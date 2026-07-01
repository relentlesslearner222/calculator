import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryPanel } from '../components/HistoryPanel';
import { HistoryEntry } from '../types/calculator';

describe('HistoryPanel', () => {
  it('shows empty state message when no entries', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByTestId('history-empty')).toHaveTextContent('No history yet');
  });

  it('renders entries with expression and result', () => {
    const entries: HistoryEntry[] = [
      { expression: '2+3', result: '5' },
      { expression: '10/2', result: '5' },
    ];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.getByText('2+3')).toBeInTheDocument();
    expect(screen.getByText('10/2')).toBeInTheDocument();
    expect(screen.getAllByText('5')).toHaveLength(2);
    expect(screen.queryByTestId('history-empty')).not.toBeInTheDocument();
  });

  it('renders the correct number of entries', () => {
    const entries: HistoryEntry[] = [
      { expression: '1+1', result: '2' },
      { expression: '3*4', result: '12' },
      { expression: '9-5', result: '4' },
    ];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.getByTestId('history-entry-0')).toBeInTheDocument();
    expect(screen.getByTestId('history-entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('history-entry-2')).toBeInTheDocument();
  });

  it('calls onClear when Clear History button is clicked', () => {
    const onClear = jest.fn();
    const entries: HistoryEntry[] = [{ expression: '1+1', result: '2' }];
    render(<HistoryPanel entries={entries} onClear={onClear} />);
    fireEvent.click(screen.getByTestId('btn-clear-history'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('clear button is present even when entries list is empty', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByTestId('btn-clear-history')).toBeInTheDocument();
  });

  it('renders history panel container', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByTestId('history-panel')).toBeInTheDocument();
  });
});
