import React from 'react';
import { CalcButton } from './CalcButton';
import type { ButtonDef } from '../types/calculator';

interface ButtonGridProps {
  angleMode: 'deg' | 'rad';
  onDigit: (d: string) => void;
  onOperator: (op: string) => void;
  onFunction: (f: string) => void;
  onEvaluate: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onToggleAngle: () => void;
  onMemStore: () => void;
  onMemRecall: () => void;
  onMemClear: () => void;
  onMemAdd: () => void;
  onMemSub: () => void;
  onParen: (p: string) => void;
}

export const ButtonGrid: React.FC<ButtonGridProps> = ({
  angleMode,
  onDigit,
  onOperator,
  onFunction,
  onEvaluate,
  onClear,
  onBackspace,
  onToggleSign,
  onPercent,
  onToggleAngle,
  onMemStore,
  onMemRecall,
  onMemClear,
  onMemAdd,
  onMemSub,
  onParen,
}) => {
  // Scientific function rows
  const scientificRows: ButtonDef[][] = [
    [
      { label: 'MC', value: 'MC', variant: 'memory', title: 'Memory Clear' },
      { label: 'MR', value: 'MR', variant: 'memory', title: 'Memory Recall' },
      { label: 'M+', value: 'M+', variant: 'memory', title: 'Memory Add' },
      { label: 'M−', value: 'M-', variant: 'memory', title: 'Memory Subtract' },
      { label: 'MS', value: 'MS', variant: 'memory', title: 'Memory Store' },
    ],
    [
      { label: angleMode === 'deg' ? 'DEG' : 'RAD', value: 'ANGLE', variant: 'secondary', title: 'Toggle Deg/Rad' },
      { label: 'sin', value: 'sin(', variant: 'function' },
      { label: 'cos', value: 'cos(', variant: 'function' },
      { label: 'tan', value: 'tan(', variant: 'function' },
      { label: 'π', value: 'π', variant: 'function' },
    ],
    [
      { label: 'x²', value: '^2)', variant: 'function', title: 'Square' },
      { label: 'sin⁻¹', value: 'asin(', variant: 'function' },
      { label: 'cos⁻¹', value: 'acos(', variant: 'function' },
      { label: 'tan⁻¹', value: 'atan(', variant: 'function' },
      { label: 'e', value: 'e', variant: 'function', title: 'Euler\'s number' },
    ],
    [
      { label: '√', value: 'sqrt(', variant: 'function', title: 'Square root' },
      { label: 'log', value: 'log(', variant: 'function', title: 'Log base 10' },
      { label: 'ln', value: 'ln(', variant: 'function', title: 'Natural log' },
      { label: 'xⁿ', value: '^', variant: 'function', title: 'Power' },
      { label: '10ˣ', value: '10^(', variant: 'function', title: '10 to the power of x' },
    ],
  ];

  // Basic calculator rows
  const basicRows: ButtonDef[][] = [
    [
      { label: 'AC', value: 'AC', variant: 'clear' },
      { label: '+/−', value: 'SIGN', variant: 'secondary' },
      { label: '%', value: '%', variant: 'secondary' },
      { label: '÷', value: '/', variant: 'operator' },
    ],
    [
      { label: '7', value: '7', variant: 'digit' },
      { label: '8', value: '8', variant: 'digit' },
      { label: '9', value: '9', variant: 'digit' },
      { label: '×', value: '*', variant: 'operator' },
    ],
    [
      { label: '4', value: '4', variant: 'digit' },
      { label: '5', value: '5', variant: 'digit' },
      { label: '6', value: '6', variant: 'digit' },
      { label: '−', value: '-', variant: 'operator' },
    ],
    [
      { label: '1', value: '1', variant: 'digit' },
      { label: '2', value: '2', variant: 'digit' },
      { label: '3', value: '3', variant: 'digit' },
      { label: '+', value: '+', variant: 'operator' },
    ],
    [
      { label: '(', value: '(', variant: 'secondary' },
      { label: '0', value: '0', variant: 'digit' },
      { label: '.', value: '.', variant: 'digit' },
      { label: '=', value: '=', variant: 'equal' },
    ],
  ];

  const handleButton = (btn: ButtonDef) => {
    switch (btn.value) {
      case 'AC': onClear(); break;
      case 'SIGN': onToggleSign(); break;
      case '%': onPercent(); break;
      case '=': onEvaluate(); break;
      case 'ANGLE': onToggleAngle(); break;
      case 'MC': onMemClear(); break;
      case 'MR': onMemRecall(); break;
      case 'M+': onMemAdd(); break;
      case 'M-': onMemSub(); break;
      case 'MS': onMemStore(); break;
      case '(': case ')': onParen(btn.value); break;
      case '+': case '-': case '*': case '/': case '^': onOperator(btn.value); break;
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
      case '.': case 'π': case 'e': onDigit(btn.value); break;
      default:
        // Functions ending with '(' or special combos like '^2)'
        onFunction(btn.value);
    }
  };

  return (
    <div>
      {/* Scientific rows */}
      {scientificRows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-5 gap-1.5 mb-1.5">
          {row.map((btn) => (
            <CalcButton
              key={btn.value}
              label={btn.label}
              variant={btn.variant}
              title={btn.title}
              wide={btn.wide}
              onClick={() => handleButton(btn)}
              data-testid={`btn-${btn.value}`}
            />
          ))}
        </div>
      ))}

      {/* Divider */}
      <div className="border-t border-gray-700 my-2" />

      {/* Basic rows */}
      {basicRows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-4 gap-1.5 mb-1.5">
          {row.map((btn) => (
            <CalcButton
              key={btn.label}
              label={btn.label}
              variant={btn.variant}
              title={btn.title}
              wide={btn.wide}
              onClick={() => handleButton(btn)}
              data-testid={`btn-${btn.value}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
