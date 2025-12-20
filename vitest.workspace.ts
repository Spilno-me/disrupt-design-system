import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineWorkspace } from 'vitest/config'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
export default defineWorkspace([
  // Keep any existing vitest configs if you have them
  // 'vitest.config.ts',
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
        provider: 'playwright',
        instances: [{ browser: 'chromium' }],
      },
      // Storybook's test setup
      setupFiles: ['.storybook/vitest.setup.ts'],
    },
  },
])
