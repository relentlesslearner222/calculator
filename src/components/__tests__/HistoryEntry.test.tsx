import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HistoryEntry } from '../HistoryEntry';
import { CalculationEntry } from '@/types';

const entry: CalculationEntry = {
  id: 'test-1',
  expression: '3 + 4',
  result: '7',
  timestamp: new Date('2024-01-01T12:00:00Z'),
};

describe('HistoryEntry', () => {
  it('renders expression and result', () => {
    render(<HistoryEntry entry={entry} isActive={false} onClick={jest.fn()} now={new Date('2024-01-01T12:01:00Z')} />);
    expect(screen.getByText('3 + 4')).toBeInTheDocument();
    expect(screen.getByText('= 7')).toBeInTheDocument();
  });

  it('shows absolute datetime in title attribute', () => {
    render(<HistoryEntry entry={entry} isActive={false} onClick={jest.fn()} now={new Date('2024-01-01T12:01:00Z')} />);
    const btn = screen.getByRole('button');
    expect(btn.title).toBeTruthy();
  });

  it('calls onClick with the entry', async () => {
    const onClick = jest.fn();
    render(<HistoryEntry entry={entry} isActive={false} onClick={onClick} now={new Date('2024-01-01T12:01:00Z')} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith(entry);
  });

  it('applies active highlight when isActive=true', () => {
    render(<HistoryEntry entry={entry} isActive={true} onClick={jest.fn()} now={new Date('2024-01-01T12:01:00Z')} />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-amber-100');
  });

  it('does not apply active highlight when isActive=false', () => {
    render(<HistoryEntry entry={entry} isActive={false} onClick={jest.fn()} now={new Date('2024-01-01T12:01:00Z')} />);
    const btn = screen.getByRole('button');
    expect(btn.className).not.toContain('bg-amber-100');
  });
});
