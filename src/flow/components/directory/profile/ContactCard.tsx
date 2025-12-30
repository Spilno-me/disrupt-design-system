/**
 * ContactCard - Contact information card for user profile
 *
 * Displays all contact methods with copy-to-clipboard and quick actions.
 */

import * as React from 'react'
import { useState } from 'react'
import {
  Mail,
  Phone,
  Building2,
  Clock,
  Globe,
  AlertTriangle,
  MessageSquare,
  Hash,
  Copy,
  Check,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { UserProfileData } from '../types'

interface ContactCardProps {
  /** User profile data */
  profile: UserProfileData
  /** Callback to send email */
  onEmail?: (email: string) => void
  /** Callback to make phone call */
  onCall?: (phone: string) => void
  /** Callback to open Teams chat */
  onTeamsChat?: (teamsEmail: string) => void
  /** Callback to open Slack chat */
  onSlackChat?: (slackHandle: string) => void
}

interface ContactItemProps {
  icon: React.ElementType
  label: string
  value: string
  onCopy?: () => void
  onClick?: () => void
  iconClassName?: string
}

function ContactItem({
  icon: Icon,
  label,
  value,
  onCopy,
  onClick,
  iconClassName,
}: ContactItemProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-default last:border-b-0">
      <div className={cn(
        'flex items-center justify-center size-10 rounded-full bg-accent/10 shrink-0',
        iconClassName
      )}>
        <Icon className="size-5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-tertiary">{label}</p>
        <p className="text-sm font-medium text-primary truncate">{value}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="size-4 text-success" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? 'Copied!' : 'Copy'}</TooltipContent>
        </Tooltip>
        {onClick && (
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0"
            onClick={onClick}
          >
            <Icon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function ContactCard({
  profile,
  onEmail,
  onCall,
  onTeamsChat,
  onSlackChat,
}: ContactCardProps) {
  return (
    <div className="p-4 bg-surface border border-default rounded-xl">
      <h3 className="text-sm font-semibold text-primary mb-3">
        Contact Information
      </h3>

      <div className="divide-y divide-default">
        {/* Email */}
        <ContactItem
          icon={Mail}
          label="Email"
          value={profile.email}
          onClick={() => onEmail?.(profile.email)}
        />

        {/* Phone */}
        {profile.phone && (
          <ContactItem
            icon={Phone}
            label="Phone"
            value={profile.phone}
            onClick={() => onCall?.(profile.phone!)}
          />
        )}

        {/* Office location */}
        {profile.officeLocation && (
          <ContactItem
            icon={Building2}
            label="Office"
            value={profile.officeLocation}
          />
        )}

        {/* Working hours */}
        {profile.workingHours && (
          <ContactItem
            icon={Clock}
            label="Working Hours"
            value={profile.workingHours}
          />
        )}

        {/* Timezone */}
        {profile.timezone && (
          <ContactItem
            icon={Globe}
            label="Timezone"
            value={profile.timezone}
          />
        )}

        {/* Teams */}
        {profile.teamsEmail && (
          <ContactItem
            icon={MessageSquare}
            label="Microsoft Teams"
            value={profile.teamsEmail}
            onClick={() => onTeamsChat?.(profile.teamsEmail!)}
          />
        )}

        {/* Slack */}
        {profile.slackHandle && (
          <ContactItem
            icon={Hash}
            label="Slack"
            value={`@${profile.slackHandle}`}
            onClick={() => onSlackChat?.(profile.slackHandle!)}
          />
        )}

        {/* Emergency contact flag */}
        {profile.isEmergencyContact && (
          <div className="flex items-center gap-3 py-3 bg-error/5 rounded-lg px-3 mt-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-error/10 shrink-0">
              <AlertTriangle className="size-5 text-error" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-error">Emergency Contact</p>
              <p className="text-xs text-error/80">
                Available for emergency response situations
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

ContactCard.displayName = 'ContactCard'

export default ContactCard
