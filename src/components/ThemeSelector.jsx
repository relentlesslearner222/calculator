import styled from 'styled-components';

const Fieldset = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Legend = styled.legend`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizeBase};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  padding: 0 4px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizeBase};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'salesforce', label: 'Salesforce' },
];

export default function ThemeSelector({ themeName, setTheme }) {
  return (
    <Fieldset role="radiogroup" aria-label="Select theme">
      <Legend>Theme</Legend>
      {THEMES.map(({ value, label }) => (
        <Label key={value}>
          <input
            type="radio"
            name="theme"
            value={value}
            checked={themeName === value}
            onChange={() => setTheme(value)}
          />
          {label}
        </Label>
      ))}
    </Fieldset>
  );
}
