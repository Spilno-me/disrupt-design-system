import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight, type LucideIcon } from "lucide-react"

import { cn } from "../../lib/utils"

// =============================================================================
// SPLIT BUTTON - Diagonal divider design inspired by Cohere/Pentagram
// =============================================================================

const splitButtonVariants = cva(
  "group inline-flex items-stretch p-0 overflow-visible cursor-pointer font-medium font-sans transition-all duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30 drop-shadow",
  {
    variants: {
      variant: {
        primary: "bg-transparent",
        secondary: "bg-transparent",
        destructive: "bg-transparent",
        success: "bg-transparent",
        outline: "bg-transparent drop-shadow-md",  // Stronger shadow for outline
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

// Main section (text) variants
// Primary uses dark text on bright teal (per reference design)
// Other colored variants keep white text on their darker backgrounds
// flex-1 ensures main section grows to fill available space in full-width mode
const mainSectionVariants = cva(
  "flex flex-1 items-center relative z-[1] transition-colors duration-150 rounded-l-xl",
  {
    variants: {
      variant: {
        primary: "bg-accent-strong text-inverse-bg hover:bg-accent-strong/90",  // Dark text on bright teal
        secondary: "bg-accent-dark text-accent-strong hover:bg-accent-dark/90", // Teal text on dark teal (inverted primary)
        destructive: "bg-error-strong text-on-status hover:bg-error-strong/90", // White text on red (WCAG AA)
        success: "bg-success-strong text-on-status hover:bg-success-strong/90", // White text on green (WCAG AA)
        outline: "bg-surface text-primary hover:bg-page",                         // Dark text on white
      },
      size: {
        sm: "py-3 pl-5 pr-8",
        default: "py-4 pl-7 pr-10",
        lg: "py-5 pl-8 pr-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

// Icon section variants
// Asymmetric padding: more on left (diagonal overlap area) than right
// Icon color matches the MAIN section color (not white) for visual continuity
// shrink-0 ensures icon section stays fixed width in full-width mode
const iconSectionVariants = cva(
  "flex shrink-0 items-center justify-center transition-colors duration-150 rounded-r-xl",
  {
    variants: {
      variant: {
        // Icon section: darker shade with contrasting icon color
        primary: "bg-accent-dark text-accent-strong hover:bg-accent-dark/80",     // Teal icon on dark teal
        secondary: "bg-accent-strong text-inverse-bg hover:bg-accent-strong/80", // Dark icon on bright teal (inverted primary)
        destructive: "bg-[#7F1D1D] text-on-status hover:bg-[#7F1D1D]/80",           // White icon on darker red
        success: "bg-success-dark text-on-status hover:bg-success-dark/80",        // White icon on darker green
        outline: "bg-muted-bg text-primary hover:bg-page",                          // Dark icon on light bg
      },
      size: {
        // -ml matches clip diagonal so sections connect perfectly on hover
        // Transform creates the "cut off" gap by default
        sm: "-ml-[18px] pl-6 pr-4",
        default: "-ml-[21px] pl-7 pr-5",
        lg: "-ml-[26px] pl-8 pr-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

// Clip paths for diagonal effect - steep angle matching Figma (21px over 75px height)
const CLIP_PATHS = {
  sm: "polygon(0 0, calc(100% - 18px) 0, 100% 100%, 0 100%)",
  default: "polygon(0 0, calc(100% - 21px) 0, 100% 100%, 0 100%)",
  lg: "polygon(0 0, calc(100% - 26px) 0, 100% 100%, 0 100%)",
} as const

// Inverse clip paths for icon section (diagonal from bottom-left to match main section)
const ICON_CLIP_PATHS = {
  sm: "polygon(0 0, 100% 0, 100% 100%, 18px 100%)",
  default: "polygon(0 0, 100% 0, 100% 100%, 21px 100%)",
  lg: "polygon(0 0, 100% 0, 100% 100%, 26px 100%)",
} as const

const ICON_SIZES = {
  sm: 16,
  default: 20,
  lg: 24,
} as const

// =============================================================================
// COMPONENT PROPS
// =============================================================================

interface SplitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof splitButtonVariants> {
  /** Icon component to display in the action section */
  icon?: LucideIcon
  /** Hide the icon section entirely */
  hideIcon?: boolean
  /** Click handler for the icon section (makes it a separate action) */
  onIconClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
  /** Full width mode */
  fullWidth?: boolean
}

// =============================================================================
// SPLIT BUTTON COMPONENT
// =============================================================================

const SplitButton = React.forwardRef<HTMLButtonElement, SplitButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      icon: Icon = ArrowRight,
      hideIcon = false,
      onIconClick,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const iconSize = ICON_SIZES[size || "default"]
    const clipPath = CLIP_PATHS[size || "default"]
    const iconClipPath = ICON_CLIP_PATHS[size || "default"]

    const handleIconClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (onIconClick) {
        e.stopPropagation()
        onIconClick(e)
      }
    }

    return (
      <button
        ref={ref}
        className={cn(
          splitButtonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {/* Main text section - diagonal clip only when icon is visible */}
        <span
          className={cn(
            mainSectionVariants({ variant, size }),
            hideIcon && "rounded-r-xl",  // Full rounded corners when no icon
            hideIcon && variant === "outline" && "border border-default shadow-sm"  // Match regular Button outline
          )}
          style={hideIcon ? undefined : { clipPath }}
        >
          <span className="truncate">{children}</span>
        </span>

        {/* Icon section - cut off piece with matching diagonal, gap visible, reconnects on hover */}
        {!hideIcon && (
          <span
            onClick={onIconClick ? handleIconClick : undefined}
            className={cn(
              iconSectionVariants({ variant, size }),
              "transition-transform duration-300 ease-out translate-x-[5px] translate-y-[2px] group-hover:translate-x-0 group-hover:translate-y-0",
              onIconClick && "cursor-pointer"
            )}
            style={{ clipPath: iconClipPath }}
            aria-hidden={!onIconClick}
          >
            <Icon size={iconSize} strokeWidth={2} />
          </span>
        )}
      </button>
    )
  }
)

SplitButton.displayName = "SplitButton"

export { SplitButton, splitButtonVariants }
export type { SplitButtonProps }
