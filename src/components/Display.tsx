interface DisplayProps {
  value: string;
  expression?: string;
}

export function Display({ value, expression = '' }: DisplayProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 mb-4 text-right">
      {expression && (
        <div className="text-gray-400 text-sm min-h-[1.25rem] truncate">{expression}</div>
      )}
      <div className="text-white text-4xl font-light tracking-wider break-all">
        {value}
      </div>
    </div>
  );
}
