import { render, screen } from '@testing-library/react';
import { Display } from '../components/Display';

describe('Display component', () => {
  const defaultProps = {
    expression: '2+3',
    display: '5',
    angleMode: 'deg' as const,
    memory: 0,
    isError: false,
  };

  it('renders the display value', () => {
    render(<Display {...defaultProps} />);
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('5');
  });

  it('renders the expression', () => {
    render(<Display {...defaultProps} />);
    expect(screen.getByLabelText('expression')).toHaveTextContent('2+3');
  });

  it('shows angle mode as DEG', () => {
    render(<Display {...defaultProps} />);
    expect(screen.getByLabelText('angle mode')).toHaveTextContent('deg');
  });

  it('shows angle mode as RAD', () => {
    render(<Display {...defaultProps} angleMode="rad" />);
    expect(screen.getByLabelText('angle mode')).toHaveTextContent('rad');
  });

  it('shows M indicator when memory is non-zero', () => {
    render(<Display {...defaultProps} memory={42} />);
    expect(screen.getByLabelText('memory indicator')).toBeInTheDocument();
  });

  it('does not show M indicator when memory is 0', () => {
    render(<Display {...defaultProps} memory={0} />);
    expect(screen.queryByLabelText('memory indicator')).not.toBeInTheDocument();
  });

  it('applies error styling on isError', () => {
    render(<Display {...defaultProps} isError={true} display="Division by zero" />);
    const displayEl = screen.getByTestId('calculator-display');
    expect(displayEl).toHaveClass('text-red-400');
  });
});
