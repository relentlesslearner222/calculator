interface ButtonProps {
  label: string;
  value: string;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

export function Button({ label, value: _value, onClick, isActive = false, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center justify-center rounded-xl text-xl font-medium h-16 w-full cursor-pointer select-none',
        'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500',
        'transition transform',
        isActive ? 'ring-2 ring-blue-400 scale-95' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  );
}
