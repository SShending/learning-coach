import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

import { createLearningVaultMcpServer } from "./create-server.js";
import { readStdioConfig } from "../runtime/config.js";
import { createProductionVault } from "../runtime/create-production-vault.js";

async function main(): Promise<void> {
  const config = readStdioConfig(process.env);
  const server = createLearningVaultMcpServer(createProductionVault(config), {
    learnerId: config.learnerId,
    scopes: new Set(["vault:read", "vault:write"]),
  });
  const transport = new StdioServerTransport();
  // SDK 1.x transport declarations are not exact-optional compatible.
  await server.connect(transport as Transport);
}

main().catch(() => {
  process.stderr.write("Learning Vault stdio server failed to start. Check environment configuration.\n");
  process.exitCode = 1;
});
