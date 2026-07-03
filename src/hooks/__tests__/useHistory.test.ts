import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../useHistory';
import { CalculationEntry } from '@/types';

function makeEntry(id: string, expression = 'expr', result = '42'): CalculationEntry {
  return { id, expression, result, timestamp: new Date() };
}

beforeEach(() => {
  localStorage.clear();
});

describe('useHistory', () => {
  it('initial state is empty', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toHaveLength(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('push adds entry to the front', () => {
    const { result } = renderHook(() => useHistory());
    const e1 = makeEntry('1');
    const e2 = makeEntry('2');
    act(() => result.current.push(e1));
    act(() => result.current.push(e2));
    expect(result.current.entries[0].id).toBe('2');
    expect(result.current.entries[1].id).toBe('1');
    expect(result.current.canUndo).toBe(true);
  });

  it('caps at 20 entries', () => {
    const { result } = renderHook(() => useHistory());
    for (let i = 0; i < 25; i++) {
      act(() => result.current.push(makeEntry(String(i))));
    }
    expect(result.current.entries).toHaveLength(20);
  });

  it('undo moves head of entries to undoStack', () => {
    const { result } = renderHook(() => useHistory());
    const e1 = makeEntry('1');
    const e2 = makeEntry('2');
    act(() => result.current.push(e1));
    act(() => result.current.push(e2));
    act(() => result.current.undo());
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].id).toBe('1');
    expect(result.current.canRedo).toBe(true);
  });

  it('redo restores undone entry', () => {
    const { result } = renderHook(() => useHistory());
    const e = makeEntry('1');
    act(() => result.current.push(e));
    act(() => result.current.undo());
    act(() => result.current.redo());
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].id).toBe('1');
    expect(result.current.canRedo).toBe(false);
  });

  it('clearAll empties everything', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.push(makeEntry('1')));
    act(() => result.current.push(makeEntry('2')));
    act(() => result.current.clearAll());
    expect(result.current.entries).toHaveLength(0);
    expect(result.current.canUndo).toBe(false);
  });

  it('persists to and rehydrates from localStorage', () => {
    const { result } = renderHook(() => useHistory());
    const e = makeEntry('abc', '1+1', '2');
    act(() => result.current.push(e));

    // New hook instance should read from localStorage
    const { result: result2 } = renderHook(() => useHistory());
    expect(result2.current.entries[0].id).toBe('abc');
    expect(result2.current.entries[0].timestamp).toBeInstanceOf(Date);
  });

  it('push clears redoStack', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.push(makeEntry('1')));
    act(() => result.current.undo());
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.push(makeEntry('2')));
    expect(result.current.canRedo).toBe(false);
  });
});
