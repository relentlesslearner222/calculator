import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../hooks/useCalculator';

describe('useCalculator', () => {
  it('starts with empty expression and result 0', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.state.expression).toBe('');
    expect(result.current.state.result).toBe('0');
  });

  it('appends digits to expression', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.actions.append('4'));
    act(() => result.current.actions.append('2'));
    expect(result.current.state.expression).toBe('42');
  });

  it('evaluates basic arithmetic', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.actions.append('6'));
    act(() => result.current.actions.operator('+'));
    act(() => result.current.actions.append('4'));
    act(() => result.current.actions.evaluate());
    expect(result.current.state.result).toBe('10');
    expect(result.current.state.isResultDisplayed).toBe(true);
  });

  it('clears state on AC', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.actions.append('5'));
    act(() => result.current.actions.clear());
    expect(result.current.state.expression).toBe('');
    expect(result.current.state.result).toBe('0');
  });

  it('backspace removes last character', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.actions.append('1'));
    act(() => result.current.actions.append('2'));
    act(() => result.current.actions.append('3'));
    act(() => result.current.actions.backspace());
    expect(result.current.state.expression).toBe('12');
  });

  it('sets error on invalid expression', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.actions.append('1'));
    act(() => result.current.actions.operator('/'));
    act(() => result.current.actions.append('0'));
    act(() => result.current.actions.evaluate());
    expect(result.current.state.error).not.toBeNull();
    expect(result.current.state.result).toBe('Error');
  });

  it('adds calculation to history', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.actions.append('3'));
    act(() => result.current.actions.operator('*'));
    act(() => result.current.actions.append('3'));
    act(() => result.current.actions.evaluate());
    expect(result.current.state.history).toHaveLength(1);
    expect(result.current.state.history[0].result).toBe('9');
  });

  it('stores and recalls memory', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.actions.append('7'));
    act(() => result.current.actions.memStore());
    expect(result.current.state.memory).toBe(7);
    act(() => result.current.actions.clear());
    act(() => result.current.actions.memRecall());
    expect(result.current.state.expression).toContain('7');
  });

  it('toggles angle mode', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.state.angleMode).toBe('deg');
    act(() => result.current.actions.toggleAngle());
    expect(result.current.state.angleMode).toBe('rad');
    act(() => result.current.actions.toggleAngle());
    expect(result.current.state.angleMode).toBe('deg');
  });

  it('restores expression from history entry', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.actions.append('2'));
    act(() => result.current.actions.operator('+'));
    act(() => result.current.actions.append('2'));
    act(() => result.current.actions.evaluate());
    const entry = result.current.state.history[0];
    act(() => result.current.actions.clear());
    act(() => result.current.actions.restoreHistory(entry));
    expect(result.current.state.expression).toBe(entry.expression);
  });

  it('clears history', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.actions.append('1'));
    act(() => result.current.actions.evaluate());
    act(() => result.current.actions.clearHistory());
    expect(result.current.state.history).toHaveLength(0);
  });
});
