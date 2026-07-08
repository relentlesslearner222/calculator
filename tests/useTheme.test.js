import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../src/hooks/useTheme';
import { lightTheme, darkTheme, salesforceTheme } from '../src/themes/index';

beforeEach(() => {
  localStorage.clear();
});

describe('useTheme', () => {
  test('returns light theme by default', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.themeName).toBe('light');
    expect(result.current.theme).toEqual(lightTheme);
  });

  test('reads saved theme from localStorage', () => {
    localStorage.setItem('calculator_theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.themeName).toBe('dark');
    expect(result.current.theme).toEqual(darkTheme);
  });

  test('falls back to light if stored value is invalid', () => {
    localStorage.setItem('calculator_theme', 'invalid_theme');
    const { result } = renderHook(() => useTheme());
    expect(result.current.themeName).toBe('light');
  });

  test('setTheme changes theme and persists to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.setTheme('salesforce');
    });
    expect(result.current.themeName).toBe('salesforce');
    expect(result.current.theme).toEqual(salesforceTheme);
    expect(localStorage.getItem('calculator_theme')).toBe('salesforce');
  });

  test('setTheme ignores invalid theme names', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.setTheme('notatheme');
    });
    expect(result.current.themeName).toBe('light');
  });

  test('exposes theme object matching themeName', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.setTheme('dark');
    });
    expect(result.current.theme).toEqual(darkTheme);
  });
});
