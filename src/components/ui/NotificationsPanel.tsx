import * as React from 'react'
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Users,
  FileText,
  Zap,
  Building2,
  AlertTriangle,
  Clock,
  Trash2,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'
import { Separator } from './separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet'

// =============================================================================
// TYPES
// =============================================================================

export type NotificationType = 'lead' | 'invoice' | 'tenant' | 'partner' | 'system' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

export interface NotificationsPanelProps {
  /** List of notifications */
  notifications: Notification[]
  /** Whether the panel is open */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Callback when a notification is clicked */
  onNotificationClick?: (notification: Notification) => void
  /** Callback when a notification is marked as read */
  onMarkAsRead?: (notificationId: string) => void
  /** Callback when all notifications are marked as read */
  onMarkAllAsRead?: () => void
  /** Callback when a notification is deleted */
  onDelete?: (notificationId: string) => void
  /** Callback when all notifications are cleared */
  onClearAll?: () => void
  /** Custom trigger element */
  trigger?: React.ReactNode
  /** Additional className */
  className?: string
}

// =============================================================================
// NOTIFICATION ICONS
// =============================================================================

const notificationIcons: Record<NotificationType, { icon: React.ReactNode; className: string }> = {
  lead: { icon: <Users className="w-5 h-5" />, className: 'bg-accent/10 text-accent' },
  invoice: { icon: <FileText className="w-5 h-5" />, className: 'bg-success/10 text-success' },
  tenant: { icon: <Zap className="w-5 h-5" />, className: 'bg-warning/10 text-warning' },
  partner: { icon: <Building2 className="w-5 h-5" />, className: 'bg-info/10 text-info' },
  system: { icon: <Bell className="w-5 h-5" />, className: 'bg-muted-bg text-secondary' },
  warning: { icon: <AlertTriangle className="w-5 h-5" />, className: 'bg-error/10 text-error' },
}

// =============================================================================
// NOTIFICATIONS PANEL COMPONENT
// =============================================================================

export function NotificationsPanel({
  notifications,
  open,
  onOpenChange,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  trigger,
  className,
}: NotificationsPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  const defaultTrigger = (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-inverse text-xs font-medium rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent side="right" className={cn('w-full sm:max-w-md p-0', className)}>
        <SheetHeader className="px-4 py-3 border-b border-default">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-error text-inverse text-xs font-medium rounded-full">
                  {unreadCount}
                </span>
              )}
            </SheetTitle>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted-bg flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted" />
              </div>
              <p className="text-primary font-medium">No notifications</p>
              <p className="text-sm text-secondary mt-1">
                You're all caught up! Check back later.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-default">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => onNotificationClick?.(notification)}
                  onMarkAsRead={() => onMarkAsRead?.(notification.id)}
                  onDelete={() => onDelete?.(notification.id)}
                />
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-default">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="w-full text-error hover:text-error hover:bg-errorLight"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all notifications
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

// =============================================================================
// NOTIFICATION ITEM COMPONENT
// =============================================================================

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
  onMarkAsRead?: () => void
  onDelete?: () => void
}

function NotificationItem({
  notification,
  onClick,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const { icon, className } = notificationIcons[notification.type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 cursor-pointer hover:bg-muted-bg transition-colors',
        !notification.read && 'bg-accent-bg/30'
      )}
      onClick={onClick}
    >
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', className)}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm font-medium text-primary', !notification.read && 'font-semibold')}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-sm text-secondary line-clamp-2 mt-0.5">{notification.message}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock className="w-3 h-3" />
            {notification.timestamp}
          </span>
          {notification.actionLabel && (
            <span className="text-xs text-accent hover:underline">
              {notification.actionLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onMarkAsRead?.()
            }}
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted hover:text-error"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// NOTIFICATION BELL WITH BADGE
// =============================================================================

export interface NotificationBellProps {
  count: number
  onClick?: () => void
  className?: string
}

export function NotificationBell({ count, onClick, className }: NotificationBellProps) {
  return (
    <button
      className={cn(
        'relative p-2 rounded-lg hover:bg-muted-bg transition-colors',
        className
      )}
      onClick={onClick}
    >
      <Bell className="w-5 h-5 text-primary" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-error text-inverse text-xs font-medium rounded-full flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

export default NotificationsPanel
