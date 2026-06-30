import { render, screen, fireEvent } from '@testing-library/react';
import { CalcButton } from '../components/CalcButton';

describe('CalcButton component', () => {
  it('renders label', () => {
    render(<CalcButton label="7" onClick={() => {}} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handler = jest.fn();
    render(<CalcButton label="+" onClick={handler} variant="operator" />);
    fireEvent.click(screen.getByText('+'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('has accessible aria-label', () => {
    render(<CalcButton label="√" onClick={() => {}} ariaLabel="square root" />);
    expect(screen.getByRole('button', { name: 'square root' })).toBeInTheDocument();
  });

  it('applies wide class when wide=true', () => {
    render(<CalcButton label="0" onClick={() => {}} wide />);
    expect(screen.getByRole('button')).toHaveClass('col-span-2');
  });

  it('does not apply col-span-2 when wide=false', () => {
    render(<CalcButton label="1" onClick={() => {}} />);
    expect(screen.getByRole('button')).not.toHaveClass('col-span-2');
  });

  it('uses testId for data-testid', () => {
    render(<CalcButton label="=" onClick={() => {}} testId="btn-equals" />);
    expect(screen.getByTestId('btn-equals')).toBeInTheDocument();
  });
});
