import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdditionCalculator from '../components/AdditionCalculator';

describe('AdditionCalculator', () => {
  test('Test 1: adds 3 and 4 to display Result: 7', async () => {
    const user = userEvent.setup();
    render(<AdditionCalculator />);

    const num1Input = screen.getByLabelText('Number 1');
    const num2Input = screen.getByLabelText('Number 2');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.clear(num1Input);
    await user.type(num1Input, '3');
    await user.clear(num2Input);
    await user.type(num2Input, '4');
    await user.click(addButton);

    expect(screen.getByText('Result: 7')).toBeInTheDocument();
  });

  test('Test 2: updates result after changing Number 1 to 10 (result becomes 14)', async () => {
    const user = userEvent.setup();
    render(<AdditionCalculator />);

    const num1Input = screen.getByLabelText('Number 1');
    const num2Input = screen.getByLabelText('Number 2');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.clear(num1Input);
    await user.type(num1Input, '3');
    await user.clear(num2Input);
    await user.type(num2Input, '4');
    await user.click(addButton);
    expect(screen.getByText('Result: 7')).toBeInTheDocument();

    await user.clear(num1Input);
    await user.type(num1Input, '10');
    await user.click(addButton);
    expect(screen.getByText('Result: 14')).toBeInTheDocument();
  });

  test('Test 3: adds 0 and 0 to display Result: 0', async () => {
    const user = userEvent.setup();
    render(<AdditionCalculator />);

    const num1Input = screen.getByLabelText('Number 1');
    const num2Input = screen.getByLabelText('Number 2');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await user.clear(num1Input);
    await user.type(num2Input, '0');
    await user.clear(num2Input);
    await user.type(num2Input, '0');
    await user.click(addButton);

    expect(screen.getByText('Result: 0')).toBeInTheDocument();
  });
});
