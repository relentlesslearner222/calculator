import { useReducer } from 'react';
import { CalculatorAction } from '../types';
import { calculatorReducer, initialState } from './calculatorReducer';

export interface UseCalculatorReturn {
  displayValue: string;
  dispatch: (action: CalculatorAction) => void;
}

export function useCalculator(): UseCalculatorReturn {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return {
    displayValue: state.currentInput,
    dispatch,
  };
}
