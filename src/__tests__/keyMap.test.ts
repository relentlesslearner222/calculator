import { keyMap } from '../utils/keyMap';

describe('keyMap', () => {
  it('maps digit keys 0-9 to DIGIT actions', () => {
    for (const digit of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      const action = keyMap[digit];
      expect(action).toEqual({ type: 'DIGIT', payload: digit });
    }
  });

  it('maps "." to DIGIT action with payload "."', () => {
    expect(keyMap['.']).toEqual({ type: 'DIGIT', payload: '.' });
  });

  it('maps "+" to OPERATOR action', () => {
    expect(keyMap['+']).toEqual({ type: 'OPERATOR', payload: '+' });
  });

  it('maps "-" to OPERATOR action', () => {
    expect(keyMap['-']).toEqual({ type: 'OPERATOR', payload: '-' });
  });

  it('maps "*" to OPERATOR action', () => {
    expect(keyMap['*']).toEqual({ type: 'OPERATOR', payload: '*' });
  });

  it('maps "/" to OPERATOR action', () => {
    expect(keyMap['/']).toEqual({ type: 'OPERATOR', payload: '/' });
  });

  it('maps "Enter" to EQUALS action', () => {
    expect(keyMap['Enter']).toEqual({ type: 'EQUALS' });
  });

  it('maps "=" to EQUALS action', () => {
    expect(keyMap['=']).toEqual({ type: 'EQUALS' });
  });

  it('maps "Escape" to CLEAR action', () => {
    expect(keyMap['Escape']).toEqual({ type: 'CLEAR' });
  });

  it('maps "Backspace" to BACKSPACE action', () => {
    expect(keyMap['Backspace']).toEqual({ type: 'BACKSPACE' });
  });

  it('does not map unknown keys', () => {
    expect(keyMap['a']).toBeUndefined();
    expect(keyMap['F1']).toBeUndefined();
  });
});
