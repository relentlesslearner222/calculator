interface DisplayProps {
  expression: string;
  displayValue: string;
  isError: boolean;
}

export function Display({ expression, displayValue, isError }: DisplayProps) {
  return (
    <div className="bg-gray-900 rounded-t-2xl p-4 flex flex-col items-end min-h-[6rem]">
      <div className="text-gray-400 text-sm min-h-[1.25rem] truncate w-full text-right">
        {expression}
      </div>
      <div
        className={`text-4xl font-light mt-1 truncate w-full text-right ${
          isError ? 'text-red-400' : 'text-white'
        }`}
        data-testid="display-value"
      >
        {displayValue}
      </div>
    </div>
  );
}
