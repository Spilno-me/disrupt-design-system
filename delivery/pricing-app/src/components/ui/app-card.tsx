import * as React from 'react'
import { cn } from '../../lib/utils'

const AppCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-[var(--color-default)] bg-[var(--color-surface)] shadow-md',
      className
    )}
    {...props}
  />
))
AppCard.displayName = 'AppCard'

const AppCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)}
    {...props}
  />
))
AppCardHeader.displayName = 'AppCardHeader'

const AppCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-[var(--color-primary)]',
      className
    )}
    {...props}
  />
))
AppCardTitle.displayName = 'AppCardTitle'

const AppCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-[var(--color-muted)]', className)}
    {...props}
  />
))
AppCardDescription.displayName = 'AppCardDescription'

const AppCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
AppCardContent.displayName = 'AppCardContent'

const AppCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
AppCardFooter.displayName = 'AppCardFooter'

export {
  AppCard,
  AppCardHeader,
  AppCardFooter,
  AppCardTitle,
  AppCardDescription,
  AppCardContent,
}
