const { mapKeyToAction, mapKeyToScientificAction } = require('../src/keyboardMapping');

// ── Helpers ────────────────────────────────────────────────────────────────
function evt(key) { return { key }; }

// ── mapKeyToAction ─────────────────────────────────────────────────────────
describe('mapKeyToAction – digits', () => {
  test.each(['0','1','2','3','4','5','6','7','8','9'])(
    'key "%s" returns digit action',
    (d) => {
      expect(mapKeyToAction(evt(d))).toEqual({ type: 'digit', value: d });
    }
  );
});

describe('mapKeyToAction – operators', () => {
  test.each([
    ['+', '+'],
    ['-', '-'],
    ['*', '*'],
    ['/', '/'],
  ])('key "%s" returns operator action with value "%s"', (key, value) => {
    expect(mapKeyToAction(evt(key))).toEqual({ type: 'operator', value });
  });
});

describe('mapKeyToAction – control keys', () => {
  test('Enter returns evaluate', () => {
    expect(mapKeyToAction(evt('Enter'))).toEqual({ type: 'evaluate' });
  });

  test('= returns evaluate', () => {
    expect(mapKeyToAction(evt('='))).toEqual({ type: 'evaluate' });
  });

  test('Backspace returns delete', () => {
    expect(mapKeyToAction(evt('Backspace'))).toEqual({ type: 'delete' });
  });

  test('Escape returns clear', () => {
    expect(mapKeyToAction(evt('Escape'))).toEqual({ type: 'clear' });
  });

  test('. returns decimal', () => {
    expect(mapKeyToAction(evt('.'))).toEqual({ type: 'decimal' });
  });

  test('% returns percent', () => {
    expect(mapKeyToAction(evt('%'))).toEqual({ type: 'percent' });
  });
});

describe('mapKeyToAction – unknown keys', () => {
  test.each(['a', 'b', 'q', 'F1', 'Tab', 'ArrowUp'])(
    'key "%s" returns null',
    (k) => {
      expect(mapKeyToAction(evt(k))).toBeNull();
    }
  );
});

// ── mapKeyToScientificAction ───────────────────────────────────────────────
describe('mapKeyToScientificAction – scientific keys', () => {
  test.each([
    ['s', 'sin'],
    ['c', 'cos'],
    ['t', 'tan'],
    ['l', 'log'],
    ['n', 'ln'],
    ['^', 'pow'],
    ['r', 'sqrt'],
  ])('key "%s" maps to "%s"', (key, value) => {
    expect(mapKeyToScientificAction(evt(key))).toEqual({ type: 'scientific', value });
  });
});

describe('mapKeyToScientificAction – unknown keys', () => {
  test.each(['a', '1', '+', 'Enter', 'F2'])(
    'key "%s" returns null',
    (k) => {
      expect(mapKeyToScientificAction(evt(k))).toBeNull();
    }
  );
});

// ── Edge cases ─────────────────────────────────────────────────────────────
describe('mapKeyToAction – edge cases', () => {
  test('handles upper-case letters (not digits) as null', () => {
    expect(mapKeyToAction(evt('A'))).toBeNull();
  });

  test('digit 0 is returned as string "0", not number', () => {
    const result = mapKeyToAction(evt('0'));
    expect(result).not.toBeNull();
    expect(result.value).toBe('0');
    expect(typeof result.value).toBe('string');
  });

  test('all ten digits produce unique values', () => {
    const values = ['0','1','2','3','4','5','6','7','8','9']
      .map(d => mapKeyToAction(evt(d)).value);
    expect(new Set(values).size).toBe(10);
  });
});

describe('mapKeyToScientificAction – does not overlap standard keys', () => {
  const standardKeys = ['0','1','+','-','*','/','Enter','=','Backspace','Escape','.','%'];
  test.each(standardKeys)('scientific mapper returns null for standard key "%s"', (k) => {
    expect(mapKeyToScientificAction(evt(k))).toBeNull();
  });
});
