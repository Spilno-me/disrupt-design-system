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

/** Linen - Cool blue-white scale (based on softLinen) */
export const LINEN = {
  50: '#F5FCFF',   // Lightest - near white with blue tint
  100: '#EBF9FF',  // softLinen (original)
  200: '#D9F0FB',  // Subtle blue
  300: '#B8DCF0',  // Light blue-gray
  400: '#8CBDD8',  // Medium light
  500: '#6199B8',  // Base - muted blue
  600: '#4A7A96',  // Darker blue
  700: '#365B71',  // Dark blue-gray
  800: '#243D4D',  // Very dark
  900: '#132029',  // Near black with blue
} as const

/** Ivory - Warm white scale for depth layering (EHS-optimized) */
export const IVORY = {
  50: '#FFFEF9',   // Elevated/Card - warmest near-white
  100: '#FAF8F3',  // Surface - warm ivory
  200: '#F0EDE6',  // Page background - warm beige
  300: '#E5E2DB',  // Hover states
  400: '#D5D2CB',  // Active states
  500: '#B5B2AB',  // Muted elements
  600: '#8A877F',  // Secondary text on light
  700: '#5F5C54',  // Primary text on light
  800: '#3A3832',  // Dark accents
  900: '#1F1E1B',  // Near black with warmth
} as const

/** Base primitives - single color values */
export const PRIMITIVES = {
  white: '#FFFFFF',
  black: '#000000',
  cream: '#FBFBF3',
  // Depth layering primitives (Ivory family - warm whites)
  ivoryElevated: IVORY[50],   // #FFFEF9 - Card/elevated surfaces (lightest)
  ivorySurface: IVORY[100],   // #FAF8F3 - Content surfaces
  ivoryPage: IVORY[400],      // #D5D2CB - Page background (darkest of the three)
  // Legacy (kept for backwards compatibility)
  winterWhite: IVORY[400],    // Aliased to ivoryPage
  softLinen: IVORY[100],      // Aliased to ivorySurface
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
    page: PRIMITIVES.ivoryPage,       // #D5D2CB - Warm beige page background
    surface: PRIMITIVES.ivorySurface, // #FAF8F3 - Warm ivory surface (1 step lighter)
    surfaceHover: IVORY[300],         // #E5E2DB - Hover state
    surfaceActive: IVORY[400],        // #D5D2CB - Active/pressed state
    elevated: PRIMITIVES.ivoryElevated, // #FFFEF9 - Card/elevated (2 steps lighter)
    muted: DUSK_REEF[50],
    inverse: ABYSS[500],
    inverseSubtle: ABYSS[700],
    accent: DEEP_CURRENT[50],
    accentSubtle: DEEP_CURRENT[100],
    accentStrong: DEEP_CURRENT[500],
    accentDark: DEEP_CURRENT[600],
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
    accentDark: DEEP_CURRENT[600],
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
    light: 'rgba(250, 248, 243, 0.3)',   // Based on ivorySurface
    medium: 'rgba(0, 0, 0, 0.3)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darkStrong: 'rgba(0, 0, 0, 0.8)',
    white15: 'rgba(255, 255, 255, 0.15)',
    white50: 'rgba(255, 255, 255, 0.5)',
    white60: 'rgba(255, 255, 255, 0.6)',
    subtle: 'rgba(229, 226, 219, 0.5)',  // Based on IVORY[300]
    tealGlass: 'rgba(0, 128, 128, 0.05)',
    glass: 'rgba(250, 248, 243, 0.85)',  // Glass effect - ivorySurface based
    glassBorder: 'rgba(153, 153, 153, 0)', // Transparent end for glass borders
  },

  // --- GRADIENTS ---
  gradient: {
    subtle: `linear-gradient(0deg, ${DEEP_CURRENT[50]} 0%, ${PRIMITIVES.white} 100%)`,
    // QuickActionButton gradients (Figma node-id=687-8522)
    incident: {
      fill: `linear-gradient(180deg, ${CORAL[100]} 0%, ${CORAL[450]} 11%, ${CORAL[700]} 100%)`,
      border: `linear-gradient(180deg, ${PRIMITIVES.white} 0%, rgba(153, 153, 153, 0) 96%)`,
    },
    create: {
      fill: `linear-gradient(180deg, ${DEEP_CURRENT[100]} 0%, ${DEEP_CURRENT[500]} 11%, ${DEEP_CURRENT[700]} 100%)`,
      border: `linear-gradient(180deg, ${PRIMITIVES.white} 0%, rgba(153, 153, 153, 0) 96%)`,
    },
    emergency: {
      fill: `linear-gradient(180deg, ${ORANGE[100]} 0%, ${ORANGE[500]} 11%, ${ORANGE[700]} 100%)`,
      border: `linear-gradient(180deg, ${PRIMITIVES.white} 0%, rgba(153, 153, 153, 0) 96%)`,
    },
    capture: {
      fill: `linear-gradient(180deg, ${HARBOR[100]} 0%, ${HARBOR[500]} 11%, ${HARBOR[700]} 100%)`,
      border: `linear-gradient(180deg, ${PRIMITIVES.white} 0%, rgba(153, 153, 153, 0) 96%)`,
    },
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

  // --- WAVE PATTERN (header/footer animated waves) ---
  wave: {
    light: {
      start: DEEP_CURRENT[200],   // Light mode gradient start
      end: DEEP_CURRENT[400],     // Light mode gradient end
    },
    dark: {
      start: DEEP_CURRENT[300],   // Dark mode gradient start
      end: DEEP_CURRENT[500],     // Dark mode gradient end
    },
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
// DEPTH MODEL
// Semantic layer definitions for UI depth/elevation visualization
// Single source of truth for DepthLayeringModel.mdx and related documentation
// =============================================================================

/** Helper to get primitive name from color value - used for dynamic DEPTH_MODEL labels */
function getPrimitiveName(color: string): string {
  // Check LINEN scale first (softLinen = LINEN[100], so use scale notation for consistency)
  for (const [shade, hex] of Object.entries(LINEN)) {
    if (color === hex) return `LINEN[${shade}]`
  }
  // Check ABYSS scale for dark mode
  for (const [shade, hex] of Object.entries(ABYSS)) {
    if (color === hex) return `ABYSS[${shade}]`
  }
  // Fallback to primitive names
  if (color === PRIMITIVES.winterWhite) return 'winterWhite'
  if (color === PRIMITIVES.cream) return 'cream'
  if (color === PRIMITIVES.white) return 'white'
  return color
}

export const DEPTH_MODEL = {
  /** Layers ordered from closest to viewer (1) to furthest (5) */
  layers: [
    {
      depth: 1,
      name: 'elevated',
      displayName: 'Elevated',
      description: 'Modals, dropdowns, tooltips - closest to user',
      light: {
        token: 'background.elevated',
        color: ALIAS.background.elevated,
        label: getPrimitiveName(ALIAS.background.elevated),
      },
      dark: {
        token: 'ABYSS[400]',
        color: ABYSS[400],
        label: getPrimitiveName(ABYSS[400]),
      },
    },
    {
      depth: 2,
      name: 'card',
      displayName: 'Card',
      description: 'Cards, panels - floating content',
      light: {
        token: 'background.elevated',
        color: ALIAS.background.elevated,
        label: getPrimitiveName(ALIAS.background.elevated),
      },
      dark: {
        token: 'ABYSS[500]',
        color: ABYSS[500],
        label: getPrimitiveName(ABYSS[500]),
      },
    },
    {
      depth: 3,
      name: 'surface',
      displayName: 'Surface',
      description: 'Content areas, sidebars',
      light: {
        token: 'background.surface',
        color: ALIAS.background.surface,
        label: getPrimitiveName(ALIAS.background.surface),
      },
      dark: {
        token: 'ABYSS[700]',
        color: ABYSS[700],
        label: getPrimitiveName(ABYSS[700]),
      },
    },
    {
      depth: 4,
      name: 'surfaceHover',
      displayName: 'Surface Hover',
      description: 'Hover state for surfaces',
      light: {
        token: 'background.surfaceHover',
        color: ALIAS.background.surfaceHover,
        label: getPrimitiveName(ALIAS.background.surfaceHover),
      },
      dark: {
        token: 'ABYSS[600]',
        color: ABYSS[600],
        label: getPrimitiveName(ABYSS[600]),
      },
    },
    {
      depth: 5,
      name: 'page',
      displayName: 'Page',
      description: 'Page background - furthest from user',
      light: {
        token: 'background.page',
        color: ALIAS.background.page,
        label: getPrimitiveName(ALIAS.background.page),
      },
      dark: {
        token: 'ABYSS[900]',
        color: ABYSS[900],
        label: getPrimitiveName(ABYSS[900]),
      },
    },
  ],

  /** Key insight for documentation */
  insight: 'Elements closer to the viewer are always relatively lighter than elements further away, regardless of theme.',

  /** Depth formula explanation */
  formula: {
    light: 'Further from eye → Higher shade number → Darker',
    dark: 'Further from eye → Higher shade number → Darker',
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
  /** Elevated shadow: premium emphasis with richer opacity for featured elements */
  elevated: '0 2px 8px -1px rgba(0, 0, 0, 0.14), 0 6px 20px -4px rgba(0, 0, 0, 0.10)',
  /** Ambient shadow: hard close shadow + soft spread for realistic depth */
  ambient: '0 2px 4px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08)',
  image: '0 6px 12px -2px rgba(0,0,0,0.3), 0 20px 50px -8px rgba(0,0,0,0.2)',
  header: ALIAS.shadow.header,
  footer: ALIAS.shadow.footer,
  buttonDefault: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
} as const

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'elevated'

// =============================================================================
// HIGHLIGHTS (Top-edge light reflections)
// =============================================================================

/**
 * Highlights simulate light reflecting off the top edge of elevated surfaces.
 * Where there's shadow (below), there's highlight (above) - basic physics.
 */
export const HIGHLIGHTS = {
  /** No highlight effect */
  none: 'none',
  /** Top-edge light reflection for dark surfaces */
  edge: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.16)',
} as const

export type HighlightLevel = keyof typeof HIGHLIGHTS

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
  red: `linear-gradient(
    0deg,
    ${CORAL[500]} 0%,
    ${CORAL[400]} 8%,
    ${CORAL[300]} 15%,
    transparent 25%,
    transparent 75%,
    ${CORAL[300]} 85%,
    ${CORAL[400]} 92%,
    ${CORAL[500]} 100%
  )`,
  redGlow: `linear-gradient(
    0deg,
    rgba(247, 13, 26, 1) 0%,
    rgba(252, 165, 165, 0.9) 10%,
    transparent 25%,
    transparent 75%,
    rgba(252, 165, 165, 0.9) 90%,
    rgba(247, 13, 26, 1) 100%
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
  /** Pixel values for inline styles (3D visualizations, overlays, MDX docs) */
  px: {
    // Base scale (4px increments)
    micro: '4px',
    tight: '8px',
    base: '12px',
    comfortable: '16px',
    spacious: '24px',
    section: '48px',
    page: '96px',
    // Semantic aliases for MDX documentation
    sectionHeadingTop: '48px',
    sectionHeadingBottom: '16px',
    // Card system
    cardPadding: '20px',
    cardGap: '16px',
    cardGapCompact: '12px',
    gridGap: '16px',
  },
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
    mono: '"JetBrains Mono", ui-monospace, monospace',
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
// MOTION TOKENS (Inspired by Vibe Design System)
// Two categories: Productive (functional) and Expressive (delightful)
// =============================================================================

/**
 * Motion duration tokens - semantic timing for animations
 * - Productive: Quick, functional interactions (70-150ms)
 * - Expressive: Emphasizing, delightful animations (250-400ms)
 */
export const MOTION_DURATION = {
  // Productive - fast, functional animations
  productiveShort: '70ms',    // Micro-interactions, hover states
  productiveMedium: '100ms',  // Toggles, checkboxes, small buttons
  productiveLong: '150ms',    // Small transitions, tooltips appearing

  // Expressive - longer, emphasizing animations
  expressiveShort: '250ms',   // Cards, modals, medium elements
  expressiveLong: '400ms',    // Page transitions, hero animations

  // Legacy aliases (for backwards compatibility)
  fast: '150ms',
  normal: '250ms',
  smooth: '300ms',
  slow: '400ms',
} as const

/**
 * Motion easing tokens - cubic-bezier curves for different purposes
 * - Enter: Elements appearing (ease-out style)
 * - Exit: Elements leaving (ease-in style)
 * - Transition: State changes on screen
 * - Emphasize: Attention-grabbing with subtle overshoot
 */
export const MOTION_EASING = {
  // Semantic easing curves
  enter: 'cubic-bezier(0, 0, 0.35, 1)',        // Elements appearing - fast start, slow end
  exit: 'cubic-bezier(0.4, 0, 1, 1)',          // Elements leaving - slow start, fast end
  transition: 'cubic-bezier(0.4, 0, 0.2, 1)',  // On-screen state changes
  emphasize: 'cubic-bezier(0, 0, 0.2, 1.4)',   // Attention/bounce (subtle overshoot)

  // Framer Motion compatible arrays
  enterArray: [0, 0, 0.35, 1] as const,
  exitArray: [0.4, 0, 1, 1] as const,
  transitionArray: [0.4, 0, 0.2, 1] as const,
  emphasizeArray: [0, 0, 0.2, 1.4] as const,

  // Legacy/generic (for backwards compatibility)
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const

/**
 * Motion delay tokens - stagger and sequence timing
 */
export const MOTION_DELAY = {
  none: '0ms',
  short: '50ms',    // Quick stagger between items
  normal: '100ms',  // Standard delay
  long: '200ms',    // Pronounced stagger
} as const

/**
 * Combined MOTION export - unified motion token system
 */
export const MOTION = {
  duration: MOTION_DURATION,
  easing: MOTION_EASING,
  delay: MOTION_DELAY,

  // CSS variable references (for use in Tailwind/CSS)
  cssVars: {
    duration: {
      productiveShort: 'var(--motion-duration-productive-short)',
      productiveMedium: 'var(--motion-duration-productive-medium)',
      productiveLong: 'var(--motion-duration-productive-long)',
      expressiveShort: 'var(--motion-duration-expressive-short)',
      expressiveLong: 'var(--motion-duration-expressive-long)',
    },
    easing: {
      enter: 'var(--motion-easing-enter)',
      exit: 'var(--motion-easing-exit)',
      transition: 'var(--motion-easing-transition)',
      emphasize: 'var(--motion-easing-emphasize)',
    },
    delay: {
      short: 'var(--motion-delay-short)',
      normal: 'var(--motion-delay-normal)',
      long: 'var(--motion-delay-long)',
    },
  },
} as const

// =============================================================================
// MOTION KEYFRAMES (Pre-built animation patterns)
// Absorbed from Vibe Design System - ready-to-use keyframe animations
// =============================================================================

/**
 * Pre-built keyframe animations for common UI patterns
 * Usage: Apply these as CSS @keyframes or use the cssString in style tags
 */
export const MOTION_KEYFRAMES = {
  // --- POP ANIMATIONS (Scale-based entries) ---

  /** Simple pop-in: scale 0.8 → 1 with fade */
  popIn: {
    name: 'dds-pop-in',
    keyframes: {
      '0%': { transform: 'scale(0.8)', opacity: '0' },
      '70%': { opacity: '1' },
      '100%': { transform: 'scale(1)' },
    },
    cssString: `@keyframes dds-pop-in {
  0% { transform: scale(0.8); opacity: 0; }
  70% { opacity: 1; }
  100% { transform: scale(1); }
}`,
  },

  /** Pop-out: reverse of pop-in */
  popOut: {
    name: 'dds-pop-out',
    keyframes: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '30%': { opacity: '1' },
      '100%': { transform: 'scale(0.8)', opacity: '0' },
    },
    cssString: `@keyframes dds-pop-out {
  0% { transform: scale(1); opacity: 1; }
  30% { opacity: 1; }
  100% { transform: scale(0.8); opacity: 0; }
}`,
  },

  /** Elastic pop: bouncy overshoot 1.1 → 0.95 → 1.05 → 1 */
  popElastic: {
    name: 'dds-pop-elastic',
    keyframes: {
      '0%': { transform: 'scale(0.8)', opacity: '0' },
      '40%': { transform: 'scale(1.1)', opacity: '1' },
      '65%': { transform: 'scale(0.95)' },
      '85%': { transform: 'scale(1.05)' },
      '100%': { transform: 'scale(1)' },
    },
    cssString: `@keyframes dds-pop-elastic {
  0% { transform: scale(0.8); opacity: 0; }
  40% { transform: scale(1.1); opacity: 1; }
  65% { transform: scale(0.95); }
  85% { transform: scale(1.05); }
  100% { transform: scale(1); }
}`,
  },

  /** Bold elastic: more pronounced bounce */
  popElasticBold: {
    name: 'dds-pop-elastic-bold',
    keyframes: {
      '0%': { transform: 'scale(0.6)', opacity: '0' },
      '35%': { transform: 'scale(1.15)', opacity: '1' },
      '55%': { transform: 'scale(0.9)' },
      '75%': { transform: 'scale(1.08)' },
      '90%': { transform: 'scale(0.98)' },
      '100%': { transform: 'scale(1)' },
    },
    cssString: `@keyframes dds-pop-elastic-bold {
  0% { transform: scale(0.6); opacity: 0; }
  35% { transform: scale(1.15); opacity: 1; }
  55% { transform: scale(0.9); }
  75% { transform: scale(1.08); }
  90% { transform: scale(0.98); }
  100% { transform: scale(1); }
}`,
  },

  // --- SLIDE ANIMATIONS (Position-based entries) ---

  /** Slide in from bottom */
  slideInUp: {
    name: 'dds-slide-in-up',
    keyframes: {
      '0%': { transform: 'translateY(16px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    cssString: `@keyframes dds-slide-in-up {
  0% { transform: translateY(16px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}`,
  },

  /** Slide in from top */
  slideInDown: {
    name: 'dds-slide-in-down',
    keyframes: {
      '0%': { transform: 'translateY(-16px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    cssString: `@keyframes dds-slide-in-down {
  0% { transform: translateY(-16px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}`,
  },

  /** Slide in from left */
  slideInLeft: {
    name: 'dds-slide-in-left',
    keyframes: {
      '0%': { transform: 'translateX(-16px)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    cssString: `@keyframes dds-slide-in-left {
  0% { transform: translateX(-16px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}`,
  },

  /** Slide in from right */
  slideInRight: {
    name: 'dds-slide-in-right',
    keyframes: {
      '0%': { transform: 'translateX(16px)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    cssString: `@keyframes dds-slide-in-right {
  0% { transform: translateX(16px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}`,
  },

  /** Slide out to bottom */
  slideOutDown: {
    name: 'dds-slide-out-down',
    keyframes: {
      '0%': { transform: 'translateY(0)', opacity: '1' },
      '100%': { transform: 'translateY(16px)', opacity: '0' },
    },
    cssString: `@keyframes dds-slide-out-down {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(16px); opacity: 0; }
}`,
  },

  /** Slide out to top */
  slideOutUp: {
    name: 'dds-slide-out-up',
    keyframes: {
      '0%': { transform: 'translateY(0)', opacity: '1' },
      '100%': { transform: 'translateY(-16px)', opacity: '0' },
    },
    cssString: `@keyframes dds-slide-out-up {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-16px); opacity: 0; }
}`,
  },

  /** Elastic slide in from bottom */
  slideInUpElastic: {
    name: 'dds-slide-in-up-elastic',
    keyframes: {
      '0%': { transform: 'translateY(24px)', opacity: '0' },
      '50%': { transform: 'translateY(-4px)', opacity: '1' },
      '75%': { transform: 'translateY(2px)' },
      '100%': { transform: 'translateY(0)' },
    },
    cssString: `@keyframes dds-slide-in-up-elastic {
  0% { transform: translateY(24px); opacity: 0; }
  50% { transform: translateY(-4px); opacity: 1; }
  75% { transform: translateY(2px); }
  100% { transform: translateY(0); }
}`,
  },

  // --- SPIN ANIMATIONS (Rotation-based) ---

  /** Spin in with emphasis - rotation + scale */
  spinIn: {
    name: 'dds-spin-in',
    keyframes: {
      '0%': { transform: 'rotate(-180deg) scale(0)', opacity: '0' },
      '60%': { transform: 'rotate(15deg) scale(1.1)', opacity: '1' },
      '100%': { transform: 'rotate(0) scale(1)' },
    },
    cssString: `@keyframes dds-spin-in {
  0% { transform: rotate(-180deg) scale(0); opacity: 0; }
  60% { transform: rotate(15deg) scale(1.1); opacity: 1; }
  100% { transform: rotate(0) scale(1); }
}`,
  },

  /** Continuous spin - loading indicators */
  spin: {
    name: 'dds-spin',
    keyframes: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    cssString: `@keyframes dds-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
  },

  // --- FADE ANIMATIONS (Opacity-based) ---

  /** Simple fade in */
  fadeIn: {
    name: 'dds-fade-in',
    keyframes: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    cssString: `@keyframes dds-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}`,
  },

  /** Simple fade out */
  fadeOut: {
    name: 'dds-fade-out',
    keyframes: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    cssString: `@keyframes dds-fade-out {
  0% { opacity: 1; }
  100% { opacity: 0; }
}`,
  },

  // --- ATTENTION/EMPHASIS ANIMATIONS ---

  /** Pulse - gentle scale pulse for attention */
  pulse: {
    name: 'dds-pulse',
    keyframes: {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
      '100%': { transform: 'scale(1)' },
    },
    cssString: `@keyframes dds-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}`,
  },

  /** Shake - horizontal shake for errors */
  shake: {
    name: 'dds-shake',
    keyframes: {
      '0%, 100%': { transform: 'translateX(0)' },
      '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
      '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
    },
    cssString: `@keyframes dds-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}`,
  },

  /** Bounce - vertical bounce for attention */
  bounce: {
    name: 'dds-bounce',
    keyframes: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-8px)' },
    },
    cssString: `@keyframes dds-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}`,
  },

  /** Wiggle - subtle rotation for playful attention */
  wiggle: {
    name: 'dds-wiggle',
    keyframes: {
      '0%, 100%': { transform: 'rotate(0deg)' },
      '25%': { transform: 'rotate(-3deg)' },
      '75%': { transform: 'rotate(3deg)' },
    },
    cssString: `@keyframes dds-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}`,
  },
} as const

/**
 * CSS string containing all keyframe definitions
 * Inject this into a <style> tag or CSS file to make all animations available
 */
export const MOTION_KEYFRAMES_CSS = Object.values(MOTION_KEYFRAMES)
  .map(k => k.cssString)
  .join('\n\n')

// Legacy TRANSITIONS export (deprecated - use MOTION instead)
/** @deprecated Use MOTION.duration and MOTION.easing instead */
export const TRANSITIONS = {
  duration: MOTION_DURATION,
  timing: {
    ease: MOTION_EASING.ease,
    easeIn: MOTION_EASING.easeIn,
    easeOut: MOTION_EASING.easeOut,
    easeInOut: MOTION_EASING.easeInOut,
  },
} as const

// =============================================================================
// ANIMATION (Component-specific animation settings)
// =============================================================================

export const ANIMATION = {
  // Framer Motion durations (in seconds)
  duration: {
    INSTANT: 0.07,   // Maps to productiveShort
    FAST: 0.1,       // Maps to productiveMedium
    NORMAL: 0.15,    // Maps to productiveLong
    SMOOTH: 0.25,    // Maps to expressiveShort
    SLOW: 0.4,       // Maps to expressiveLong
    SCROLL: 0.8,
    SCROLL_LONG: 1.4,
  },
  easing: {
    ENTER: MOTION_EASING.enterArray,
    EXIT: MOTION_EASING.exitArray,
    TRANSITION: MOTION_EASING.transitionArray,
    EMPHASIZE: MOTION_EASING.emphasizeArray,
    // Legacy
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
  DEFAULT_BG: 'rgb(250, 248, 243)',  // ivorySurface
  ASSUMED_DARK: 'rgb(50, 50, 50)',
  BRIGHTNESS_THRESHOLD: 128,
} as const
