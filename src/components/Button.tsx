interface Props {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'action' | 'equals' | 'scientific';
  wide?: boolean;
}

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  default:    'bg-gray-700 hover:bg-gray-600 text-white',
  operator:   'bg-orange-500 hover:bg-orange-400 text-white',
  action:     'bg-gray-500 hover:bg-gray-400 text-white',
  equals:     'bg-green-600 hover:bg-green-500 text-white',
  scientific: 'bg-gray-600 hover:bg-gray-500 text-blue-200 text-sm',
};

export function Button({ label, onClick, variant = 'default', wide = false }: Props) {
  return (
    <button
      onClick={onClick}
      className={[
        'rounded-xl font-semibold transition-colors duration-100 active:scale-95 select-none',
        'h-14 flex items-center justify-center',
        wide ? 'col-span-2' : '',
        variantClasses[variant],
      ].join(' ')}
      aria-label={label}
    >
      {label}
    </button>
  );
}
