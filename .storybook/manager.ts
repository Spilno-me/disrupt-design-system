import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

const theme = create({
  base: 'light',

  // Brand
  brandTitle: 'Disrupt Design System',
  brandUrl: 'https://disruptinc.io',
  // brandImage: '/logo.svg', // Add logo later
  brandTarget: '_blank',

  // Colors
  colorPrimary: '#F70D1A', // Ferrari Red
  colorSecondary: '#08A4BD', // Teal

  // UI
  appBg: '#FBFBF3', // Cream
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E2E8F0',
  appBorderRadius: 4,

  // Text colors
  textColor: '#2D3142', // Dark
  textInverseColor: '#FFFFFF',
  textMutedColor: '#64748B', // Muted

  // Toolbar
  barTextColor: '#64748B',
  barSelectedColor: '#F70D1A',
  barHoverColor: '#08A4BD',
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#E2E8F0',
  inputTextColor: '#2D3142',
  inputBorderRadius: 4,

  // Font
  fontBase: '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  fontCode: '"Fira Code", "Monaco", "Consolas", monospace',
})

addons.setConfig({
  theme,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['assets'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
})
