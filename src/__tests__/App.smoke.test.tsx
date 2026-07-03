import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App smoke test', () => {
  it('renders the calculator display', () => {
    render(<App />);
    expect(screen.getByTestId('display-value')).toBeInTheDocument();
  });

  it('renders keypad buttons', () => {
    render(<App />);
    expect(screen.getByLabelText('AC')).toBeInTheDocument();
    expect(screen.getByLabelText('=')).toBeInTheDocument();
  });
});
