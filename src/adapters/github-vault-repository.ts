import type { Octokit } from "@octokit/rest";

import { VaultError } from "../domain/errors.js";
import type {
  BindVaultRequest,
  RepositoryInspection,
  VaultBinding,
} from "../domain/types.js";
import type { VaultRepository } from "../ports/vault-repository.js";
import type { GitHubClientFactory } from "./github-app-client-factory.js";

const EMPTY_REVISION_PREFIX = "empty:";
const ALLOWED_PATHS = [
  /^\.learning-vault\/vault\.json$/,
  /^README\.md$/,
  /^topics\/[a-z0-9]+(?:-[a-z0-9]+)*\/(?:notes|sessions)\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/,
  /^public-exports\/[a-z0-9]+(?:-[a-z0-9]+)*\/README\.md$/,
];

export class GitHubVaultRepository implements VaultRepository {
  constructor(private readonly clients: GitHubClientFactory) {}

  async inspect(request: BindVaultRequest): Promise<RepositoryInspection> {
    const client = this.clients.forInstallation(request.installationId);
    try {
      const repository = await client.rest.repos.get({
        owner: request.owner,
        repo: request.repository,
      });
      const defaultBranch = repository.data.default_branch;
      const revision = await this.readHeadOrEmpty(
        client,
        request.owner,
        request.repository,
        defaultBranch,
        repository.data.id,
      );
      return {
        installationId: request.installationId,
        repositoryId: repository.data.id,
        owner: repository.data.owner.login,
        repository: repository.data.name,
        private: repository.data.private,
        defaultBranch,
        revision,
        commitId: revision,
      };
    } catch (error) {
      throw this.mapGitHubError(error, "inspect");
    }
  }

  async readFile(
    binding: VaultBinding,
    path: string,
    pinnedRevision?: string,
  ): Promise<string | null> {
    this.requireAllowedPath(path);
    const revision = pinnedRevision ?? (await this.inspect(binding)).revision;
    if (this.isEmptyRevision(revision)) return null;
    const client = this.clients.forInstallation(binding.installationId);
    try {
      const response = await client.rest.repos.getContent({
        owner: binding.owner,
        repo: binding.repository,
        path,
        ref: revision,
      });
      if (Array.isArray(response.data) || response.data.type !== "file") return null;
      if (!("content" in response.data) || typeof response.data.content !== "string") return null;
      return Buffer.from(response.data.content.replace(/\n/g, ""), "base64").toString("utf8");
    } catch (error) {
      if (this.statusOf(error) === 404) return null;
      throw this.mapGitHubError(error, "read");
    }
  }

  async listFiles(binding: VaultBinding): Promise<string[]> {
    const inspection = await this.inspect(binding);
    if (this.isEmptyRevision(inspection.revision)) return [];
    const client = this.clients.forInstallation(binding.installationId);
    try {
      const commit = await client.rest.git.getCommit({
        owner: binding.owner,
        repo: binding.repository,
        commit_sha: inspection.revision,
      });
      const tree = await client.rest.git.getTree({
        owner: binding.owner,
        repo: binding.repository,
        tree_sha: commit.data.tree.sha,
        recursive: "true",
      });
      return tree.data.tree
        .filter((entry) => entry.type === "blob" && typeof entry.path === "string")
        .map((entry) => entry.path as string)
        .sort();
    } catch (error) {
      throw this.mapGitHubError(error, "read");
    }
  }

  async commit(
    binding: VaultBinding,
    transition: {
      baseRevision: string;
      message: string;
      files: Record<string, string | null>;
    },
  ): Promise<{ revision: string; commitId: string }> {
    for (const path of Object.keys(transition.files)) this.requireAllowedPath(path);
    const inspection = await this.inspect(binding);
    if (!inspection.private) {
      throw new VaultError(
        "authorization",
        "private_vault_required",
        "The bound Learning Vault is no longer private, so the write was blocked.",
        true,
      );
    }
    if (inspection.revision !== transition.baseRevision) {
      throw this.staleRevision(transition.baseRevision, inspection.revision);
    }
    const client = this.clients.forInstallation(binding.installationId);

    try {
      const entries: Array<{
        path: string;
        mode: "100644";
        type: "blob";
        sha: string | null;
      }> = [];
      for (const [path, content] of Object.entries(transition.files)) {
        if (content === null) {
          entries.push({ path, mode: "100644", type: "blob", sha: null });
          continue;
        }
        const blob = await client.rest.git.createBlob({
          owner: binding.owner,
          repo: binding.repository,
          content,
          encoding: "utf-8",
        });
        entries.push({ path, mode: "100644", type: "blob", sha: blob.data.sha });
      }

      const empty = this.isEmptyRevision(transition.baseRevision);
      let baseTree: string | undefined;
      if (!empty) {
        const baseCommit = await client.rest.git.getCommit({
          owner: binding.owner,
          repo: binding.repository,
          commit_sha: transition.baseRevision,
        });
        baseTree = baseCommit.data.tree.sha;
      }
      const tree = await client.rest.git.createTree({
        owner: binding.owner,
        repo: binding.repository,
        tree: entries,
        ...(baseTree === undefined ? {} : { base_tree: baseTree }),
      });
      const commit = await client.rest.git.createCommit({
        owner: binding.owner,
        repo: binding.repository,
        message: transition.message,
        tree: tree.data.sha,
        parents: empty ? [] : [transition.baseRevision],
      });

      try {
        if (empty) {
          await client.rest.git.createRef({
            owner: binding.owner,
            repo: binding.repository,
            ref: `refs/heads/${inspection.defaultBranch}`,
            sha: commit.data.sha,
          });
        } else {
          await client.rest.git.updateRef({
            owner: binding.owner,
            repo: binding.repository,
            ref: `heads/${inspection.defaultBranch}`,
            sha: commit.data.sha,
            force: false,
          });
        }
      } catch (error) {
        if ([409, 422].includes(this.statusOf(error) ?? 0)) {
          const current = await this.inspect(binding).catch(() => inspection);
          throw this.staleRevision(transition.baseRevision, current.revision);
        }
        throw error;
      }
      return { revision: commit.data.sha, commitId: commit.data.sha };
    } catch (error) {
      if (error instanceof VaultError) throw error;
      throw this.mapGitHubError(error, "write");
    }
  }

  async findCommitByMarker(
    binding: VaultBinding,
    marker: string,
  ): Promise<{ revision: string; commitId: string } | null> {
    const inspection = await this.inspect(binding);
    if (this.isEmptyRevision(inspection.revision)) return null;
    const client = this.clients.forInstallation(binding.installationId);
    try {
      const commits = await client.paginate(client.rest.repos.listCommits, {
        owner: binding.owner,
        repo: binding.repository,
        sha: inspection.defaultBranch,
        per_page: 100,
      });
      const found = commits.find((commit) => commit.commit.message.includes(marker));
      return found === undefined
        ? null
        : { revision: found.sha, commitId: found.sha };
    } catch (error) {
      throw this.mapGitHubError(error, "read");
    }
  }

  private async readHeadOrEmpty(
    client: Octokit,
    owner: string,
    repository: string,
    defaultBranch: string,
    repositoryId: number,
  ): Promise<string> {
    try {
      const head = await client.rest.git.getRef({
        owner,
        repo: repository,
        ref: `heads/${defaultBranch}`,
      });
      return head.data.object.sha;
    } catch (error) {
      if ([404, 409].includes(this.statusOf(error) ?? 0)) {
        return `${EMPTY_REVISION_PREFIX}${repositoryId}`;
      }
      throw error;
    }
  }

  private requireAllowedPath(path: string): void {
    if (!ALLOWED_PATHS.some((pattern) => pattern.test(path))) {
      throw new VaultError(
        "unsupported_action",
        "repository_path_not_allowed",
        "The requested path is outside the Learning Vault domain contract.",
        false,
      );
    }
  }

  private isEmptyRevision(revision: string): boolean {
    return revision.startsWith(EMPTY_REVISION_PREFIX);
  }

  private staleRevision(expected: string, actual: string): VaultError {
    return new VaultError(
      "stale_revision",
      "stale_revision",
      `The Vault advanced from ${expected} to ${actual}.`,
      true,
    );
  }

  private mapGitHubError(error: unknown, operation: "inspect" | "read" | "write"): VaultError {
    const status = this.statusOf(error);
    if (status === 401 || status === 403 || (status === 404 && operation === "inspect")) {
      return new VaultError(
        "authorization",
        "github_app_access_denied",
        "The GitHub App cannot access the bound Learning Vault.",
        true,
      );
    }
    if (status === 408 || status === 429 || (status !== undefined && status >= 500)) {
      return new VaultError(
        "unavailable",
        "github_temporarily_unavailable",
        "GitHub is temporarily unavailable; no Learning Vault mutation was confirmed.",
        true,
      );
    }
    return new VaultError(
      "github_failure",
      "github_operation_failed",
      "The GitHub operation failed without a confirmed Learning Vault mutation.",
      true,
    );
  }

  private statusOf(error: unknown): number | undefined {
    if (error !== null && typeof error === "object" && "status" in error) {
      return typeof error.status === "number" ? error.status : undefined;
    }
    return undefined;
  }
}
