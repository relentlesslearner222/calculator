import { lightTheme, darkTheme, salesforceTheme, themes, VALID_THEME_NAMES } from '../src/themes/index';

describe('lightTheme', () => {
  test('has required color tokens', () => {
    expect(lightTheme.colors.background).toBe('#f5f5f5');
    expect(lightTheme.colors.surface).toBe('#ffffff');
    expect(lightTheme.colors.text).toBeDefined();
    expect(lightTheme.colors.primary).toBeDefined();
  });

  test('has typography tokens', () => {
    expect(lightTheme.typography.fontFamily).toBeTruthy();
    expect(lightTheme.typography.fontSizeBase).toBe('16px');
    expect(lightTheme.typography.fontSizeDisplay).toBe('32px');
  });

  test('has spacing tokens', () => {
    expect(lightTheme.spacing.sm).toBe('8px');
    expect(lightTheme.spacing.md).toBe('16px');
    expect(lightTheme.spacing.lg).toBe('24px');
  });
});

describe('darkTheme', () => {
  test('has a dark background', () => {
    expect(darkTheme.colors.background).toBe('#1a1a2e');
  });

  test('has required color tokens', () => {
    expect(darkTheme.colors.surface).toBeDefined();
    expect(darkTheme.colors.text).toBeDefined();
    expect(darkTheme.colors.primary).toBeDefined();
  });
});

describe('salesforceTheme', () => {
  test('uses Salesforce primary color', () => {
    expect(salesforceTheme.colors.primary).toBe('#0176d3');
  });

  test('uses Salesforce background', () => {
    expect(salesforceTheme.colors.background).toBe('#f3f3f3');
  });

  test('uses Salesforce text color', () => {
    expect(salesforceTheme.colors.text).toBe('#181818');
  });

  test('uses Salesforce font family', () => {
    expect(salesforceTheme.typography.fontFamily).toContain('Salesforce Sans');
  });
});

describe('themes map', () => {
  test('contains all three themes', () => {
    expect(themes.light).toBe(lightTheme);
    expect(themes.dark).toBe(darkTheme);
    expect(themes.salesforce).toBe(salesforceTheme);
  });

  test('VALID_THEME_NAMES includes light, dark, salesforce', () => {
    expect(VALID_THEME_NAMES).toEqual(['light', 'dark', 'salesforce']);
  });
});
