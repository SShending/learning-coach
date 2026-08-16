export type ModelResult = {
  reply: string;
  durableMemory: string | null;
};

export interface AgentModel {
  respond(input: string, relevantMemories: string[]): Promise<ModelResult>;
}

export interface AgentMemory {
  retrieve(input: string): Promise<string[]>;
  save(memory: string): Promise<void>;
}

export class MinimalMemoryAgent {
  constructor(
    private readonly model: AgentModel,
    private readonly memory: AgentMemory,
  ) {}

  async turn(input: string): Promise<string> {
    const relevantMemories = await this.memory.retrieve(input);
    const result = await this.model.respond(input, relevantMemories);
    if (result.durableMemory !== null) {
      await this.memory.save(result.durableMemory);
    }
    return result.reply;
  }
}
