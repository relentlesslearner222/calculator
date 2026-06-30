export type AngleMode = 'deg' | 'rad';

export interface HistoryEntry {
  expression: string;
  result: string;
}

export interface CalculatorState {
  display: string;
  expression: string;
  angleMode: AngleMode;
  isError: boolean;
  waitingForOperand: boolean;
  memory: number;
  history: HistoryEntry[];
}

export type ButtonVariant = 'number' | 'operator' | 'function' | 'equals' | 'clear' | 'memory';

export interface CalcButton {
  label: string;
  value: string;
  variant: ButtonVariant;
  ariaLabel?: string;
}
