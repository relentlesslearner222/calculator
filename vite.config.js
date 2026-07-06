import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/calculator/',
  build: {
    sourcemap: mode !== 'production',
  },
}));
