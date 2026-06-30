import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryPanel } from '../components/HistoryPanel';
import { HistoryEntry } from '../types/calculator';

describe('HistoryPanel component', () => {
  it('renders empty state message when no entries', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByText('No calculations yet')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('does not render empty state when entries exist', () => {
    const entries: HistoryEntry[] = [{ expression: '3+4', result: '7' }];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.queryByText('No calculations yet')).not.toBeInTheDocument();
  });

  it('renders all provided history entries', () => {
    const entries: HistoryEntry[] = [
      { expression: '3+4', result: '7' },
      { expression: '10/2', result: '5' },
      { expression: '6*7', result: '42' },
    ];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.getByText('3+4')).toBeInTheDocument();
    expect(screen.getByText('= 7')).toBeInTheDocument();
    expect(screen.getByText('10/2')).toBeInTheDocument();
    expect(screen.getByText('= 5')).toBeInTheDocument();
  });

  it('renders Clear History button', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Clear History' })).toBeInTheDocument();
  });

  it('calls onClear when Clear History button is clicked', () => {
    const onClear = jest.fn();
    render(<HistoryPanel entries={[]} onClear={onClear} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear History' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders the history list with correct aria-label', () => {
    const entries: HistoryEntry[] = [{ expression: '1+1', result: '2' }];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.getByRole('list', { name: 'calculation history' })).toBeInTheDocument();
  });

  it('renders correct count of list items', () => {
    const entries: HistoryEntry[] = [
      { expression: '1+1', result: '2' },
      { expression: '2+2', result: '4' },
    ];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  it('each entry shows expression and result', () => {
    const entries: HistoryEntry[] = [{ expression: '5*5', result: '25' }];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('5*5');
    expect(item).toHaveTextContent('= 25');
  });
});
