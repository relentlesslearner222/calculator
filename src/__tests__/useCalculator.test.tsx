import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../hooks/useCalculator';

describe('useCalculator hook', () => {
  it('initialises with display "0"', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.state.display).toBe('0');
  });

  it('initialises with empty history', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.state.history).toEqual([]);
  });

  it('appends digits correctly', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('4'));
    act(() => result.current.appendDigit('2'));
    expect(result.current.state.display).toBe('42');
  });

  it('does not duplicate leading zero', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('0'));
    expect(result.current.state.display).toBe('0');
  });

  it('evaluates 3+4 = 7', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('3'));
    act(() => result.current.appendOperator('+'));
    act(() => result.current.appendDigit('4'));
    act(() => result.current.equals());
    expect(result.current.state.display).toBe('7');
    expect(result.current.state.isError).toBe(false);
  });

  it('evaluates 10/2 = 5', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('1'));
    act(() => result.current.appendDigit('0'));
    act(() => result.current.appendOperator('/'));
    act(() => result.current.appendDigit('2'));
    act(() => result.current.equals());
    expect(result.current.state.display).toBe('5');
  });

  it('sets isError on division by zero', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('5'));
    act(() => result.current.appendOperator('/'));
    act(() => result.current.appendDigit('0'));
    act(() => result.current.equals());
    expect(result.current.state.isError).toBe(true);
  });

  it('clear resets display to 0', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('9'));
    act(() => result.current.clear());
    expect(result.current.state.display).toBe('0');
    expect(result.current.state.expression).toBe('');
  });

  it('backspace removes last character', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('1'));
    act(() => result.current.appendDigit('2'));
    act(() => result.current.appendDigit('3'));
    act(() => result.current.backspace());
    expect(result.current.state.display).toBe('12');
  });

  it('decimal point appended once', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('3'));
    act(() => result.current.decimal());
    act(() => result.current.decimal()); // should be ignored
    act(() => result.current.appendDigit('1'));
    expect(result.current.state.display).toBe('3.1');
  });

  it('toggles angle mode', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.state.angleMode).toBe('deg');
    act(() => result.current.toggleAngleMode());
    expect(result.current.state.angleMode).toBe('rad');
    act(() => result.current.toggleAngleMode());
    expect(result.current.state.angleMode).toBe('deg');
  });

  it('memory store and recall', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('4'));
    act(() => result.current.appendDigit('2'));
    act(() => result.current.memoryStore());
    expect(result.current.state.memory).toBe(42);
    act(() => result.current.clear());
    act(() => result.current.memoryRecall());
    expect(result.current.state.display).toBe('42');
  });

  it('memory clear resets to 0', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('5'));
    act(() => result.current.memoryStore());
    act(() => result.current.memoryClear());
    expect(result.current.state.memory).toBe(0);
  });

  it('memory add accumulates values', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('5'));
    act(() => result.current.memoryStore());
    act(() => result.current.clear());
    act(() => result.current.appendDigit('3'));
    act(() => result.current.memoryAdd());
    expect(result.current.state.memory).toBe(8);
  });

  it('percent converts display value', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('5'));
    act(() => result.current.appendDigit('0'));
    act(() => result.current.percent());
    expect(result.current.state.display).toBe('0.5');
  });

  it('toggle sign negates positive number', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('7'));
    act(() => result.current.toggleSign());
    expect(result.current.state.display).toBe('-7');
  });

  it('toggle sign un-negates negative number', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('7'));
    act(() => result.current.toggleSign());
    act(() => result.current.toggleSign());
    expect(result.current.state.display).toBe('7');
  });

  it('appends function with open paren', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendFunction('sin'));
    expect(result.current.state.expression).toBe('sin(');
  });

  it('error state clears on next input', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('5'));
    act(() => result.current.appendOperator('/'));
    act(() => result.current.appendDigit('0'));
    act(() => result.current.equals());
    expect(result.current.state.isError).toBe(true);
    // Next digit should clear error
    act(() => result.current.appendDigit('3'));
    expect(result.current.state.isError).toBe(false);
    expect(result.current.state.display).toBe('3');
  });

  // History tests
  it('EQUALS appends entry to history on success', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('3'));
    act(() => result.current.appendOperator('+'));
    act(() => result.current.appendDigit('4'));
    act(() => result.current.equals());
    expect(result.current.state.history).toHaveLength(1);
    expect(result.current.state.history[0].expression).toBe('3+4');
    expect(result.current.state.history[0].result).toBe('7');
  });

  it('EQUALS does not append to history on error', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('5'));
    act(() => result.current.appendOperator('/'));
    act(() => result.current.appendDigit('0'));
    act(() => result.current.equals());
    expect(result.current.state.history).toHaveLength(0);
  });

  it('history accumulates multiple entries', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('2'));
    act(() => result.current.appendOperator('+'));
    act(() => result.current.appendDigit('3'));
    act(() => result.current.equals());
    act(() => result.current.appendDigit('1'));
    act(() => result.current.appendDigit('0'));
    act(() => result.current.appendOperator('/'));
    act(() => result.current.appendDigit('2'));
    act(() => result.current.equals());
    expect(result.current.state.history).toHaveLength(2);
  });

  it('CLEAR preserves history', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('3'));
    act(() => result.current.appendOperator('+'));
    act(() => result.current.appendDigit('4'));
    act(() => result.current.equals());
    expect(result.current.state.history).toHaveLength(1);
    act(() => result.current.clear());
    expect(result.current.state.history).toHaveLength(1);
    expect(result.current.state.display).toBe('0');
  });

  it('clearHistory wipes history', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('3'));
    act(() => result.current.appendOperator('+'));
    act(() => result.current.appendDigit('4'));
    act(() => result.current.equals());
    expect(result.current.state.history).toHaveLength(1);
    act(() => result.current.clearHistory());
    expect(result.current.state.history).toHaveLength(0);
  });

  it('clearHistory does not affect calculator state', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendDigit('9'));
    act(() => result.current.appendOperator('+'));
    act(() => result.current.appendDigit('1'));
    act(() => result.current.equals());
    act(() => result.current.clearHistory());
    expect(result.current.state.display).toBe('10');
    expect(result.current.state.history).toHaveLength(0);
  });
});
