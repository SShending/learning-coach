import { describe, expect, it } from "vitest";

import {
  MinimalMemoryAgent,
  type AgentMemory,
  type AgentModel,
} from "../../examples/minimal-memory-agent.js";

describe("hand-built minimal memory agent exercise", () => {
  it("retrieves before generation and writes only the model's distilled durable memory", async () => {
    const events: string[] = [];
    const stored: string[] = [];
    const memory: AgentMemory = {
      async retrieve(input) {
        events.push(`retrieve:${input}`);
        return input.includes("format") ? stored : [];
      },
      async save(value) {
        events.push(`save:${value}`);
        stored.push(value);
      },
    };
    const model: AgentModel = {
      async respond(input, relevantMemories) {
        events.push(`respond:${relevantMemories.join("|")}`);
        return input.includes("prefer")
          ? { reply: "Noted.", durableMemory: "The user prefers concise format." }
          : { reply: relevantMemories[0] ?? "No preference found.", durableMemory: null };
      },
    };
    const agent = new MinimalMemoryAgent(model, memory);

    await expect(agent.turn("I prefer concise format")).resolves.toBe("Noted.");
    await expect(agent.turn("What format should you use?")).resolves.toBe(
      "The user prefers concise format.",
    );
    expect(events).toEqual([
      "retrieve:I prefer concise format",
      "respond:",
      "save:The user prefers concise format.",
      "retrieve:What format should you use?",
      "respond:The user prefers concise format.",
    ]);
  });
});
