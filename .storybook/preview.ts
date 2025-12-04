import type { Preview } from '@storybook/react-vite'
import '../src/input.css' // Import Tailwind CSS

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'cream',
      values: [
        {
          name: 'cream',
          value: '#FBFBF3',
        },
        {
          name: 'dark',
          value: '#2D3142',
        },
        {
          name: 'white',
          value: '#FFFFFF',
        },
      ],
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;