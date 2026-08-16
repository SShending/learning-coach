import { VaultError } from "./errors.js";
import type { LearningUpdateInput } from "./learning-update.js";

const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{16,}\b/i,
  /\b(?:password|passwd|api[_ -]?key|secret)\s*[:=]\s*\S{6,}/i,
  /\b(?:verification|one[- ]time|otp)\s+(?:code\s*)?[:=]?\s*\d{4,8}\b/i,
];

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const WORKPLACE_ID_PATTERN = /\b(?:EMP|STAFF|WORKER)-\d{4,}\b/i;

export function containsSecret(value: unknown): boolean {
  return strings(value).some((text) => SECRET_PATTERNS.some((pattern) => pattern.test(text)));
}

export function redactPublicIdentifiers(text: string): string {
  return text
    .replace(new RegExp(EMAIL_PATTERN.source, "gi"), "[redacted personal identifier]")
    .replace(new RegExp(WORKPLACE_ID_PATTERN.source, "gi"), "[redacted workplace identifier]");
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value !== null && typeof value === "object") {
    return Object.values(value).flatMap(strings);
  }
  return [];
}

function replaceStrings(value: unknown, replacements: Array<[string, string]>): unknown {
  if (typeof value === "string") {
    return replacements.reduce(
      (text, [exact, abstraction]) => text.split(exact).join(abstraction),
      value,
    );
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceStrings(item, replacements));
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceStrings(item, replacements)]),
    );
  }
  return value;
}

export function minimizeLearningUpdate(update: LearningUpdateInput): LearningUpdateInput {
  if (containsSecret(update)) {
    throw new VaultError(
      "privacy_rejection",
      "secret_detected",
      "The Learning Update contains a credential or comparable secret and was not saved.",
      true,
    );
  }

  if (update.meaningful && update.record && update.privacy === undefined) {
    throw new VaultError(
      "privacy_rejection",
      "privacy_review_required",
      "Classify sensitive context and source excerpts before persisting this Learning Update.",
      true,
    );
  }

  if (update.privacy?.sourceExcerpts.some((excerpt) => !excerpt.confirmed)) {
    throw new VaultError(
      "privacy_rejection",
      "source_confirmation_required",
      "Raw chat, uploads, proprietary code, and substantial copied material require confirmation for this update.",
      true,
    );
  }

  const replacements = (update.privacy?.sensitiveContext ?? [])
    .map((item) => [item.exact, item.abstraction] as [string, string])
    .sort((left, right) => right[0].length - left[0].length);
  const replaced = replaceStrings(update, replacements) as LearningUpdateInput;
  const { privacy: _privacy, ...safeUpdate } = replaced;
  if (
    strings(safeUpdate).some(
      (text) => EMAIL_PATTERN.test(text) || WORKPLACE_ID_PATTERN.test(text),
    )
  ) {
    throw new VaultError(
      "privacy_rejection",
      "sensitive_context_requires_abstraction",
      "Sensitive personal or workplace identifiers must be abstracted before persistence.",
      true,
    );
  }
  return safeUpdate as LearningUpdateInput;
}
