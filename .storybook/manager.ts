import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

const theme = create({
  base: 'light',

  // Brand
  brandTitle: 'Disrupt Design System',
  brandUrl: 'https://disruptinc.io',
  brandImage: '/disrupt-logo.svg',
  brandTarget: '_blank',

  // Colors
  colorPrimary: '#F70D1A', // Ferrari Red
  colorSecondary: '#08A4BD', // Teal

  // UI
  appBg: '#FBFBF3', // Cream
  appContentBg: '#FBFBF3', // Soft linen
  appPreviewBg: '#FBFBF3', // Soft linen - story canvas background
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
  fontBase: '"Fixel", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", "Monaco", "Consolas", monospace',
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
