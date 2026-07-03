import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, KeyboardShortcutHandlers } from '../useKeyboardShortcuts';

function makeHandlers(overrides: Partial<KeyboardShortcutHandlers> = {}): KeyboardShortcutHandlers {
  return {
    onUndo: jest.fn(),
    onRedo: jest.fn(),
    onEvaluate: jest.fn(),
    onClear: jest.fn(),
    onAppendToken: jest.fn(),
    ...overrides,
  };
}

function fireKey(key: string, opts: Partial<KeyboardEventInit> = {}) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...opts }));
}

describe('useKeyboardShortcuts', () => {
  it('Ctrl+Z calls onUndo', () => {
    const handlers = makeHandlers();
    renderHook(() => useKeyboardShortcuts(handlers));
    fireKey('z', { ctrlKey: true });
    expect(handlers.onUndo).toHaveBeenCalledTimes(1);
  });

  it('Ctrl+Y calls onRedo', () => {
    const handlers = makeHandlers();
    renderHook(() => useKeyboardShortcuts(handlers));
    fireKey('y', { ctrlKey: true });
    expect(handlers.onRedo).toHaveBeenCalledTimes(1);
  });

  it('Ctrl+Shift+Z calls onRedo', () => {
    const handlers = makeHandlers();
    renderHook(() => useKeyboardShortcuts(handlers));
    fireKey('z', { ctrlKey: true, shiftKey: true });
    expect(handlers.onRedo).toHaveBeenCalledTimes(1);
  });

  it('digit key calls onAppendToken', () => {
    const handlers = makeHandlers();
    renderHook(() => useKeyboardShortcuts(handlers));
    fireKey('5');
    expect(handlers.onAppendToken).toHaveBeenCalledWith('5');
  });

  it('operator key calls onAppendToken', () => {
    const handlers = makeHandlers();
    renderHook(() => useKeyboardShortcuts(handlers));
    fireKey('+');
    expect(handlers.onAppendToken).toHaveBeenCalledWith('+');
  });

  it('Enter calls onEvaluate', () => {
    const handlers = makeHandlers();
    renderHook(() => useKeyboardShortcuts(handlers));
    fireKey('Enter');
    expect(handlers.onEvaluate).toHaveBeenCalledTimes(1);
  });

  it('Escape calls onClear', () => {
    const handlers = makeHandlers();
    renderHook(() => useKeyboardShortcuts(handlers));
    fireKey('Escape');
    expect(handlers.onClear).toHaveBeenCalledTimes(1);
  });

  it('does not fire when focus is in INPUT', () => {
    const handlers = makeHandlers();
    renderHook(() => useKeyboardShortcuts(handlers));
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '5', bubbles: true }));
    // Note: event fired on input, not window — handler won't see it via window listener
    // Verify window-level handler does not mistakenly fire when target is input
    document.body.removeChild(input);
    expect(handlers.onAppendToken).not.toHaveBeenCalled();
  });
});
