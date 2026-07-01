import { render, screen } from '@testing-library/react';
import { Display } from '../components/Display';

describe('Display', () => {
  test('shows display value', () => {
    render(<Display expression="2+3" display="5" />);
    expect(screen.getByTestId('display')).toHaveTextContent('5');
  });

  test('shows expression', () => {
    render(<Display expression="1+2" display="3" />);
    expect(screen.getByLabelText('expression')).toHaveTextContent('1+2');
  });

  test('shows 0 as default display', () => {
    render(<Display expression="" display="0" />);
    expect(screen.getByTestId('display')).toHaveTextContent('0');
  });
});
