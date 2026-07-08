import { useState } from 'react';
import styled from 'styled-components';
import Display from './Display';
import Keypad from './Keypad';
import { add, subtract } from '../calculator';

const CalculatorWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  width: 320px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export default function Calculator() {
  const [display, setDisplay] = useState('');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  function handleDigit(digit) {
    if (waitingForSecond) {
      setDisplay(digit);
      setWaitingForSecond(false);
    } else {
      setDisplay(prev => (prev === '0' || prev === '') ? digit : prev + digit);
    }
  }

  function handleOperator(op) {
    const current = parseFloat(display) || 0;
    if (firstOperand !== null && !waitingForSecond) {
      const result = calculate(firstOperand, current, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    } else {
      setFirstOperand(current);
    }
    setOperator(op);
    setWaitingForSecond(true);
  }

  function calculate(a, b, op) {
    if (op === '+') return add(a, b);
    if (op === '-') return subtract(a, b);
    if (op === '*') return a * b;
    if (op === '/') return b !== 0 ? a / b : 'Error';
    return b;
  }

  function handleEquals() {
    if (firstOperand === null || operator === null) return;
    const current = parseFloat(display) || 0;
    const result = calculate(firstOperand, current, operator);
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(false);
  }

  function handleClear() {
    setDisplay('');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecond(false);
  }

  return (
    <CalculatorWrapper>
      <Display value={display} />
      <Keypad
        onDigit={handleDigit}
        onOperator={handleOperator}
        onEquals={handleEquals}
        onClear={handleClear}
      />
    </CalculatorWrapper>
  );
}
