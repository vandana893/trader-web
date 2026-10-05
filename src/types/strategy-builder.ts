export type NodeType = 
  | 'market' 
  | 'instrument' 
  | 'indicator' 
  | 'comparison' 
  | 'arithmetic' 
  | 'time' 
  | 'position' 
  | 'risk' 
  | 'entry' 
  | 'repair' 
  | 'exit' 
  | 'notification'
  | 'condition'; // primitive condition node

export interface StrategyNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, any>;
}

export type LogicalOperator = 'AND' | 'OR' | 'NOT';

export interface ConditionGroup {
  id: string;
  operator: LogicalOperator;
  conditions: (StrategyNode | ConditionGroup)[];
}

export interface StrategyVersion {
  version: number;
  createdAt: string;
  stateSnapshot: Omit<StrategyBuilderState, 'history'>;
  status: 'Draft' | 'Saved' | 'Validated';
}

export interface StrategyBuilderState {
  strategyId: string;
  name: string;
  version: number;
  status: "draft" | "validated";
  nodes: StrategyNode[]; // Linear nodes (entry, exit, risk, etc)
  conditionGroup: ConditionGroup; // Root condition group for logic
  history: StrategyVersion[];
  isDirty: boolean;
}

export interface BlockDefinition {
  type: NodeType;
  name: string;
  description: string;
  category: string;
  defaultConfig: Record<string, any>;
}
