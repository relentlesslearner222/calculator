export type CalculatorAction =
  | { type: 'DIGIT'; payload: string }
  | { type: 'OPERATOR'; payload: '+' | '-' | '*' | '/' }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'BACKSPACE' };

export interface CalculatorState {
  currentInput: string;
  previousInput: string;
  operator: string | null;
  overwrite: boolean;
}

export interface ButtonConfig {
  label: string;
  value: string;
  action: CalculatorAction;
  className?: string;
}
