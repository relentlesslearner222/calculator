import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../src/themes/index';
import ThemeSelector from '../src/components/ThemeSelector';

function renderWithTheme(ui) {
  return render(
    <ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>
  );
}

describe('ThemeSelector', () => {
  test('renders three radio buttons', () => {
    renderWithTheme(<ThemeSelector themeName="light" setTheme={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  test('renders Light, Dark, Salesforce options', () => {
    renderWithTheme(<ThemeSelector themeName="light" setTheme={() => {}} />);
    expect(screen.getByLabelText('Light')).toBeInTheDocument();
    expect(screen.getByLabelText('Dark')).toBeInTheDocument();
    expect(screen.getByLabelText('Salesforce')).toBeInTheDocument();
  });

  test('has correct radio checked for current theme', () => {
    renderWithTheme(<ThemeSelector themeName="dark" setTheme={() => {}} />);
    expect(screen.getByLabelText('Dark')).toBeChecked();
    expect(screen.getByLabelText('Light')).not.toBeChecked();
    expect(screen.getByLabelText('Salesforce')).not.toBeChecked();
  });

  test('calls setTheme when a radio is changed', () => {
    const setTheme = jest.fn();
    renderWithTheme(<ThemeSelector themeName="light" setTheme={setTheme} />);
    fireEvent.click(screen.getByLabelText('Dark'));
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  test('calls setTheme with salesforce when Salesforce radio clicked', () => {
    const setTheme = jest.fn();
    renderWithTheme(<ThemeSelector themeName="light" setTheme={setTheme} />);
    fireEvent.click(screen.getByLabelText('Salesforce'));
    expect(setTheme).toHaveBeenCalledWith('salesforce');
  });

  test('fieldset has correct role and aria-label', () => {
    renderWithTheme(<ThemeSelector themeName="light" setTheme={() => {}} />);
    const group = screen.getByRole('radiogroup', { name: 'Select theme' });
    expect(group).toBeInTheDocument();
  });
});
