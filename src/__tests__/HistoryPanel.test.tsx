import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryPanel } from '../components/HistoryPanel';
import { HistoryEntry } from '../types/calculator';

describe('HistoryPanel component', () => {
  it('renders empty state message when entries is empty', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByTestId('history-empty')).toBeInTheDocument();
    expect(screen.getByText('No calculations yet')).toBeInTheDocument();
  });

  it('does not render empty state when entries exist', () => {
    const entries: HistoryEntry[] = [{ expression: '2+3', result: '5' }];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.queryByTestId('history-empty')).not.toBeInTheDocument();
  });

  it('renders all entries', () => {
    const entries: HistoryEntry[] = [
      { expression: '2+3', result: '5' },
      { expression: '10*2', result: '20' },
      { expression: '9-4', result: '5' },
      { expression: '8/2', result: '4' },
    ];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.getByTestId('history-entry-0')).toBeInTheDocument();
    expect(screen.getByTestId('history-entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('history-entry-2')).toBeInTheDocument();
    expect(screen.getByTestId('history-entry-3')).toBeInTheDocument();
  });

  it('renders entry expression and result', () => {
    const entries: HistoryEntry[] = [{ expression: '3+4', result: '7' }];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.getByText('3+4')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders clear history button', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByTestId('btn-clear-history')).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = jest.fn();
    render(<HistoryPanel entries={[]} onClear={onClear} />);
    fireEvent.click(screen.getByTestId('btn-clear-history'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders entry content via data-testid', () => {
    const entries: HistoryEntry[] = [{ expression: '6*7', result: '42' }];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    const entry = screen.getByTestId('history-entry-0');
    expect(entry).toHaveTextContent('6*7');
    expect(entry).toHaveTextContent('42');
  });

  it('renders history list when entries present', () => {
    const entries: HistoryEntry[] = [{ expression: '1+1', result: '2' }];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.getByTestId('history-list')).toBeInTheDocument();
  });
});
