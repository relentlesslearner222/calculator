import { render, screen } from '@testing-library/react';
import { Display } from '../Display';

describe('Display', () => {
  it('renders display value', () => {
    render(<Display expression="3+4" displayValue="7" isError={false} />);
    expect(screen.getByTestId('display-value')).toHaveTextContent('7');
  });

  it('renders error state with red text class', () => {
    render(<Display expression="5/0" displayValue="Error" isError={true} />);
    const el = screen.getByTestId('display-value');
    expect(el).toHaveTextContent('Error');
    expect(el.className).toContain('text-red-400');
  });

  it('renders expression', () => {
    render(<Display expression="12 + 7" displayValue="12 + 7" isError={false} />);
    expect(screen.getByText('12 + 7')).toBeInTheDocument();
  });
});
