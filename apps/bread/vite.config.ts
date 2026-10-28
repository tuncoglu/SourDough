import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { precachePlugin } from '../../packages/core/src/precache.ts';

const packages = (name: string) => fileURLToPath(new URL(`../../packages/${name}`, import.meta.url));

export default defineConfig({
  base: './',
  plugins: [react(), precachePlugin('bread')],
  resolve: {
    alias: {
      '@sourdough/calc': `${packages('calc')}/src`,
      '@sourdough/core': `${packages('core')}/src`,
      '@sourdough/ui': `${packages('ui')}/src`,
    },
    // The shared packages sit outside this folder and have no node_modules of
    // their own: make them use this app's one copy of React.
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}', '../../packages/core/__tests__/**/*.test.ts', '../../packages/ui/__tests__/**/*.test.tsx'],
  },
});
