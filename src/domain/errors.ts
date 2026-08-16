export type VaultErrorCategory =
  | "authentication"
  | "authorization"
  | "validation"
  | "incompatible_schema"
  | "stale_revision"
  | "privacy_rejection"
  | "github_failure"
  | "unsupported_action"
  | "unavailable";

export class VaultError extends Error {
  constructor(
    readonly category: VaultErrorCategory,
    readonly code: string,
    message: string,
    readonly recoverable: boolean,
  ) {
    super(message);
    this.name = "VaultError";
  }
}

export function toPublicError(error: unknown): {
  category: VaultErrorCategory;
  code: string;
  message: string;
  recoverable: boolean;
} {
  if (error instanceof VaultError) {
    return {
      category: error.category,
      code: error.code,
      message: error.message,
      recoverable: error.recoverable,
    };
  }
  return {
    category: "unavailable",
    code: "unexpected_failure",
    message: "The Learning Vault operation failed without changing the Vault.",
    recoverable: true,
  };
}
