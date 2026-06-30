/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        calc: {
          bg: '#1a1a2e',
          surface: '#16213e',
          display: '#0f3460',
          primary: '#e94560',
          secondary: '#533483',
          operator: '#0f3460',
          function: '#533483',
          equal: '#e94560',
          digit: '#16213e',
          memory: '#1a4a6b',
        },
      },
    },
  },
  plugins: [],
};
