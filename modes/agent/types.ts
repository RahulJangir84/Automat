export type ToolName =
  | "listFiles"
  | "readFile"
  | "writeFile"
  | "runCommand"
  | "findFile"
  | "gitDiff";

export type ToolCall = {
  name: ToolName;
  args: Record<string, unknown>;
};

export type ToolResult = {
  ok: boolean;
  output: unknown;
};

export type AgentRunOptions = {
  userTask: string;
  projectRoot: string;
};

export type AgentStepLog = {
  step: number;
  type: "model" | "tool";
  message: string;
};

export type PendingAction =
  | {
      type: "write-file";
      path: string;
      content: string;
    }
  | {
      type: "run-command";
      command: string;
    };