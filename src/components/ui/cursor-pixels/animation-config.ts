import { ALIAS } from '../../../constants/designTokens'

// Animation timing constants - named for semantic meaning
export const TIMING = {
  IDLE_TRIGGER_DELAY_MS: 600,
  FADE_DURATION: 0.4,
  ROTATION_RESET_DURATION: 0.3,
  EXCITED_DURATION_BASE: 0.25,
  EXCITED_DURATION_VARIANCE: 0.15,
  DISRUPT_TOTAL_DURATION: 0.5,
} as const

// Disrupt animation phase ratios (must sum to 1.0)
export const DISRUPT_PHASES = {
  EXPLODE: 0.22,  // First 22% - rapid expansion
  SETTLE: 0.28,   // Next 28% - decelerate and hold
  RETURN: 0.50,   // Final 50% - smooth return home
} as const

// Explosion parameters
export const EXPLOSION = {
  MIN_DISTANCE: 30,
  MAX_DISTANCE: 60,
  MIN_SCALE: 1.1,
  MAX_SCALE: 1.25,
  MAX_ROTATION_DEGREES: 90,
  SETTLE_BLEND_RATIO: 0.85, // 85% explode + 15% home during settle
} as const

// Idle floating animation parameters
export const IDLE = {
  X_RANGE_MIN: 6,
  X_RANGE_MAX: 12,
  Y_RANGE_MIN: 8,
  Y_RANGE_MAX: 14,
  DURATION_MIN: 2,
  DURATION_MAX: 3.5,
  STAGGER_DELAY: 0.1,
  MAX_ROTATION: 10,
} as const

// Excited state parameters
export const EXCITED = {
  SCALE_MIN: 1.08,
  SCALE_MAX: 1.16,
  MAX_ROTATION: 12,
} as const

// Repel explosion parameters (when hovering feature icons)
export const REPEL = {
  MIN_DISTANCE: 60,
  MAX_DISTANCE: 120,
  MAX_ROTATION: 120,
  FINAL_SCALE: 0.3,
  EXPLODE_DURATION: 0.35,
  FADE_IN_DURATION: 0.5,  // Slightly slower fade in for gentle return
  ANGLE_VARIANCE: 0.5,    // Radians of random variance from base angle
  STAGGER_MULTIPLIER: 2,  // Multiplier for pixel delay to create staggered return
  FOCUS_TRANSITION_DELAY_MS: 10,  // Delay to check if focus moved to another input
} as const

// Pixel configurations
export const PIXELS = [
  { id: 'red-1', width: 12, height: 12, rx: 2, color: ALIAS.status.error, delay: 0.02 },
  { id: 'red-2', width: 10, height: 10, rx: 2, color: ALIAS.status.error, delay: 0.06 },
  { id: 'red-3', width: 14, height: 14, rx: 3, color: ALIAS.status.error, delay: 0.10 },
  { id: 'dark-1', width: 8, height: 8, rx: 1.5, color: ALIAS.text.primary, delay: 0.04 },
  { id: 'dark-2', width: 6, height: 6, rx: 1, color: ALIAS.text.primary, delay: 0.08 },
  { id: 'dark-3', width: 6, height: 6, rx: 1, color: ALIAS.text.primary, delay: 0.12 },
  { id: 'dark-4', width: 7, height: 7, rx: 1.5, color: ALIAS.text.primary, delay: 0.14 },
] as const

// Offset positions relative to cursor
export const PIXEL_OFFSETS = [
  { x: 5, y: 28 },
  { x: -12, y: 38 },
  { x: 14, y: 45 },
  { x: -4, y: 55 },
  { x: 8, y: 65 },
  { x: -10, y: 75 },
  { x: 3, y: 85 },
] as const

// QuickTo duration formula
export const calculateQuickToDuration = (delay: number): number => 0.3 + delay * 2
