import { describe, expect, it } from "vitest";

import { createContractHarness } from "../support/contract-harness.js";

describe("Learning Vault tool metadata", () => {
  it("advertises structured outputs, OAuth scopes, and idempotency accurately", async () => {
    const harness = await createContractHarness();

    try {
      const tools = await harness.listTools();
      expect(tools).toHaveLength(11);
      for (const tool of tools) {
        expect(tool.outputSchema).toMatchObject({ type: "object" });
        expect(tool._meta?.securitySchemes).toEqual([
          {
            type: "oauth2",
            scopes:
              tool.name === "apply_forget"
                ? ["vault:read", "vault:write"]
                : [
                    ["get_vault_status", "get_learning_context", "get_review_queue", "prepare_forget"].includes(
                      tool.name,
                    )
                      ? "vault:read"
                      : "vault:write",
                  ],
          },
        ]);
      }
      expect(tools.find((tool) => tool.name === "save_learning_update")?.annotations).toMatchObject({
        idempotentHint: true,
      });
      expect(tools.find((tool) => tool.name === "initialize_vault")?.annotations).toMatchObject({
        idempotentHint: true,
      });
      expect(tools.find((tool) => tool.name === "save_conflict_merge")?.annotations).toMatchObject({
        idempotentHint: true,
      });
      expect(tools.find((tool) => tool.name === "disconnect_vault")?.annotations).toMatchObject({
        destructiveHint: true,
      });
    } finally {
      await harness.close();
    }
  });
});
