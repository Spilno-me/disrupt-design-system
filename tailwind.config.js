/**
 * Disrupt Design System - Tailwind Configuration
 *
 * This configuration uses the DDS preset as the single source of truth.
 * The preset is exported for consuming applications to use.
 */

import ddsPreset from './tailwind-preset.js'

/** @type {import('tailwindcss').Config} */
export default {
  // Use the DDS preset as the foundation
  presets: [ddsPreset],

  darkMode: ['class'],

  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // DDS-specific extensions (if any) go here
  // Most apps won't need this - they just use the preset
  theme: {
    extend: {
      // Add any DDS-internal-only extensions here
    },
  },

  plugins: [],
}
