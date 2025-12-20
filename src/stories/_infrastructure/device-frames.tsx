/**
 * Device Frames for Story Presentations
 *
 * Realistic device frames for showcasing mobile components in Storybook.
 * These provide proper context for mobile-first component development.
 *
 * Features:
 * - All iPhone models from Storybook viewport presets
 * - iPad/tablet support
 * - Automatic viewport detection via useDeviceFromViewport hook
 * - Accurate device specifications (dimensions, corner radius, safe areas)
 *
 * @example
 * import { IPhoneFrame, useDeviceFromViewport } from '@/stories/_infrastructure'
 *
 * // Auto-detect from Storybook viewport
 * const { model, deviceType } = useDeviceFromViewport()
 * <IPhoneFrame model={model}>
 *   <YourMobileComponent />
 * </IPhoneFrame>
 *
 * // Or use specific model
 * <IPhoneFrame model="iphone14promax">
 *   <YourMobileComponent />
 * </IPhoneFrame>
 */

import * as React from 'react'

// =============================================================================
// IPHONE DEVICE SPECIFICATIONS
// =============================================================================

/**
 * iPhone model specifications (in design points)
 * Matches Storybook INITIAL_VIEWPORTS for seamless integration
 * Based on Apple's Human Interface Guidelines
 */
export const IPHONE_SPECS = {
  // ---------------------------------------------------------------------------
  // Legacy / Compact Models
  // ---------------------------------------------------------------------------
  /** iPhone 5/5s/5c/SE 1st gen - smallest */
  iphone5: {
    name: 'iPhone 5',
    width: 320,
    height: 568,
    cornerRadius: 0,
    safeAreaTop: 20,
    safeAreaBottom: 0,
    hasDynamicIsland: false,
    hasNotch: false,
  },
  /** iPhone 6/6s/7/8/SE 2nd & 3rd gen - compact */
  iphone6: {
    name: 'iPhone 6/7/8/SE',
    width: 375,
    height: 667,
    cornerRadius: 0,
    safeAreaTop: 20,
    safeAreaBottom: 0,
    hasDynamicIsland: false,
    hasNotch: false,
  },
  /** iPhone 6+/6s+/7+/8+ - large compact */
  iphone6plus: {
    name: 'iPhone 6+/7+/8+',
    width: 414,
    height: 736,
    cornerRadius: 0,
    safeAreaTop: 20,
    safeAreaBottom: 0,
    hasDynamicIsland: false,
    hasNotch: false,
  },

  // ---------------------------------------------------------------------------
  // Notch Era (iPhone X - 11 series)
  // ---------------------------------------------------------------------------
  /** iPhone X/XS/11 Pro - notch era */
  iphonex: {
    name: 'iPhone X/XS/11 Pro',
    width: 375,
    height: 812,
    cornerRadius: 39,
    safeAreaTop: 44,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },
  /** iPhone XR/11 - notch, slightly larger */
  iphonexr: {
    name: 'iPhone XR/11',
    width: 414,
    height: 896,
    cornerRadius: 41,
    safeAreaTop: 44,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },
  /** iPhone XS Max/11 Pro Max - notch, largest */
  iphonexsmax: {
    name: 'iPhone XS Max/11 Pro Max',
    width: 414,
    height: 896,
    cornerRadius: 39,
    safeAreaTop: 44,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },

  // ---------------------------------------------------------------------------
  // iPhone 12 Series
  // ---------------------------------------------------------------------------
  /** iPhone 12 mini - compact notch */
  iphone12mini: {
    name: 'iPhone 12 mini',
    width: 375,
    height: 812,
    cornerRadius: 44,
    safeAreaTop: 50,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },
  /** iPhone 12/12 Pro - standard notch */
  iphone12: {
    name: 'iPhone 12/12 Pro',
    width: 390,
    height: 844,
    cornerRadius: 47,
    safeAreaTop: 47,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },
  /** iPhone 12 Pro Max - large notch */
  iphone12promax: {
    name: 'iPhone 12 Pro Max',
    width: 428,
    height: 926,
    cornerRadius: 53,
    safeAreaTop: 47,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },

  // ---------------------------------------------------------------------------
  // iPhone 13 Series (same dimensions as 12)
  // ---------------------------------------------------------------------------
  /** iPhone 13 mini */
  iphone13mini: {
    name: 'iPhone 13 mini',
    width: 375,
    height: 812,
    cornerRadius: 44,
    safeAreaTop: 50,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },
  /** iPhone 13/13 Pro */
  iphone13: {
    name: 'iPhone 13/13 Pro',
    width: 390,
    height: 844,
    cornerRadius: 47,
    safeAreaTop: 47,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },
  /** iPhone 13 Pro Max */
  iphone13promax: {
    name: 'iPhone 13 Pro Max',
    width: 428,
    height: 926,
    cornerRadius: 53,
    safeAreaTop: 47,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },

  // ---------------------------------------------------------------------------
  // iPhone 14 Series (Dynamic Island introduced on Pro)
  // ---------------------------------------------------------------------------
  /** iPhone 14/14 Plus - notch (non-Pro) */
  iphone14: {
    name: 'iPhone 14',
    width: 390,
    height: 844,
    cornerRadius: 47,
    safeAreaTop: 47,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },
  /** iPhone 14 Plus */
  iphone14plus: {
    name: 'iPhone 14 Plus',
    width: 428,
    height: 926,
    cornerRadius: 53,
    safeAreaTop: 47,
    safeAreaBottom: 34,
    hasDynamicIsland: false,
    hasNotch: true,
  },
  /** iPhone 14 Pro - Dynamic Island */
  iphone14pro: {
    name: 'iPhone 14 Pro',
    width: 393,
    height: 852,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },
  /** iPhone 14 Pro Max - Dynamic Island */
  iphone14promax: {
    name: 'iPhone 14 Pro Max',
    width: 430,
    height: 932,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },

  // ---------------------------------------------------------------------------
  // iPhone 15/16/17 Series (All have Dynamic Island)
  // ---------------------------------------------------------------------------
  /** iPhone 15/16 - standard Dynamic Island */
  iphone15: {
    name: 'iPhone 15/16',
    width: 393,
    height: 852,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },
  /** iPhone 15/16 Plus */
  iphone15plus: {
    name: 'iPhone 15/16 Plus',
    width: 430,
    height: 932,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },
  /** iPhone 15 Pro */
  iphone15pro: {
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },
  /** iPhone 15 Pro Max */
  iphone15promax: {
    name: 'iPhone 15 Pro Max',
    width: 430,
    height: 932,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },

  // ---------------------------------------------------------------------------
  // iPhone 16 Series (2024)
  // ---------------------------------------------------------------------------
  /** iPhone 16 */
  iphone16: {
    name: 'iPhone 16',
    width: 393,
    height: 852,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },
  /** iPhone 16 Plus */
  iphone16plus: {
    name: 'iPhone 16 Plus',
    width: 430,
    height: 932,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },
  /** iPhone 16 Pro - larger display than 15 Pro */
  iphone16pro: {
    name: 'iPhone 16 Pro',
    width: 402,
    height: 874,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },
  /** iPhone 16 Pro Max - largest display */
  iphone16promax: {
    name: 'iPhone 16 Pro Max',
    width: 440,
    height: 956,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },

  // ---------------------------------------------------------------------------
  // iPhone 17 Series (2025)
  // ---------------------------------------------------------------------------
  /** iPhone 17 Pro Max */
  iphone17promax: {
    name: 'iPhone 17 Pro Max',
    width: 440,
    height: 956,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },

  // ---------------------------------------------------------------------------
  // Aliases for backward compatibility
  // ---------------------------------------------------------------------------
  /** @deprecated Use iphone6 instead */
  se: {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    cornerRadius: 0,
    safeAreaTop: 20,
    safeAreaBottom: 0,
    hasDynamicIsland: false,
    hasNotch: false,
  },
  /** @deprecated Use iphone15 instead */
  standard: {
    name: 'iPhone 15',
    width: 393,
    height: 852,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },
  /** @deprecated Use iphone15pro instead */
  pro: {
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },
  /** @deprecated Use iphone15promax instead */
  proMax: {
    name: 'iPhone 17 Pro Max',
    width: 430,
    height: 932,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasDynamicIsland: true,
    hasNotch: false,
  },
} as const

export type IPhoneModel = keyof typeof IPHONE_SPECS

// =============================================================================
// IPAD DEVICE SPECIFICATIONS
// =============================================================================

/**
 * iPad model specifications (in design points)
 * Matches Storybook INITIAL_VIEWPORTS for seamless integration
 */
export const IPAD_SPECS = {
  /** iPad (standard) - 10.2" */
  ipad: {
    name: 'iPad',
    width: 768,
    height: 1024,
    cornerRadius: 18,
    safeAreaTop: 20,
    safeAreaBottom: 20,
    hasHomeButton: true,
  },
  /** iPad Air / iPad 10th gen - 10.9" */
  ipadAir: {
    name: 'iPad Air',
    width: 820,
    height: 1180,
    cornerRadius: 18,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    hasHomeButton: false,
  },
  /** iPad Pro 11" */
  ipadPro11: {
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    cornerRadius: 18,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    hasHomeButton: false,
  },
  /** iPad Pro 12.9" */
  ipadPro12: {
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    cornerRadius: 18,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    hasHomeButton: false,
  },
  /** iPad Mini */
  ipadMini: {
    name: 'iPad Mini',
    width: 744,
    height: 1133,
    cornerRadius: 18,
    safeAreaTop: 24,
    safeAreaBottom: 20,
    hasHomeButton: false,
  },
} as const

export type IPadModel = keyof typeof IPAD_SPECS

// =============================================================================
// VIEWPORT DETECTION
// =============================================================================

/**
 * Maps Storybook viewport names to device models
 */
const VIEWPORT_TO_DEVICE: Record<string, { type: 'iphone' | 'ipad'; model: IPhoneModel | IPadModel }> = {
  // iPhone viewports (Storybook INITIAL_VIEWPORTS)
  iphone5: { type: 'iphone', model: 'iphone5' },
  iphone6: { type: 'iphone', model: 'iphone6' },
  iphone6p: { type: 'iphone', model: 'iphone6plus' },
  iphone8p: { type: 'iphone', model: 'iphone6plus' },
  iphonex: { type: 'iphone', model: 'iphonex' },
  iphonexr: { type: 'iphone', model: 'iphonexr' },
  iphonexsmax: { type: 'iphone', model: 'iphonexsmax' },
  iphonese2: { type: 'iphone', model: 'iphone6' },
  iphone12mini: { type: 'iphone', model: 'iphone12mini' },
  iphone12: { type: 'iphone', model: 'iphone12' },
  iphone12promax: { type: 'iphone', model: 'iphone12promax' },
  iphone14: { type: 'iphone', model: 'iphone14' },
  iphone14promax: { type: 'iphone', model: 'iphone14promax' },
  // iPad viewports
  ipad: { type: 'ipad', model: 'ipad' },
  ipad10p: { type: 'ipad', model: 'ipadAir' },
  ipad12p: { type: 'ipad', model: 'ipadPro12' },
}

/**
 * Finds the closest device model based on viewport dimensions
 */
function findClosestDevice(width: number, height: number): { type: 'iphone' | 'ipad'; model: IPhoneModel | IPadModel } {
  // iPad threshold: width >= 700px in portrait
  const isTablet = Math.min(width, height) >= 700

  if (isTablet) {
    // Find closest iPad
    let closest: IPadModel = 'ipad'
    let minDiff = Infinity

    for (const [model, specs] of Object.entries(IPAD_SPECS)) {
      const diff = Math.abs(specs.width - width) + Math.abs(specs.height - height)
      if (diff < minDiff) {
        minDiff = diff
        closest = model as IPadModel
      }
    }
    return { type: 'ipad', model: closest }
  }

  // Find closest iPhone
  let closest: IPhoneModel = 'iphone15promax'
  let minDiff = Infinity

  for (const [model, specs] of Object.entries(IPHONE_SPECS)) {
    // Skip deprecated aliases
    if (['se', 'standard', 'pro', 'proMax'].includes(model)) continue

    const diff = Math.abs(specs.width - width) + Math.abs(specs.height - height)
    if (diff < minDiff) {
      minDiff = diff
      closest = model as IPhoneModel
    }
  }

  return { type: 'iphone', model: closest }
}

export interface DeviceDetectionResult {
  /** Device type: 'iphone' or 'ipad' */
  deviceType: 'iphone' | 'ipad'
  /** Detected iPhone model (if iPhone) */
  iphoneModel: IPhoneModel | null
  /** Detected iPad model (if iPad) */
  ipadModel: IPadModel | null
  /** Current viewport width */
  viewportWidth: number
  /** Current viewport height */
  viewportHeight: number
  /** Whether viewport was detected from Storybook or window size */
  source: 'storybook' | 'window'
}

/**
 * Hook to detect device model from current viewport
 *
 * Uses either:
 * 1. Storybook viewport parameter (if detected)
 * 2. Window dimensions as fallback
 *
 * @example
 * ```tsx
 * const { deviceType, iphoneModel, ipadModel } = useDeviceFromViewport()
 *
 * if (deviceType === 'iphone' && iphoneModel) {
 *   return <IPhoneFrame model={iphoneModel}>{children}</IPhoneFrame>
 * }
 * if (deviceType === 'ipad' && ipadModel) {
 *   return <IPadFrame model={ipadModel}>{children}</IPadFrame>
 * }
 * ```
 */
export function useDeviceFromViewport(): DeviceDetectionResult {
  const [result, setResult] = React.useState<DeviceDetectionResult>(() => ({
    deviceType: 'iphone',
    iphoneModel: 'iphone15promax',
    ipadModel: null,
    viewportWidth: 430,
    viewportHeight: 932,
    source: 'window',
  }))

  React.useEffect(() => {
    const detectDevice = () => {
      // Try to get Storybook viewport from URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const viewportId = urlParams.get('globals')?.match(/viewport:([^;]+)/)?.[1]

      if (viewportId && VIEWPORT_TO_DEVICE[viewportId]) {
        const device = VIEWPORT_TO_DEVICE[viewportId]
        const specs = device.type === 'iphone'
          ? IPHONE_SPECS[device.model as IPhoneModel]
          : IPAD_SPECS[device.model as IPadModel]

        setResult({
          deviceType: device.type,
          iphoneModel: device.type === 'iphone' ? device.model as IPhoneModel : null,
          ipadModel: device.type === 'ipad' ? device.model as IPadModel : null,
          viewportWidth: specs.width,
          viewportHeight: specs.height,
          source: 'storybook',
        })
        return
      }

      // Fallback to window dimensions
      const width = window.innerWidth
      const height = window.innerHeight
      const device = findClosestDevice(width, height)
      const specs = device.type === 'iphone'
        ? IPHONE_SPECS[device.model as IPhoneModel]
        : IPAD_SPECS[device.model as IPadModel]

      setResult({
        deviceType: device.type,
        iphoneModel: device.type === 'iphone' ? device.model as IPhoneModel : null,
        ipadModel: device.type === 'ipad' ? device.model as IPadModel : null,
        viewportWidth: specs.width,
        viewportHeight: specs.height,
        source: 'window',
      })
    }

    detectDevice()
    window.addEventListener('resize', detectDevice)

    // Also listen for Storybook navigation changes
    const observer = new MutationObserver(detectDevice)
    observer.observe(document.body, { subtree: true, childList: true })

    return () => {
      window.removeEventListener('resize', detectDevice)
      observer.disconnect()
    }
  }, [])

  return result
}

// =============================================================================
// STATUS BAR COMPONENT
// =============================================================================

interface StatusBarProps {
  /** Time to display (default: "9:41") */
  time?: string
  /** Battery level 0-100 (default: 100) */
  batteryLevel?: number
  /** Show cellular signal (default: true) */
  showCellular?: boolean
  /** Show WiFi signal (default: true) */
  showWifi?: boolean
  /** Light or dark mode (default: "dark" for visibility on dark bg) */
  mode?: 'light' | 'dark'
}

/**
 * iOS-style status bar with time, cellular, wifi, and battery
 */
const StatusBar: React.FC<StatusBarProps> = ({
  time = '9:41',
  batteryLevel = 100,
  showCellular = true,
  showWifi = true,
  mode = 'dark',
}) => {
  const textColor = mode === 'dark' ? 'text-inverse' : 'text-primary'
  const iconColor = mode === 'dark' ? 'text-inverse' : 'text-primary'
  const batteryBorderColor = mode === 'dark' ? 'border-inverse/60' : 'border-primary/60'

  return (
    <div className="flex items-center justify-between w-full">
      {/* Time */}
      <span className={`text-sm font-semibold ${textColor}`}>{time}</span>

      {/* Right side icons */}
      <div className="flex items-center gap-1.5">
        {/* Cellular signal */}
        {showCellular && (
          <svg className={`w-4 h-4 ${iconColor}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 17h2v4H2v-4zm4-5h2v9H6v-9zm4-4h2v13h-2V8zm4-4h2v17h-2V4zm4 8h2v9h-2v-9z" />
          </svg>
        )}

        {/* WiFi signal */}
        {showWifi && (
          <svg className={`w-4 h-4 ${iconColor}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
        )}

        {/* Battery */}
        <div className="flex items-center">
          <div className={`w-6 h-3 border ${batteryBorderColor} rounded-sm relative overflow-hidden`}>
            <div
              className="absolute inset-0.5 bg-harbor-500 rounded-[1px] transition-all"
              style={{ width: `${Math.min(100, Math.max(0, batteryLevel))}%` }}
            />
          </div>
          {/* Battery cap */}
          <div className={`w-0.5 h-1.5 ${mode === 'dark' ? 'bg-inverse/40' : 'bg-primary/40'} rounded-r-sm ml-px`} />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// HOME INDICATOR COMPONENT
// =============================================================================

interface HomeIndicatorProps {
  /** Light or dark mode */
  mode?: 'light' | 'dark'
}

/**
 * iOS home indicator pill
 */
const HomeIndicator: React.FC<HomeIndicatorProps> = ({ mode = 'dark' }) => (
  <div
    className={`rounded-full ${mode === 'dark' ? 'bg-white/30' : 'bg-black/30'}`}
    style={{
      width: '134px',
      height: '5px',
    }}
  />
)

// =============================================================================
// DYNAMIC ISLAND COMPONENT
// =============================================================================

interface DynamicIslandProps {
  /** Width of the pill (default: 126) */
  width?: number
  /** Height of the pill (default: 37) */
  height?: number
}

/**
 * iPhone Dynamic Island cutout
 */
const DynamicIsland: React.FC<DynamicIslandProps> = ({
  width = 126,
  height = 37,
}) => (
  <div
    className="bg-black rounded-full"
    style={{
      width: `${width}px`,
      height: `${height}px`,
    }}
  />
)

// =============================================================================
// NOTCH COMPONENT (iPhone X - 13 series)
// =============================================================================

interface NotchProps {
  /** Width of the notch (default: 209 for iPhone X style) */
  width?: number
  /** Height of the notch (default: 30) */
  height?: number
}

/**
 * iPhone notch cutout (X through 13 series)
 * Creates the classic notch shape with rounded corners
 */
const Notch: React.FC<NotchProps> = ({
  width = 209,
  height = 30,
}) => (
  <div
    className="bg-black"
    style={{
      width: `${width}px`,
      height: `${height}px`,
      borderBottomLeftRadius: '20px',
      borderBottomRightRadius: '20px',
    }}
  />
)

// =============================================================================
// IPHONE FRAME COMPONENT
// =============================================================================

export interface IPhoneFrameProps {
  /** iPhone model to simulate (default: "iphone15promax") */
  model?: IPhoneModel
  /** Content to render inside the frame */
  children: React.ReactNode
  /** Scale factor for the frame (default: 1) */
  scale?: number
  /** Additional className for the outer container */
  className?: string
}

/**
 * IPhoneFrame - iPhone device frame for Storybook previews
 *
 * Simple wrapper to preview components in an iPhone context.
 *
 * @example
 * ```tsx
 * <IPhoneFrame>
 *   <YourMobileComponent />
 * </IPhoneFrame>
 *
 * <IPhoneFrame model="iphonex" scale={0.5}>
 *   <YourMobileComponent />
 * </IPhoneFrame>
 * ```
 */
export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  model = 'iphone15promax',
  children,
  scale = 1,
  className,
}) => {
  // Static light frame - content inside determines theme
  const time = '9:41'
  const batteryLevel = 100
  const screenBackground = '#ffffff'
  const frameColor = '#e5e5e0'
  const colorMode = 'light' as const
  const specs = IPHONE_SPECS[model]
  const bezelWidth = 4

  // Wrapper handles scaling via transform (preserves crisp rendering)
  // Inner content uses actual device dimensions
  return (
    <div
      className={`relative mx-auto ${className || ''}`}
      style={{
        width: `${specs.width * scale}px`,
        height: `${specs.height * scale}px`,
      }}
    >
      {/* Scaled container */}
      <div
        style={{
          width: `${specs.width}px`,
          height: `${specs.height}px`,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
        }}
      >
        {/* Phone outer frame (bezel) */}
        <div
          className="absolute inset-0 shadow-2xl overflow-hidden"
          style={{
            backgroundColor: frameColor,
            borderRadius: `${specs.cornerRadius}px`,
            padding: `${bezelWidth}px`,
          }}
        >
        {/* Screen area */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            borderRadius: `${specs.cornerRadius - bezelWidth}px`,
            backgroundColor: screenBackground,
          }}
        >
          {/* Dynamic Island (for iPhone 14 Pro+ models) */}
          {specs.hasDynamicIsland && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
              <DynamicIsland />
            </div>
          )}

          {/* Notch (for iPhone X - 13 series) */}
          {specs.hasNotch && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
              <Notch />
            </div>
          )}

          {/* Screen content wrapper */}
          <div className="relative w-full h-full flex flex-col">
            {/* Status bar area */}
            <div
              className="flex items-end px-8 pb-1"
              style={{ height: `${specs.safeAreaTop}px` }}
            >
              <StatusBar
                time={time}
                batteryLevel={batteryLevel}
                mode={colorMode}
              />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>

            {/* Safe area bottom padding (for home indicator) */}
            {specs.safeAreaBottom > 0 && (
              <div style={{ height: `${specs.safeAreaBottom}px` }} />
            )}
          </div>

          {/* Home indicator */}
          {specs.safeAreaBottom > 0 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50">
              <HomeIndicator mode={colorMode} />
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

// =============================================================================
// IPAD FRAME COMPONENT
// =============================================================================

export interface IPadFrameProps {
  /** iPad model to simulate (default: "ipad") */
  model?: IPadModel
  /** Orientation: portrait or landscape (default: "landscape") */
  orientation?: 'portrait' | 'landscape'
  /** Content to render inside the frame */
  children: React.ReactNode
  /** Scale factor for the frame (default: 1) */
  scale?: number
  /** Additional className for the outer container */
  className?: string
}

/**
 * IPadFrame - iPad device frame for Storybook previews
 *
 * Simple wrapper to preview components in an iPad context.
 *
 * @example
 * ```tsx
 * <IPadFrame>
 *   <YourTabletComponent />
 * </IPadFrame>
 *
 * <IPadFrame model="ipadPro11" orientation="portrait">
 *   <YourTabletComponent />
 * </IPadFrame>
 * ```
 */
export const IPadFrame: React.FC<IPadFrameProps> = ({
  model = 'ipad',
  orientation = 'landscape',
  children,
  scale = 1,
  className,
}) => {
  // Static light frame - content inside determines theme
  const time = '9:41'
  const batteryLevel = 100
  const screenBackground = '#ffffff'
  const frameColor = '#e5e5e0'
  const colorMode = 'light' as const
  const specs = IPAD_SPECS[model]
  const bezelWidth = 8 // iPads have thicker bezels

  // Swap dimensions for landscape orientation
  const isLandscape = orientation === 'landscape'
  const frameWidth = isLandscape ? specs.height : specs.width
  const frameHeight = isLandscape ? specs.width : specs.height

  // Wrapper handles scaling via transform (preserves crisp rendering)
  // Inner content uses actual device dimensions
  return (
    <div
      className={`relative mx-auto ${className || ''}`}
      style={{
        width: `${frameWidth * scale}px`,
        height: `${frameHeight * scale}px`,
      }}
    >
      {/* Scaled container */}
      <div
        style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
        }}
      >
        {/* iPad outer frame (bezel) */}
        <div
          className="absolute inset-0 shadow-2xl overflow-hidden"
          style={{
            backgroundColor: frameColor,
            borderRadius: `${specs.cornerRadius}px`,
            padding: `${bezelWidth}px`,
          }}
        >
        {/* Screen area */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            borderRadius: `${specs.cornerRadius - bezelWidth}px`,
            backgroundColor: screenBackground,
          }}
        >
          {/* Screen content wrapper */}
          <div className="relative w-full h-full flex flex-col">
            {/* Status bar area */}
            <div
              className="flex items-end px-8 pb-1"
              style={{ height: `${specs.safeAreaTop}px` }}
            >
              <StatusBar
                time={time}
                batteryLevel={batteryLevel}
                mode={colorMode}
              />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>

            {/* Safe area bottom padding */}
            {specs.safeAreaBottom > 0 && (
              <div style={{ height: `${specs.safeAreaBottom}px` }} />
            )}
          </div>

          {/* Home indicator (for non-home-button iPads) */}
          {!specs.hasHomeButton && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50">
              <HomeIndicator mode={colorMode} />
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

// =============================================================================
// ADAPTIVE DEVICE FRAME (simplified)
// =============================================================================

export interface AdaptiveDeviceFrameProps {
  /** Content to render inside the frame */
  children: React.ReactNode
  /** Override detected model for iPhone */
  forceIPhoneModel?: IPhoneModel
  /** Override detected model for iPad */
  forceIPadModel?: IPadModel
  /** Scale factor for the frame */
  scale?: number
  /** Additional className */
  className?: string
}

/**
 * AdaptiveDeviceFrame - Auto-detects viewport and renders appropriate device
 *
 * Uses useDeviceFromViewport hook to detect the current Storybook viewport
 * and renders either an iPhone or iPad frame accordingly.
 *
 * @example
 * ```tsx
 * // Auto-detect from viewport
 * <AdaptiveDeviceFrame>
 *   <YourContent />
 * </AdaptiveDeviceFrame>
 *
 * // In story with viewport decorator
 * export const Mobile: Story = {
 *   parameters: { viewport: { defaultViewport: 'iphone14promax' } },
 *   render: () => (
 *     <AdaptiveDeviceFrame>
 *       <MobileNavBar>...</MobileNavBar>
 *     </AdaptiveDeviceFrame>
 *   ),
 * }
 * ```
 */
export const AdaptiveDeviceFrame: React.FC<AdaptiveDeviceFrameProps> = ({
  children,
  forceIPhoneModel,
  forceIPadModel,
  ...props
}) => {
  const { deviceType, iphoneModel, ipadModel } = useDeviceFromViewport()

  if (deviceType === 'ipad') {
    return (
      <IPadFrame model={forceIPadModel || ipadModel || 'ipad'} {...props}>
        {children}
      </IPadFrame>
    )
  }

  return (
    <IPhoneFrame model={forceIPhoneModel || iphoneModel || 'iphone15promax'} {...props}>
      {children}
    </IPhoneFrame>
  )
}

// =============================================================================
// PRESET IPHONE FRAMES
// =============================================================================

/**
 * iPhone SE frame - compact size for basic mobile testing
 */
export const IPhoneSEFrame: React.FC<Omit<IPhoneFrameProps, 'model'>> = (props) => (
  <IPhoneFrame model="se" {...props} />
)

/**
 * iPhone 15 frame - standard size
 */
export const IPhoneStandardFrame: React.FC<Omit<IPhoneFrameProps, 'model'>> = (props) => (
  <IPhoneFrame model="standard" {...props} />
)

/**
 * iPhone 15 Pro frame - pro size with Dynamic Island
 */
export const IPhoneProFrame: React.FC<Omit<IPhoneFrameProps, 'model'>> = (props) => (
  <IPhoneFrame model="pro" {...props} />
)

/**
 * iPhone 17 Pro Max frame - largest display (default)
 */
export const IPhoneProMaxFrame: React.FC<Omit<IPhoneFrameProps, 'model'>> = (props) => (
  <IPhoneFrame model="proMax" {...props} />
)

// =============================================================================
// PRESET IPAD FRAMES
// =============================================================================

/**
 * iPad frame - standard 10.2" tablet
 */
export const IPadStandardFrame: React.FC<Omit<IPadFrameProps, 'model'>> = (props) => (
  <IPadFrame model="ipad" {...props} />
)

/**
 * iPad Air frame - 10.9" modern design
 */
export const IPadAirFrame: React.FC<Omit<IPadFrameProps, 'model'>> = (props) => (
  <IPadFrame model="ipadAir" {...props} />
)

/**
 * iPad Pro 11" frame
 */
export const IPadPro11Frame: React.FC<Omit<IPadFrameProps, 'model'>> = (props) => (
  <IPadFrame model="ipadPro11" {...props} />
)

/**
 * iPad Pro 12.9" frame - largest iPad
 */
export const IPadPro12Frame: React.FC<Omit<IPadFrameProps, 'model'>> = (props) => (
  <IPadFrame model="ipadPro12" {...props} />
)

/**
 * iPad Mini frame - compact tablet
 */
export const IPadMiniFrame: React.FC<Omit<IPadFrameProps, 'model'>> = (props) => (
  <IPadFrame model="ipadMini" {...props} />
)

// =============================================================================
// STORY DECORATORS
// =============================================================================

/**
 * Decorator that wraps a story in an iPhone frame
 *
 * @example
 * decorators: [withIPhoneFrame('iphone15promax')]
 */
export const withIPhoneFrame = (
  model: IPhoneModel = 'iphone15promax',
  options?: Omit<IPhoneFrameProps, 'model' | 'children'>
) => {
  return (Story: React.FC) => (
    <div className="p-6 flex justify-center">
      <IPhoneFrame model={model} {...options}>
        <Story />
      </IPhoneFrame>
    </div>
  )
}

/**
 * Decorator that wraps a story in an iPad frame
 *
 * @example
 * decorators: [withIPadFrame('ipadPro11')]
 */
export const withIPadFrame = (
  model: IPadModel = 'ipad',
  options?: Omit<IPadFrameProps, 'model' | 'children'>
) => {
  return (Story: React.FC) => (
    <div className="p-6 flex justify-center">
      <IPadFrame model={model} {...options}>
        <Story />
      </IPadFrame>
    </div>
  )
}

/**
 * Decorator that auto-detects viewport and renders appropriate device frame
 *
 * @example
 * decorators: [withAdaptiveDeviceFrame()]
 */
export const withAdaptiveDeviceFrame = (
  options?: Omit<AdaptiveDeviceFrameProps, 'children'>
) => {
  return (Story: React.FC) => (
    <div className="p-6 flex justify-center">
      <AdaptiveDeviceFrame {...options}>
        <Story />
      </AdaptiveDeviceFrame>
    </div>
  )
}
