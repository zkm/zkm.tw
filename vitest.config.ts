import { defineConfig } from 'vitest/config';

// Vitest-specific config; keeps types isolated from the Vite build config
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
