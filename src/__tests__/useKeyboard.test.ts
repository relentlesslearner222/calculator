import { renderHook } from '@testing-library/react';
import { useKeyboard } from '../hooks/useKeyboard';
import { CalculatorAction } from '../types';

function fireKeyDown(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('useKeyboard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls onAction with the mapped action when a known key is pressed', () => {
    const onAction = jest.fn<void, [CalculatorAction]>();
    const setActiveKey = jest.fn<void, [string | null]>();

    renderHook(() => useKeyboard({ onAction, setActiveKey }));

    fireKeyDown('5');
    expect(onAction).toHaveBeenCalledWith({ type: 'DIGIT', payload: '5' });
  });

  it('calls setActiveKey with the pressed key', () => {
    const onAction = jest.fn<void, [CalculatorAction]>();
    const setActiveKey = jest.fn<void, [string | null]>();

    renderHook(() => useKeyboard({ onAction, setActiveKey }));

    fireKeyDown('Enter');
    expect(setActiveKey).toHaveBeenCalledWith('Enter');
  });

  it('clears activeKey after 150ms', () => {
    const onAction = jest.fn<void, [CalculatorAction]>();
    const setActiveKey = jest.fn<void, [string | null]>();

    renderHook(() => useKeyboard({ onAction, setActiveKey }));

    fireKeyDown('+');
    expect(setActiveKey).toHaveBeenCalledWith('+');
    expect(setActiveKey).not.toHaveBeenCalledWith(null);

    jest.advanceTimersByTime(150);
    expect(setActiveKey).toHaveBeenCalledWith(null);
  });

  it('does not call onAction for unknown keys', () => {
    const onAction = jest.fn<void, [CalculatorAction]>();
    const setActiveKey = jest.fn<void, [string | null]>();

    renderHook(() => useKeyboard({ onAction, setActiveKey }));

    fireKeyDown('a');
    expect(onAction).not.toHaveBeenCalled();
    expect(setActiveKey).not.toHaveBeenCalled();
  });

  it('removes the event listener on unmount', () => {
    const onAction = jest.fn<void, [CalculatorAction]>();
    const setActiveKey = jest.fn<void, [string | null]>();

    const { unmount } = renderHook(() => useKeyboard({ onAction, setActiveKey }));
    unmount();

    fireKeyDown('1');
    expect(onAction).not.toHaveBeenCalled();
  });
});
