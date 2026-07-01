import { Button } from './Button';
import { CalcAction } from '../hooks/useCalculator';

type Dispatch = (action: CalcAction) => void;

interface Props {
  onAction: Dispatch;
}

type ButtonDef = {
  label: string;
  action: CalcAction;
  variant?: 'default' | 'operator' | 'action' | 'equals' | 'scientific';
  wide?: boolean;
};

const SCIENTIFIC_BUTTONS: ButtonDef[] = [
  { label: 'sin',  action: { type: 'APPEND', value: 'sin(' },  variant: 'scientific' },
  { label: 'cos',  action: { type: 'APPEND', value: 'cos(' },  variant: 'scientific' },
  { label: 'tan',  action: { type: 'APPEND', value: 'tan(' },  variant: 'scientific' },
  { label: 'log',  action: { type: 'APPEND', value: 'log(' },  variant: 'scientific' },
  { label: 'ln',   action: { type: 'APPEND', value: 'ln(' },   variant: 'scientific' },
  { label: '√',    action: { type: 'APPEND', value: 'sqrt(' }, variant: 'scientific' },
  { label: 'x²',   action: { type: 'APPEND', value: 'sq(' },   variant: 'scientific' },
  { label: 'xʸ',   action: { type: 'APPEND', value: 'pow(' },  variant: 'scientific' },
  { label: '1/x',  action: { type: 'APPEND', value: 'inv(' },  variant: 'scientific' },
  { label: 'n!',   action: { type: 'APPEND', value: 'fact(' }, variant: 'scientific' },
];

const STANDARD_BUTTONS: ButtonDef[] = [
  { label: 'C',   action: { type: 'CLEAR' },               variant: 'action' },
  { label: '(',   action: { type: 'APPEND', value: '(' },  variant: 'action' },
  { label: ')',   action: { type: 'APPEND', value: ')' },  variant: 'action' },
  { label: '÷',   action: { type: 'APPEND', value: '/' },  variant: 'operator' },

  { label: '7',   action: { type: 'APPEND', value: '7' } },
  { label: '8',   action: { type: 'APPEND', value: '8' } },
  { label: '9',   action: { type: 'APPEND', value: '9' } },
  { label: '×',   action: { type: 'APPEND', value: '*' },  variant: 'operator' },

  { label: '4',   action: { type: 'APPEND', value: '4' } },
  { label: '5',   action: { type: 'APPEND', value: '5' } },
  { label: '6',   action: { type: 'APPEND', value: '6' } },
  { label: '−',   action: { type: 'APPEND', value: '-' },  variant: 'operator' },

  { label: '1',   action: { type: 'APPEND', value: '1' } },
  { label: '2',   action: { type: 'APPEND', value: '2' } },
  { label: '3',   action: { type: 'APPEND', value: '3' } },
  { label: '+',   action: { type: 'APPEND', value: '+' },  variant: 'operator' },

  { label: '⌫',   action: { type: 'BACKSPACE' },           variant: 'action' },
  { label: '0',   action: { type: 'APPEND', value: '0' } },
  { label: '.',   action: { type: 'APPEND', value: '.' } },
  { label: '=',   action: { type: 'EVALUATE' },             variant: 'equals' },
];

export function ButtonGrid({ onAction }: Props) {
  return (
    <div>
      {/* Scientific row */}
      <div className="grid grid-cols-5 gap-2 mb-2">
        {SCIENTIFIC_BUTTONS.map((btn) => (
          <Button
            key={btn.label}
            label={btn.label}
            onClick={() => onAction(btn.action)}
            variant={btn.variant}
          />
        ))}
      </div>
      {/* Standard grid */}
      <div className="grid grid-cols-4 gap-2">
        {STANDARD_BUTTONS.map((btn) => (
          <Button
            key={btn.label}
            label={btn.label}
            onClick={() => onAction(btn.action)}
            variant={btn.variant}
            wide={btn.wide}
          />
        ))}
      </div>
    </div>
  );
}
