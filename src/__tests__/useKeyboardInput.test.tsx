import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useKeyboardInput } from '../hooks/useKeyboardInput';

function makeCallbacks() {
  return {
    appendDigit: jest.fn(),
    appendOperator: jest.fn(),
    decimal: jest.fn(),
    equals: jest.fn(),
    backspace: jest.fn(),
    clear: jest.fn(),
    percent: jest.fn(),
  };
}

function pressKey(key: string, options: KeyboardEventInit = {}) {
  fireEvent.keyDown(window, { key, ...options });
}

describe('useKeyboardInput', () => {
  it('appends digit when digit key pressed', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('5');
    expect(cbs.appendDigit).toHaveBeenCalledWith('5');
  });

  it('appends all digit keys 0-9', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    for (const d of ['0','1','2','3','4','5','6','7','8','9']) {
      pressKey(d);
    }
    expect(cbs.appendDigit).toHaveBeenCalledTimes(10);
  });

  it('appends + operator', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('+');
    expect(cbs.appendOperator).toHaveBeenCalledWith('+');
  });

  it('appends - operator', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('-');
    expect(cbs.appendOperator).toHaveBeenCalledWith('-');
  });

  it('appends * operator', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('*');
    expect(cbs.appendOperator).toHaveBeenCalledWith('*');
  });

  it('appends / operator and prevents default', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    const event = new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    window.dispatchEvent(event);
    expect(cbs.appendOperator).toHaveBeenCalledWith('/');
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('appends ^ operator', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('^');
    expect(cbs.appendOperator).toHaveBeenCalledWith('^');
  });

  it('calls decimal on . key', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('.');
    expect(cbs.decimal).toHaveBeenCalledTimes(1);
  });

  it('calls equals on Enter key', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('Enter');
    expect(cbs.equals).toHaveBeenCalledTimes(1);
  });

  it('calls equals on = key', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('=');
    expect(cbs.equals).toHaveBeenCalledTimes(1);
  });

  it('calls backspace on Backspace key', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('Backspace');
    expect(cbs.backspace).toHaveBeenCalledTimes(1);
  });

  it('calls clear on Escape key', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('Escape');
    expect(cbs.clear).toHaveBeenCalledTimes(1);
  });

  it('calls percent on % key', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('%');
    expect(cbs.percent).toHaveBeenCalledTimes(1);
  });

  it('does nothing when enabled=false', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs, false));
    pressKey('5');
    pressKey('Enter');
    pressKey('+');
    expect(cbs.appendDigit).not.toHaveBeenCalled();
    expect(cbs.equals).not.toHaveBeenCalled();
    expect(cbs.appendOperator).not.toHaveBeenCalled();
  });

  it('ignores keys with Ctrl modifier', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('5', { ctrlKey: true });
    expect(cbs.appendDigit).not.toHaveBeenCalled();
  });

  it('ignores keys with Meta modifier', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('5', { metaKey: true });
    expect(cbs.appendDigit).not.toHaveBeenCalled();
  });

  it('ignores keys with Alt modifier', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('+', { altKey: true });
    expect(cbs.appendOperator).not.toHaveBeenCalled();
  });

  it('ignores unrecognised keys', () => {
    const cbs = makeCallbacks();
    renderHook(() => useKeyboardInput(cbs));
    pressKey('F1');
    pressKey('Tab');
    pressKey('ArrowUp');
    expect(cbs.appendDigit).not.toHaveBeenCalled();
    expect(cbs.appendOperator).not.toHaveBeenCalled();
    expect(cbs.equals).not.toHaveBeenCalled();
    expect(cbs.clear).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const cbs = makeCallbacks();
    const { unmount } = renderHook(() => useKeyboardInput(cbs));
    unmount();
    pressKey('5');
    expect(cbs.appendDigit).not.toHaveBeenCalled();
  });
});
