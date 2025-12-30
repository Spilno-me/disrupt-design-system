/**
 * Device Frames for Story Presentations
 *
 * Realistic device frames for showcasing mobile components in Storybook.
 * These provide proper context for mobile-first component development.
 *
 * ## Features
 * - All iPhone models from Storybook viewport presets (iPhone 5 → iPhone 17)
 * - iPad/tablet support (iPad, iPad Air, iPad Pro 11", iPad Pro 12.9", iPad Mini)
 * - Safari browser chrome for PWA/mobile web previews
 * - Automatic viewport detection via useDeviceFromViewport hook
 * - Accurate device specifications (dimensions, corner radius, safe areas)
 *
 * ## Safari iOS 18 Browser Chrome Measurements (2025)
 *
 * Research-based measurements for accurate Safari browser simulation:
 *
 * | Component              | Height (pt) | Notes                                    |
 * |------------------------|-------------|------------------------------------------|
 * | Status Bar             | 47-59pt     | 59pt for Dynamic Island (iPhone 14 Pro+)|
 * | Safari Address Bar     | 50pt        | Compact mode (iOS 15+)                   |
 * | Safari Bottom Toolbar  | 44pt        | Back, Forward, Share, Bookmarks, Tabs    |
 * | Home Indicator         | 34pt        | Safe area bottom inset                   |
 *
 * ### iPhone 16 Pro Max Safari Chrome Total:
 * - Top: 59pt (status) + 50pt (address bar) = 109pt
 * - Bottom: 44pt (toolbar) + 34pt (home indicator) = 78pt
 * - Total: 187pt of browser chrome
 *
 * ### Sources:
 * - https://samuelkraft.com/blog/safari-15-bottom-tab-bars-web
 * - https://benfrain.com/the-ios-safari-menu-bar-is-hostile-to-web-apps-discuss/
 * - https://www.sabhya.dev/handling-ios-safari-toolbar-for-full-height-web-content
 * - https://developer.apple.com/design/human-interface-guidelines/layout
 *
 * ## Components
 *
 * ### IPhoneFrame
 * Visual wrapper for components - does NOT trigger CSS media queries.
 * Use for visual presentation only.
 *
 * ### IPhoneMobileFrame
 * Uses iframe at actual device dimensions - CSS media queries WORK!
 * Use for testing responsive behavior in stories.
 *
 * @example Native app style (no browser chrome)
 * ```tsx
 * <IPhoneMobileFrame model="iphone16promax" storyId="my-story--default" />
 * ```
 *
 * @example PWA/Mobile web with Safari browser chrome
 * ```tsx
 * <IPhoneMobileFrame
 *   model="iphone16promax"
 *   storyId="flow-dashboard--default"
 *   showBrowser
 *   browserUrl="flow.disrupt.app"
 * />
 * ```
 *
 * @example Visual wrapper only (CSS won't trigger)
 * ```tsx
 * <IPhoneFrame model="iphone15promax">
 *   <YourMobileComponent />
 * </IPhoneFrame>
 * ```
 */

import * as React from 'react'
import { PortalContainerProvider } from '../../components/ui/sheet'

// =============================================================================
// SHARED STATUS BAR DEFAULTS (Single source of truth)
// =============================================================================

/**
 * Default values for status bar display across all device frames.
 * Update these to change the appearance in all iPhone/iPad frames.
 */
export const STATUS_BAR_DEFAULTS = {
  /** Time displayed in status bar */
  time: '4:20',
  /** Battery percentage (0-100) */
  batteryLevel: 100,
  /** Show charging indicator (green battery + lightning bolt) */
  isCharging: true,
} as const

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
  /** Show battery as charging with lightning bolt (default: true) */
  isCharging?: boolean
}

/**
 * iOS-style status bar with time, cellular, wifi, and battery
 */
const StatusBar: React.FC<StatusBarProps> = ({
  time = STATUS_BAR_DEFAULTS.time,
  batteryLevel = STATUS_BAR_DEFAULTS.batteryLevel,
  showCellular = true,
  showWifi = true,
  mode = 'dark',
  isCharging = STATUS_BAR_DEFAULTS.isCharging,
}) => {
  const textColor = mode === 'dark' ? 'text-inverse' : 'text-primary'
  const iconColor = mode === 'dark' ? 'text-inverse' : 'text-primary'
  const batteryBorderColor = mode === 'dark' ? 'border-inverse/60' : 'border-primary/60'

  // iOS shows green battery when charging or above 80%
  const batteryColor = isCharging || batteryLevel >= 80 ? 'bg-green-500' :
                       batteryLevel <= 20 ? 'bg-red-500' : 'bg-white'

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

        {/* Battery with charging indicator */}
        <div className="flex items-center">
          <div className={`w-6 h-3 border ${batteryBorderColor} rounded-sm relative overflow-hidden`}>
            {/* Battery fill - green when charging */}
            <div
              className={`absolute inset-0.5 ${batteryColor} rounded-[1px] transition-all`}
              style={{ width: `${Math.min(100, Math.max(0, batteryLevel))}%` }}
            />
            {/* Lightning bolt for charging */}
            {isCharging && (
              <svg
                className="absolute inset-0 w-full h-full text-black/70"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66l.1-.16L12 5h1l-1 7h3.5c.58 0 .57.32.38.66l-.1.16L11 21z" />
              </svg>
            )}
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
// IFRAME MOBILE FRAME (for real CSS media query testing)
// =============================================================================

export interface IPhoneMobileFrameProps {
  /** iPhone model to simulate (default: "iphone16promax") */
  model?: IPhoneModel
  /** Storybook story ID to embed (e.g., "flow-dashboard--default") */
  storyId?: string
  /** Content to render (alternative to storyId for simple content) */
  children?: React.ReactNode
  /** Scale factor for the frame (default: 0.7 to fit in viewport) */
  scale?: number
  /** Additional className for the outer container */
  className?: string
  /** Show Safari browser chrome (address bar + toolbar) */
  showBrowser?: boolean
  /** URL to display in Safari address bar */
  browserUrl?: string
}

/**
 * IPhoneMobileFrame - iPhone frame with REAL viewport via iframe
 *
 * Uses an actual iframe to render content, making CSS media queries work correctly.
 * The iframe has the actual device dimensions, triggering responsive breakpoints.
 *
 * ## Content Modes
 * 1. **storyId** - Embeds another Storybook story in an iframe (CSS works!)
 * 2. **children** - Renders children directly (CSS won't work, visual only)
 *
 * ## Browser Chrome (showBrowser prop)
 * When `showBrowser={true}`, renders Safari iOS 18 browser chrome:
 *
 * | Element           | Height | Description                          |
 * |-------------------|--------|--------------------------------------|
 * | Status Bar        | 59pt   | Time, signal, battery (Dynamic Island)|
 * | Address Bar       | 50pt   | Compact URL bar with lock icon       |
 * | Bottom Toolbar    | 44pt   | Back, Forward, Share, Bookmarks, Tabs|
 * | Home Indicator    | 34pt   | Swipe-up gesture area                |
 *
 * Total Safari chrome: 187pt (109pt top + 78pt bottom)
 *
 * @example Native app (no browser chrome)
 * ```tsx
 * <IPhoneMobileFrame
 *   model="iphone16promax"
 *   storyId="flow-dashboard--default"
 * />
 * ```
 *
 * @example PWA with Safari browser chrome
 * ```tsx
 * <IPhoneMobileFrame
 *   model="iphone16promax"
 *   storyId="flow-dashboard--default"
 *   showBrowser
 *   browserUrl="flow.disrupt.app"
 * />
 * ```
 *
 * @example Direct children (visual only)
 * ```tsx
 * <IPhoneMobileFrame>
 *   <YourMobileApp />
 * </IPhoneMobileFrame>
 * ```
 */
export const IPhoneMobileFrame: React.FC<IPhoneMobileFrameProps> = ({
  model = 'iphone16promax',
  storyId,
  children,
  scale = 0.7,
  className,
  showBrowser = false,
  browserUrl = 'flow.disrupt.app',
}) => {
  const specs = IPHONE_SPECS[model]
  const frameColor = '#2a2a2a' // Dark titanium frame
  const bezelWidth = 10

  // Ref for the screen container - used for portal containment
  // Using state + callback ref pattern to trigger re-render when ref is set
  const [screenContainer, setScreenContainer] = React.useState<HTMLDivElement | null>(null)

  const contentWidth = specs.width
  const contentHeight = specs.height

  // Safari browser chrome heights (iOS 18 compact style)
  // Research: Address bar ~50pt, Bottom toolbar ~44pt
  // Sources: https://samuelkraft.com/blog/safari-15-bottom-tab-bars-web
  //          https://benfrain.com/the-ios-safari-menu-bar-is-hostile-to-web-apps-discuss/
  const SAFARI_ADDRESS_BAR_HEIGHT = 50 // Compact address bar (iOS 15+)
  const SAFARI_TOOLBAR_HEIGHT = 44 // Bottom navigation toolbar
  const safariTopHeight = showBrowser ? specs.safeAreaTop + SAFARI_ADDRESS_BAR_HEIGHT : 0
  const safariBottomHeight = showBrowser ? SAFARI_TOOLBAR_HEIGHT + specs.safeAreaBottom : 0
  const safariTotalHeight = safariTopHeight + safariBottomHeight

  // Content (iframe) height after Safari chrome
  const iframeHeight = showBrowser ? contentHeight - safariTotalHeight : contentHeight

  // Build iframe URL for Storybook story
  const iframeSrc = storyId
    ? `/iframe.html?id=${storyId}&viewMode=story&shortcuts=false&singleStory=true`
    : undefined

  return (
    <div
      className={`relative mx-auto ${className || ''}`}
      style={{
        width: `${(contentWidth + bezelWidth * 2) * scale}px`,
        height: `${(contentHeight + bezelWidth * 2) * scale}px`,
      }}
    >
      {/* Scaled container - overflow:hidden prevents corner leakage during transform */}
      <div
        className="overflow-hidden"
        style={{
          width: `${contentWidth + bezelWidth * 2}px`,
          height: `${contentHeight + bezelWidth * 2}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          borderRadius: `${specs.cornerRadius + 6}px`, // Match bezel radius
        }}
      >
        {/* Phone outer frame (bezel) - dark titanium style */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundColor: frameColor,
            borderRadius: `${specs.cornerRadius + 6}px`,
            padding: `${bezelWidth}px`,
            boxShadow: `
              0 50px 100px -20px rgba(0, 0, 0, 0.5),
              0 30px 60px -30px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `,
          }}
        >
          {/* Screen area - clip-path ensures proper corner clipping for iframes */}
          {/* This div serves as the portal container for Sheet/Drawer components */}
          <div
            ref={setScreenContainer}
            className="relative overflow-hidden flex flex-col"
            style={{
              width: `${contentWidth}px`,
              height: `${contentHeight}px`,
              borderRadius: `${specs.cornerRadius - 4}px`,
              backgroundColor: '#000',
              // clip-path is more reliable than overflow:hidden for clipping at rounded corners
              clipPath: `inset(0 round ${specs.cornerRadius - 4}px)`,
            }}
          >
            {/* === BROWSER MODE: Safari iOS Chrome === */}
            {showBrowser ? (
              <>
                {/* Safari top area: Dynamic Island + status bar + compact address bar */}
                <div
                  className="flex-shrink-0 bg-neutral-100 relative"
                  style={{ height: `${safariTopHeight}px` }}
                >
                  {/* Dynamic Island overlay (renders on top of Safari chrome) */}
                  {specs.hasDynamicIsland && (
                    <div
                      className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 bg-black rounded-full pointer-events-none"
                      style={{ width: '126px', height: '37px' }}
                    />
                  )}
                  {/* Status bar - mode="light" for dark text on light Safari chrome */}
                  <div
                    className="flex items-end px-6 pb-0.5"
                    style={{ height: `${specs.safeAreaTop}px` }}
                  >
                    <StatusBar mode="light" />
                  </div>
                  {/* Safari compact address bar */}
                  <SafariAddressBar url={browserUrl} isSecure={true} />
                </div>

                {/* Web content area (iframe) */}
                {iframeSrc ? (
                  <iframe
                    src={iframeSrc}
                    title="Mobile Preview"
                    className="flex-1"
                    style={{
                      width: `${contentWidth}px`,
                      height: `${iframeHeight}px`,
                      border: 'none',
                      backgroundColor: '#fff',
                    }}
                  />
                ) : (
                  <div
                    className="flex-1 overflow-hidden bg-white"
                    style={{
                      width: `${contentWidth}px`,
                      height: `${iframeHeight}px`,
                    }}
                  >
                    <PortalContainerProvider container={screenContainer}>
                      {children}
                    </PortalContainerProvider>
                  </div>
                )}

                {/* Safari bottom toolbar + home indicator */}
                <div
                  className="flex-shrink-0 bg-neutral-50"
                  style={{ height: `${safariBottomHeight}px` }}
                >
                  <SafariToolbar mode="light" />
                  {/* Home indicator area - mode="light" for dark pill on light Safari chrome */}
                  <div
                    className="flex items-center justify-center"
                    style={{ height: `${specs.safeAreaBottom}px` }}
                  >
                    <HomeIndicator mode="light" />
                  </div>
                </div>
              </>
            ) : (
              /* === NATIVE MODE: Full screen content === */
              <>
                {/* Dynamic Island overlay */}
                {specs.hasDynamicIsland && (
                  <div
                    className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 bg-black rounded-full pointer-events-none"
                    style={{ width: '126px', height: '37px' }}
                  />
                )}

                {/* Content: iframe or children */}
                {iframeSrc ? (
                  <iframe
                    src={iframeSrc}
                    title="Mobile Preview"
                    style={{
                      width: `${contentWidth}px`,
                      height: `${contentHeight}px`,
                      border: 'none',
                      backgroundColor: '#fff',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: `${contentWidth}px`,
                      height: `${contentHeight}px`,
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                    }}
                  >
                    <PortalContainerProvider container={screenContainer}>
                      {children}
                    </PortalContainerProvider>
                  </div>
                )}

                {/* Home indicator overlay */}
                {specs.safeAreaBottom > 0 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                    <div
                      className="rounded-full"
                      style={{
                        width: '134px',
                        height: '5px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Side buttons - Volume rocker */}
        <div
          className="absolute rounded-l-sm"
          style={{
            left: '-2px',
            top: '115px',
            width: '3px',
            height: '28px',
            backgroundColor: '#3a3a3a',
          }}
        />
        <div
          className="absolute rounded-l-sm"
          style={{
            left: '-2px',
            top: '155px',
            width: '3px',
            height: '56px',
            backgroundColor: '#3a3a3a',
          }}
        />
        {/* Side button - Power/Action */}
        <div
          className="absolute rounded-r-sm"
          style={{
            right: '-2px',
            top: '145px',
            width: '3px',
            height: '72px',
            backgroundColor: '#3a3a3a',
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// SAFARI BROWSER CHROME (iOS 17+ style)
// =============================================================================

interface SafariAddressBarProps {
  /** URL to display */
  url?: string
  /** Is the page secure (shows lock icon) */
  isSecure?: boolean
}

/**
 * Safari iOS address bar (compact style - iOS 15+)
 * Shows URL in a pill-shaped container with reader/share icons
 */
const SafariAddressBar: React.FC<SafariAddressBarProps> = ({
  url = 'flow.disrupt.app',
  isSecure = true,
}) => (
  <div className="flex items-center justify-center gap-2 px-3 py-1">
    <div className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-100 rounded-xl px-3 py-1.5 min-h-[36px]">
      {/* Lock icon (secure) */}
      {isSecure && (
        <svg className="w-3 h-3 text-neutral-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1C8.676 1 6 3.676 6 7v2H4v14h16V9h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4z"/>
        </svg>
      )}
      {/* URL */}
      <span className="text-sm text-neutral-900 truncate">{url}</span>
    </div>
  </div>
)

interface SafariToolbarProps {
  /** Light or dark mode */
  mode?: 'light' | 'dark'
}

/**
 * Safari iOS bottom toolbar with navigation buttons
 */
const SafariToolbar: React.FC<SafariToolbarProps> = ({ mode = 'light' }) => {
  const iconColor = mode === 'light' ? 'text-blue-500' : 'text-blue-400'
  const disabledColor = mode === 'light' ? 'text-neutral-300' : 'text-neutral-600'

  return (
    <div className="flex items-center justify-around px-4 py-2 bg-neutral-50/95 backdrop-blur-sm border-t border-neutral-200">
      {/* Back (disabled) */}
      <button className={`p-2 ${disabledColor}`} disabled>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      {/* Forward (disabled) */}
      <button className={`p-2 ${disabledColor}`} disabled>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      {/* Share */}
      <button className={`p-2 ${iconColor}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v11.25" />
        </svg>
      </button>
      {/* Bookmarks */}
      <button className={`p-2 ${iconColor}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </button>
      {/* Tabs */}
      <button className={`p-2 ${iconColor}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" />
        </svg>
      </button>
    </div>
  )
}

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
  /** Show Safari browser chrome (for PWA/web apps) */
  showBrowser?: boolean
  /** URL to display in browser address bar */
  browserUrl?: string
}

/**
 * IPhoneFrame - iPhone device frame for Storybook previews
 *
 * Simple wrapper to preview components in an iPhone context.
 * Use `showBrowser={true}` for PWA/mobile web apps to show Safari chrome.
 *
 * @example
 * ```tsx
 * // Native app style (full screen, no browser chrome)
 * <IPhoneFrame>
 *   <YourMobileComponent />
 * </IPhoneFrame>
 *
 * // PWA / Mobile web app with Safari browser chrome
 * <IPhoneFrame showBrowser browserUrl="flow.disrupt.app">
 *   <YourMobileComponent />
 * </IPhoneFrame>
 * ```
 */
export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  model = 'iphone15promax',
  children,
  scale = 1,
  className,
  showBrowser = false,
  browserUrl = 'flow.disrupt.app',
}) => {
  // Static light frame - content inside determines theme
  // StatusBar uses STATUS_BAR_DEFAULTS for time/battery (single source of truth)
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
          {/* Dynamic Island - hidden when browser is shown (Safari covers it) */}
          {specs.hasDynamicIsland && !showBrowser && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
              <DynamicIsland />
            </div>
          )}

          {/* Notch - hidden when browser is shown (Safari covers it) */}
          {specs.hasNotch && !showBrowser && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
              <Notch />
            </div>
          )}

          {/* Screen content wrapper */}
          <div className="relative w-full h-full flex flex-col">
            {/* === BROWSER MODE: Safari iOS Chrome === */}
            {showBrowser ? (
              <>
                {/* Safari top area: status bar + compact address bar */}
                <div className="flex-shrink-0 bg-neutral-100">
                  {/* Status bar (in Safari's area) */}
                  <div
                    className="flex items-end px-6 pb-0.5"
                    style={{ height: `${specs.safeAreaTop}px` }}
                  >
                    <StatusBar mode="light" />
                  </div>
                  {/* Safari compact address bar */}
                  <SafariAddressBar url={browserUrl} isSecure={true} />
                </div>

                {/* Web content area (between Safari chrome) */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                  {children}
                </div>

                {/* Safari bottom toolbar */}
                <div className="flex-shrink-0">
                  <SafariToolbar mode={colorMode} />
                  {/* Home indicator area */}
                  <div
                    className="bg-neutral-50 flex items-center justify-center"
                    style={{ height: `${specs.safeAreaBottom}px` }}
                  >
                    <HomeIndicator mode="dark" />
                  </div>
                </div>
              </>
            ) : (
              /* === NATIVE MODE: Full screen app === */
              <>
                {/* Status bar area */}
                <div
                  className="flex items-end px-8 pb-1 flex-shrink-0"
                  style={{ height: `${specs.safeAreaTop}px` }}
                >
                  <StatusBar mode={colorMode} />
                </div>

                {/* Main content area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {children}
                </div>

                {/* Safe area bottom padding (for home indicator) */}
                {specs.safeAreaBottom > 0 && (
                  <div style={{ height: `${specs.safeAreaBottom}px` }} />
                )}

                {/* Home indicator */}
                {specs.safeAreaBottom > 0 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50">
                    <HomeIndicator mode={colorMode} />
                  </div>
                )}
              </>
            )}
          </div>
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
  // StatusBar uses STATUS_BAR_DEFAULTS for time/battery (single source of truth)
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
              <StatusBar mode={colorMode} />
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
// IPAD MOBILE FRAME (iframe for real CSS media query testing)
// =============================================================================

export interface IPadMobileFrameProps {
  /** iPad model to simulate (default: "ipadPro11") */
  model?: IPadModel
  /** Orientation: portrait or landscape (default: "landscape") */
  orientation?: 'portrait' | 'landscape'
  /** Storybook story ID to embed (e.g., "flow-dashboard--default") */
  storyId?: string
  /** Content to render (alternative to storyId for simple content) */
  children?: React.ReactNode
  /** Scale factor for the frame (default: 0.5 to fit in viewport) */
  scale?: number
  /** Additional className for the outer container */
  className?: string
  /** Show Safari browser chrome (address bar + toolbar) */
  showBrowser?: boolean
  /** URL to display in Safari address bar */
  browserUrl?: string
}

/**
 * IPadMobileFrame - iPad frame with REAL viewport via iframe
 *
 * Uses an actual iframe to render content, making CSS media queries work correctly.
 * The iframe has the actual device dimensions, triggering responsive breakpoints.
 *
 * ## Content Modes
 * 1. **storyId** - Embeds another Storybook story in an iframe (CSS works!)
 * 2. **children** - Renders children directly (CSS won't work, visual only)
 *
 * ## Orientation
 * - `portrait` - Standard upright iPad view
 * - `landscape` - Rotated iPad view (default, better for most dashboards)
 *
 * @example Native app - landscape (default)
 * ```tsx
 * <IPadMobileFrame
 *   model="ipadPro11"
 *   storyId="flow-dashboard--default"
 * />
 * ```
 *
 * @example Portrait orientation
 * ```tsx
 * <IPadMobileFrame
 *   model="ipadPro11"
 *   orientation="portrait"
 *   storyId="flow-dashboard--default"
 * />
 * ```
 *
 * @example With Safari browser chrome
 * ```tsx
 * <IPadMobileFrame
 *   model="ipadPro11"
 *   storyId="flow-dashboard--default"
 *   showBrowser
 *   browserUrl="flow.disrupt.app"
 * />
 * ```
 */
export const IPadMobileFrame: React.FC<IPadMobileFrameProps> = ({
  model = 'ipadPro11',
  orientation = 'landscape',
  storyId,
  children,
  scale = 0.5,
  className,
  showBrowser = false,
  browserUrl = 'flow.disrupt.app',
}) => {
  const specs = IPAD_SPECS[model]
  const frameColor = '#2a2a2a' // Dark titanium frame
  const bezelWidth = 12 // iPads have thicker bezels

  // Swap dimensions for orientation
  const isLandscape = orientation === 'landscape'
  const contentWidth = isLandscape ? specs.height : specs.width
  const contentHeight = isLandscape ? specs.width : specs.height

  // Safari browser chrome heights (iPad style)
  const SAFARI_ADDRESS_BAR_HEIGHT = 50
  const SAFARI_TOOLBAR_HEIGHT = 44
  const safariTopHeight = showBrowser ? specs.safeAreaTop + SAFARI_ADDRESS_BAR_HEIGHT : 0
  const safariBottomHeight = showBrowser ? SAFARI_TOOLBAR_HEIGHT + specs.safeAreaBottom : 0
  const safariTotalHeight = safariTopHeight + safariBottomHeight

  // Content (iframe) height after Safari chrome
  const iframeHeight = showBrowser ? contentHeight - safariTotalHeight : contentHeight

  // Build iframe URL for Storybook story
  const iframeSrc = storyId
    ? `/iframe.html?id=${storyId}&viewMode=story&shortcuts=false&singleStory=true`
    : undefined

  return (
    <div
      className={`relative mx-auto ${className || ''}`}
      style={{
        width: `${(contentWidth + bezelWidth * 2) * scale}px`,
        height: `${(contentHeight + bezelWidth * 2) * scale}px`,
      }}
    >
      {/* Scaled container */}
      <div
        className="overflow-hidden"
        style={{
          width: `${contentWidth + bezelWidth * 2}px`,
          height: `${contentHeight + bezelWidth * 2}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          borderRadius: `${specs.cornerRadius + 8}px`,
        }}
      >
        {/* iPad outer frame (bezel) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundColor: frameColor,
            borderRadius: `${specs.cornerRadius + 8}px`,
            padding: `${bezelWidth}px`,
            boxShadow: `
              0 50px 100px -20px rgba(0, 0, 0, 0.5),
              0 30px 60px -30px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `,
          }}
        >
          {/* Screen area */}
          <div
            className="relative overflow-hidden flex flex-col"
            style={{
              width: `${contentWidth}px`,
              height: `${contentHeight}px`,
              borderRadius: `${specs.cornerRadius - 4}px`,
              backgroundColor: '#000',
              clipPath: `inset(0 round ${specs.cornerRadius - 4}px)`,
            }}
          >
            {/* === BROWSER MODE: Safari iPadOS Chrome === */}
            {showBrowser ? (
              <>
                {/* Safari top area: status bar + compact address bar */}
                <div
                  className="flex-shrink-0 bg-neutral-100 relative"
                  style={{ height: `${safariTopHeight}px` }}
                >
                  {/* Status bar */}
                  <div
                    className="flex items-end px-6 pb-0.5"
                    style={{ height: `${specs.safeAreaTop}px` }}
                  >
                    <StatusBar mode="light" />
                  </div>
                  {/* Safari compact address bar */}
                  <SafariAddressBar url={browserUrl} isSecure={true} />
                </div>

                {/* Web content area (iframe) */}
                {iframeSrc ? (
                  <iframe
                    src={iframeSrc}
                    title="iPad Preview"
                    className="flex-1"
                    style={{
                      width: `${contentWidth}px`,
                      height: `${iframeHeight}px`,
                      border: 'none',
                      backgroundColor: '#fff',
                    }}
                  />
                ) : (
                  <div
                    className="flex-1 overflow-hidden bg-white"
                    style={{
                      width: `${contentWidth}px`,
                      height: `${iframeHeight}px`,
                    }}
                  >
                    {children}
                  </div>
                )}

                {/* Safari bottom toolbar + home indicator */}
                <div
                  className="flex-shrink-0 bg-neutral-50"
                  style={{ height: `${safariBottomHeight}px` }}
                >
                  <SafariToolbar mode="light" />
                  {/* Home indicator area */}
                  {!specs.hasHomeButton && (
                    <div
                      className="flex items-center justify-center"
                      style={{ height: `${specs.safeAreaBottom}px` }}
                    >
                      <HomeIndicator mode="light" />
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* === NATIVE MODE: Full screen content === */
              <>
                {/* Content: iframe or children */}
                {iframeSrc ? (
                  <iframe
                    src={iframeSrc}
                    title="iPad Preview"
                    style={{
                      width: `${contentWidth}px`,
                      height: `${contentHeight}px`,
                      border: 'none',
                      backgroundColor: '#fff',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: `${contentWidth}px`,
                      height: `${contentHeight}px`,
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                    }}
                  >
                    {children}
                  </div>
                )}

                {/* Home indicator overlay (for non-home-button iPads) */}
                {!specs.hasHomeButton && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                    <div
                      className="rounded-full"
                      style={{
                        width: '134px',
                        height: '5px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                      }}
                    />
                  </div>
                )}
              </>
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
