import type { VaultBinding } from "../domain/types.js";

export interface OperationalStore {
  getBinding(learnerId: string): Promise<VaultBinding | null>;
  setBinding(learnerId: string, binding: VaultBinding): Promise<void>;
  deleteBinding(learnerId: string): Promise<void>;
}
