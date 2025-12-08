import type { Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport'
import { create } from 'storybook/theming'
import '../src/styles.css'

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