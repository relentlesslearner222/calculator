import { useState, useCallback } from 'react';
import { evaluateExpression, EvaluationError } from '@/engine/evaluate';
import { CalculationEntry } from '@/types';

export interface UseCalculatorReturn {
  expression: string;
  displayValue: string;
  isError: boolean;
  appendToken: (token: string) => void;
  clear: () => void;
  evaluate: () => CalculationEntry | null;
  restoreExpression: (expression: string) => void;
}

export function useCalculator(): UseCalculatorReturn {
  const [expression, setExpression] = useState<string>('');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [isError, setIsError] = useState<boolean>(false);

  const appendToken = useCallback((token: string) => {
    setIsError(false);
    setExpression((prev) => {
      const next = prev + token;
      setDisplayValue(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setExpression('');
    setDisplayValue('0');
    setIsError(false);
  }, []);

  const evaluate = useCallback((): CalculationEntry | null => {
    if (!expression.trim()) return null;
    try {
      const result = evaluateExpression(expression);
      const entry: CalculationEntry = {
        id: crypto.randomUUID(),
        expression,
        result,
        timestamp: new Date(),
      };
      setDisplayValue(result);
      setExpression(result);
      setIsError(false);
      return entry;
    } catch (err) {
      if (err instanceof EvaluationError) {
        setDisplayValue('Error');
        setIsError(true);
        return null;
      }
      throw err;
    }
  }, [expression]);

  const restoreExpression = useCallback((expr: string) => {
    setExpression(expr);
    setDisplayValue(expr);
    setIsError(false);
  }, []);

  return { expression, displayValue, isError, appendToken, clear, evaluate, restoreExpression };
}
