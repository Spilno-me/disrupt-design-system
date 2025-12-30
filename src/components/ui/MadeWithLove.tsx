import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ALIAS } from '../../constants/designTokens'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Default URL for Disrupt website */
const DISRUPT_URL = 'https://disruptinc.io/'

/** Heartbeat animation duration in seconds */
const HEARTBEAT_DURATION_SECONDS = 1.2

/** Delay between heartbeat cycles in seconds */
const HEARTBEAT_REPEAT_DELAY_SECONDS = 0.5

/** Heart icon size classes by size variant */
const HEART_SIZE_CLASSES = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
} as const

/** Keyframe times for realistic lub-dub heartbeat pattern */
const HEARTBEAT_KEYFRAME_TIMES = [0, 0.15, 0.3, 0.45, 0.6]

/** Scale values for heartbeat animation (lub-dub pattern) */
const HEARTBEAT_SCALE_VALUES = [1, 1.2, 1, 1.15, 1]

// =============================================================================
// TYPES
// =============================================================================

export interface MadeWithLoveProps {
  /** Additional className for styling */
  className?: string
  /** Color mode: 'dark' for dark text on light bg, 'light' for light text on dark bg */
  colorMode?: 'dark' | 'light'
  /** Optional click handler (overrides default link behavior) */
  onClick?: () => void
  /** URL to link to (defaults to Disrupt website) */
  href?: string
}

type HeartSize = keyof typeof HEART_SIZE_CLASSES

interface BeatingHeartProps {
  color: string
  size?: HeartSize
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * DisruptFullLogo - SVG logo with D icon and "isrupt" text.
 *
 * @internal Not exported - used only within MadeWithLove component.
 */
function DisruptFullLogo({ textColor }: { textColor: string }) {
  return (
    <svg
      width="80"
      height="20"
      viewBox="0 0 177 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
      aria-hidden="true"
    >
      {/* Main D shape - RED */}
      <path
        d="M29.1689 8.35718C36.5257 8.35718 42.4895 14.2909 42.4895 21.6105C42.4895 28.93 36.5257 34.8637 29.1689 34.8637H15.3565C14.8492 34.8637 14.4379 34.4545 14.4379 33.9497V30.4764C14.4379 29.9716 14.8492 29.5624 15.3565 29.5624H29.1689C33.583 29.5624 37.1613 26.0022 37.1613 21.6105C37.1613 17.2187 33.583 13.6585 29.1689 13.6585H15.3565C14.8492 13.6585 14.4379 13.2493 14.4379 12.7445V9.2712C14.4379 8.7664 14.8492 8.35718 15.3565 8.35718H29.1689Z"
        fill={ALIAS.status.error}
      />

      {/* Floating pixels - red */}
      <path
        d="M11.1907 23.6729C11.1907 23.3802 11.434 23.1428 11.7342 23.1428H14.5968C14.897 23.1428 15.1403 23.3802 15.1403 23.6729V26.4699C15.1403 26.7626 14.897 27 14.5968 27H11.7342C11.434 27 11.1907 26.7626 11.1907 26.4699V23.6729Z"
        fill={ALIAS.status.error}
      />
      <path
        d="M5.9245 15.9588C5.9245 15.666 6.16786 15.4287 6.46807 15.4287H9.33059C9.63079 15.4287 9.87416 15.666 9.87416 15.9588V18.7558C9.87416 19.0485 9.63079 19.2859 9.33059 19.2859H6.46807C6.16786 19.2859 5.9245 19.0485 5.9245 18.7558V15.9588Z"
        fill={ALIAS.status.error}
      />
      <path
        d="M7.89929 30.2783C7.89929 29.888 8.22378 29.5715 8.62405 29.5715H12.4407C12.841 29.5715 13.1655 29.888 13.1655 30.2783V34.0076C13.1655 34.398 12.841 34.7144 12.4407 34.7144H8.62405C8.22377 34.7144 7.89929 34.398 7.89929 34.0076V30.2783Z"
        fill={ALIAS.status.error}
      />

      {/* Floating pixels - dark */}
      <path
        d="M13.1655 18.3534C13.1655 18.1582 13.3278 18 13.5279 18H15.4363C15.6364 18 15.7986 18.1582 15.7986 18.3534V20.218C15.7986 20.4132 15.6364 20.5714 15.4363 20.5714H13.5279C13.3278 20.5714 13.1655 20.4132 13.1655 20.218V18.3534Z"
        fill={textColor}
      />
      <path
        d="M3.94965 12.4794C3.94965 12.333 4.07133 12.2144 4.22143 12.2144H5.65269C5.80279 12.2144 5.92447 12.333 5.92447 12.4794V13.8779C5.92447 14.0243 5.80279 14.1429 5.65269 14.1429H4.22143C4.07133 14.1429 3.94965 14.0243 3.94965 13.8779V12.4794Z"
        fill={textColor}
      />
      <path
        d="M3.94965 27.265C3.94965 27.1187 4.07133 27 4.22143 27H5.65269C5.80279 27 5.92447 27.1187 5.92447 27.265V28.6635C5.92447 28.8099 5.80279 28.9286 5.65269 28.9286H4.22143C4.07133 28.9286 3.94965 28.8099 3.94965 28.6635V27.265Z"
        fill={textColor}
      />
      <path
        d="M6.58276 24.6937C6.58276 24.5474 6.70445 24.4287 6.85455 24.4287H8.28581C8.43591 24.4287 8.55759 24.5474 8.55759 24.6937V26.0922C8.55759 26.2386 8.43591 26.3573 8.28581 26.3573H6.85455C6.70444 26.3573 6.58276 26.2386 6.58276 26.0922V24.6937Z"
        fill={textColor}
      />
      <path
        d="M7.89929 9.06395C7.89929 8.67361 8.22378 8.35718 8.62405 8.35718H12.4407C12.841 8.35718 13.1655 8.67361 13.1655 9.06394V12.7933C13.1655 13.1836 12.841 13.5 12.4407 13.5H8.62405C8.22377 13.5 7.89929 13.1836 7.89929 12.7933V9.06395Z"
        fill={textColor}
      />
      <path
        d="M0.658264 18.3534C0.658264 18.1582 0.820506 18 1.02064 18H2.92899C3.12913 18 3.29137 18.1582 3.29137 18.3534V20.218C3.29137 20.4132 3.12913 20.5714 2.92899 20.5714H1.02064C0.820505 20.5714 0.658264 20.4132 0.658264 20.218V18.3534Z"
        fill={textColor}
      />
      <path
        d="M4.60791 20.9249C4.60791 20.7297 4.77015 20.5715 4.97029 20.5715H6.87864C7.07877 20.5715 7.24101 20.7297 7.24101 20.9249V22.7896C7.24101 22.9847 7.07877 23.143 6.87864 23.143H4.97029C4.77015 23.143 4.60791 22.9847 4.60791 22.7896V20.9249Z"
        fill={textColor}
      />

      {/* "i" dot */}
      <path
        d="M50.6235 9H48.0397C46.9352 9 46.0397 9.90817 46.0397 11.0127C46.0397 12.1173 46.9352 13.0255 48.0397 13.0255H50.6235C51.7281 13.0255 52.6235 12.1173 52.6235 11.0127C52.6235 9.90817 51.7281 9 50.6235 9Z"
        fill={textColor}
      />
      {/* "i" stem */}
      <path
        d="M46.0399 17.2212C46.0399 16.1166 46.9353 15.2212 48.0399 15.2212H50.6237C51.7282 15.2212 52.6237 16.1166 52.6237 17.2212V32.6167C52.6237 33.7213 51.7282 34.6167 50.6237 34.6167H48.0399C46.9353 34.6167 46.0399 33.7213 46.0399 32.6167V17.2212Z"
        fill={textColor}
      />

      {/* "s" */}
      <path
        d="M69.151 34.9826H68.0844C63.9158 34.9826 60.8262 34.5679 58.8155 33.7384C57.6562 33.2601 56.7414 32.571 56.0712 31.6709C55.2908 30.6229 56.2629 29.347 57.5696 29.347H61.0809C61.6942 29.347 62.2567 29.6642 62.7843 29.9771C63.1657 30.2033 63.6328 30.3714 64.1856 30.4814C65.1909 30.6766 66.7357 30.7742 68.82 30.7742C71.2721 30.7742 72.9395 30.6278 73.8222 30.335C74.7295 30.0423 75.1831 29.5299 75.1831 28.798V28.6882C75.1831 28.1515 74.9011 27.7734 74.3371 27.5538C73.7977 27.3342 72.7188 27.2 71.1004 27.1512L63.5971 26.8585C60.7036 26.7609 58.6561 26.2973 57.4546 25.4679C56.2531 24.614 55.6524 23.2599 55.6524 21.4058V21.0398C55.6524 18.6733 56.6822 17.0509 58.742 16.1727C60.8017 15.2944 63.9771 14.8552 68.2683 14.8552H68.7832C72.6329 14.8552 75.5019 15.2944 77.39 16.1727C78.3855 16.6298 79.2282 17.239 79.9182 18.0002C80.8645 19.0443 79.9123 20.4909 78.5031 20.4909H75.2434C74.6462 20.4909 74.0898 20.1955 73.5652 19.9103C72.5268 19.3459 70.7612 19.0637 68.2683 19.0637C65.9878 19.0637 64.4308 19.1979 63.5971 19.4662C62.7879 19.7346 62.3833 20.1859 62.3833 20.8203V20.9666C62.3833 21.5034 62.6653 21.8815 63.2293 22.1011C63.7932 22.3207 64.8721 22.4548 66.466 22.5036L74.0061 22.7964C76.8996 22.9184 78.9348 23.3941 80.1118 24.2236C81.3133 25.0531 81.914 26.3949 81.914 28.2491V28.5785C81.914 30.9693 80.9209 32.6405 78.9348 33.592C76.9486 34.5191 73.6873 34.9826 69.151 34.9826Z"
        fill={textColor}
      />

      {/* "r" */}
      <path
        d="M99.2683 15.2212C100.02 15.2212 100.629 15.8305 100.629 16.5821V18.2713C100.629 19.3759 99.7338 20.2713 98.6292 20.2713H97.5396C95.1611 20.2713 93.4324 20.6251 92.3535 21.3326C91.2746 22.0401 90.7351 23.3088 90.7351 25.1385V32.6167C90.7351 33.7213 89.8397 34.6167 88.7351 34.6167H86.1513C85.0467 34.6167 84.1513 33.7213 84.1513 32.6167V17.2212C84.1513 16.1166 85.0467 15.2212 86.1513 15.2212H89.0334C89.9733 15.2212 90.7351 15.9831 90.7351 16.9229V18.5124C90.7351 18.5743 90.7853 18.6246 90.8473 18.6246C90.891 18.6246 90.9307 18.599 90.9496 18.5596C91.5173 17.3739 92.4634 16.5295 93.7879 16.0263C95.1366 15.4896 96.9634 15.2212 99.2683 15.2212Z"
        fill={textColor}
      />

      {/* "u" */}
      <path
        d="M102.017 26.8951V17.2212C102.017 16.1166 102.913 15.2212 104.017 15.2212H106.564C107.669 15.2212 108.564 16.1166 108.564 17.2212V25.8338C108.564 27.5416 108.994 28.6761 109.852 29.2372C110.71 29.7739 112.034 30.0423 113.824 30.0423C115.884 30.0423 117.416 29.6641 118.422 28.9078C119.452 28.1271 119.967 26.8219 119.967 24.9921V17.2212C119.967 16.1166 120.862 15.2212 121.967 15.2212H124.55C125.655 15.2212 126.55 16.1166 126.55 17.2212V32.6167C126.55 33.7213 125.655 34.6167 124.55 34.6167H121.687C120.737 34.6167 119.967 33.8466 119.967 32.8967V31.3137C119.967 31.2381 119.905 31.1767 119.83 31.1767C119.778 31.1767 119.731 31.2058 119.707 31.2513C118.393 33.7389 115.684 34.9826 111.581 34.9826C110.085 34.9826 108.797 34.8729 107.719 34.6533C106.664 34.4337 105.683 34.0434 104.776 33.4822C103.869 32.9211 103.182 32.0916 102.716 30.9938C102.25 29.8959 102.017 28.5297 102.017 26.8951Z"
        fill={textColor}
      />

      {/* "p" */}
      <path
        d="M131.411 40.8379C130.306 40.8379 129.411 39.9424 129.411 38.8379V17.2212C129.411 16.1166 130.306 15.2212 131.411 15.2212H134.238C135.188 15.2212 135.958 15.9912 135.958 16.9412V18.5488C135.958 18.6109 136.008 18.6611 136.07 18.6611C136.114 18.6611 136.153 18.6357 136.172 18.5963C136.79 17.3121 137.834 16.37 139.305 15.7701C140.801 15.1602 142.873 14.8552 145.521 14.8552H146.33C150.057 14.8552 152.865 15.5505 154.753 16.9412C156.666 18.3318 157.622 20.7349 157.622 24.1504V25.6874C157.622 29.103 156.666 31.5061 154.753 32.8967C152.865 34.2873 150.057 34.9826 146.33 34.9826H145.521C142.873 34.9826 140.801 34.6777 139.305 34.0677C137.834 33.4679 136.79 32.5258 136.172 31.2415C136.153 31.2022 136.114 31.1767 136.07 31.1767C136.008 31.1767 135.958 31.227 135.958 31.289V38.8379C135.958 39.9424 135.062 40.8379 133.958 40.8379H131.411ZM149.346 20.7105C148.218 20.1005 146.269 19.7956 143.498 19.7956C140.727 19.7956 138.778 20.1005 137.65 20.7105C136.522 21.296 135.958 22.5402 135.958 24.4432V25.3947C135.958 27.2732 136.522 28.5175 137.65 29.1274C138.802 29.7373 140.752 30.0423 143.498 30.0423C146.269 30.0423 148.218 29.7495 149.346 29.164C150.474 28.5541 151.038 27.2976 151.038 25.3947V24.4432C151.038 22.5402 150.474 21.296 149.346 20.7105Z"
        fill={textColor}
      />

      {/* "t" */}
      <path
        d="M163.354 21.9054C163.354 20.8008 162.458 19.9054 161.354 19.9054H160.462C159.357 19.9054 158.462 19.01 158.462 17.9054V17.2212C158.462 16.1166 159.357 15.2212 160.462 15.2212H161.354C162.458 15.2212 163.354 14.3258 163.354 13.2212V11C163.354 9.89543 164.249 9 165.354 9H167.901C169.006 9 169.901 9.89543 169.901 11V13.2212C169.901 14.3258 170.796 15.2212 171.901 15.2212H174.705C175.81 15.2212 176.705 16.1166 176.705 17.2212V17.9054C176.705 19.01 175.81 19.9054 174.705 19.9054H171.901C170.796 19.9054 169.901 20.8008 169.901 21.9054V26.0168C169.901 27.7002 170.244 28.7858 170.931 29.2738C171.642 29.7617 172.991 30.0057 174.977 30.0057C175.931 30.0057 176.705 30.7797 176.705 31.7344V32.6167C176.705 33.7213 175.81 34.6167 174.705 34.6167H172.696C169.19 34.6167 166.75 34.0556 165.377 32.9333C164.028 31.7867 163.354 29.8105 163.354 27.0049V21.9054Z"
        fill={textColor}
      />
    </svg>
  )
}
DisruptFullLogo.displayName = 'DisruptFullLogo'

/**
 * BeatingHeart - Animated heart icon with realistic lub-dub pattern.
 *
 * @internal Not exported - used only within MadeWithLove component.
 */
function BeatingHeart({ color, size = 'md' }: BeatingHeartProps) {
  return (
    <motion.div
      className="inline-flex items-center justify-center"
      animate={{
        scale: HEARTBEAT_SCALE_VALUES,
      }}
      transition={{
        duration: HEARTBEAT_DURATION_SECONDS,
        repeat: Infinity,
        repeatDelay: HEARTBEAT_REPEAT_DELAY_SECONDS,
        ease: 'easeInOut',
        times: HEARTBEAT_KEYFRAME_TIMES,
      }}
    >
      <Heart
        className={HEART_SIZE_CLASSES[size]}
        fill={color}
        color={color}
        strokeWidth={0}
        aria-hidden="true"
      />
    </motion.div>
  )
}
BeatingHeart.displayName = 'BeatingHeart'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * MadeWithLove - A footer badge with a beating heart and full Disrupt logo.
 *
 * Displays "Made with ❤️ by Disrupt" branding badge. Features a realistic
 * double-beat heartbeat animation (lub-dub pattern) that mimics a real heart.
 *
 * @component ATOM
 *
 * @example
 * ```tsx
 * // Default - links to disruptinc.io
 * <MadeWithLove colorMode="dark" />
 *
 * // In footer on dark background
 * <MadeWithLove colorMode="light" />
 *
 * // Custom link
 * <MadeWithLove href="https://custom-url.com" />
 *
 * // With click handler (overrides link)
 * <MadeWithLove onClick={() => console.log('clicked')} />
 * ```
 *
 * **Features:**
 * - Realistic double-beat heartbeat animation (lub-dub pattern)
 * - Full Disrupt logo with text (no tagline)
 * - Properly aligned text and logo baseline
 * - Supports light/dark color modes
 * - Links to Disrupt website by default
 * - Keyboard accessible when used with onClick
 *
 * **Testing:**
 * - `data-slot="made-with-love"` - Root container
 * - Supports `data-testid` via className override
 *
 * **Accessibility:**
 * - External link includes `rel="noopener noreferrer"`
 * - Button mode supports keyboard navigation (Enter key)
 * - Decorative SVG and heart icons are aria-hidden
 *
 * @see {@link https://disruptinc.io/} Disrupt Inc website
 */
export function MadeWithLove({
  className,
  colorMode = 'dark',
  onClick,
  href = DISRUPT_URL,
}: MadeWithLoveProps) {
  const textColor = colorMode === 'light' ? ALIAS.text.inverse : ALIAS.text.primary
  const heartColor = ALIAS.status.error

  const content = (
    <>
      <span
        className="text-sm font-medium"
        style={{ color: textColor }}
      >
        Made with
      </span>
      <BeatingHeart color={heartColor} />
      <span
        className="text-sm font-medium"
        style={{ color: textColor }}
      >
        by
      </span>
      <DisruptFullLogo textColor={textColor} />
    </>
  )

  // If onClick is provided, use a div with click handler
  if (onClick) {
    return (
      <div
        data-slot="made-with-love"
        className={cn(
          'inline-flex items-center gap-2 select-none cursor-pointer',
          'hover:opacity-80 transition-opacity',
          className
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        {content}
      </div>
    )
  }

  // Default: render as a link to Disrupt website
  return (
    <a
      data-slot="made-with-love"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 select-none',
        'hover:opacity-80 transition-opacity no-underline',
        className
      )}
    >
      {content}
    </a>
  )
}
MadeWithLove.displayName = 'MadeWithLove'

export default MadeWithLove
