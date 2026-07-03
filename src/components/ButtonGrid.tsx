import { CalculatorAction, ButtonConfig } from '../types';
import { Button } from './Button';

const BUTTONS: ButtonConfig[] = [
  { label: 'AC', value: 'Escape', action: { type: 'CLEAR' }, className: 'bg-red-500 hover:bg-red-400 col-span-2' },
  { label: '⌫', value: 'Backspace', action: { type: 'BACKSPACE' }, className: 'bg-yellow-600 hover:bg-yellow-500' },
  { label: '÷', value: '/', action: { type: 'OPERATOR', payload: '/' }, className: 'bg-orange-500 hover:bg-orange-400' },
  { label: '7', value: '7', action: { type: 'DIGIT', payload: '7' } },
  { label: '8', value: '8', action: { type: 'DIGIT', payload: '8' } },
  { label: '9', value: '9', action: { type: 'DIGIT', payload: '9' } },
  { label: '×', value: '*', action: { type: 'OPERATOR', payload: '*' }, className: 'bg-orange-500 hover:bg-orange-400' },
  { label: '4', value: '4', action: { type: 'DIGIT', payload: '4' } },
  { label: '5', value: '5', action: { type: 'DIGIT', payload: '5' } },
  { label: '6', value: '6', action: { type: 'DIGIT', payload: '6' } },
  { label: '−', value: '-', action: { type: 'OPERATOR', payload: '-' }, className: 'bg-orange-500 hover:bg-orange-400' },
  { label: '1', value: '1', action: { type: 'DIGIT', payload: '1' } },
  { label: '2', value: '2', action: { type: 'DIGIT', payload: '2' } },
  { label: '3', value: '3', action: { type: 'DIGIT', payload: '3' } },
  { label: '+', value: '+', action: { type: 'OPERATOR', payload: '+' }, className: 'bg-orange-500 hover:bg-orange-400' },
  { label: '0', value: '0', action: { type: 'DIGIT', payload: '0' }, className: 'col-span-2' },
  { label: '.', value: '.', action: { type: 'DIGIT', payload: '.' } },
  { label: '=', value: 'Enter', action: { type: 'EQUALS' }, className: 'bg-blue-500 hover:bg-blue-400' },
];

interface ButtonGridProps {
  onAction: (action: CalculatorAction) => void;
  activeKey: string | null;
}

export function ButtonGrid({ onAction, activeKey }: ButtonGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {BUTTONS.map((btn) => (
        <Button
          key={btn.label}
          label={btn.label}
          value={btn.value}
          onClick={() => onAction(btn.action)}
          isActive={activeKey === btn.value}
          className={btn.className}
        />
      ))}
    </div>
  );
}
