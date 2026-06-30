export type AngleMode = 'deg' | 'rad';

export interface CalcState {
  expression: string;
  result: string;
  error: string | null;
  memory: number;
  history: HistoryEntry[];
  angleMode: AngleMode;
  isResultDisplayed: boolean;
}

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type ButtonVariant =
  | 'digit'
  | 'operator'
  | 'function'
  | 'memory'
  | 'equal'
  | 'clear'
  | 'secondary';

export interface ButtonDef {
  label: string;
  value: string;
  variant: ButtonVariant;
  wide?: boolean;
  title?: string;
}
