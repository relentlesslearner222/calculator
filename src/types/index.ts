export interface CalculationEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export interface HistoryState {
  entries: CalculationEntry[];
  undoStack: CalculationEntry[];
  redoStack: CalculationEntry[];
}
