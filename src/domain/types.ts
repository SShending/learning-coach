export type LearnerPrincipal = {
  learnerId: string;
  scopes: ReadonlySet<string>;
};

export type VaultBinding = {
  installationId: number;
  owner: string;
  repository: string;
  repositoryId: number;
};

export type VaultStatus = {
  status: "unbound" | "uninitialized" | "ready" | "incompatible" | "unavailable";
  schemaVersion: number | null;
  revision: string | null;
  defaultBranch: string | null;
};

export type RepositoryInspection = VaultBinding & {
  private: boolean;
  defaultBranch: string;
  revision: string;
  commitId: string;
};

export type BindVaultRequest = {
  installationId: number;
  owner: string;
  repository: string;
};
