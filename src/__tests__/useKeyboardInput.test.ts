import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import { CalcAction } from '../hooks/useCalculator';

describe('useKeyboardInput', () => {
  test('digit keys dispatch APPEND', () => {
    const dispatch = jest.fn();
    renderHook(() => useKeyboardInput(dispatch));
    fireEvent.keyDown(window, { key: '5' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'APPEND', value: '5' });
  });

  test('Enter dispatches EVALUATE', () => {
    const dispatch = jest.fn();
    renderHook(() => useKeyboardInput(dispatch));
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'EVALUATE' });
  });

  test('Escape dispatches CLEAR', () => {
    const dispatch = jest.fn();
    renderHook(() => useKeyboardInput(dispatch));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR' });
  });

  test('Backspace dispatches BACKSPACE', () => {
    const dispatch = jest.fn();
    renderHook(() => useKeyboardInput(dispatch));
    fireEvent.keyDown(window, { key: 'Backspace' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'BACKSPACE' });
  });

  test('s dispatches sin(', () => {
    const dispatch = jest.fn();
    renderHook(() => useKeyboardInput(dispatch));
    fireEvent.keyDown(window, { key: 's' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'APPEND', value: 'sin(' });
  });

  test('p dispatches π', () => {
    const dispatch = jest.fn();
    renderHook(() => useKeyboardInput(dispatch));
    fireEvent.keyDown(window, { key: 'p' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'APPEND', value: 'π' });
  });

  test('operator keys dispatch APPEND', () => {
    const dispatch = jest.fn();
    renderHook(() => useKeyboardInput(dispatch));
    fireEvent.keyDown(window, { key: '+' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'APPEND', value: '+' });
  });

  test('unknown key does not dispatch', () => {
    const dispatch = jest.fn() as jest.MockedFunction<(action: CalcAction) => void>;
    renderHook(() => useKeyboardInput(dispatch));
    fireEvent.keyDown(window, { key: 'F1' });
    expect(dispatch).not.toHaveBeenCalled();
  });
});
