import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight, type LucideIcon } from "lucide-react"

import { cn } from "../../lib/utils"

// =============================================================================
// SPLIT BUTTON - Diagonal divider design inspired by Cohere/Pentagram
// =============================================================================

const splitButtonVariants = cva(
  "inline-flex items-stretch p-0 overflow-hidden cursor-pointer font-medium font-sans transition-all duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30",
  {
    variants: {
      variant: {
        primary: "bg-accent-dark rounded-xl",
        secondary: "bg-inverse-bg/80 rounded-xl",
        destructive: "bg-error-strong/80 rounded-xl",
        success: "bg-success-strong/80 rounded-xl",
        outline: "bg-muted-bg border border-default rounded-xl",
      },
      size: {
        sm: "text-sm rounded-md",
        default: "text-base rounded-xl",
        lg: "text-lg rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

// Main section (text) variants
const mainSectionVariants = cva(
  "flex items-center relative z-[1] transition-colors duration-150",
  {
    variants: {
      variant: {
        primary: "bg-accent-strong text-inverse hover:bg-accent-strong/90",
        secondary: "bg-inverse-bg text-inverse hover:bg-inverse-bg/90",
        destructive: "bg-error-strong text-inverse hover:bg-error-strong/90",
        success: "bg-success-strong text-inverse hover:bg-success-strong/90",
        outline: "bg-surface text-primary hover:bg-page",
      },
      size: {
        sm: "py-3 pl-5 pr-9 -mr-3",
        default: "py-4 pl-7 pr-12 -mr-4",
        lg: "py-5 pl-8 pr-14 -mr-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

// Icon section variants
const iconSectionVariants = cva(
  "flex items-center justify-center transition-colors duration-150",
  {
    variants: {
      variant: {
        primary: "bg-accent-dark text-inverse hover:bg-accent-dark/80",
        secondary: "bg-inverse-bg/80 text-inverse hover:bg-inverse-bg/60",
        destructive: "bg-error-strong/80 text-inverse hover:bg-error-strong/60",
        success: "bg-success-strong/80 text-inverse hover:bg-success-strong/60",
        outline: "bg-muted-bg text-secondary hover:bg-page",
      },
      size: {
        sm: "w-13 px-4",
        default: "w-16 px-6",
        lg: "w-19 px-7",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

// Clip paths for diagonal effect (CSS custom properties via style)
const CLIP_PATHS = {
  sm: "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 0 100%)",
  default: "polygon(0 0, calc(100% - 16px) 0, 100% 100%, 0 100%)",
  lg: "polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0 100%)",
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
        {/* Main text section with diagonal clip */}
        <span
          className={cn(mainSectionVariants({ variant, size }))}
          style={{ clipPath }}
        >
          <span className="truncate">{children}</span>
        </span>

        {/* Icon section */}
        {!hideIcon && (
          <span
            onClick={onIconClick ? handleIconClick : undefined}
            className={cn(
              iconSectionVariants({ variant, size }),
              onIconClick && "cursor-pointer"
            )}
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
