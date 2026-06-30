import React from 'react';
import { AngleMode } from '../types/calculator';

interface DisplayProps {
  expression: string;
  display: string;
  angleMode: AngleMode;
  memory: number;
  isError: boolean;
}

export function Display({ expression, display, angleMode, memory, isError }: DisplayProps) {
  return (
    <div className="bg-gray-800 rounded-t-2xl p-4 min-h-[110px] flex flex-col justify-between select-none">
      <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
        <span className="font-mono truncate max-w-[80%]" aria-label="expression">
          {expression || '\u00A0'}
        </span>
        <div className="flex gap-2">
          {memory !== 0 && (
            <span className="text-blue-400 font-semibold" aria-label="memory indicator">M</span>
          )}
          <span
            className={`font-semibold uppercase ${
              angleMode === 'deg' ? 'text-green-400' : 'text-yellow-400'
            }`}
            aria-label="angle mode"
          >
            {angleMode}
          </span>
        </div>
      </div>
      <div
        className={`font-mono text-right break-all leading-none ${
          isError
            ? 'text-red-400 text-base'
            : display.length > 12
            ? 'text-xl'
            : display.length > 8
            ? 'text-2xl'
            : 'text-4xl'
        }`}
        aria-live="polite"
        aria-label="calculator display"
        data-testid="calculator-display"
      >
        {display}
      </div>
    </div>
  );
}
