import type { Octokit } from "@octokit/rest";
import { describe, expect, it } from "vitest";

import type { GitHubClientFactory } from "../../src/adapters/github-app-client-factory.js";
import { GitHubVaultRepository } from "../../src/adapters/github-vault-repository.js";
import { createContractHarness } from "../support/contract-harness.js";

describe("GitHub App Vault adapter", () => {
  it("initializes an empty private repository with one root commit and a non-forced ref creation", async () => {
    const calls = {
      blobs: [] as string[],
      trees: [] as Array<Record<string, unknown>>,
      commits: [] as Array<Record<string, unknown>>,
      refs: [] as Array<Record<string, unknown>>,
      updateRefs: [] as Array<Record<string, unknown>>,
    };
    let head: string | null = null;
    const client = {
      rest: {
        repos: {
          async get() {
            return {
              data: {
                id: 42,
                default_branch: "main",
                owner: { login: "learner" },
                name: "learning-vault",
                private: true,
              },
            };
          },
          async getContent() {
            throw { status: 404 };
          },
          async listCommits() {
            return { data: [] };
          },
        },
        git: {
          async getRef() {
            if (head === null) throw { status: 409 };
            return { data: { object: { sha: head } } };
          },
          async createBlob(input: Record<string, unknown>) {
            calls.blobs.push(String(input.content));
            return { data: { sha: `blob-${calls.blobs.length}` } };
          },
          async getCommit() {
            return { data: { tree: { sha: "base-tree" } } };
          },
          async createTree(input: Record<string, unknown>) {
            calls.trees.push(input);
            return { data: { sha: `tree-${calls.trees.length}` } };
          },
          async createCommit(input: Record<string, unknown>) {
            calls.commits.push(input);
            return { data: { sha: `commit-${calls.commits.length}` } };
          },
          async createRef(input: Record<string, unknown>) {
            calls.refs.push(input);
            head = String(input.sha);
            return { data: { ref: input.ref } };
          },
          async updateRef(input: Record<string, unknown>) {
            calls.updateRefs.push(input);
            return { data: { object: { sha: input.sha } } };
          },
        },
      },
      async paginate() {
        return [];
      },
    } as unknown as Octokit;
    const factory: GitHubClientFactory = { forInstallation: () => client };
    const repository = new GitHubVaultRepository(factory);
    const harness = await createContractHarness({
      repositoryAdapter: repository,
    });

    try {
      await harness.call("bind_vault", {
        installationId: 7,
        owner: "learner",
        repository: "learning-vault",
      });
      await expect(
        harness.call("initialize_vault", { baseRevision: "empty:42" }),
      ).resolves.toEqual({
        status: "initialized",
        schemaVersion: 1,
        revision: "commit-1",
        commitId: "commit-1",
      });

      expect(calls.blobs).toHaveLength(2);
      expect(calls.trees).toHaveLength(1);
      expect(calls.commits).toHaveLength(1);
      expect(calls.commits[0]).toMatchObject({
        message: "Initialize Learning Vault schema v1",
        tree: "tree-1",
        parents: [],
      });
      expect(calls.refs).toEqual([
        expect.objectContaining({ ref: "refs/heads/main", sha: "commit-1" }),
      ]);
      expect(calls.updateRefs).toEqual([]);

      await expect(
        repository.commit(
          {
            installationId: 7,
            repositoryId: 42,
            owner: "learner",
            repository: "learning-vault",
          },
          {
            baseRevision: "commit-1",
            message: "Update Learning Vault",
            files: { "README.md": "# Updated Learning Vault\n" },
          },
        ),
      ).resolves.toEqual({ revision: "commit-2", commitId: "commit-2" });
      expect(calls.updateRefs).toEqual([
        expect.objectContaining({
          ref: "heads/main",
          sha: "commit-2",
          force: false,
        }),
      ]);
    } finally {
      await harness.close();
    }
  });
});
