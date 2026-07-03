import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClearHistoryConfirm } from '../ClearHistoryConfirm';

describe('ClearHistoryConfirm', () => {
  it('renders confirmation message', () => {
    render(<ClearHistoryConfirm onConfirm={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });

  it('renders Confirm and Cancel buttons', () => {
    render(<ClearHistoryConfirm onConfirm={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByLabelText('Confirm clear history')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancel clear history')).toBeInTheDocument();
  });

  it('calls onConfirm when Confirm clicked', async () => {
    const onConfirm = jest.fn();
    render(<ClearHistoryConfirm onConfirm={onConfirm} onCancel={jest.fn()} />);
    await userEvent.click(screen.getByLabelText('Confirm clear history'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel clicked', async () => {
    const onCancel = jest.fn();
    render(<ClearHistoryConfirm onConfirm={jest.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByLabelText('Cancel clear history'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does NOT call window.confirm', async () => {
    const windowConfirm = jest.spyOn(window, 'confirm');
    render(<ClearHistoryConfirm onConfirm={jest.fn()} onCancel={jest.fn()} />);
    await userEvent.click(screen.getByLabelText('Confirm clear history'));
    expect(windowConfirm).not.toHaveBeenCalled();
    windowConfirm.mockRestore();
  });
});
