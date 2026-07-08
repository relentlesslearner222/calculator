import { useState, useEffect } from 'react';
import { themes, VALID_THEME_NAMES, DEFAULT_THEME_NAME } from '../themes/index';

const STORAGE_KEY = 'calculator_theme';

function getInitialThemeName() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_THEME_NAMES.includes(stored)) {
      return stored;
    }
  } catch (_e) {
    // localStorage unavailable
  }
  return DEFAULT_THEME_NAME;
}

export function useTheme() {
  const [themeName, setThemeNameState] = useState(getInitialThemeName);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, themeName);
    } catch (_e) {
      // localStorage unavailable
    }
  }, [themeName]);

  function setTheme(name) {
    if (VALID_THEME_NAMES.includes(name)) {
      setThemeNameState(name);
    }
  }

  return {
    theme: themes[themeName],
    themeName,
    setTheme,
  };
}
