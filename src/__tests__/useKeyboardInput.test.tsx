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
      expect(actions.appendDigit).toHaveBeenCalledWith(digit);
    }
    expect(actions.appendDigit).toHaveBeenCalledTimes(10);
  });

  it('calls decimal for "." key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('.');
    expect(actions.decimal).toHaveBeenCalledTimes(1);
  });

  it('calls appendOperator for "+" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('+');
    expect(actions.appendOperator).toHaveBeenCalledWith('+');
  });

  it('calls appendOperator for "-" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('-');
    expect(actions.appendOperator).toHaveBeenCalledWith('-');
  });

  it('calls appendOperator for "*" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('*');
    expect(actions.appendOperator).toHaveBeenCalledWith('*');
  });

  it('calls appendOperator for "/" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('/');
    expect(actions.appendOperator).toHaveBeenCalledWith('/');
  });

  it('calls appendOperator for "^" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('^');
    expect(actions.appendOperator).toHaveBeenCalledWith('^');
  });

  it('calls equals for "Enter" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('Enter');
    expect(actions.equals).toHaveBeenCalledTimes(1);
  });

  it('calls equals for "=" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('=');
    expect(actions.equals).toHaveBeenCalledTimes(1);
  });

  it('calls backspace for "Backspace" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('Backspace');
    expect(actions.backspace).toHaveBeenCalledTimes(1);
  });

  it('calls clear for "Escape" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('Escape');
    expect(actions.clear).toHaveBeenCalledTimes(1);
  });

  it('calls percent for "%" key', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('%');
    expect(actions.percent).toHaveBeenCalledTimes(1);
  });

  it('ignores keys with Ctrl modifier', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('5', { ctrlKey: true });
    expect(actions.appendDigit).not.toHaveBeenCalled();
  });

  it('ignores keys with Meta modifier', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('Enter', { metaKey: true });
    expect(actions.equals).not.toHaveBeenCalled();
  });

  it('ignores keys with Alt modifier', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('+', { altKey: true });
    expect(actions.appendOperator).not.toHaveBeenCalled();
  });

  it('ignores unrecognised keys', () => {
    const actions = makeActions();
    renderHook(() => useKeyboardInput(actions));
    fireKey('a');
    fireKey('F1');
    fireKey('Tab');
    expect(actions.appendDigit).not.toHaveBeenCalled();
    expect(actions.equals).not.toHaveBeenCalled();
    expect(actions.clear).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const actions = makeActions();
    const { unmount } = renderHook(() => useKeyboardInput(actions));
    unmount();
    fireKey('5');
    expect(actions.appendDigit).not.toHaveBeenCalled();
  });
});
