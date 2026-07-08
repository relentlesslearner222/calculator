export const lightTheme = {
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    primary: '#4a90e2',
    primaryText: '#ffffff',
    border: '#dddddd',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSizeBase: '16px',
    fontSizeDisplay: '32px',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
};

export const darkTheme = {
  colors: {
    background: '#1a1a2e',
    surface: '#16213e',
    text: '#e0e0e0',
    textSecondary: '#a0a0b0',
    primary: '#0f3460',
    primaryText: '#e0e0e0',
    border: '#2a2a4a',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSizeBase: '16px',
    fontSizeDisplay: '32px',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
};

export const salesforceTheme = {
  colors: {
    background: '#f3f3f3',
    surface: '#ffffff',
    text: '#181818',
    textSecondary: '#444444',
    primary: '#0176d3',
    primaryText: '#ffffff',
    border: '#dddbda',
  },
  typography: {
    fontFamily: "'Salesforce Sans', Arial, sans-serif",
    fontSizeBase: '16px',
    fontSizeDisplay: '32px',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  salesforce: salesforceTheme,
};

export const VALID_THEME_NAMES = ['light', 'dark', 'salesforce'];
export const DEFAULT_THEME_NAME = 'light';
