import React from 'react';
import type { ButtonVariant } from '../types/calculator';

interface CalcButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  wide?: boolean;
  disabled?: boolean;
  title?: string;
  'data-testid'?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  digit:
    'bg-gray-700 hover:bg-gray-600 text-white dark:bg-gray-700 dark:hover:bg-gray-600',
  operator:
    'bg-blue-700 hover:bg-blue-600 text-white dark:bg-blue-800 dark:hover:bg-blue-700',
  function:
    'bg-purple-700 hover:bg-purple-600 text-white dark:bg-purple-800 dark:hover:bg-purple-700',
  memory:
    'bg-teal-700 hover:bg-teal-600 text-white dark:bg-teal-800 dark:hover:bg-teal-700',
  equal:
    'bg-red-500 hover:bg-red-400 text-white dark:bg-red-600 dark:hover:bg-red-500',
  clear:
    'bg-orange-500 hover:bg-orange-400 text-white dark:bg-orange-600 dark:hover:bg-orange-500',
  secondary:
    'bg-gray-600 hover:bg-gray-500 text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
};

export const CalcButton: React.FC<CalcButtonProps> = ({
  label,
  onClick,
  variant = 'digit',
  wide = false,
  disabled = false,
  title,
  'data-testid': testId,
}) => {
  return (
    <button
      type="button"
      title={title}
      data-testid={testId}
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex items-center justify-center rounded-lg font-semibold text-sm select-none',
        'transition-all duration-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30',
        'h-12',
        wide ? 'col-span-2' : '',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        variantClasses[variant],
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  );
};
