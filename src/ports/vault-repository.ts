import type {
  BindVaultRequest,
  RepositoryInspection,
  VaultBinding,
} from "../domain/types.js";

export interface VaultRepository {
  inspect(request: BindVaultRequest): Promise<RepositoryInspection>;
  readFile(binding: VaultBinding, path: string, revision?: string): Promise<string | null>;
  listFiles(binding: VaultBinding): Promise<string[]>;
  commit(
    binding: VaultBinding,
    transition: {
      baseRevision: string;
      message: string;
      files: Record<string, string | null>;
    },
  ): Promise<{ revision: string; commitId: string }>;
  findCommitByMarker(
    binding: VaultBinding,
    marker: string,
  ): Promise<{ revision: string; commitId: string } | null>;
}
