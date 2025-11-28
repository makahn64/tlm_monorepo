import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['scripts/**/*.test.ts'],
    testTimeout: 30000, // 30 seconds for script execution tests
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});
