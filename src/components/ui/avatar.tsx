"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

// =============================================================================
// AVATAR VARIANTS
// =============================================================================

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center rounded-full bg-accent-bg text-primary font-medium",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// =============================================================================
// AVATAR COMPONENTS
// =============================================================================

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

/**
 * Avatar - Displays user profile image with fallback support.
 * @component ATOM
 *
 * @example
 * // With image
 * <Avatar>
 *   <AvatarImage src="/user.jpg" alt="John Doe" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 *
 * @example
 * // Initials only
 * <Avatar size="lg">
 *   <AvatarFallback>AB</AvatarFallback>
 * </Avatar>
 */
function Avatar({ className, size, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, className }))}
      {...props}
    />
  )
}

/**
 * AvatarImage - The image element within Avatar.
 * Automatically hides if image fails to load.
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
}

/**
 * AvatarFallback - Displays when image is loading or unavailable.
 * Typically shows user initials.
 */
interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {}

function AvatarFallback({ className, size, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackVariants({ size, className }))}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants }
