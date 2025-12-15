/**
 * Design Tokens - Two-Tiered Color System
 *
 * TIER 1 (Primitives): Raw color values ONLY - hex values, no semantics
 * TIER 2 (Alias): Semantic tokens - references Tier 1, describes intent
 *
 * Components use ALIAS tokens directly. No component-specific tier needed.
 */

// =============================================================================
// TIER 1: BRAND COLORS (Primitives)
// Raw color values ONLY. No semantic meaning, no usage context.
// These are the single source of truth for all color values.
// =============================================================================

/** Abyss - Dark neutral scale */
export const ABYSS = {
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
} as const

/** Deep Current - Teal scale */
export const DEEP_CURRENT = {
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
} as const

/** Dusk Reef - Purple scale */
export const DUSK_REEF = {
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
} as const

/** Coral - Red scale */
export const CORAL = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  450: '#EF4444',    // Tailwind red-500 (circleRed - for badges, feature indicators)
  500: '#F70D1A',    // Ferrari red (brand accent)
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
} as const

/** Wave - Blue scale */
export const WAVE = {
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
} as const

/** Sunrise - Yellow scale */
export const SUNRISE = {
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
} as const

/** Orange scale - for aging/urgent indicators */
export const ORANGE = {
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
} as const

/** Harbor - Green scale */
export const HARBOR = {
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
} as const

/** Slate - Neutral gray scale */
export const SLATE = {
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
} as const

/** Base primitives - single color values */
export const PRIMITIVES = {
  white: '#FFFFFF',
  black: '#000000',
  cream: '#FBFBF3',
  linkedIn: '#0A66C2',
} as const

// =============================================================================
// TIER 2: ALIAS TOKENS (Semantic)
// What the color MEANS. References Tier 1 ONLY.
// No raw hex values allowed in this tier.
// =============================================================================

export const ALIAS = {
  // --- TEXT ---
  text: {
    primary: ABYSS[500],
    secondary: DUSK_REEF[500],
    tertiary: DUSK_REEF[400],
    emphasis: ABYSS[400], // Emphasized labels - lighter than primary but still dark
    disabled: DUSK_REEF[300],
    inverse: PRIMITIVES.white,
    link: DEEP_CURRENT[500],
    linkHover: DEEP_CURRENT[600],
    error: CORAL[500],
    success: HARBOR[600],
    warning: SUNRISE[600],
    info: WAVE[600],
  },

  // --- BACKGROUND ---
  background: {
    page: PRIMITIVES.cream,
    surface: PRIMITIVES.white,
    surfaceHover: ABYSS[50],
    surfaceActive: ABYSS[100],
    elevated: PRIMITIVES.white,
    muted: DUSK_REEF[50],
    inverse: ABYSS[500],
    inverseSubtle: ABYSS[700],
    accent: DEEP_CURRENT[50],
    accentSubtle: DEEP_CURRENT[100],
    accentStrong: DEEP_CURRENT[500],
    accentDark: DEEP_CURRENT[700],
    error: CORAL[50],
    errorSubtle: CORAL[100],
    success: HARBOR[50],
    successSubtle: HARBOR[100],
    warning: SUNRISE[50],
    warningSubtle: SUNRISE[100],
    info: WAVE[50],
    infoSubtle: WAVE[100],
  },

  // --- BORDER ---
  border: {
    default: SLATE[300],
    subtle: ABYSS[100],
    strong: ABYSS[300],
    focus: DEEP_CURRENT[500],
    error: CORAL[500],
    success: HARBOR[500],
    warning: SUNRISE[500],
    info: WAVE[500],
    disabled: ABYSS[200],
    accent: DEEP_CURRENT[500],
    inverse: ABYSS[700],
  },

  // --- ICON ---
  icon: {
    primary: ABYSS[500],
    secondary: DUSK_REEF[500],
    tertiary: DUSK_REEF[400],
    disabled: DUSK_REEF[300],
    inverse: PRIMITIVES.white,
    accent: DEEP_CURRENT[500],
    error: CORAL[500],
    success: HARBOR[500],
    warning: SUNRISE[500],
    info: WAVE[500],
  },

  // --- INTERACTIVE ---
  interactive: {
    primary: ABYSS[500],
    primaryHover: ABYSS[600],
    primaryActive: ABYSS[700],
    accent: DEEP_CURRENT[500],
    accentHover: DEEP_CURRENT[600],
    accentActive: DEEP_CURRENT[700],
    danger: CORAL[500],
    dangerHover: CORAL[600],
    dangerActive: CORAL[700],
    disabled: ABYSS[200],
    disabledText: ABYSS[300],
  },

  // --- STATUS ---
  status: {
    error: CORAL[500],
    errorLight: CORAL[50],
    errorMuted: CORAL[100],
    success: HARBOR[500],
    successLight: HARBOR[50],
    successMuted: HARBOR[100],
    warning: SUNRISE[500],
    warningLight: SUNRISE[50],
    warningMuted: SUNRISE[100],
    info: WAVE[500],
    infoLight: WAVE[50],
    infoMuted: WAVE[100],
  },

  // --- OVERLAY ---
  overlay: {
    light: 'rgba(251, 251, 243, 0.3)',
    medium: 'rgba(0, 0, 0, 0.3)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darkStrong: 'rgba(0, 0, 0, 0.8)',
    white15: 'rgba(255, 255, 255, 0.15)',
    white50: 'rgba(255, 255, 255, 0.5)',
    white60: 'rgba(255, 255, 255, 0.6)',
    subtle: 'rgba(229, 229, 229, 0.5)',
    tealGlass: 'rgba(0, 128, 128, 0.05)',
  },

  // --- GRADIENTS ---
  gradient: {
    subtle: `linear-gradient(0deg, ${DEEP_CURRENT[50]} 0%, ${PRIMITIVES.white} 100%)`,
  },

  // --- SHADOWS ---
  shadow: {
    sm: '0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)',
    header: '0px 2px 4px 5px rgba(0, 0, 0, 0.15)',
    footer: '0px -1px 3px rgba(0, 0, 0, 0.08)',
  },

  // --- GRID/CANVAS ---
  grid: {
    color: 'rgba(180, 180, 180, 0.4)',
  },

  // --- MASK GRADIENTS ---
  mask: {
    radialFade: (w: number, h: number, x: number, y: number) =>
      `radial-gradient(ellipse ${w}px ${h}px at ${x}% ${y}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)`,
  },

  // --- GLOW FILTERS ---
  glow: {
    electric: 'drop-shadow(0 0 2px cyan)',
    electricIntense: 'drop-shadow(0 0 3px cyan)',
  },

  // --- BRAND ACCENT (for brand-specific usage) ---
  brand: {
    primary: ABYSS[500],
    secondary: DEEP_CURRENT[500],
    tertiary: DUSK_REEF[500],
    accent: CORAL[500],
    neutral: PRIMITIVES.cream,
    linkedIn: PRIMITIVES.linkedIn,
  },

  // --- FEATURE INDICATORS (semantic colors for features) ---
  feature: {
    automate: WAVE[500],
    advice: CORAL[450],    // circleRed - used for badges, feature indicators
    adapt: SUNRISE[500],
    scale: HARBOR[500],
  },

  // --- AGING/URGENT (orange indicators) ---
  aging: {
    primary: ORANGE[500],
    dark: ORANGE[600],
    light: ORANGE[50],
  },

  // --- ANIMATION (particle effects, decorative elements) ---
  animation: {
    particleBlue: WAVE[600],      // Primary particle color
    particleBlueMed: WAVE[400],   // Medium particle color
    particleBlueLight: WAVE[300], // Light particle color
    particleBlueSubtle: WAVE[200], // Subtle particle color
  },

  // --- ELECTRIC EFFECT (input borders, interactive glow) ---
  electric: {
    cyan: '#00CED1',           // Dark turquoise for electric borders
    cyanBright: '#00FFFF',     // Bright cyan for glow
    cyanGlow: 'rgba(0, 206, 209, 0.6)',
    cyanGlowSubtle: 'rgba(0, 255, 255, 0.4)',
  },
} as const

// =============================================================================
// TAILWIND COLOR MAPPING
// Maps TIER 2 semantic aliases to Tailwind class names
// References TIER 2 ONLY - never Tier 1
// =============================================================================

export const COLORS = {
  // --- SEMANTIC NAMES (Tailwind classes) ---
  dark: ALIAS.brand.primary,           // bg-dark, text-dark
  teal: ALIAS.brand.secondary,         // bg-teal, text-teal
  tealLight: DEEP_CURRENT[300],        // bg-teal-light, text-teal-light - lighter teal for hero subtitles
  red: ALIAS.status.error,             // bg-red, text-red
  cream: ALIAS.background.page,        // bg-cream
  muted: ALIAS.text.secondary,         // text-muted

  // --- SEMANTIC ROLES ---
  primary: ALIAS.interactive.primary,  // bg-primary
  accent: ALIAS.interactive.accent,    // bg-accent
  background: ALIAS.background.page,   // bg-background
  surface: ALIAS.background.surface,   // bg-surface
  error: ALIAS.status.error,           // bg-error

  // --- TEXT COLORS ---
  text: {
    primary: ALIAS.text.primary,
    secondary: ALIAS.text.secondary,
    emphasis: ALIAS.text.emphasis,
    disabled: ALIAS.text.disabled,
    inverse: ALIAS.text.inverse,
  },

  // --- FEATURE COLORS ---
  feature: {
    blue: ALIAS.feature.automate,
    red: ALIAS.feature.advice,
    yellow: ALIAS.feature.adapt,
    green: ALIAS.feature.scale,
  },

  // --- CIRCLE COLORS (feature card shortcuts) ---
  circleBlue: ALIAS.feature.automate,
  circleRed: ALIAS.feature.advice,
  circleYellow: ALIAS.feature.adapt,
  circleGreen: ALIAS.feature.scale,

  // --- PURPLE SHADES ---
  darkPurple: ALIAS.text.secondary,
  lightPurple: ALIAS.background.muted,

  // --- UTILITY COLORS ---
  white: ALIAS.text.inverse,
  slate: ALIAS.border.default,
  linkedIn: PRIMITIVES.linkedIn,

  // --- TRANSPARENT/OVERLAY ---
  transparent: {
    glass: ALIAS.overlay.light,
    headerShadow: ALIAS.overlay.medium,
  },
} as const

// =============================================================================
// SHADOWS
// =============================================================================

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  /** Ambient shadow: hard close shadow + soft spread for realistic depth */
  ambient: '0 2px 4px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08)',
  image: '0 6px 12px -2px rgba(0,0,0,0.3), 0 20px 50px -8px rgba(0,0,0,0.2)',
  header: ALIAS.shadow.header,
  footer: ALIAS.shadow.footer,
  buttonDefault: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
} as const

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl'

// =============================================================================
// GRADIENTS
// =============================================================================

export const GRADIENTS = {
  heroOverlay: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.25) 100%)',
  heroOverlayStrong: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
  /** Product card background - white at top fading to light teal (DDS branded) */
  cardBg: `linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(230, 247, 250, 1) 14%, rgba(230, 247, 250, 1) 100%)`,
  /** Product card border - gradient stroke for depth effect (DDS branded) */
  cardBorder: `linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(204, 239, 245, 0.95) 11%, rgba(204, 239, 245, 0.95) 100%)`,
} as const

// =============================================================================
// GLASS EFFECT GRADIENTS
// =============================================================================

export const GLASS_GRADIENTS = {
  teal: `linear-gradient(
    0deg,
    ${DEEP_CURRENT[500]} 0%,
    ${DEEP_CURRENT[300]} 8%,
    ${DEEP_CURRENT[200]} 15%,
    transparent 25%,
    transparent 75%,
    ${DEEP_CURRENT[200]} 85%,
    ${DEEP_CURRENT[300]} 92%,
    ${DEEP_CURRENT[500]} 100%
  )`,
  tealGlow: `linear-gradient(
    0deg,
    rgba(8, 164, 189, 0.9) 0%,
    rgba(61, 189, 212, 0.7) 10%,
    transparent 25%,
    transparent 75%,
    rgba(61, 189, 212, 0.7) 90%,
    rgba(8, 164, 189, 0.9) 100%
  )`,
  white: `linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 5%,
    rgba(255, 255, 255, 1) 8%,
    transparent 12%,
    transparent 88%,
    rgba(255, 255, 255, 1) 92%,
    rgba(255, 255, 255, 0.8) 95%,
    rgba(255, 255, 255, 0.9) 100%
  )`,
  whiteGlow: `linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.3) 5%,
    transparent 12%,
    transparent 88%,
    rgba(255, 255, 255, 0.3) 95%,
    rgba(255, 255, 255, 0.5) 100%
  )`,
} as const

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const RADIUS = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const

// =============================================================================
// SPACING
// =============================================================================

export const SPACING = {
  sectionPaddingY: 'py-16 lg:py-24',
  sectionPaddingX: 'px-6 lg:px-10',
  containerMaxWidth: '1440px',
  heroFrameMaxWidth: '1440px',
  headerMaxWidth: '1440px',
  headerHeight: '82px',
  headingGap: 'mb-1',
  subheadingGap: 'mb-8',
  listItemGap: 'gap-4',
  sectionContentGap: 'gap-12 lg:gap-16',
} as const

// =============================================================================
// SIZES
// =============================================================================

export const SIZES = {
  containerMaxWidth: '1440px',
  heroFrameMaxWidth: '1440px',
  headerMaxWidth: '1440px',
  headerHeight: '82px',
  inputHeight: '40px',
  buttonHeight: '40px',
  textareaMinHeight: '120px',
} as const

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const TYPOGRAPHY = {
  fontFamily: {
    display: '"Pilat Extended", Arial, sans-serif',
    sans: '"Fixel", system-ui, sans-serif',
    mono: 'ui-monospace, monospace',
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
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
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
  // Tailwind class shortcuts
  display: 'font-display',
  sans: 'font-sans',
  h1: 'text-4xl md:text-6xl lg:text-7xl',
  h2: 'text-2xl lg:text-[32px]',
  subheading: 'text-base lg:text-lg',
  body: 'text-base',
  sectionHeading: 'text-2xl lg:text-[32px] font-display font-semibold leading-tight',
  sectionSubheading: 'text-base lg:text-lg font-display font-medium',
} as const

// =============================================================================
// BORDER WIDTH
// =============================================================================

export const BORDER_WIDTH = {
  0: '0px',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// =============================================================================
// TRANSITIONS
// =============================================================================

export const TRANSITIONS = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    smooth: '300ms',
    slow: '500ms',
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const

// =============================================================================
// ANIMATION
// =============================================================================

export const ANIMATION = {
  duration: {
    INSTANT: 0.1,
    FAST: 0.2,
    NORMAL: 0.3,
    SMOOTH: 0.4,
    SLOW: 0.5,
    SCROLL: 0.8,
    SCROLL_LONG: 1.4,
  },
  easing: {
    EASE_OUT: [0.4, 0, 0.1, 1] as const,
    EASE_IN_OUT: 'easeInOut' as const,
    SPRING_CAROUSEL: [0.32, 0.72, 0, 1] as const,
  },
  MENU_CLOSE_DELAY_MS: 350,
  particles: {
    SPAWN_THROTTLE_MS: 50,
    MAX_ACTIVE_PARTICLES: 30,
    SPAWN_PROBABILITY: 0.9,
    LIFETIME_MS: 3500,
    INITIAL_SPAWN_COUNT: 30,
  },
  rotation: {
    MAX_SPEED: 1,
    ACCELERATION: 0.05,
    DECELERATION: 0.03,
  },
  linkedIn: {
    MAX_SPEED: 8,
    ACCELERATION: 0.4,
    DECELERATION: 0.15,
    FILL_TRIGGER_SPEED: 7,
  },
  blob: {
    WAYPOINT_INTERVAL_MS: 2000,
    EASE_FACTOR: 0.02,
    MAX_WIDTH_RATIO: 0.4,
    MAX_HEIGHT_RATIO: 0.6,
  },
} as const

// =============================================================================
// Z-INDEX LAYERS
// =============================================================================

export const Z_INDEX = {
  background: 0,
  content: 1,
  dropdown: 10,
  sticky: 20,
  header: 50,
  modal: 100,
  tooltip: 150,
} as const

// =============================================================================
// TAILWIND CLASS COMPOSITIONS
// =============================================================================

export const CLASSES = {
  sectionContainer: 'max-w-[1440px] mx-auto px-6 lg:px-10',
  twoColumnLayout: 'flex flex-col lg:flex-row items-center gap-12 lg:gap-16',
  sectionImage: `w-full h-auto rounded-[${RADIUS.lg}] object-cover`,
  headingGroup: 'flex flex-col',
  glassEffect: 'backdrop-blur-[10px] bg-[rgba(251,251,243,0.3)]',
  buttonPrimary: `h-9 px-4 py-2 rounded-[${RADIUS.md}] text-sm font-medium bg-dark text-white hover:opacity-90 cursor-pointer`,
} as const

// =============================================================================
// LAYOUT CONSTANTS
// =============================================================================

export const LAYOUT = {
  HEADER_HEIGHT_PX: 82,
  SCROLL_OFFSET_PX: 16,
  HEADER_SAMPLE_Y: 50,
} as const

// =============================================================================
// COLOR CONSTANTS (for runtime calculations)
// =============================================================================

export const COLOR_CONSTANTS = {
  DEFAULT_BG: 'rgb(251, 251, 243)',
  ASSUMED_DARK: 'rgb(50, 50, 50)',
  BRIGHTNESS_THRESHOLD: 128,
} as const
