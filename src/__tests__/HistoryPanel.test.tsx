import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryPanel } from '../components/HistoryPanel';
import { HistoryEntry } from '../types/calculator';

describe('HistoryPanel component', () => {
  it('renders empty state message when no entries', () => {
    render(<HistoryPanel entries={[]} onClear={() => {}} />);
    expect(screen.getByTestId('history-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('history-list')).not.toBeInTheDocument();
  });

  it('does not render empty state when entries exist', () => {
    const entries: HistoryEntry[] = [{ expression: '2+3', result: '5' }];
    render(<HistoryPanel entries={entries} onClear={() => {}} />);
    expect(screen.queryByTestId('history-empty')).not.toBeInTheDocument();
  });

  it('renders all provided entries', () => {
    const entries: HistoryEntry[] = [
      { expression: '2+3', result: '5' },
      { expression: '10/2', result: '5' },
      { expression: '7*8', result: '56' },
      { expression: '100-25', result: '75' },
    ];
    render(<HistoryPanel entries={entries} onClear={() => {}} />);
    expect(screen.getByTestId('history-entry-0')).toBeInTheDocument();
    expect(screen.getByTestId('history-entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('history-entry-2')).toBeInTheDocument();
    expect(screen.getByTestId('history-entry-3')).toBeInTheDocument();
  });

  it('renders expression and result text in entry', () => {
    const entries: HistoryEntry[] = [{ expression: '2+3', result: '5' }];
    render(<HistoryPanel entries={entries} onClear={() => {}} />);
    expect(screen.getByTestId('history-entry-0')).toBeInTheDocument();
    expect(screen.getByText('2+3')).toBeInTheDocument();
    expect(screen.getByText('= 5')).toBeInTheDocument();
  });

  it('renders the Clear History button', () => {
    render(<HistoryPanel entries={[]} onClear={() => {}} />);
    expect(screen.getByTestId('btn-clear-history')).toBeInTheDocument();
  });

  it('calls onClear when Clear History button is clicked', () => {
    const onClear = jest.fn();
    render(<HistoryPanel entries={[]} onClear={onClear} />);
    fireEvent.click(screen.getByTestId('btn-clear-history'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders history list when entries exist', () => {
    const entries: HistoryEntry[] = [{ expression: '3*4', result: '12' }];
    render(<HistoryPanel entries={entries} onClear={() => {}} />);
    const list = screen.getByTestId('history-list');
    expect(list).toBeInTheDocument();
    const item = screen.getByTestId('history-entry-0');
    expect(item).toHaveTextContent('3*4');
    expect(item).toHaveTextContent('12');
  });
});
