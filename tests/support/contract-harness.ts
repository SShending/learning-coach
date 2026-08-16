import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { MemoryOperationalStore } from "../../src/adapters/memory-operational-store.js";
import {
  MemoryVaultRepository,
  type MemoryRepositoryFixture,
} from "../../src/adapters/memory-vault-repository.js";
import { LearningVault } from "../../src/application/learning-vault.js";
import { createLearningVaultMcpServer } from "../../src/mcp/create-server.js";
import type { OperationalStore } from "../../src/ports/operational-store.js";
import type { VaultRepository } from "../../src/ports/vault-repository.js";

export type ContractHarness = {
  call(toolName: string, input: Record<string, unknown>): Promise<unknown>;
  callError(toolName: string, input: Record<string, unknown>): Promise<unknown>;
  listTools(): Promise<
    Array<{
      name: string;
      annotations?: Record<string, unknown>;
      outputSchema?: Record<string, unknown>;
      _meta?: Record<string, unknown>;
    }>
  >;
  readRepositoryFile(path: string): Promise<string | null>;
  setRepositoryPrivacy(privateRepository: boolean): void;
  setRepositoryWriteAvailability(available: boolean): void;
  close(): Promise<void>;
};

export async function createContractHarness(options: {
  repositories?: MemoryRepositoryFixture[];
  now?: string;
  operationalStore?: OperationalStore;
  repositoryAdapter?: VaultRepository;
  learnerId?: string;
  scopes?: string[];
} = {}): Promise<ContractHarness> {
  const operationalStore = options.operationalStore ?? new MemoryOperationalStore();
  const memoryRepository = new MemoryVaultRepository(options.repositories);
  const repository = options.repositoryAdapter ?? memoryRepository;
  const vault = new LearningVault(
    operationalStore,
    repository,
    () => options.now ?? "2026-08-15T08:00:00.000Z",
  );
  const server = createLearningVaultMcpServer(vault, {
    learnerId: options.learnerId ?? "learner-alpha",
    scopes: new Set(options.scopes ?? ["vault:read", "vault:write"]),
  });
  const client = new Client({ name: "contract-test", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await server.connect(serverTransport);
  await client.connect(clientTransport);

  return {
    async call(toolName, input) {
      const result = await client.callTool({ name: toolName, arguments: input });
      if (result.isError) {
        throw new Error(JSON.stringify(result));
      }
      return result.structuredContent;
    },
    async callError(toolName, input) {
      const result = await client.callTool({ name: toolName, arguments: input });
      if (!result.isError) {
        throw new Error(`Expected ${toolName} to fail`);
      }
      return result.structuredContent;
    },
    async listTools() {
      const result = await client.listTools();
      return result.tools.map((tool) => ({
        name: tool.name,
        ...(tool.annotations === undefined ? {} : { annotations: tool.annotations }),
        ...(tool.outputSchema === undefined ? {} : { outputSchema: tool.outputSchema }),
        ...(tool._meta === undefined ? {} : { _meta: tool._meta }),
      }));
    },
    async readRepositoryFile(path) {
      const fixture = options.repositories?.[0];
      if (fixture === undefined) return null;
      return repository.readFile(
        {
          installationId: fixture.installationId,
          repositoryId: fixture.repositoryId,
          owner: fixture.owner,
          repository: fixture.repository,
        },
        path,
      );
    },
    setRepositoryPrivacy(privateRepository) {
      const fixture = options.repositories?.[0];
      if (fixture === undefined) throw new Error("A memory repository fixture is required.");
      memoryRepository.setPrivacy(
        {
          installationId: fixture.installationId,
          repositoryId: fixture.repositoryId,
          owner: fixture.owner,
          repository: fixture.repository,
        },
        privateRepository,
      );
    },
    setRepositoryWriteAvailability(available) {
      memoryRepository.setWriteAvailability(available);
    },
    async close() {
      await client.close();
      await server.close();
    },
  };
}
