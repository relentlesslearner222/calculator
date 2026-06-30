import React, { useRef, useEffect } from 'react';
import { formatExpression } from '../utils/format';

interface DisplayProps {
  expression: string;
  result: string;
  error: string | null;
  memory: number;
  angleMode: 'deg' | 'rad';
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  error,
  memory,
  angleMode,
}) => {
  const exprRef = useRef<HTMLDivElement>(null);

  // Auto-scroll expression to end
  useEffect(() => {
    if (exprRef.current) {
      exprRef.current.scrollLeft = exprRef.current.scrollWidth;
    }
  }, [expression]);

  return (
    <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 mb-3 select-none">
      {/* Status row */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400 uppercase tracking-widest">
          {angleMode}
        </span>
        {memory !== 0 && (
          <span className="text-xs text-teal-400 font-mono">M={memory}</span>
        )}
      </div>

      {/* Expression */}
      <div
        ref={exprRef}
        data-testid="expression-display"
        className="overflow-x-auto whitespace-nowrap text-gray-300 text-sm font-mono min-h-[1.25rem] mb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {formatExpression(expression) || '\u00A0'}
      </div>

      {/* Result / Error */}
      {error ? (
        <div
          data-testid="error-display"
          className="text-red-400 text-2xl font-mono font-bold truncate"
        >
          {error}
        </div>
      ) : (
        <div
          data-testid="result-display"
          className="text-white text-3xl font-mono font-bold truncate"
        >
          {result}
        </div>
      )}
    </div>
  );
};
