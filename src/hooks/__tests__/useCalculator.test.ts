import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../useCalculator';

describe('useCalculator', () => {
  it('initial state', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.expression).toBe('');
    expect(result.current.displayValue).toBe('0');
    expect(result.current.isError).toBe(false);
  });

  it('appendToken builds expression', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendToken('3'));
    act(() => result.current.appendToken('+'));
    act(() => result.current.appendToken('4'));
    expect(result.current.expression).toBe('3+4');
    expect(result.current.displayValue).toBe('3+4');
  });

  it('evaluate returns entry and updates display', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendToken('3'));
    act(() => result.current.appendToken('+'));
    act(() => result.current.appendToken('4'));
    let entry: ReturnType<typeof result.current.evaluate> = null;
    act(() => {
      entry = result.current.evaluate();
    });
    expect(entry).not.toBeNull();
    expect(entry!.result).toBe('7');
    expect(result.current.displayValue).toBe('7');
    expect(result.current.isError).toBe(false);
  });

  it('evaluate sets error on invalid expression', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendToken('5'));
    act(() => result.current.appendToken('/'));
    act(() => result.current.appendToken('0'));
    act(() => result.current.evaluate());
    expect(result.current.isError).toBe(true);
    expect(result.current.displayValue).toBe('Error');
  });

  it('clear resets state', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.appendToken('9'));
    act(() => result.current.clear());
    expect(result.current.expression).toBe('');
    expect(result.current.displayValue).toBe('0');
  });

  it('restoreExpression sets expression without side effects', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.restoreExpression('12 + 7'));
    expect(result.current.expression).toBe('12 + 7');
    expect(result.current.displayValue).toBe('12 + 7');
    expect(result.current.isError).toBe(false);
  });

  it('evaluate returns null for empty expression', () => {
    const { result } = renderHook(() => useCalculator());
    let entry: ReturnType<typeof result.current.evaluate> = null;
    act(() => {
      entry = result.current.evaluate();
    });
    expect(entry).toBeNull();
  });
});
