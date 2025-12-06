import type { Preview } from '@storybook/react-vite'
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport'
import '../src/styles.css'

const preview: Preview = {
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
    },
  },
};

export default preview;