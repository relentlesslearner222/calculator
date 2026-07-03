interface KeypadProps {
  onToken: (token: string) => void;
  onClear: () => void;
  onEvaluate: () => void;
}

type ButtonDef = {
  label: string;
  action: () => void;
  className?: string;
};

export function Keypad({ onToken, onClear, onEvaluate }: KeypadProps) {
  const buttons: ButtonDef[] = [
    { label: 'AC', action: onClear, className: 'col-span-2 bg-gray-400 text-gray-900 hover:bg-gray-300' },
    { label: '(', action: () => onToken('('), className: 'bg-gray-600 text-white hover:bg-gray-500' },
    { label: ')', action: () => onToken(')'), className: 'bg-gray-600 text-white hover:bg-gray-500' },
    { label: '7', action: () => onToken('7'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '8', action: () => onToken('8'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '9', action: () => onToken('9'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '÷', action: () => onToken('/'), className: 'bg-amber-500 text-white hover:bg-amber-400' },
    { label: '4', action: () => onToken('4'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '5', action: () => onToken('5'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '6', action: () => onToken('6'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '×', action: () => onToken('*'), className: 'bg-amber-500 text-white hover:bg-amber-400' },
    { label: '1', action: () => onToken('1'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '2', action: () => onToken('2'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '3', action: () => onToken('3'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '-', action: () => onToken('-'), className: 'bg-amber-500 text-white hover:bg-amber-400' },
    { label: '0', action: () => onToken('0'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '.', action: () => onToken('.'), className: 'bg-gray-700 text-white hover:bg-gray-600' },
    { label: '=', action: onEvaluate, className: 'bg-amber-500 text-white hover:bg-amber-400' },
    { label: '+', action: () => onToken('+'), className: 'bg-amber-500 text-white hover:bg-amber-400' },
  ];

  return (
    <div className="grid grid-cols-4 gap-1 bg-gray-800 rounded-b-2xl p-2">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.action}
          className={`${
            btn.className ?? 'bg-gray-700 text-white hover:bg-gray-600'
          } rounded-xl p-4 text-xl font-medium transition-colors active:scale-95`}
          aria-label={btn.label}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
