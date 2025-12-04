/**
 * Design Tokens - Centralized design system values
 * Pure, platform-agnostic design tokens
 * Can be consumed by Tailwind, React Native, CSS variables, etc.
 */

// =============================================================================
// COLORS - Pure hex values, no platform-specific syntax
// =============================================================================

export const COLORS = {
  // =============================================================================
  // PRIMARY BRAND COLORS (Base + Variations)
  // =============================================================================

  // Dark Scale - Primary text, buttons, headings
  dark: {
    50: '#F7F8F9',
    100: '#E8EAED',
    200: '#D1D4DB',
    300: '#9FA5B0',
    400: '#6D7485',
    500: '#2D3142',   // Base - primary text, buttons (MAIN)
    600: '#242735',
    700: '#1B1D28',
    800: '#12131A',
    900: '#090A0D',
  },

  // Teal Scale - Accent, links, active states
  teal: {
    50: '#E6F7FA',
    100: '#B3E8F0',
    200: '#80D9E5',
    300: '#4DCADB',
    400: '#26B7CE',
    500: '#08A4BD',   // Base - accents, links (MAIN)
    600: '#0793AA',
    700: '#058297',
    800: '#047185',
    900: '#025D6D',
  },

  // Ferrari Red Scale - Brand accent, alerts, errors
  red: {
    50: '#FEF2F2',
    100: '#FFDCDE',
    200: '#FFB3B8',
    300: '#FF7A82',
    400: '#FF474D',
    500: '#F70D1A',   // Base - brand red (MAIN)
    600: '#DE0C17',
    700: '#BE0A14',
    800: '#9F0811',
    900: '#80060E',
  },

  // Cream Scale - Backgrounds, surfaces
  cream: {
    50: '#FFFFFF',
    100: '#FEFEFC',
    200: '#FCFCF8',
    300: '#FBFBF3',   // Base - main background (MAIN)
    400: '#F7F7ED',
    500: '#F3F3E7',
    600: '#E8E8D8',
    700: '#D4D4BE',
    800: '#C0C0A4',
    900: '#ACACAA',
  },

  // Muted Purple Scale - Secondary text, subtle accents
  muted: {
    50: '#F6F5F8',
    100: '#E7E4EE',
    200: '#D4CEE0',
    300: '#B8AEC9',
    400: '#9B8FB2',
    500: '#5E4F7E',   // Base - secondary text (MAIN)
    600: '#4E406A',
    700: '#3E3156',
    800: '#2E2342',
    900: '#1E152E',
  },

  // =============================================================================
  // SEMANTIC ALIASES (Reference scale values)
  // =============================================================================

  primary: '#2D3142',
  accent: '#08A4BD',
  background: '#FBFBF3',
  surface: '#FFFFFF',
  error: '#F70D1A',

  text: {
    primary: '#2D3142',
    secondary: '#5E4F7E',
    disabled: '#9FA5B0',
    inverse: '#FFFFFF',
  },

  // =============================================================================
  // FEATURE COLORS
  // =============================================================================

  feature: {
    blue: '#3B82F6',
    red: '#FF2E3A',
    yellow: '#EAB308',
    green: '#22C55E',
  },

  // =============================================================================
  // UTILITY COLORS
  // =============================================================================

  white: '#FFFFFF',
  slate: '#CBD5E1',
  linkedIn: '#0A66C2',

  // Transparent values
  transparent: {
    glass: 'rgba(251, 251, 243, 0.3)',
    headerShadow: 'rgba(0, 0, 0, 0.15)',
    overlay: {
      light: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.25)',
      dark: 'rgba(0, 0, 0, 0.5)',
    },
  },
} as const

// =============================================================================
// SHADOWS - Pure shadow values
// =============================================================================

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Custom shadows
  image: '0 6px 12px -2px rgba(0,0,0,0.3), 0 20px 50px -8px rgba(0,0,0,0.2)',
  header: '0 2px 4px 5px rgba(0, 0, 0, 0.15)',
  button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const

// =============================================================================
// GRADIENTS
// =============================================================================

export const GRADIENTS = {
  // Hero overlay for text readability - only bottom half, light
  heroOverlay: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.25) 100%)',
} as const

// =============================================================================
// GLASSMORPHISM EFFECTS - Frosted glass UI effects
// =============================================================================

export const GLASS_EFFECTS = {
  // Backdrop blur values
  blur: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    header: '10px',  // Used by header
  },

  // Glass surface presets (background + blur combinations)
  surface: {
    // Light glass - subtle transparency for headers, overlays
    light: {
      background: 'rgba(251, 251, 243, 0.3)',  // cream/30
      backdropBlur: '10px',
      border: 'rgba(8, 164, 189, 1)',  // teal border
      shadow: '0px 2px 4px 5px rgba(0, 0, 0, 0.15)',  // header shadow
    },
    // Medium glass - more visible for cards, modals
    medium: {
      background: 'rgba(251, 251, 243, 0.5)',  // cream/50
      backdropBlur: '12px',
      border: 'rgba(8, 164, 189, 0.3)',  // teal/30 border
      shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    // Heavy glass - strong blur for prominent overlays
    heavy: {
      background: 'rgba(251, 251, 243, 0.7)',  // cream/70
      backdropBlur: '16px',
      border: 'rgba(8, 164, 189, 0.5)',  // teal/50 border
      shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    // Dark glass - for dark mode or overlays on light backgrounds
    dark: {
      background: 'rgba(45, 49, 66, 0.6)',  // dark/60
      backdropBlur: '16px',
      border: 'rgba(8, 164, 189, 0.4)',  // teal/40 border
      shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
    },
  },
} as const

// =============================================================================
// GRID PATTERNS - Background grid decorative patterns
// =============================================================================

export const GRID_PATTERNS = {
  // Grid cell sizes
  size: {
    xs: '10px',
    sm: '15px',
    md: '20px',    // Default - used in GridBlobCanvas
    lg: '30px',
    xl: '40px',
    '2xl': '60px',
  },

  // Grid line colors with opacity
  color: {
    light: 'rgba(180, 180, 180, 0.2)',   // Very subtle
    medium: 'rgba(180, 180, 180, 0.4)',  // Default - used in GridBlobCanvas
    dark: 'rgba(180, 180, 180, 0.6)',    // More visible
    teal: 'rgba(8, 164, 189, 0.3)',      // Branded grid
    muted: 'rgba(94, 79, 126, 0.3)',     // Purple-tinted grid
  },

  // Grid line widths
  strokeWidth: {
    thin: '0.5px',
    normal: '1px',    // Default
    thick: '2px',
  },

  // Complete grid presets
  preset: {
    // Subtle background decoration (default)
    default: {
      size: '20px',
      color: 'rgba(180, 180, 180, 0.4)',
      strokeWidth: '1px',
    },
    // Fine grid for detailed sections
    fine: {
      size: '10px',
      color: 'rgba(180, 180, 180, 0.2)',
      strokeWidth: '0.5px',
    },
    // Large grid for hero sections
    large: {
      size: '40px',
      color: 'rgba(180, 180, 180, 0.3)',
      strokeWidth: '1px',
    },
    // Branded teal grid
    branded: {
      size: '20px',
      color: 'rgba(8, 164, 189, 0.3)',
      strokeWidth: '1px',
    },
  },
} as const

// =============================================================================
// BORDER RADIUS - Pure pixel/percentage values
// =============================================================================

export const RADIUS = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const

// =============================================================================
// BORDER WIDTHS - Standard border widths
// =============================================================================

export const BORDER_WIDTH = {
  none: '0px',
  thin: '1px',
  medium: '2px',
  thick: '4px',
  bold: '8px',
} as const

// =============================================================================
// SPACING - T-shirt sizing scale
// =============================================================================

export const SPACING = {
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
} as const

// =============================================================================
// LAYOUT SIZES - Container and component sizes
// =============================================================================

export const SIZES = {
  // Container max widths
  containerMaxWidth: '1358px',
  heroFrameMaxWidth: '1358px',
  headerMaxWidth: '1358px',

  // Component heights
  headerHeight: '82px',
  inputHeight: '36px',
  buttonHeight: '36px',
  textareaMinHeight: '104px',

  // Breakpoint-based container padding
  containerPadding: {
    mobile: '24px',
    desktop: '40px',
  },

  // Section padding
  sectionPadding: {
    mobile: '64px',
    desktop: '96px',
  },
} as const

// =============================================================================
// TYPOGRAPHY - Font families, sizes, weights, line heights
// =============================================================================

export const TYPOGRAPHY = {
  // Font families - pure font stacks
  fontFamily: {
    display: '"Pilat Extended", "Arial", sans-serif',
    sans: '"Fixel", "system-ui", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Font sizes - pure pixel values
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
    '7xl': '72px',
    '8xl': '96px',
    '9xl': '128px',
  },

  // Font weights
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

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

// =============================================================================
// TRANSITIONS - CSS transition durations
// =============================================================================

export const TRANSITIONS = {
  duration: {
    instant: '75ms',
    fast: '150ms',
    normal: '200ms',
    smooth: '300ms',
    slow: '500ms',
    slower: '700ms',
  },

  timing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// =============================================================================
// ANIMATION - Motion and interaction animations
// =============================================================================

export const ANIMATION = {
  // Duration constants (in seconds) - for Framer Motion
  duration: {
    INSTANT: 0.1,
    FAST: 0.2,
    NORMAL: 0.3,
    SMOOTH: 0.4,
    SLOW: 0.5,
    SCROLL: 0.8,
    SCROLL_LONG: 1.4,
  },

  // Common easing curves
  easing: {
    EASE_OUT: [0.4, 0, 0.1, 1] as const,
    EASE_IN_OUT: 'easeInOut' as const,
    SPRING_CAROUSEL: [0.32, 0.72, 0, 1] as const,
  },

  // Menu animation delay (ms)
  MENU_CLOSE_DELAY_MS: 350,

  // Particle system (HeroSection)
  particles: {
    SPAWN_THROTTLE_MS: 50,
    MAX_ACTIVE_PARTICLES: 30,
    SPAWN_PROBABILITY: 0.9,
    LIFETIME_MS: 3500,
    INITIAL_SPAWN_COUNT: 30,
  },

  // Rotation animation (FeatureCard, LinkedInButton)
  rotation: {
    MAX_SPEED: 1,
    ACCELERATION: 0.05,
    DECELERATION: 0.03,
  },

  // LinkedIn button specific
  linkedIn: {
    MAX_SPEED: 8,
    ACCELERATION: 0.4,
    DECELERATION: 0.15,
    FILL_TRIGGER_SPEED: 7,
  },

  // Waypoint animation (GridBlobCanvas)
  blob: {
    WAYPOINT_INTERVAL_MS: 2000,
    EASE_FACTOR: 0.02,
    MAX_WIDTH_RATIO: 0.4,
    MAX_HEIGHT_RATIO: 0.6,
  },
} as const

// =============================================================================
// BREAKPOINTS - Responsive design breakpoints
// =============================================================================

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const

// =============================================================================
// FOCUS STATES - Accessibility focus ring styles
// =============================================================================

export const FOCUS = {
  ring: {
    width: '2px',
    offset: '2px',
    color: COLORS.accent,
  },
  outline: {
    width: '2px',
    style: 'solid',
    color: COLORS.accent,
  },
} as const

// =============================================================================
// LAYOUT CONSTANTS
// =============================================================================

export const LAYOUT = {
  /** Header height in pixels - used for scroll offsets and positioning */
  HEADER_HEIGHT_PX: 82,
  /** Extra padding below header when scrolling to elements */
  SCROLL_OFFSET_PX: 16,
  /** Y position for header contrast sampling */
  HEADER_SAMPLE_Y: 50,
} as const

// =============================================================================
// COLOR CONSTANTS
// =============================================================================

export const COLOR_CONSTANTS = {
  /** Default cream background color (rgb) */
  DEFAULT_BG: 'rgb(251, 251, 243)',
  /** Assumed dark color for hero sections with images */
  ASSUMED_DARK: 'rgb(50, 50, 50)',
  /** Brightness threshold for determining dark vs light text */
  BRIGHTNESS_THRESHOLD: 128,
} as const

// =============================================================================
// Z-INDEX LAYERS - Stacking order system
// =============================================================================

export const Z_INDEX = {
  base: 0,
  below: -1,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  header: 50,
  modal: 100,
  popover: 110,
  tooltip: 150,
  notification: 200,
} as const
