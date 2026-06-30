import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryPanel } from '../components/HistoryPanel';
import { HistoryEntry } from '../types/calculator';

describe('HistoryPanel component', () => {
  it('renders empty state message when no entries', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByTestId('history-empty')).toBeInTheDocument();
    expect(screen.getByText('No calculations yet')).toBeInTheDocument();
  });

  it('does not render empty state when entries exist', () => {
    const entries: HistoryEntry[] = [{ expression: '3+4', result: '7' }];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.queryByTestId('history-empty')).not.toBeInTheDocument();
  });

  it('renders each entry with expression and result', () => {
    const entries: HistoryEntry[] = [
      { expression: '3+4', result: '7' },
      { expression: '10/2', result: '5' },
    ];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    expect(screen.getByText('3+4')).toBeInTheDocument();
    expect(screen.getByText('→ 7')).toBeInTheDocument();
    expect(screen.getByText('10/2')).toBeInTheDocument();
    expect(screen.getByText('→ 5')).toBeInTheDocument();
  });

  it('renders correct number of history entries', () => {
    const entries: HistoryEntry[] = [
      { expression: '1+1', result: '2' },
      { expression: '2+2', result: '4' },
      { expression: '3+3', result: '6' },
    ];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    const list = screen.getByTestId('history-list');
    expect(list.children).toHaveLength(3);
  });

  it('calls onClear when Clear History button is clicked', () => {
    const onClear = jest.fn();
    render(<HistoryPanel entries={[]} onClear={onClear} />);
    fireEvent.click(screen.getByTestId('btn-clear-history'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders the history panel with correct aria-label', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByRole('region', { hidden: true })).toBeDefined();
    expect(screen.getByTestId('history-panel')).toBeInTheDocument();
  });

  it('renders Clear History button', () => {
    render(<HistoryPanel entries={[]} onClear={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Clear History' })).toBeInTheDocument();
  });

  it('entries are rendered in order', () => {
    const entries: HistoryEntry[] = [
      { expression: 'first', result: '1' },
      { expression: 'second', result: '2' },
    ];
    render(<HistoryPanel entries={entries} onClear={jest.fn()} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('first');
    expect(items[1]).toHaveTextContent('second');
  });
});
