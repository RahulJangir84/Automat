import type { AgentStepLog, PendingAction } from "./types.js";

export class ActionTracker {
  private logs: AgentStepLog[] = [];
  private pendingActions: PendingAction[] = [];

  addLog(log: AgentStepLog) {
    this.logs.push(log);
  }

  getLogs() {
    return this.logs;
  }

  addPendingAction(action: PendingAction) {
    this.pendingActions.push(action);
  }

  getPendingActions() {
    return this.pendingActions;
  }

  clearPendingActions() {
    this.pendingActions = [];
  }
}