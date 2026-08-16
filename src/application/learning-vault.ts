import { createHash } from "node:crypto";

import { VaultError } from "../domain/errors.js";
import {
  FORGET_HISTORY_WARNING,
  HISTORICAL_ERASURE_GUIDANCE,
  type ForgetSelection,
} from "../domain/forget.js";
import {
  containsSecret,
  minimizeLearningUpdate,
  redactPublicIdentifiers,
} from "../domain/content-policy.js";
import type { LearningUpdateInput } from "../domain/learning-update.js";
import type { PreparePublicExportInput } from "../domain/public-export.js";
import type {
  BindVaultRequest,
  LearnerPrincipal,
  VaultStatus,
} from "../domain/types.js";
import {
  createEmptyVaultDocument,
  serializeVaultDocument,
  VAULT_SCHEMA_VERSION,
  VAULT_STATE_PATH,
  vaultDocumentSchema,
  type VaultDocument,
} from "../domain/vault-state.js";
import type { OperationalStore } from "../ports/operational-store.js";
import type { VaultRepository } from "../ports/vault-repository.js";

export class LearningVault {
  constructor(
    private readonly operationalStore: OperationalStore,
    private readonly repository: VaultRepository,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  async getStatus(principal: LearnerPrincipal): Promise<VaultStatus> {
    this.requireScope(principal, "vault:read");
    try {
      const binding = await this.operationalStore.getBinding(principal.learnerId);
      if (binding === null) {
        return {
          status: "unbound",
          schemaVersion: null,
          revision: null,
          defaultBranch: null,
        };
      }

      const inspection = await this.repository.inspect(binding);
      const rawState = await this.repository.readFile(binding, VAULT_STATE_PATH);
      if (rawState === null) {
        return {
          status: "uninitialized",
          schemaVersion: null,
          revision: inspection.revision,
          defaultBranch: inspection.defaultBranch,
        };
      }

      try {
        const state = JSON.parse(rawState) as { schemaVersion?: unknown };
        const schemaVersion = typeof state.schemaVersion === "number" ? state.schemaVersion : null;
        const compatible = vaultDocumentSchema.safeParse(state).success;
        return {
          status: compatible ? "ready" : "incompatible",
          schemaVersion,
          revision: inspection.revision,
          defaultBranch: inspection.defaultBranch,
        };
      } catch {
        return {
          status: "incompatible",
          schemaVersion: null,
          revision: inspection.revision,
          defaultBranch: inspection.defaultBranch,
        };
      }
    } catch (error) {
      if (!(error instanceof VaultError) || error.category !== "unavailable") throw error;
      return {
        status: "unavailable",
        schemaVersion: null,
        revision: null,
        defaultBranch: null,
      };
    }
  }

  async bindVault(principal: LearnerPrincipal, request: BindVaultRequest) {
    this.requireScope(principal, "vault:write");
    const existing = await this.operationalStore.getBinding(principal.learnerId);
    if (existing !== null) {
      throw new VaultError(
        "validation",
        "vault_already_bound",
        "Disconnect the current Learning Vault before binding another one.",
        true,
      );
    }
    const inspection = await this.repository.inspect(request);
    if (!inspection.private) {
      throw new VaultError(
        "authorization",
        "private_vault_required",
        "Learning Coach only binds private repositories as Learning Vaults.",
        true,
      );
    }
    const binding = {
      installationId: inspection.installationId,
      owner: inspection.owner,
      repository: inspection.repository,
      repositoryId: inspection.repositoryId,
    };
    await this.operationalStore.setBinding(principal.learnerId, binding);
    return {
      status: "bound" as const,
      repositoryId: inspection.repositoryId,
      owner: inspection.owner,
      repository: inspection.repository,
      defaultBranch: inspection.defaultBranch,
      revision: inspection.revision,
    };
  }

  async disconnectVault(principal: LearnerPrincipal) {
    this.requireScope(principal, "vault:write");
    await this.operationalStore.deleteBinding(principal.learnerId);
    return { status: "disconnected" as const };
  }

  async initializeVault(
    principal: LearnerPrincipal,
    request: { baseRevision: string },
  ) {
    this.requireScope(principal, "vault:write");
    const binding = await this.requireBinding(principal);
    const inspection = await this.repository.inspect(binding);
    const rawState = await this.repository.readFile(binding, VAULT_STATE_PATH);

    if (rawState !== null) {
      const parsed = vaultDocumentSchema.safeParse(JSON.parse(rawState));
      if (!parsed.success) {
        throw new VaultError(
          "incompatible_schema",
          "unsupported_schema",
          "The repository contains an incompatible Learning Vault schema.",
          false,
        );
      }
      return {
        status: "already_initialized" as const,
        schemaVersion: VAULT_SCHEMA_VERSION,
        revision: inspection.revision,
        commitId: inspection.commitId,
      };
    }

    const existingFiles = await this.repository.listFiles(binding);
    if (existingFiles.length > 0) {
      throw new VaultError(
        "incompatible_schema",
        "nonempty_repository",
        "Initialization requires an empty repository or an existing compatible Learning Vault.",
        false,
      );
    }
    if (inspection.revision !== request.baseRevision) {
      throw new VaultError(
        "stale_revision",
        "stale_revision",
        `The Vault advanced from ${request.baseRevision} to ${inspection.revision}.`,
        true,
      );
    }

    const state = createEmptyVaultDocument(binding.repositoryId, this.now());
    const committed = await this.repository.commit(binding, {
      baseRevision: request.baseRevision,
      message: "Initialize Learning Vault schema v1",
      files: {
        [VAULT_STATE_PATH]: serializeVaultDocument(state),
        "README.md":
          "# Learning Vault\n\nPrivate learning state managed by Learning Coach. Keep this repository private.\n",
      },
    });
    return {
      status: "initialized" as const,
      schemaVersion: VAULT_SCHEMA_VERSION,
      ...committed,
    };
  }

  async getLearningContext(
    principal: LearnerPrincipal,
    request: {
      topicId: string;
      proposedTopic?:
        | {
            title: string;
            goal: string;
            targetCapability: string;
          }
        | undefined;
    },
  ) {
    this.requireScope(principal, "vault:read");
    const binding = await this.requireBinding(principal);
    const inspection = await this.repository.inspect(binding);
    const state = await this.readVaultDocument(binding);
    const topic = state.topics[request.topicId];

    if (topic === undefined) {
      if (request.proposedTopic === undefined) {
        throw new VaultError(
          "validation",
          "topic_not_found",
          "Provide a proposed Topic orientation when starting a new Topic.",
          true,
        );
      }
      return {
        status: "new_topic" as const,
        saved: false,
        schemaVersion: state.schemaVersion,
        revision: inspection.revision,
        topic: {
          id: request.topicId,
          ...request.proposedTopic,
          currentFocus: "Establish the learner's current model and first prerequisite gap.",
          knownGaps: [] as string[],
          nextStep: "Teach the smallest useful concept, then ask at most one focused check.",
          concepts: [] as unknown[],
        },
        learningStrategy: {
          observations: state.learningStrategy.observations.filter(
            (observation) =>
              observation.status === "active" &&
              observation.topicIds.includes(request.topicId),
          ),
        },
      };
    }

    return {
      status: "existing_topic" as const,
      saved: true,
      schemaVersion: state.schemaVersion,
      revision: inspection.revision,
      topic: {
        ...topic,
        concepts: Object.values(topic.concepts),
      },
      learningStrategy: {
        observations: state.learningStrategy.observations.filter(
          (observation) =>
            observation.status === "active" &&
            observation.topicIds.includes(request.topicId),
        ),
      },
    };
  }

  async saveLearningUpdate(
    principal: LearnerPrincipal,
    proposedUpdate: LearningUpdateInput,
  ) {
    this.requireScope(principal, "vault:write");
    const binding = await this.requireBinding(principal);
    const inspection = await this.repository.inspect(binding);
    const state = await this.readVaultDocument(binding);
    const applied = state.appliedUpdates[proposedUpdate.updateId];

    if (applied !== undefined) {
      const original = await this.repository.findCommitByMarker(
        binding,
        `[update:${proposedUpdate.updateId}]`,
      );
      if (original === null) {
        throw new VaultError(
          "github_failure",
          "applied_update_commit_missing",
          "The Vault records this update, but its commit reference could not be recovered.",
          true,
        );
      }
      return {
        status: "already_saved" as const,
        updateId: proposedUpdate.updateId,
        ...original,
      };
    }

    if (!proposedUpdate.meaningful) {
      return {
        status: "unchanged" as const,
        updateId: proposedUpdate.updateId,
        revision: inspection.revision,
        commitId: inspection.commitId,
      };
    }
    if (!proposedUpdate.record) {
      return {
        status: "unsaved" as const,
        reason: "learner_opt_out" as const,
        updateId: proposedUpdate.updateId,
        revision: inspection.revision,
        commitId: inspection.commitId,
      };
    }
    const update = minimizeLearningUpdate(proposedUpdate);
    if (
      update.topic === undefined ||
      update.concepts === undefined ||
      update.evidence === undefined ||
      update.notes === undefined ||
      update.session === undefined
    ) {
      throw new VaultError(
        "validation",
        "incomplete_learning_update",
        "A meaningful Learning Update requires Topic, concepts, evidence, notes, and a session summary.",
        true,
      );
    }
    if (inspection.revision !== update.baseRevision) {
      throw new VaultError(
        "stale_revision",
        "stale_revision",
        `The Vault advanced from ${update.baseRevision} to ${inspection.revision}.`,
        true,
      );
    }

    const now = this.now();
    const existingTopic = state.topics[update.topic.id];
    const concepts = { ...(existingTopic?.concepts ?? {}) };
    for (const change of update.concepts) {
      const existing = concepts[change.id];
      concepts[change.id] = {
        ...change,
        evidence: existing?.evidence ?? [],
      };
    }
    for (const evidence of update.evidence) {
      const concept = concepts[evidence.conceptId];
      if (concept === undefined) {
        throw new VaultError(
          "validation",
          "unknown_evidence_concept",
          `Evidence ${evidence.id} references unknown concept ${evidence.conceptId}.`,
          true,
        );
      }
      if (evidence.type === "contradiction") {
        concept.evidence = concept.evidence.map((item) =>
          item.type === "contradiction" ? item : { ...item, stale: true },
        );
      }
      concept.evidence = [
        ...concept.evidence.filter((item) => item.id !== evidence.id),
        {
          id: evidence.id,
          observedAt: evidence.observedAt,
          type: evidence.type,
          summary: evidence.summary,
          sessionId: update.session.id,
          stale: evidence.stale,
        },
      ];
    }
    const knownConceptIds = new Set(Object.keys(concepts));
    for (const concept of Object.values(concepts)) {
      const missing = concept.prerequisites.filter((id) => !knownConceptIds.has(id));
      if (missing.length > 0) {
        throw new VaultError(
          "validation",
          "unknown_prerequisite",
          `Concept ${concept.id} has unknown prerequisites: ${missing.join(", ")}.`,
          true,
        );
      }
      if (concept.level > 0 && concept.evidence.length === 0) {
        throw new VaultError(
          "validation",
          "mastery_requires_evidence",
          `Concept ${concept.id} cannot have mastery level ${concept.level} without evidence.`,
          true,
        );
      }
    }

    const notes = { ...(existingTopic?.notes ?? {}) };
    const files: Record<string, string | null> = {};
    for (const note of update.notes) {
      const path = `topics/${update.topic.id}/notes/${note.id}.md`;
      notes[note.id] = {
        id: note.id,
        path,
        updatedAt: now,
        kind: note.kind,
        claimStatus: note.claimStatus,
        sources: note.sources,
      };
      files[path] = note.markdown.endsWith("\n") ? note.markdown : `${note.markdown}\n`;
    }
    const sessionPath = `topics/${update.topic.id}/sessions/${update.session.id}.md`;
    const sessions = {
      ...(existingTopic?.sessions ?? {}),
      [update.session.id]: { id: update.session.id, path: sessionPath, createdAt: now },
    };
    files[sessionPath] = this.renderSession(update.session, [
      `Updated Topic ${update.topic.id}`,
      ...update.concepts.map((concept) => `Updated concept ${concept.id}`),
      ...update.notes.map((note) => `Updated note ${note.id}`),
      ...(update.strategyObservations ?? []).map(
        (observation) => `Updated Learning Strategy observation ${observation.id}`,
      ),
    ]);

    state.topics[update.topic.id] = {
      ...update.topic,
      concepts,
      notes,
      sessions,
    };
    for (const observation of update.strategyObservations ?? []) {
      const missingTopics = observation.topicIds.filter(
        (topicId) => state.topics[topicId] === undefined,
      );
      if (missingTopics.length > 0) {
        throw new VaultError(
          "validation",
          "unknown_strategy_topic",
          `Learning Strategy observation references unknown Topics: ${missingTopics.join(", ")}.`,
          true,
        );
      }
      const evidenceIds = new Set(
        Object.values(state.topics).flatMap((topicState) =>
          Object.values(topicState.concepts).flatMap((concept) =>
            concept.evidence.map((evidenceItem) => evidenceItem.id),
          ),
        ),
      );
      const missingEvidence = observation.evidenceRefs.filter(
        (evidenceId) => !evidenceIds.has(evidenceId),
      );
      if (missingEvidence.length > 0) {
        throw new VaultError(
          "validation",
          "unknown_strategy_evidence",
          `Learning Strategy observation references unknown evidence: ${missingEvidence.join(", ")}.`,
          true,
        );
      }
      if (observation.supersedes !== null) {
        const previous = state.learningStrategy.observations.find(
          (item) => item.id === observation.supersedes && item.status === "active",
        );
        if (previous === undefined) {
          throw new VaultError(
            "validation",
            "strategy_revision_target_missing",
            `Active Learning Strategy observation ${observation.supersedes} was not found.`,
            true,
          );
        }
        previous.status = "superseded";
      }
      state.learningStrategy.observations = [
        ...state.learningStrategy.observations.filter((item) => item.id !== observation.id),
        { ...observation, status: "active" as const },
      ];
    }
    state.updatedAt = now;
    state.appliedUpdates[update.updateId] = {
      updateId: update.updateId,
      baseRevision: update.baseRevision,
      appliedAt: now,
    };
    vaultDocumentSchema.parse(state);
    files[VAULT_STATE_PATH] = serializeVaultDocument(state);

    let committed: { revision: string; commitId: string };
    try {
      committed = await this.repository.commit(binding, {
        baseRevision: update.baseRevision,
        message: `Learning Update: ${update.topic.currentFocus} [update:${update.updateId}]`,
        files,
      });
    } catch (error) {
      if (error instanceof VaultError && error.category === "unavailable") {
        return {
          status: "unsaved" as const,
          reason: "write_unavailable" as const,
          updateId: update.updateId,
          revision: inspection.revision,
          commitId: inspection.commitId,
        };
      }
      throw error;
    }
    return {
      status: "saved" as const,
      updateId: update.updateId,
      ...committed,
    };
  }

  async saveConflictMerge(
    principal: LearnerPrincipal,
    request: {
      staleBaseRevision: string;
      confirmed: boolean;
      update: LearningUpdateInput;
    },
  ) {
    this.requireScope(principal, "vault:write");
    if (!request.confirmed) {
      throw new VaultError(
        "validation",
        "merge_confirmation_required",
        "Review and explicitly confirm the conflict merge before it is saved.",
        true,
      );
    }
    if (request.staleBaseRevision === request.update.baseRevision) {
      throw new VaultError(
        "validation",
        "merge_must_use_latest_revision",
        "A conflict merge must be rebuilt against the latest Vault revision.",
        true,
      );
    }
    const binding = await this.requireBinding(principal);
    const inspection = await this.repository.inspect(binding);
    if (inspection.revision !== request.update.baseRevision) {
      throw new VaultError(
        "stale_revision",
        "stale_revision",
        `The Vault advanced again from ${request.update.baseRevision} to ${inspection.revision}.`,
        true,
      );
    }
    return this.saveLearningUpdate(principal, request.update);
  }

  async getReviewQueue(principal: LearnerPrincipal) {
    this.requireScope(principal, "vault:read");
    const binding = await this.requireBinding(principal);
    const inspection = await this.repository.inspect(binding);
    const state = await this.readVaultDocument(binding);
    const items = Object.values(state.topics).flatMap((topic) =>
      Object.values(topic.concepts)
        .filter((concept) => concept.nextReview !== null)
        .map((concept) => ({
          topicId: topic.id,
          conceptId: concept.id,
          conceptName: concept.name,
          level: concept.level,
          dueAt: concept.nextReview as string,
          reason: concept.evidence.some(
            (evidence) => evidence.type === "contradiction" && !evidence.stale,
          )
            ? "contradiction"
            : concept.status === "blocked"
              ? "prerequisite_gap"
              : "scheduled_review",
          targetCapability: topic.targetCapability,
        })),
    );
    items.sort(
      (left, right) =>
        left.dueAt.localeCompare(right.dueAt) ||
        left.topicId.localeCompare(right.topicId) ||
        left.conceptId.localeCompare(right.conceptId),
    );
    return { revision: inspection.revision, items };
  }

  async prepareForget(
    principal: LearnerPrincipal,
    request: { baseRevision: string; selection: ForgetSelection },
  ) {
    this.requireScope(principal, "vault:read");
    const binding = await this.requireBinding(principal);
    const inspection = await this.repository.inspect(binding);
    if (inspection.revision !== request.baseRevision) {
      throw new VaultError(
        "stale_revision",
        "stale_revision",
        `The Vault advanced from ${request.baseRevision} to ${inspection.revision}.`,
        true,
      );
    }
    const state = await this.readVaultDocument(binding);
    const topic = state.topics[request.selection.topicId];
    if (topic === undefined) {
      throw new VaultError(
        "validation",
        "topic_not_found",
        `Topic ${request.selection.topicId} was not found in the current Learning Vault.`,
        true,
      );
    }

    const conceptIds = request.selection.forgetTopic
      ? Object.keys(topic.concepts)
      : request.selection.conceptIds;
    const noteIds = request.selection.forgetTopic
      ? Object.keys(topic.notes)
      : request.selection.noteIds;
    const sessionIds = request.selection.forgetTopic
      ? Object.keys(topic.sessions)
      : request.selection.sessionIds;
    this.requireSelectedIds("concept", conceptIds, topic.concepts);
    this.requireSelectedIds("note", noteIds, topic.notes);
    this.requireSelectedIds("session", sessionIds, topic.sessions);

    const selectedConcepts = new Set(conceptIds);
    const selectedSessions = new Set(sessionIds);
    const removedEvidenceIds = new Set(
      Object.values(topic.concepts).flatMap((concept) =>
        selectedConcepts.has(concept.id)
          ? concept.evidence.map((evidence) => evidence.id)
          : concept.evidence
              .filter((evidence) => selectedSessions.has(evidence.sessionId))
              .map((evidence) => evidence.id),
      ),
    );
    const affectedStrategyObservations = state.learningStrategy.observations.filter(
      (observation) =>
        (request.selection.forgetTopic && observation.topicIds.includes(topic.id)) ||
        observation.evidenceRefs.some((evidenceId) => removedEvidenceIds.has(evidenceId)),
    );
    const previewId = this.forgetPreviewId(request.baseRevision, request.selection);

    return {
      status: "prepared" as const,
      previewId,
      baseRevision: request.baseRevision,
      selection: request.selection,
      affected: {
        topic: request.selection.forgetTopic
          ? { id: topic.id, title: topic.title }
          : null,
        concepts: conceptIds.map((id) => ({
          id,
          name: topic.concepts[id]?.name ?? id,
          evidenceCount: topic.concepts[id]?.evidence.length ?? 0,
        })),
        notes: noteIds.map((id) => ({ id, path: topic.notes[id]?.path ?? "" })),
        sessions: sessionIds.map((id) => ({ id, path: topic.sessions[id]?.path ?? "" })),
        evidenceIds: [...removedEvidenceIds].sort(),
        reviewItems: conceptIds
          .filter((id) => topic.concepts[id]?.nextReview !== null)
          .map((conceptId) => ({ topicId: topic.id, conceptId })),
        prerequisiteReferences: Object.values(topic.concepts).flatMap((concept) =>
          concept.prerequisites
            .filter((prerequisiteId) => selectedConcepts.has(prerequisiteId))
            .map((prerequisiteId) => ({ conceptId: concept.id, prerequisiteId })),
        ),
        strategyObservationIds: affectedStrategyObservations.map((item) => item.id),
      },
      warning: FORGET_HISTORY_WARNING,
      historicalErasureGuidance: HISTORICAL_ERASURE_GUIDANCE,
    };
  }

  async applyForget(
    principal: LearnerPrincipal,
    request: {
      previewId: string;
      baseRevision: string;
      selection: ForgetSelection;
      confirmed: boolean;
    },
  ) {
    this.requireScope(principal, "vault:write");
    const binding = await this.requireBinding(principal);
    const inspection = await this.repository.inspect(binding);
    if (!request.confirmed) {
      return {
        status: "cancelled" as const,
        revision: inspection.revision,
        commitId: inspection.commitId,
        warning: FORGET_HISTORY_WARNING,
      };
    }
    const preview = await this.prepareForget(principal, request);
    if (preview.previewId !== request.previewId) {
      throw new VaultError(
        "validation",
        "forget_preview_mismatch",
        "Prepare Forget again and confirm the unchanged preview before applying it.",
        true,
      );
    }

    const state = await this.readVaultDocument(binding);
    const topic = state.topics[request.selection.topicId];
    if (topic === undefined) {
      throw new VaultError("validation", "topic_not_found", "The selected Topic no longer exists.", true);
    }
    const files: Record<string, string | null> = {};
    const selectedConcepts = new Set(request.selection.conceptIds);
    const selectedSessions = new Set(request.selection.sessionIds);
    const removedEvidenceIds = new Set(preview.affected.evidenceIds);

    if (request.selection.forgetTopic) {
      for (const note of Object.values(topic.notes)) files[note.path] = null;
      for (const session of Object.values(topic.sessions)) files[session.path] = null;
      delete state.topics[topic.id];
    } else {
      for (const conceptId of selectedConcepts) delete topic.concepts[conceptId];
      for (const concept of Object.values(topic.concepts)) {
        concept.prerequisites = concept.prerequisites.filter((id) => !selectedConcepts.has(id));
        concept.evidence = concept.evidence.filter(
          (evidence) => !selectedSessions.has(evidence.sessionId),
        );
        if (concept.level > 0 && concept.evidence.length === 0) {
          concept.level = 0;
          concept.status = "learning";
        }
      }
      for (const noteId of request.selection.noteIds) {
        const note = topic.notes[noteId];
        if (note !== undefined) files[note.path] = null;
        delete topic.notes[noteId];
      }
      for (const sessionId of selectedSessions) {
        const session = topic.sessions[sessionId];
        if (session !== undefined) files[session.path] = null;
        delete topic.sessions[sessionId];
      }
    }
    state.reviewQueue = state.reviewQueue.filter((item) => {
      if (item === null || typeof item !== "object") return true;
      const queueItem = item as { topicId?: unknown; conceptId?: unknown };
      if (queueItem.topicId !== request.selection.topicId) return true;
      return !request.selection.forgetTopic && !selectedConcepts.has(String(queueItem.conceptId));
    });
    state.learningStrategy.observations = state.learningStrategy.observations.filter(
      (observation) =>
        !preview.affected.strategyObservationIds.includes(observation.id) &&
        !observation.evidenceRefs.some((evidenceId) => removedEvidenceIds.has(evidenceId)),
    );
    state.updatedAt = this.now();
    vaultDocumentSchema.parse(state);
    files[VAULT_STATE_PATH] = serializeVaultDocument(state);

    const committed = await this.repository.commit(binding, {
      baseRevision: request.baseRevision,
      message: `Forget current Learning Vault material [forget:${request.previewId}]`,
      files,
    });
    return {
      status: "forgotten" as const,
      ...committed,
      warning: FORGET_HISTORY_WARNING,
      historicalErasureGuidance: HISTORICAL_ERASURE_GUIDANCE,
    };
  }

  async preparePublicExport(
    principal: LearnerPrincipal,
    request: PreparePublicExportInput,
  ) {
    this.requireScope(principal, "vault:write");
    const binding = await this.requireBinding(principal);
    const inspection = await this.repository.inspect(binding);
    const state = await this.readVaultDocument(binding);
    const existing = state.publicExports[request.exportId];
    if (existing !== undefined) {
      const original = await this.repository.findCommitByMarker(
        binding,
        `[export:${request.exportId}]`,
      );
      if (original === null) {
        throw new VaultError(
          "github_failure",
          "public_export_commit_missing",
          "The Vault records this Public Export candidate, but its commit reference could not be recovered.",
          true,
        );
      }
      return {
        status: "already_prepared" as const,
        exportId: request.exportId,
        ...original,
        candidatePath: existing.candidatePath,
        included: existing.included,
        excluded: existing.excluded,
        publication: {
          status: "candidate_only" as const,
          requiredTarget: "separate_clean_history_repository" as const,
          privateVaultVisibilityChanged: false,
          publicRepositoryCreated: false,
        },
      };
    }
    if (inspection.revision !== request.baseRevision) {
      throw new VaultError(
        "stale_revision",
        "stale_revision",
        `The Vault advanced from ${request.baseRevision} to ${inspection.revision}.`,
        true,
      );
    }

    const included = { topics: [] as string[], concepts: [] as string[], notes: [] as string[] };
    const excluded: Array<{ item: string; reason: "private_reflection" | "unsupported_claim" }> = [];
    const sections: string[] = [];
    const selectedTopicIds = new Set<string>();

    for (const selection of request.selection) {
      if (selectedTopicIds.has(selection.topicId)) {
        throw new VaultError(
          "validation",
          "duplicate_export_topic",
          `Topic ${selection.topicId} appears more than once in the Public Export whitelist.`,
          true,
        );
      }
      selectedTopicIds.add(selection.topicId);
      const topic = state.topics[selection.topicId];
      if (topic === undefined) {
        throw new VaultError(
          "validation",
          "export_selection_out_of_bounds",
          `Selected Topic ${selection.topicId} is not present in the current Learning Vault.`,
          true,
        );
      }
      this.requireSelectedIds(
        "concept",
        selection.conceptIds,
        topic.concepts,
        "export_selection_out_of_bounds",
      );
      this.requireSelectedIds(
        "note",
        selection.noteIds,
        topic.notes,
        "export_selection_out_of_bounds",
      );

      const topicSections: string[] = [`## ${topic.title}`];
      if (selection.conceptIds.length > 0) {
        topicSections.push(
          "",
          "### Concepts",
          "",
          ...selection.conceptIds.map((conceptId) => `- ${topic.concepts[conceptId]?.name ?? conceptId}`),
        );
        included.concepts.push(
          ...selection.conceptIds.map((conceptId) => `${selection.topicId}/${conceptId}`),
        );
      }
      for (const noteId of selection.noteIds) {
        const note = topic.notes[noteId];
        if (note === undefined) continue;
        const item = `${selection.topicId}/${noteId}`;
        if (note.kind === "private_reflection") {
          excluded.push({ item, reason: "private_reflection" });
          continue;
        }
        if (note.claimStatus === "unsupported") {
          excluded.push({ item, reason: "unsupported_claim" });
          continue;
        }
        const markdown = await this.repository.readFile(binding, note.path);
        if (markdown === null) {
          throw new VaultError(
            "incompatible_schema",
            "export_note_missing",
            `Selected note ${item} is referenced by state but missing from the repository.`,
            false,
          );
        }
        if (containsSecret(markdown)) {
          throw new VaultError(
            "privacy_rejection",
            "secret_detected",
            "The Public Export selection contains a credential or comparable secret and no candidate was prepared.",
            true,
          );
        }
        const statusLabel = this.publicClaimStatusLabel(note.claimStatus);
        topicSections.push("", `### ${noteId}`, "", `Claim status: ${statusLabel}`, "");
        topicSections.push(redactPublicIdentifiers(markdown).trim());
        if (note.sources.length > 0) {
          topicSections.push("", "#### Sources", "");
          for (const source of note.sources) {
            topicSections.push(
              `- [${source.title}](${source.url}) - ${this.publicClaimStatusLabel(source.status)} | ${source.kind === "primary" ? "Primary source" : "Secondary source"}`,
            );
          }
        }
        included.notes.push(item);
      }
      included.topics.push(selection.topicId);
      sections.push(topicSections.join("\n"));
    }

    const candidatePath = `public-exports/${request.exportId}/README.md`;
    const candidate = [
      `# ${request.title}`,
      "",
      "> Public Export candidate. Publish only to a separate repository with clean history after review.",
      "",
      ...sections,
      "",
    ].join("\n");
    if (containsSecret(candidate)) {
      throw new VaultError(
        "privacy_rejection",
        "secret_detected",
        "The Public Export candidate contains a credential or comparable secret and was not prepared.",
        true,
      );
    }

    state.updatedAt = this.now();
    state.publicExports[request.exportId] = {
      exportId: request.exportId,
      title: request.title,
      candidatePath,
      preparedAt: this.now(),
      sourceRevision: request.baseRevision,
      selection: request.selection,
      included,
      excluded,
    };
    vaultDocumentSchema.parse(state);
    const committed = await this.repository.commit(binding, {
      baseRevision: request.baseRevision,
      message: `Prepare Public Export candidate [export:${request.exportId}]`,
      files: {
        [candidatePath]: candidate,
        [VAULT_STATE_PATH]: serializeVaultDocument(state),
      },
    });
    return {
      status: "prepared" as const,
      exportId: request.exportId,
      ...committed,
      candidatePath,
      included,
      excluded,
      publication: {
        status: "candidate_only" as const,
        requiredTarget: "separate_clean_history_repository" as const,
        privateVaultVisibilityChanged: false,
        publicRepositoryCreated: false,
      },
    };
  }

  private renderSession(session: {
    learnerRequest: string;
    evidenceObserved: string[];
    gapsExposed: string[];
    nextStep: string;
  }, durableChanges: string[]): string {
    const bullets = (items: string[]) =>
      items.length === 0 ? "- None observed" : items.map((item) => `- ${item}`).join("\n");
    return [
      "# Learning Session",
      "",
      "## Learner Request",
      "",
      session.learnerRequest,
      "",
      "## Observable Evidence",
      "",
      bullets(session.evidenceObserved),
      "",
      "## Gaps Exposed",
      "",
      bullets(session.gapsExposed),
      "",
      "## Durable Changes",
      "",
      bullets(durableChanges),
      "",
      "## Next Step",
      "",
      session.nextStep,
      "",
    ].join("\n");
  }

  private forgetPreviewId(baseRevision: string, selection: ForgetSelection): string {
    const normalized = {
      ...selection,
      conceptIds: [...selection.conceptIds].sort(),
      noteIds: [...selection.noteIds].sort(),
      sessionIds: [...selection.sessionIds].sort(),
    };
    return createHash("sha256")
      .update(`${baseRevision}\n${JSON.stringify(normalized)}`)
      .digest("hex")
      .slice(0, 24);
  }

  private requireSelectedIds(
    kind: string,
    selectedIds: string[],
    available: Record<string, unknown>,
    errorCode = "forget_selection_out_of_bounds",
  ): void {
    const missing = selectedIds.filter((id) => available[id] === undefined);
    if (missing.length > 0) {
      throw new VaultError(
        "validation",
        errorCode,
        `Selected ${kind} IDs are not present in the current Topic: ${missing.join(", ")}.`,
        true,
      );
    }
  }

  private publicClaimStatusLabel(
    status: "confirmed" | "working_model" | "open_question" | "unsupported",
  ): string {
    return {
      confirmed: "Confirmed",
      working_model: "Working model",
      open_question: "Open question",
      unsupported: "Unsupported claim",
    }[status];
  }

  private async readVaultDocument(binding: {
    installationId: number;
    owner: string;
    repository: string;
    repositoryId: number;
  }): Promise<VaultDocument> {
    const rawState = await this.repository.readFile(binding, VAULT_STATE_PATH);
    if (rawState === null) {
      throw new VaultError(
        "incompatible_schema",
        "vault_not_initialized",
        "Initialize the Learning Vault before reading learning context.",
        true,
      );
    }
    try {
      return vaultDocumentSchema.parse(JSON.parse(rawState));
    } catch {
      throw new VaultError(
        "incompatible_schema",
        "unsupported_schema",
        "The Learning Vault schema is missing, malformed, or unsupported.",
        false,
      );
    }
  }

  private async requireBinding(principal: LearnerPrincipal) {
    const binding = await this.operationalStore.getBinding(principal.learnerId);
    if (binding === null) {
      throw new VaultError(
        "validation",
        "vault_not_bound",
        "Bind a private Learning Vault before using this operation.",
        true,
      );
    }
    return binding;
  }

  private requireScope(principal: LearnerPrincipal, scope: string): void {
    if (!principal.scopes.has(scope)) {
      throw new VaultError(
        "authorization",
        "insufficient_scope",
        `The operation requires the ${scope} scope.`,
        true,
      );
    }
  }
}
