import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button', () => {
  test('renders label', () => {
    render(<Button label="7" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
  });

  test('calls onClick', () => {
    const onClick = jest.fn();
    render(<Button label="+" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('applies equals variant class', () => {
    render(<Button label="=" onClick={() => {}} variant="equals" />);
    const btn = screen.getByRole('button', { name: '=' });
    expect(btn.className).toMatch(/green/);
  });
});
