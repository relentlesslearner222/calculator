interface Props {
  expression: string;
  display: string;
}

export function Display({ expression, display }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 mb-4 min-h-[96px] flex flex-col justify-between">
      <div
        className="text-gray-400 text-sm text-right truncate min-h-[1.25rem]"
        aria-label="expression"
      >
        {expression}
      </div>
      <div
        className="text-white text-3xl font-mono text-right truncate"
        aria-label="display"
        data-testid="display"
      >
        {display}
      </div>
    </div>
  );
}
