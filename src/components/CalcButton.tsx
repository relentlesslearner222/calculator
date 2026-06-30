import { ButtonVariant } from '../types/calculator';

interface CalcButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  wide?: boolean;
  ariaLabel?: string;
  testId?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  number: 'bg-gray-600 hover:bg-gray-500 active:bg-gray-400 text-white',
  operator: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-400 text-white',
  function: 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-cyan-300 text-sm',
  equals: 'bg-orange-500 hover:bg-orange-400 active:bg-orange-300 text-white font-bold',
  clear: 'bg-red-700 hover:bg-red-600 active:bg-red-500 text-white',
  memory: 'bg-purple-700 hover:bg-purple-600 active:bg-purple-500 text-white text-sm',
};

export function CalcButton({
  label,
  onClick,
  variant = 'number',
  wide = false,
  ariaLabel,
  testId,
}: CalcButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      data-testid={testId ?? `btn-${label}`}
      className={`
        ${variantClasses[variant]}
        ${wide ? 'col-span-2' : ''}
        rounded-xl font-mono font-medium
        transition-colors duration-100
        flex items-center justify-center
        h-12 w-full
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-900
      `}
    >
      {label}
    </button>
  );
}
