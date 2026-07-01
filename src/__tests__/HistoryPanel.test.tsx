import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryPanel } from '../components/HistoryPanel';
import { HistoryEntry } from '../hooks/useCalculator';

const mockHistory: HistoryEntry[] = [
  { id: '1', expression: '3+4', result: '7', timestamp: 1000 },
  { id: '2', expression: '10*2', result: '20', timestamp: 2000 },
];

describe('HistoryPanel', () => {
  test('renders history entries', () => {
    render(<HistoryPanel history={mockHistory} onRestore={jest.fn()} onClose={jest.fn()} />);
    expect(screen.getByText('3+4')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('10*2')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  test('shows empty state when no history', () => {
    render(<HistoryPanel history={[]} onRestore={jest.fn()} onClose={jest.fn()} />);
    expect(screen.getByText(/no history/i)).toBeInTheDocument();
  });

  test('clicking entry calls onRestore with RESTORE_HISTORY', () => {
    const onRestore = jest.fn();
    render(<HistoryPanel history={mockHistory} onRestore={onRestore} onClose={jest.fn()} />);
    fireEvent.click(screen.getByText('3+4'));
    expect(onRestore).toHaveBeenCalledWith({
      type: 'RESTORE_HISTORY',
      expression: '3+4',
      result: '7',
    });
  });

  test('close button calls onClose', () => {
    const onClose = jest.fn();
    render(<HistoryPanel history={mockHistory} onRestore={jest.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close history'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('clear button calls onRestore with CLEAR_HISTORY', () => {
    const onRestore = jest.fn();
    render(<HistoryPanel history={mockHistory} onRestore={onRestore} onClose={jest.fn()} />);
    fireEvent.click(screen.getByText('Clear'));
    expect(onRestore).toHaveBeenCalledWith({ type: 'CLEAR_HISTORY' });
  });
});
