import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Keypad } from '../Keypad';

describe('Keypad', () => {
  it('renders digit buttons', () => {
    render(<Keypad onToken={jest.fn()} onClear={jest.fn()} onEvaluate={jest.fn()} />);
    for (const d of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      expect(screen.getByLabelText(d)).toBeInTheDocument();
    }
  });

  it('calls onToken with correct token when digit pressed', async () => {
    const onToken = jest.fn();
    render(<Keypad onToken={onToken} onClear={jest.fn()} onEvaluate={jest.fn()} />);
    await userEvent.click(screen.getByLabelText('7'));
    expect(onToken).toHaveBeenCalledWith('7');
  });

  it('calls onClear when AC pressed', async () => {
    const onClear = jest.fn();
    render(<Keypad onToken={jest.fn()} onClear={onClear} onEvaluate={jest.fn()} />);
    await userEvent.click(screen.getByLabelText('AC'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('calls onEvaluate when = pressed', async () => {
    const onEvaluate = jest.fn();
    render(<Keypad onToken={jest.fn()} onClear={jest.fn()} onEvaluate={onEvaluate} />);
    await userEvent.click(screen.getByLabelText('='));
    expect(onEvaluate).toHaveBeenCalledTimes(1);
  });

  it('calls onToken with / when ÷ pressed', async () => {
    const onToken = jest.fn();
    render(<Keypad onToken={onToken} onClear={jest.fn()} onEvaluate={jest.fn()} />);
    await userEvent.click(screen.getByLabelText('÷'));
    expect(onToken).toHaveBeenCalledWith('/');
  });
});
