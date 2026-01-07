import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

import { playwright } from '@vitest/browser-playwright'

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// =============================================================================
// VITEST CONFIGURATION
// Multi-project setup for unit tests + Storybook interaction tests
// More info: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
// =============================================================================
export default defineConfig({
  test: {
    projects: [
      // =======================================================================
      // PROJECT 1: Unit Tests (fast, node-based)
      // Run with: npm run test:unit
      // =======================================================================
      {
        extends: './vite.config.ts',
        test: {
          name: 'unit',
          include: ['src/**/__tests__/**/*.test.ts', 'src/**/__tests__/**/*.test.tsx'],
          exclude: ['**/node_modules/**', '**/dist/**'],
          environment: 'node',
          globals: true,
        },
      },
      // =======================================================================
      // PROJECT 2: Storybook Interaction Tests (browser-based)
      // Run with: npm run test:storybook
      // =======================================================================
      {
        extends: './vite.config.ts',
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: [
            '.storybook/vitest.setup.ts',
            '.storybook/vitest.matchers.ts', // jest-dom matchers (separate to avoid Chromatic bundling)
          ],
        },
      },
    ],
  },
})
