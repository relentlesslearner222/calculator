type ButtonVariant = 'digit' | 'operator' | 'action' | 'equals';

interface ButtonProps {
  label: string;
  variant: ButtonVariant;
  onClick: () => void;
  wide?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  action: 'background-color: #a5a5a5; color: #1c1c1e;',
  operator: 'background-color: #ff9f0a; color: #fff;',
  digit: 'background-color: #333333; color: #fff;',
  equals: 'background-color: #ff9f0a; color: #fff;',
};

function Button({ label, variant, onClick, wide = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        ...parseStyle(variantStyles[variant]),
        gridColumn: wide ? 'span 2' : undefined,
        borderRadius: '50%',
        width: wide ? undefined : '72px',
        height: '72px',
        fontSize: '28px',
        fontWeight: '400',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: wide ? 'flex-start' : 'center',
        paddingLeft: wide ? '28px' : undefined,
        transition: 'opacity 0.1s',
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '0.7';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '1';
      }}
    >
      {label}
    </button>
  );
}

function parseStyle(styleString: string): React.CSSProperties {
  const result: Record<string, string> = {};
  styleString.split(';').forEach((rule) => {
    const [prop, val] = rule.split(':');
    if (prop && val) {
      const camelProp = prop
        .trim()
        .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
      result[camelProp] = val.trim();
    }
  });
  return result as React.CSSProperties;
}

import type { CSSProperties } from 'react';
// Re-export React type usage
export type { CSSProperties };

export default Button;
