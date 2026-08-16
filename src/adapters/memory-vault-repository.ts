import { VaultError } from "../domain/errors.js";
import type {
  BindVaultRequest,
  RepositoryInspection,
  VaultBinding,
} from "../domain/types.js";
import type { VaultRepository } from "../ports/vault-repository.js";

export type MemoryRepositoryFixture = Omit<RepositoryInspection, "commitId"> & {
  commitId?: string;
  files?: Record<string, string>;
};

type MemoryRepository = RepositoryInspection & {
  files: Map<string, string>;
  history: Array<{ revision: string; commitId: string; message: string }>;
};

export class MemoryVaultRepository implements VaultRepository {
  readonly #repositories = new Map<string, MemoryRepository>();
  #writeAvailable = true;

  constructor(fixtures: MemoryRepositoryFixture[] = []) {
    for (const fixture of fixtures) {
      this.#repositories.set(this.key(fixture), {
        ...fixture,
        commitId: fixture.commitId ?? fixture.revision,
        files: new Map(Object.entries(fixture.files ?? {})),
        history: [],
      });
    }
  }

  async inspect(request: BindVaultRequest): Promise<RepositoryInspection> {
    const repository = this.#repositories.get(this.key(request));
    if (repository === undefined || repository.installationId !== request.installationId) {
      throw new VaultError(
        "authorization",
        "github_app_not_installed",
        "The GitHub App is not installed for that repository.",
        true,
      );
    }
    const { files: _files, ...inspection } = repository;
    return inspection;
  }

  async readFile(binding: VaultBinding, path: string, _revision?: string): Promise<string | null> {
    const repository = this.boundRepository(binding);
    return repository.files.get(path) ?? null;
  }

  async listFiles(binding: VaultBinding): Promise<string[]> {
    return [...this.boundRepository(binding).files.keys()].sort();
  }

  async commit(
    binding: VaultBinding,
    transition: {
      baseRevision: string;
      message: string;
      files: Record<string, string | null>;
    },
  ): Promise<{ revision: string; commitId: string }> {
    const repository = this.boundRepository(binding);
    if (!this.#writeAvailable) {
      throw new VaultError(
        "unavailable",
        "write_unavailable",
        "The Learning Vault write path is temporarily unavailable.",
        true,
      );
    }
    if (repository.revision !== transition.baseRevision) {
      throw new VaultError(
        "stale_revision",
        "stale_revision",
        `The Vault advanced from ${transition.baseRevision} to ${repository.revision}.`,
        true,
      );
    }
    const commitNumber = Number(repository.commitId.match(/commit-(\d+)$/)?.[1] ?? 0) + 1;
    for (const [path, content] of Object.entries(transition.files)) {
      if (content === null) {
        repository.files.delete(path);
      } else {
        repository.files.set(path, content);
      }
    }
    repository.revision = `rev-${commitNumber}`;
    repository.commitId = `commit-${commitNumber}`;
    repository.history.push({
      revision: repository.revision,
      commitId: repository.commitId,
      message: transition.message,
    });
    return { revision: repository.revision, commitId: repository.commitId };
  }

  setWriteAvailability(available: boolean): void {
    this.#writeAvailable = available;
  }

  setPrivacy(binding: VaultBinding, privateRepository: boolean): void {
    this.boundRepository(binding).private = privateRepository;
  }

  async findCommitByMarker(
    binding: VaultBinding,
    marker: string,
  ): Promise<{ revision: string; commitId: string } | null> {
    const found = this.boundRepository(binding).history.find((entry) =>
      entry.message.includes(marker),
    );
    return found === undefined
      ? null
      : { revision: found.revision, commitId: found.commitId };
  }

  private boundRepository(binding: VaultBinding): MemoryRepository {
    const repository = this.#repositories.get(this.key(binding));
    if (repository === undefined || repository.repositoryId !== binding.repositoryId) {
      throw new VaultError(
        "authorization",
        "bound_vault_unavailable",
        "The bound Learning Vault is no longer available to the GitHub App.",
        true,
      );
    }
    return repository;
  }

  private key(repository: { owner: string; repository: string }): string {
    return `${repository.owner}/${repository.repository}`.toLowerCase();
  }
}
