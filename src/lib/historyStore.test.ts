import { describe, it, expect, beforeEach, vi } from 'vitest';
import { historyStore } from './historyStore';

// Simple localStorage mock
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

describe('historyStore', () => {
  it('starts empty after reset', () => {
    expect(historyStore.getEntries()).toEqual([]);
  });

  it('addEntry adds an entry with id and timestamp', () => {
    historyStore.addEntry({ expression: '2 + 3', result: '5' });
    const entries = historyStore.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].expression).toBe('2 + 3');
    expect(entries[0].result).toBe('5');
    expect(entries[0].id).toBeTruthy();
    expect(entries[0].timestamp).toBeGreaterThan(0);
  });

  it('addEntry prepends (reverse-chronological order)', () => {
    historyStore.addEntry({ expression: '1 + 1', result: '2' });
    historyStore.addEntry({ expression: '3 + 3', result: '6' });
    const entries = historyStore.getEntries();
    expect(entries[0].expression).toBe('3 + 3');
    expect(entries[1].expression).toBe('1 + 1');
  });

  it('persists entries to localStorage on addEntry', () => {
    historyStore.addEntry({ expression: '8 + 3', result: '11' });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'calculator_history',
      expect.stringContaining('8 + 3')
    );
  });

  it('caps entries at 50', () => {
    for (let i = 0; i < 55; i++) {
      historyStore.addEntry({ expression: `${i} + 0`, result: `${i}` });
    }
    expect(historyStore.getEntries()).toHaveLength(50);
  });

  it('clearEntries empties the list', () => {
    historyStore.addEntry({ expression: '5 - 2', result: '3' });
    historyStore.clearEntries();
    expect(historyStore.getEntries()).toEqual([]);
  });

  it('clearEntries removes localStorage key', () => {
    historyStore.addEntry({ expression: '1 + 1', result: '2' });
    historyStore.clearEntries();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('calculator_history');
  });

  it('getEntries returns a copy (immutable)', () => {
    historyStore.addEntry({ expression: '1 + 1', result: '2' });
    const entries1 = historyStore.getEntries();
    const entries2 = historyStore.getEntries();
    expect(entries1).not.toBe(entries2);
    expect(entries1).toEqual(entries2);
  });
});
