/**
 * UserAvatar - Displays user avatar icon
 * @module partners/components/UserAvatar
 */

import { User } from "lucide-react"

/**
 * UserAvatar - Renders a circular avatar with user icon
 */
export function UserAvatar() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-bg">
      <User className="h-4 w-4 text-primary" />
    </div>
  )
}
