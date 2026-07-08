import { ThemeProvider } from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import ThemeSelector from './ThemeSelector';
import Calculator from './Calculator';

export default function App() {
  const { theme, themeName, setTheme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.typography.fontFamily,
        padding: theme.spacing.lg,
      }}>
        <ThemeSelector themeName={themeName} setTheme={setTheme} />
        <Calculator />
      </div>
    </ThemeProvider>
  );
}
