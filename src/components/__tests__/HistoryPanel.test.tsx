import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HistoryPanel } from '../HistoryPanel';
import { CalculationEntry } from '@/types';

const noopHandlers = {
  onUndo: jest.fn(),
  onRedo: jest.fn(),
  onClearAll: jest.fn(),
  onEntryClick: jest.fn(),
};

const entry: CalculationEntry = {
  id: 'e1',
  expression: '2 + 2',
  result: '4',
  timestamp: new Date(),
};

describe('HistoryPanel', () => {
  it('renders empty state message', () => {
    render(
      <HistoryPanel
        entries={[]}
        canUndo={false}
        canRedo={false}
        activeEntryId={null}
        {...noopHandlers}
      />
    );
    expect(screen.getByText(/no calculations yet/i)).toBeInTheDocument();
  });

  it('renders entries', () => {
    render(
      <HistoryPanel
        entries={[entry]}
        canUndo={true}
        canRedo={false}
        activeEntryId={null}
        {...noopHandlers}
      />
    );
    expect(screen.getByText('2 + 2')).toBeInTheDocument();
  });

  it('mobile toggle shows and hides panel', async () => {
    render(
      <HistoryPanel
        entries={[entry]}
        canUndo={false}
        canRedo={false}
        activeEntryId={null}
        {...noopHandlers}
      />
    );
    const toggle = screen.getByLabelText('Toggle history');
    // Initially mobile drawer is closed (just has desktop aside)
    expect(screen.queryByRole('presentation')).toBeNull();
    await userEvent.click(toggle);
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.queryByRole('presentation')).toBeNull();
  });

  it('shows clear button when entries exist', () => {
    render(
      <HistoryPanel
        entries={[entry]}
        canUndo={false}
        canRedo={false}
        activeEntryId={null}
        {...noopHandlers}
      />
    );
    expect(screen.getByText(/clear history/i)).toBeInTheDocument();
  });

  it('undo button disabled when canUndo=false', () => {
    render(
      <HistoryPanel
        entries={[]}
        canUndo={false}
        canRedo={false}
        activeEntryId={null}
        {...noopHandlers}
      />
    );
    expect(screen.getAllByLabelText('Undo')[0]).toBeDisabled();
  });
});
