import type { VaultBinding } from "../domain/types.js";
import type { OperationalStore } from "../ports/operational-store.js";

export class MemoryOperationalStore implements OperationalStore {
  readonly #bindings = new Map<string, VaultBinding>();

  async getBinding(learnerId: string): Promise<VaultBinding | null> {
    return this.#bindings.get(learnerId) ?? null;
  }

  async setBinding(learnerId: string, binding: VaultBinding): Promise<void> {
    this.#bindings.set(learnerId, binding);
  }

  async deleteBinding(learnerId: string): Promise<void> {
    this.#bindings.delete(learnerId);
  }
}
