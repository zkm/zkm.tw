import { defineConfig } from 'vitest/config';

// Vitest-specific config; keeps types isolated from the Vite build config
export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test-setup.ts'],
        coverage: {
            // Count every source file, not just the ones a test happens to import
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/**/__tests__/**', 'src/test-setup.ts', 'src/**/*.d.ts'],
            // json-summary feeds the README coverage badge (.github/workflows/coverage.yml)
            reporter: ['text', 'html', 'json-summary'],
        },
    },
});
