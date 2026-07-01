import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../hooks/useCalculator';

describe('useCalculator', () => {
  test('initial state', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.display).toBe('0');
    expect(result.current.expression).toBe('');
    expect(result.current.history).toHaveLength(0);
  });

  test('APPEND builds expression', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.dispatch({ type: 'APPEND', value: '5' }));
    act(() => result.current.dispatch({ type: 'APPEND', value: '+' }));
    act(() => result.current.dispatch({ type: 'APPEND', value: '3' }));
    expect(result.current.expression).toBe('5+3');
    expect(result.current.display).toBe('5+3');
  });

  test('EVALUATE computes result', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.dispatch({ type: 'APPEND', value: '6' }));
    act(() => result.current.dispatch({ type: 'APPEND', value: '*' }));
    act(() => result.current.dispatch({ type: 'APPEND', value: '7' }));
    act(() => result.current.dispatch({ type: 'EVALUATE' }));
    expect(result.current.display).toBe('42');
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].expression).toBe('6*7');
    expect(result.current.history[0].result).toBe('42');
  });

  test('CLEAR resets state', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.dispatch({ type: 'APPEND', value: '9' }));
    act(() => result.current.dispatch({ type: 'CLEAR' }));
    expect(result.current.expression).toBe('');
    expect(result.current.display).toBe('0');
  });

  test('BACKSPACE removes last char', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.dispatch({ type: 'APPEND', value: '1' }));
    act(() => result.current.dispatch({ type: 'APPEND', value: '2' }));
    act(() => result.current.dispatch({ type: 'BACKSPACE' }));
    expect(result.current.expression).toBe('1');
  });

  test('error does not add history entry', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.dispatch({ type: 'APPEND', value: '1' }));
    act(() => result.current.dispatch({ type: 'APPEND', value: '/' }));
    act(() => result.current.dispatch({ type: 'APPEND', value: '0' }));
    act(() => result.current.dispatch({ type: 'EVALUATE' }));
    expect(result.current.history).toHaveLength(0);
  });

  test('RESTORE_HISTORY sets expression and display', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.dispatch({ type: 'RESTORE_HISTORY', expression: '3+4', result: '7' }));
    expect(result.current.expression).toBe('3+4');
    expect(result.current.display).toBe('7');
  });

  test('CLEAR_HISTORY empties history', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.dispatch({ type: 'APPEND', value: '1' }));
    act(() => result.current.dispatch({ type: 'APPEND', value: '+' }));
    act(() => result.current.dispatch({ type: 'APPEND', value: '1' }));
    act(() => result.current.dispatch({ type: 'EVALUATE' }));
    expect(result.current.history).toHaveLength(1);
    act(() => result.current.dispatch({ type: 'CLEAR_HISTORY' }));
    expect(result.current.history).toHaveLength(0);
  });
});
