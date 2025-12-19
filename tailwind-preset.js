/**
 * Disrupt Design System - Tailwind CSS Preset
 *
 * This preset is the SINGLE SOURCE OF TRUTH for all DDS styling.
 * Consuming applications should use this preset and NOT duplicate tokens.
 *
 * Usage in consuming apps:
 * ```js
 * // tailwind.config.js
 * export default {
 *   presets: [require('@adrozdenko/design-system/tailwind-preset')],
 *   content: ['./src/** /*.{ts,tsx}'],
 * }
 * ```
 */

// =============================================================================
// TIER 1: PRIMITIVES (Raw color values)
// =============================================================================

const ABYSS = {
  50: '#E8E9EB',
  100: '#D1D3D7',
  200: '#A3A7AF',
  300: '#757B87',
  400: '#474F5F',
  500: '#2D3142',
  600: '#252836',
  700: '#1D1F2A',
  800: '#14161E',
  900: '#0C0D12',
}

const DEEP_CURRENT = {
  50: '#E6F7FA',
  100: '#CCEFF5',
  200: '#99DFEB',
  300: '#66CFE1',
  400: '#33BFD7',
  500: '#08A4BD',
  600: '#068397',
  700: '#056271',
  800: '#03424B',
  900: '#022125',
}

const DUSK_REEF = {
  50: '#EFEDF3',
  100: '#DFDBE7',
  200: '#BFB7CF',
  300: '#9F93B7',
  400: '#7F6F9F',
  500: '#5E4F7E',
  600: '#4B3F65',
  700: '#382F4C',
  800: '#262033',
  900: '#13101A',
}

const CORAL = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  450: '#EF4444',
  500: '#F70D1A',
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
}

const WAVE = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
}

const SUNRISE = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#EAB308',
  600: '#CA8A04',
  700: '#A16207',
  800: '#854D0E',
  900: '#713F12',
}

const ORANGE = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316',
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
}

const HARBOR = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  300: '#86EFAC',
  400: '#4ADE80',
  500: '#22C55E',
  600: '#16A34A',
  700: '#15803D',
  800: '#166534',
  900: '#14532D',
}

const SLATE = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
}

const PRIMITIVES = {
  white: '#FFFFFF',
  black: '#000000',
  cream: '#FBFBF3',
  softLinen: '#EBF9FF',
  linkedIn: '#0A66C2',
}

// =============================================================================
// SHADOWS
// =============================================================================

const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ambient: '0 2px 4px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08)',
  image: '0 6px 12px -2px rgba(0,0,0,0.3), 0 20px 50px -8px rgba(0,0,0,0.2)',
  header: '0px 2px 4px 5px rgba(0, 0, 0, 0.15)',
  footer: '0px -1px 3px rgba(0, 0, 0, 0.08)',
  button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
}

// =============================================================================
// BORDER RADIUS
// =============================================================================

const RADIUS = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
}

// =============================================================================
// SPACING (extends Tailwind default)
// =============================================================================

const SPACING = {
  px: '1px',
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  18: '72px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
}

// =============================================================================
// TYPOGRAPHY
// =============================================================================

const TYPOGRAPHY = {
  fontFamily: {
    display: ['"Pilat Extended"', 'Arial', 'sans-serif'],
    sans: ['"Fixel"', 'system-ui', 'sans-serif'],
    mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    xs: ['12px', { lineHeight: '16px' }],
    sm: ['14px', { lineHeight: '20px' }],
    base: ['16px', { lineHeight: '24px' }],
    lg: ['18px', { lineHeight: '28px' }],
    xl: ['20px', { lineHeight: '28px' }],
    '2xl': ['24px', { lineHeight: '32px' }],
    '3xl': ['30px', { lineHeight: '36px' }],
    '4xl': ['36px', { lineHeight: '40px' }],
    '5xl': ['48px', { lineHeight: '1' }],
    '6xl': ['60px', { lineHeight: '1' }],
    '7xl': ['72px', { lineHeight: '1' }],
    '8xl': ['96px', { lineHeight: '1' }],
    '9xl': ['128px', { lineHeight: '1' }],
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
}

// =============================================================================
// BREAKPOINTS
// =============================================================================

const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// =============================================================================
// TRANSITIONS
// =============================================================================

const TRANSITIONS = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
    // Named durations
    fast: '150ms',
    normal: '200ms',
    smooth: '300ms',
    slow: '500ms',
  },
  timing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// =============================================================================
// Z-INDEX
// =============================================================================

const Z_INDEX = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  // Named layers
  background: '0',
  content: '1',
  dropdown: '10',
  sticky: '20',
  header: '50',
  modal: '100',
  tooltip: '150',
  notification: '200',
}

// =============================================================================
// SIZES
// =============================================================================

const SIZES = {
  containerMaxWidth: '1440px',
  heroFrameMaxWidth: '1440px',
  headerMaxWidth: '1440px',
  headerHeight: '82px',
  inputHeight: '40px',
  buttonHeight: '40px',
  textareaMinHeight: '120px',
}

// =============================================================================
// SAFELIST - Always generate these classes
// =============================================================================

const SAFELIST = [
  // Semantic text colors
  'text-primary',
  'text-secondary',
  'text-tertiary',
  'text-muted',
  'text-emphasis',
  'text-disabled',
  'text-inverse',
  'text-link',
  'text-error',
  'text-success',
  'text-warning',
  'text-info',
  'text-accent',
  // Semantic background colors
  'bg-page',
  'bg-surface',
  'bg-surface-hover',
  'bg-surface-active',
  'bg-elevated',
  'bg-muted-bg',
  'bg-inverse-bg',
  'bg-inverse-subtle',
  'bg-accent-bg',
  'bg-accent-strong',
  'bg-accent-dark',
  'bg-error',
  'bg-error-light',
  'bg-error-muted',
  'bg-success',
  'bg-success-light',
  'bg-success-muted',
  'bg-warning',
  'bg-warning-light',
  'bg-warning-muted',
  'bg-info',
  'bg-info-light',
  'bg-info-muted',
  // Semantic border colors
  'border-default',
  'border-subtle',
  'border-strong',
  'border-focus',
  'border-accent',
  'border-accent-dark',
  'border-error',
  'border-success',
  'border-warning',
  'border-info',
  // Hover/opacity variants for buttons
  'hover:bg-inverse-bg/90',
  'hover:bg-muted-bg/80',
  'hover:bg-accent-strong/90',
  'hover:bg-error/90',
  'hover:bg-page',
  // Focus variants
  'focus-visible:ring-accent/30',
  'focus-visible:ring-error/30',
  'focus-visible:border-accent',
  // Legacy brand colors (for backward compatibility)
  'text-dark',
  'text-dark-purple',
  'text-teal',
  'text-teal-light',
  'text-cream',
  'text-red',
  'text-white',
  'bg-dark',
  'bg-dark-purple',
  'bg-teal',
  'bg-teal-light',
  'bg-cream',
  'bg-light-purple',
  'bg-white',
  'bg-red',
  'border-slate',
  'border-teal',
  'border-dark',
]

// =============================================================================
// THE PRESET
// =============================================================================

module.exports = {
  // Safelist ensures these classes are always generated
  safelist: SAFELIST,

  theme: {
    // Override screens with DDS breakpoints
    screens: BREAKPOINTS,

    extend: {
      // =================================================================
      // COLORS - Complete semantic mapping
      // =================================================================
      colors: {
        // --- PRIMITIVE SCALES (for direct access if needed) ---
        abyss: ABYSS,
        'deep-current': DEEP_CURRENT,
        'dusk-reef': DUSK_REEF,
        coral: CORAL,
        wave: WAVE,
        sunrise: SUNRISE,
        orange: ORANGE,
        harbor: HARBOR,
        slate: SLATE,

        // --- BRAND COLORS (semantic shortcuts) ---
        dark: ABYSS[500],
        teal: DEEP_CURRENT[500],
        'teal-light': DEEP_CURRENT[300],
        red: CORAL[500],
        cream: PRIMITIVES.cream,
        linkedin: PRIMITIVES.linkedIn,

        // --- TEXT COLORS ---
        // Usage: text-primary, text-secondary, text-muted, etc.
        primary: ABYSS[500],
        secondary: ABYSS[400], // WCAG AA compliant - 5.8:1 contrast
        tertiary: DUSK_REEF[500],
        muted: DUSK_REEF[400],
        emphasis: ABYSS[400],
        disabled: DUSK_REEF[300],
        inverse: PRIMITIVES.white,
        link: DEEP_CURRENT[500],
        'link-hover': DEEP_CURRENT[600],

        // --- BACKGROUND COLORS ---
        // Usage: bg-page, bg-surface, bg-elevated, etc.
        page: PRIMITIVES.cream,
        surface: PRIMITIVES.white,
        'surface-hover': ABYSS[50],
        'surface-active': ABYSS[100],
        elevated: PRIMITIVES.white,
        'muted-bg': DUSK_REEF[50],
        'inverse-bg': ABYSS[500],
        'inverse-subtle': ABYSS[700],
        'accent-bg': DEEP_CURRENT[50],
        'accent-subtle': DEEP_CURRENT[100],
        'accent-strong': DEEP_CURRENT[500],
        'accent-dark': DEEP_CURRENT[600],

        // --- BORDER COLORS ---
        // Usage: border-default, border-subtle, border-focus, etc.
        default: SLATE[300],
        subtle: ABYSS[100],
        strong: ABYSS[300],
        focus: DEEP_CURRENT[500],
        accent: DEEP_CURRENT[500],
        'border-inverse': ABYSS[700],
        'border-disabled': ABYSS[200],

        // --- ICON COLORS ---
        // Usage: text-icon-primary, text-icon-secondary, etc.
        'icon-primary': ABYSS[500],
        'icon-secondary': ABYSS[400], // WCAG AA compliant
        'icon-tertiary': DUSK_REEF[500],
        'icon-disabled': DUSK_REEF[300],
        'icon-inverse': PRIMITIVES.white,
        'icon-accent': DEEP_CURRENT[500],

        // --- INTERACTIVE COLORS ---
        // Usage: bg-interactive-primary, hover:bg-interactive-hover, etc.
        'interactive-primary': ABYSS[500],
        'interactive-hover': ABYSS[600],
        'interactive-active': ABYSS[700],
        'interactive-accent': DEEP_CURRENT[500],
        'interactive-accent-hover': DEEP_CURRENT[600],
        'interactive-accent-active': DEEP_CURRENT[700],
        'interactive-danger': CORAL[500],
        'interactive-danger-hover': CORAL[600],
        'interactive-disabled': ABYSS[200],

        // --- STATUS COLORS ---
        // Usage: bg-error, text-error, border-error, etc.
        error: CORAL[500],
        'error-light': CORAL[50],
        'error-muted': CORAL[100],
        success: HARBOR[500],
        'success-light': HARBOR[50],
        'success-muted': HARBOR[100],
        warning: SUNRISE[500],
        'warning-light': SUNRISE[50],
        'warning-muted': SUNRISE[100],
        info: WAVE[500],
        'info-light': WAVE[50],
        'info-muted': WAVE[100],

        // --- FEATURE COLORS (for feature indicators) ---
        // Usage: bg-feature-automate, text-feature-advice, etc.
        'feature-automate': WAVE[500],
        'feature-advice': CORAL[450],
        'feature-adapt': SUNRISE[500],
        'feature-scale': HARBOR[500],

        // Circle colors (aliases for feature)
        'circle-blue': WAVE[500],
        'circle-red': CORAL[450],
        'circle-yellow': SUNRISE[500],
        'circle-green': HARBOR[500],

        // --- AGING/URGENT COLORS ---
        aging: ORANGE[500],
        'aging-dark': ORANGE[600],
        'aging-light': ORANGE[50],

        // --- OVERLAY COLORS ---
        // Usage: bg-overlay-light, bg-overlay-dark, etc.
        'overlay-light': 'rgba(251, 251, 243, 0.3)',
        'overlay-medium': 'rgba(0, 0, 0, 0.3)',
        'overlay-dark': 'rgba(0, 0, 0, 0.5)',
        'overlay-darker': 'rgba(0, 0, 0, 0.8)',
        'overlay-white-15': 'rgba(255, 255, 255, 0.15)',
        'overlay-white-50': 'rgba(255, 255, 255, 0.5)',
        'overlay-white-60': 'rgba(255, 255, 255, 0.6)',
        'overlay-subtle': 'rgba(229, 229, 229, 0.5)',
        'overlay-teal': 'rgba(0, 128, 128, 0.05)',

        // --- ELECTRIC EFFECT COLORS ---
        'electric-cyan': '#00CED1',
        'electric-bright': '#00FFFF',

        // --- UTILITY ---
        white: PRIMITIVES.white,
        black: PRIMITIVES.black,
        transparent: 'transparent',
        current: 'currentColor',
      },

      // =================================================================
      // SPACING
      // =================================================================
      spacing: SPACING,

      // =================================================================
      // TYPOGRAPHY
      // =================================================================
      fontFamily: TYPOGRAPHY.fontFamily,
      fontSize: TYPOGRAPHY.fontSize,
      fontWeight: TYPOGRAPHY.fontWeight,
      lineHeight: TYPOGRAPHY.lineHeight,
      letterSpacing: TYPOGRAPHY.letterSpacing,

      // =================================================================
      // BORDERS
      // =================================================================
      borderRadius: RADIUS,
      borderWidth: {
        DEFAULT: '1px',
        0: '0px',
        1: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
      },

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
      // SIZES
      // =================================================================
      maxWidth: {
        container: SIZES.containerMaxWidth,
        hero: SIZES.heroFrameMaxWidth,
        header: SIZES.headerMaxWidth,
      },
      height: {
        header: SIZES.headerHeight,
        input: SIZES.inputHeight,
        button: SIZES.buttonHeight,
      },
      minHeight: {
        textarea: SIZES.textareaMinHeight,
      },

      // =================================================================
      // BACKGROUND IMAGES (Gradients)
      // =================================================================
      backgroundImage: {
        // Subtle gradient (accent to white) - for cards, surfaces
        'gradient-subtle': `linear-gradient(to top, ${DEEP_CURRENT[50]} 0%, ${PRIMITIVES.white} 100%)`,
        // Hero overlay
        'gradient-hero-overlay': 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.25) 100%)',
        // Hero overlay strong
        'gradient-hero-strong': 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
        // Card background gradient
        'gradient-card': `linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, ${DEEP_CURRENT[50]} 14%, ${DEEP_CURRENT[50]} 100%)`,
      },

      // =================================================================
      // ANIMATIONS
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
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-collapsible-content-height)', opacity: '1' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 3s linear infinite',
        'arrow-bounce': 'arrow-bounce-right 1.5s ease-in-out infinite',
        'skeleton-shimmer': 'skeleton-shimmer 1.5s infinite',
        'skeleton-wave': 'skeleton-wave 1.6s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-in-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-right': 'slide-in-from-right 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
