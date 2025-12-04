/**
 * Tailwind Class Helpers
 * Pre-composed Tailwind utility classes for common patterns
 * These are convenience helpers that use the design tokens via Tailwind utilities
 */

// =============================================================================
// LAYOUT PATTERNS
// =============================================================================

export const LAYOUT_CLASSES = {
  // Container with max width and padding
  container: 'max-w-container mx-auto px-6 lg:px-10',
  containerHero: 'max-w-hero mx-auto px-6 lg:px-10',
  containerHeader: 'max-w-header mx-auto px-6 lg:px-10',

  // Section spacing
  sectionPadding: 'py-16 lg:py-24',
  sectionPaddingTop: 'pt-16 lg:pt-24',
  sectionPaddingBottom: 'pb-16 lg:pb-24',

  // Flex layouts
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',

  // Two-column responsive layout
  twoColumn: 'flex flex-col lg:flex-row items-center gap-12 lg:gap-16',

  // Grid layouts
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
} as const

// =============================================================================
// TYPOGRAPHY PATTERNS
// =============================================================================

export const TEXT_CLASSES = {
  // Headings
  h1: 'text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight',
  h3: 'text-2xl lg:text-3xl font-display font-semibold leading-tight',
  h4: 'text-xl lg:text-2xl font-display font-semibold leading-snug',

  // Section headings (specific to design)
  sectionHeading: 'text-2xl lg:text-[32px] font-display font-semibold leading-tight',
  sectionSubheading: 'text-base lg:text-lg font-display font-medium',

  // Body text
  body: 'text-base font-sans leading-normal',
  bodyLarge: 'text-lg font-sans leading-relaxed',
  bodySmall: 'text-sm font-sans leading-normal',

  // Colors
  primary: 'text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-disabled',
  inverse: 'text-text-inverse',
} as const

// =============================================================================
// BUTTON PATTERNS
// =============================================================================

export const BUTTON_CLASSES = {
  // Base button
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',

  // Sizes
  sm: 'h-8 px-3 text-sm',
  md: 'h-button px-4 py-2 text-sm',
  lg: 'h-11 px-6 text-base',
  xl: 'h-12 px-8 text-lg',

  // Variants
  primary: 'bg-primary text-white hover:bg-dark-600 active:bg-dark-700',
  secondary: 'bg-accent text-white hover:bg-teal-600 active:bg-teal-700',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-primary hover:bg-dark-50',
  link: 'text-accent underline-offset-4 hover:underline',
} as const

// =============================================================================
// CARD PATTERNS
// =============================================================================

export const CARD_CLASSES = {
  base: 'rounded-lg bg-surface shadow-md',
  hover: 'transition-shadow hover:shadow-lg',
  bordered: 'border border-dark-200',
  padding: 'p-6',
  paddingLarge: 'p-8',
} as const

// =============================================================================
// INPUT PATTERNS
// =============================================================================

export const INPUT_CLASSES = {
  base: 'flex w-full rounded-md border border-dark-300 bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  height: 'h-input',
  error: 'border-error focus-visible:ring-error',
} as const

// =============================================================================
// IMAGE PATTERNS
// =============================================================================

export const IMAGE_CLASSES = {
  // Section image with shadow and rounded corners
  section: 'w-full h-auto rounded-lg object-cover shadow-image',

  // Responsive image
  responsive: 'w-full h-auto object-cover',

  // Avatar
  avatar: 'rounded-full object-cover',
} as const

// =============================================================================
// GLASSMORPHISM PATTERNS
// =============================================================================

export const GLASS_CLASSES = {
  // Header-specific glass effect (light blur + cream background)
  header: 'backdrop-blur-[10px] bg-cream/30 border-b border-teal shadow-header',

  // Surface variants matching design tokens
  light: 'backdrop-blur-[10px] bg-cream/30 border border-teal shadow-md',
  medium: 'backdrop-blur-[12px] bg-cream/50 border border-teal/30 shadow-lg',
  heavy: 'backdrop-blur-[16px] bg-cream/70 border border-teal/50 shadow-xl',
  dark: 'backdrop-blur-[16px] bg-dark/60 border border-teal/40 shadow-2xl',

  // Common patterns
  card: 'backdrop-blur-md bg-white/30 border border-white/50',
  modal: 'backdrop-blur-[12px] bg-cream/50 border border-teal/30 shadow-xl',
  overlay: 'backdrop-blur-[10px] bg-dark/40',
} as const

// =============================================================================
// GRID PATTERN BACKGROUNDS
// =============================================================================

export const GRID_CLASSES = {
  // Base container for grid backgrounds
  container: 'absolute inset-0 overflow-hidden pointer-events-none',

  // SVG wrapper
  svg: 'absolute inset-0 w-full h-full',

  // Grid pattern styles (use as data attributes or classes)
  // Note: Actual grid rendering uses SVG patterns in GridBlobCanvas component
  // These classes are for quick reference and documentation
  default: 'grid-pattern-default',    // 20px medium gray
  fine: 'grid-pattern-fine',          // 10px light gray
  large: 'grid-pattern-large',        // 40px light gray
  branded: 'grid-pattern-branded',    // 20px teal
} as const

// =============================================================================
// FOCUS STATES
// =============================================================================

export const FOCUS_CLASSES = {
  ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  outline: 'focus-visible:outline-2 focus-visible:outline-accent',
} as const

// =============================================================================
// TRANSITIONS
// =============================================================================

export const TRANSITION_CLASSES = {
  all: 'transition-all duration-normal ease-easeOut',
  colors: 'transition-colors duration-normal ease-easeOut',
  opacity: 'transition-opacity duration-fast ease-easeOut',
  transform: 'transition-transform duration-normal ease-easeOut',
  shadow: 'transition-shadow duration-normal ease-easeOut',
} as const

// =============================================================================
// UTILITY CLASSES
// =============================================================================

export const UTILITY_CLASSES = {
  // Screen reader only
  srOnly: 'sr-only',

  // Truncate text
  truncate: 'truncate',
  lineClamp2: 'line-clamp-2',
  lineClamp3: 'line-clamp-3',

  // Aspect ratios
  aspectSquare: 'aspect-square',
  aspectVideo: 'aspect-video',

  // Scrolling
  scrollSmooth: 'scroll-smooth',
  overflowHidden: 'overflow-hidden',
  overflowScroll: 'overflow-scroll',
} as const
