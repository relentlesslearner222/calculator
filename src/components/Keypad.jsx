import styled from 'styled-components';

const KeypadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Button = styled.button`
  background-color: ${({ theme, variant }) =>
    variant === 'operator' ? theme.colors.primary :
    variant === 'equals' ? theme.colors.primary :
    theme.colors.surface};
  color: ${({ theme, variant }) =>
    variant === 'operator' || variant === 'equals' ? theme.colors.primaryText :
    theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizeBase};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }

  &:active {
    opacity: 0.7;
  }
`;

const KEYS = [
  { label: '7', type: 'digit' },
  { label: '8', type: 'digit' },
  { label: '9', type: 'digit' },
  { label: '÷', type: 'operator', value: '/' },
  { label: '4', type: 'digit' },
  { label: '5', type: 'digit' },
  { label: '6', type: 'digit' },
  { label: '×', type: 'operator', value: '*' },
  { label: '1', type: 'digit' },
  { label: '2', type: 'digit' },
  { label: '3', type: 'digit' },
  { label: '−', type: 'operator', value: '-' },
  { label: 'C', type: 'clear' },
  { label: '0', type: 'digit' },
  { label: '=', type: 'equals' },
  { label: '+', type: 'operator', value: '+' },
];

export default function Keypad({ onDigit, onOperator, onEquals, onClear }) {
  return (
    <KeypadGrid>
      {KEYS.map((key) => {
        const handleClick = () => {
          if (key.type === 'digit') onDigit(key.label);
          else if (key.type === 'operator') onOperator(key.value || key.label);
          else if (key.type === 'equals') onEquals();
          else if (key.type === 'clear') onClear();
        };
        return (
          <Button
            key={key.label}
            variant={key.type === 'operator' || key.type === 'equals' ? key.type : 'default'}
            onClick={handleClick}
            aria-label={key.label}
          >
            {key.label}
          </Button>
        );
      })}
    </KeypadGrid>
  );
}
