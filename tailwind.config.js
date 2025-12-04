import {
  COLORS,
  SHADOWS,
  RADIUS,
  BORDER_WIDTH,
  SPACING,
  SIZES,
  TYPOGRAPHY,
  TRANSITIONS,
  BREAKPOINTS,
  Z_INDEX,
} from './src/constants/designTokens'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // Override default breakpoints
    screens: {
      sm: BREAKPOINTS.sm,
      md: BREAKPOINTS.md,
      lg: BREAKPOINTS.lg,
      xl: BREAKPOINTS.xl,
      '2xl': BREAKPOINTS['2xl'],
    },

    extend: {
      // =================================================================
      // COLORS
      // =================================================================
      colors: {
        // Brand color scales
        dark: COLORS.dark,
        teal: COLORS.teal,
        red: COLORS.red,
        cream: COLORS.cream,
        muted: COLORS.muted,

        // Semantic colors
        primary: COLORS.primary,
        accent: COLORS.accent,
        background: COLORS.background,
        surface: COLORS.surface,
        error: COLORS.error,

        // Text colors
        'text-primary': COLORS.text.primary,
        'text-secondary': COLORS.text.secondary,
        'text-disabled': COLORS.text.disabled,
        'text-inverse': COLORS.text.inverse,

        // Feature colors
        'feature-blue': COLORS.feature.blue,
        'feature-red': COLORS.feature.red,
        'feature-yellow': COLORS.feature.yellow,
        'feature-green': COLORS.feature.green,

        // Utility colors
        white: COLORS.white,
        slate: COLORS.slate,
        linkedin: COLORS.linkedIn,

        // Transparent values
        'glass-bg': COLORS.transparent.glass,
        'header-shadow': COLORS.transparent.headerShadow,
      },

      // =================================================================
      // SPACING
      // =================================================================
      spacing: SPACING,

      // =================================================================
      // TYPOGRAPHY
      // =================================================================
      fontFamily: {
        display: TYPOGRAPHY.fontFamily.display.split(','),
        sans: TYPOGRAPHY.fontFamily.sans.split(','),
        mono: TYPOGRAPHY.fontFamily.mono.split(','),
      },

      fontSize: TYPOGRAPHY.fontSize,
      fontWeight: TYPOGRAPHY.fontWeight,
      lineHeight: TYPOGRAPHY.lineHeight,
      letterSpacing: TYPOGRAPHY.letterSpacing,

      // =================================================================
      // BORDERS
      // =================================================================
      borderRadius: RADIUS,
      borderWidth: BORDER_WIDTH,

      // =================================================================
      // SHADOWS
      // =================================================================
      boxShadow: SHADOWS,

      // =================================================================
      // TRANSITIONS
      // =================================================================
      transitionDuration: TRANSITIONS.duration,
      transitionTimingFunction: TRANSITIONS.timing,

      // =================================================================
      // Z-INDEX
      // =================================================================
      zIndex: Z_INDEX,

      // =================================================================
      // MAX WIDTH (for containers)
      // =================================================================
      maxWidth: {
        container: SIZES.containerMaxWidth,
        hero: SIZES.heroFrameMaxWidth,
        header: SIZES.headerMaxWidth,
      },

      // =================================================================
      // HEIGHT (component heights)
      // =================================================================
      height: {
        header: SIZES.headerHeight,
        input: SIZES.inputHeight,
        button: SIZES.buttonHeight,
      },

      minHeight: {
        textarea: SIZES.textareaMinHeight,
      },

      // =================================================================
      // CUSTOM ANIMATIONS
      // =================================================================
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'arrow-bounce-right': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(4px)' },
        },
        'skeleton-shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'skeleton-wave': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.5' },
        },
      },

      animation: {
        'spin-slow': 'spin-slow 3s linear infinite',
        'arrow-bounce': 'arrow-bounce-right 1.5s ease-in-out infinite',
        'skeleton-shimmer': 'skeleton-shimmer 1.5s infinite',
        'skeleton-wave': 'skeleton-wave 1.6s ease-in-out infinite',
      },

      // =================================================================
      // BACKGROUND IMAGES (for gradients)
      // =================================================================
      backgroundImage: {
        'hero-overlay': 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.25) 100%)',
      },
    },
  },
  plugins: [],
}
