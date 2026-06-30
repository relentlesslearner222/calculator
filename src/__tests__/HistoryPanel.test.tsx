import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryPanel } from '../components/HistoryPanel';
import { HistoryEntry } from '../types/calculator';

describe('HistoryPanel component', () => {
  it('renders empty state message when no entries', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByText('No calculations yet')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders the History heading and Clear History button', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear History' })).toBeInTheDocument();
  });

  it('renders a list of entries', () => {
    const entries: HistoryEntry[] = [
      { expression: '3+4', result: '7' },
      { expression: '10/2', result: '5' },
    ];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('3+4')).toBeInTheDocument();
    expect(screen.getByText('10/2')).toBeInTheDocument();
  });

  it('renders result with arrow for each entry', () => {
    const entries: HistoryEntry[] = [{ expression: '2*3', result: '6' }];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    // The rendered text includes arrow character
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toContain('2*3');
    expect(items[0].textContent).toContain('6');
  });

  it('calls onClear when Clear History button is clicked', () => {
    const onClear = jest.fn();
    render(<HistoryPanel entries={[]} onClear={onClear} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear History' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not show empty state when entries exist', () => {
    const entries: HistoryEntry[] = [{ expression: '1+1', result: '2' }];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.queryByText('No calculations yet')).not.toBeInTheDocument();
  });

  it('renders multiple entries as list items', () => {
    const entries: HistoryEntry[] = [
      { expression: '1+1', result: '2' },
      { expression: '5*5', result: '25' },
      { expression: '9-3', result: '6' },
    ];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain('2');
    expect(items[1].textContent).toContain('25');
    expect(items[2].textContent).toContain('6');
  });
});
