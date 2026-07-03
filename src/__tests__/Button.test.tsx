import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="5" value="5" onClick={() => {}} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button label="+" value="+" onClick={onClick} />);
    screen.getByText('+').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies highlight classes when isActive is true', () => {
    render(<Button label="9" value="9" onClick={() => {}} isActive={true} />);
    const btn = screen.getByText('9');
    expect(btn).toHaveClass('ring-2');
    expect(btn).toHaveClass('ring-blue-400');
    expect(btn).toHaveClass('scale-95');
  });

  it('does not apply highlight classes when isActive is false', () => {
    render(<Button label="9" value="9" onClick={() => {}} isActive={false} />);
    const btn = screen.getByText('9');
    expect(btn).not.toHaveClass('ring-2');
    expect(btn).not.toHaveClass('ring-blue-400');
    expect(btn).not.toHaveClass('scale-95');
  });

  it('applies extra className when provided', () => {
    render(<Button label="AC" value="Escape" onClick={() => {}} className="bg-red-500" />);
    const btn = screen.getByText('AC');
    expect(btn).toHaveClass('bg-red-500');
  });
});
