import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from './useHistory';
import { historyStore } from '../lib/historyStore';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
  historyStore._reset();
});

describe('useHistory', () => {
  it('starts with empty entries', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([]);
  });

  it('addEntry adds and returns updated list', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addEntry({ expression: '2 + 3', result: '5' });
    });
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].expression).toBe('2 + 3');
  });

  it('clearEntries empties the list', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addEntry({ expression: '2 + 3', result: '5' });
    });
    act(() => {
      result.current.clearEntries();
    });
    expect(result.current.entries).toEqual([]);
  });

  it('searchQuery filters by expression', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addEntry({ expression: '2 + 3', result: '5' });
      result.current.addEntry({ expression: '10 - 4', result: '6' });
    });
    act(() => {
      result.current.setSearchQuery('10');
    });
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].expression).toBe('10 - 4');
  });

  it('searchQuery filters by result', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addEntry({ expression: '2 + 3', result: '5' });
      result.current.addEntry({ expression: '10 - 4', result: '6' });
    });
    act(() => {
      result.current.setSearchQuery('6');
    });
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].result).toBe('6');
  });

  it('empty searchQuery returns all entries', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addEntry({ expression: '2 + 3', result: '5' });
      result.current.addEntry({ expression: '10 - 4', result: '6' });
    });
    act(() => {
      result.current.setSearchQuery('');
    });
    expect(result.current.entries).toHaveLength(2);
  });
});
