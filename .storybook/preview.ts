import type { Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport'
import { create } from 'storybook/theming'
import '../src/styles.css'

// Suppress Storybook internal deprecation warnings
const originalWarn = console.warn
console.warn = (...args: unknown[]) => {
  const message = args[0]
  if (typeof message === 'string') {
    // Skip Storybook internal deprecation warnings
    if (
      message.includes('IconButton') ||
      message.includes('ariaLabel') ||
      message.includes('`active` prop on `Button`')
    ) {
      return
    }
  }
  originalWarn.apply(console, args)
}

const docsTheme = create({
  base: 'light',
  fontBase: '"Fixel", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  fontCode: '"Fira Code", "Monaco", "Consolas", monospace',
})

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
      parentSelector: 'body',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    viewport: {
      options: {
        ...MINIMAL_VIEWPORTS,
        ...INITIAL_VIEWPORTS,
      },
    },
    backgrounds: {
      default: 'white',
      values: [
        {
          name: 'white',
          value: '#FFFFFF',
        },
        {
          name: 'cream',
          value: '#FBFBF3',
        },
        {
          name: 'dark',
          value: '#2D3142',
        },
      ],
    },
    docs: {
      toc: true,
      theme: docsTheme,
      container: undefined,
      canvas: {
        sourceState: 'shown',
      },
    },
    layout: 'fullscreen',
  },
};

export default preview;