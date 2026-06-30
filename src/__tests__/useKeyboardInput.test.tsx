import React from 'react';
import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useKeyboardInput } from '../hooks/useKeyboardInput';

function makeActions() {
  return {
    appendDigit: jest.fn(),
    appendOperator: jest.fn(),
    decimal: jest.fn(),
    equals: jest.fn(),
    clear: jest.fn(),
    backspace: jest.fn(),
    percent: jest.fn(),
  };
}

function fireKey(key: string, extra?: Partial<KeyboardEventInit>) {
  fireEvent.keyDown(window, { key, ...extra });
}

describe('useKeyboardInput hook', () => {
  it('calls appendDigit for digit keys 0-9', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    for (const digit of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      fireKey(digit);
    }
    expect(actions.appendDigit).toHaveBeenCalledTimes(10);
    expect(actions.appendDigit).toHaveBeenCalledWith('3');
    expect(actions.appendDigit).toHaveBeenCalledWith('7');
  });

  it('calls decimal on "." key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('.');
    expect(actions.decimal).toHaveBeenCalledTimes(1);
  });

  it('calls appendOperator("+") on "+" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('+');
    expect(actions.appendOperator).toHaveBeenCalledWith('+');
  });

  it('calls appendOperator("-") on "-" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('-');
    expect(actions.appendOperator).toHaveBeenCalledWith('-');
  });

  it('calls appendOperator("*") on "*" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('*');
    expect(actions.appendOperator).toHaveBeenCalledWith('*');
  });

  it('calls appendOperator("/") on "/" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('/');
    expect(actions.appendOperator).toHaveBeenCalledWith('/');
  });

  it('calls appendOperator("^") on "^" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('^');
    expect(actions.appendOperator).toHaveBeenCalledWith('^');
  });

  it('calls equals on Enter key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('Enter');
    expect(actions.equals).toHaveBeenCalledTimes(1);
  });

  it('calls equals on "=" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('=');
    expect(actions.equals).toHaveBeenCalledTimes(1);
  });

  it('calls backspace on Backspace key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('Backspace');
    expect(actions.backspace).toHaveBeenCalledTimes(1);
  });

  it('calls clear on Escape key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('Escape');
    expect(actions.clear).toHaveBeenCalledTimes(1);
  });

  it('calls percent on "%" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('%');
    expect(actions.percent).toHaveBeenCalledTimes(1);
  });

  it('ignores keys with ctrlKey modifier', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('1', { ctrlKey: true });
    expect(actions.appendDigit).not.toHaveBeenCalled();
  });

  it('ignores keys with metaKey modifier', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('1', { metaKey: true });
    expect(actions.appendDigit).not.toHaveBeenCalled();
  });

  it('ignores keys with altKey modifier', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('1', { altKey: true });
    expect(actions.appendDigit).not.toHaveBeenCalled();
  });

  it('ignores unrecognised keys (e.g. "a")', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('a');
    expect(actions.appendDigit).not.toHaveBeenCalled();
    expect(actions.appendOperator).not.toHaveBeenCalled();
    expect(actions.equals).not.toHaveBeenCalled();
  });

  it('removes keydown listener on unmount', () => {
    const actions = makeActions();
    const { unmount } = renderHook(() => useKeyboardInput(actions));
    unmount();
    fireKey('5');
    expect(actions.appendDigit).not.toHaveBeenCalled();
  });

  it('handles Enter key when display is empty (no crash)', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    // Should not throw even on empty state - hook just calls equals callback
    expect(() => fireKey('Enter')).not.toThrow();
    expect(actions.equals).toHaveBeenCalledTimes(1);
  });
});
