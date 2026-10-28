import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  resolve: { alias: { '@sourdough/ui': fileURLToPath(new URL('../../packages/ui/src', import.meta.url)) } },
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        about: fileURLToPath(new URL('./about.html', import.meta.url)),
        privacy: fileURLToPath(new URL('./privacy.html', import.meta.url)),
      },
    },
  },
  test: { environment: 'node', include: ['test/**/*.test.ts'] },
});
