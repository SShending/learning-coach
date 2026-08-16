import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
} from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { z } from "zod";

import type { VaultBinding } from "../domain/types.js";
import type { OperationalStore } from "../ports/operational-store.js";

const AAD = Buffer.from("learning-vault-operational-store:v1", "utf8");

const bindingSchema = z.object({
  installationId: z.number().int().positive(),
  owner: z.string().min(1),
  repository: z.string().min(1),
  repositoryId: z.number().int().positive(),
});

const stateSchema = z.object({
  version: z.literal(1),
  bindings: z.record(z.string(), bindingSchema),
});

const envelopeSchema = z.object({
  version: z.literal(1),
  algorithm: z.literal("A256GCM"),
  iv: z.string().min(1),
  ciphertext: z.string(),
  tag: z.string().min(1),
});

type OperationalState = z.infer<typeof stateSchema>;

export class EncryptedFileOperationalStore implements OperationalStore {
  readonly #path: string;
  readonly #key: Buffer;
  #tail: Promise<void> = Promise.resolve();

  constructor(options: { path: string; key: Uint8Array }) {
    if (options.key.byteLength !== 32) {
      throw new Error("Operational store encryption key must contain exactly 32 bytes.");
    }
    this.#path = options.path;
    this.#key = Buffer.from(options.key);
  }

  async getBinding(learnerId: string): Promise<VaultBinding | null> {
    return this.enqueue(async () => {
      const state = await this.readState();
      return state.bindings[learnerId] ?? null;
    });
  }

  async setBinding(learnerId: string, binding: VaultBinding): Promise<void> {
    await this.enqueue(async () => {
      const state = await this.readState();
      state.bindings[learnerId] = bindingSchema.parse(binding);
      await this.writeState(state);
    });
  }

  async deleteBinding(learnerId: string): Promise<void> {
    await this.enqueue(async () => {
      const state = await this.readState();
      delete state.bindings[learnerId];
      if (Object.keys(state.bindings).length === 0) {
        await unlink(this.#path).catch((error: unknown) => {
          if (!this.isMissingFile(error)) throw error;
        });
        return;
      }
      await this.writeState(state);
    });
  }

  private async readState(): Promise<OperationalState> {
    let serialized: string;
    try {
      serialized = await readFile(this.#path, "utf8");
    } catch (error) {
      if (this.isMissingFile(error)) return { version: 1, bindings: {} };
      throw error;
    }
    const envelope = envelopeSchema.parse(JSON.parse(serialized));
    const decipher = createDecipheriv(
      "aes-256-gcm",
      this.#key,
      Buffer.from(envelope.iv, "base64"),
    );
    decipher.setAAD(AAD);
    decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(envelope.ciphertext, "base64")),
      decipher.final(),
    ]);
    return stateSchema.parse(JSON.parse(plaintext.toString("utf8")));
  }

  private async writeState(state: OperationalState): Promise<void> {
    const validated = stateSchema.parse(state);
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.#key, iv);
    cipher.setAAD(AAD);
    const ciphertext = Buffer.concat([
      cipher.update(JSON.stringify(validated), "utf8"),
      cipher.final(),
    ]);
    const envelope = {
      version: 1 as const,
      algorithm: "A256GCM" as const,
      iv: iv.toString("base64"),
      ciphertext: ciphertext.toString("base64"),
      tag: cipher.getAuthTag().toString("base64"),
    };
    const temporaryPath = `${this.#path}.${randomUUID()}.tmp`;
    await mkdir(dirname(this.#path), { recursive: true, mode: 0o700 });
    try {
      await writeFile(temporaryPath, `${JSON.stringify(envelope)}\n`, {
        encoding: "utf8",
        mode: 0o600,
      });
      await rename(temporaryPath, this.#path);
    } finally {
      await unlink(temporaryPath).catch((error: unknown) => {
        if (!this.isMissingFile(error)) throw error;
      });
    }
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.#tail.then(operation, operation);
    this.#tail = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private isMissingFile(error: unknown): boolean {
    return (
      error !== null &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    );
  }
}
