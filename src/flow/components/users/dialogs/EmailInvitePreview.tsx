/**
 * EmailInvitePreview - Simulated email invitation preview
 *
 * A realistic email preview component for demonstrating the invitation flow.
 * Styled to look like a modern email client with the invitation content.
 */

import * as React from 'react'
import {
  Mail,
  ArrowLeft,
  Star,
  Trash2,
  Archive,
  MoreHorizontal,
  Clock,
  Shield,
  ExternalLink,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent } from '../../../../components/ui/card'
import { LOGOS } from '../../../../assets/logos'

// =============================================================================
// TYPES
// =============================================================================

export interface EmailInvitePreviewProps {
  /** Recipient's name */
  recipientName: string
  /** Recipient's email */
  recipientEmail: string
  /** Person who sent the invitation */
  invitedBy: string
  /** Company name */
  companyName: string
  /** Role being assigned */
  roleName: string
  /** Location being assigned */
  locationName?: string
  /** Custom message from inviter */
  customMessage?: string
  /** Time the email was "sent" */
  sentTime?: string
  /** Callback when activate button is clicked */
  onActivateClick?: () => void
  /** Callback when back button is clicked */
  onBackClick?: () => void
  /** Show full email client chrome (header, sidebar hint) */
  showChrome?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EmailInvitePreview({
  recipientName,
  recipientEmail,
  invitedBy,
  companyName,
  roleName,
  locationName,
  customMessage,
  sentTime = '2 minutes ago',
  onActivateClick,
  onBackClick,
  showChrome = true,
}: EmailInvitePreviewProps) {
  return (
    <div className="bg-surface rounded-xl border-2 border-default shadow-lg overflow-hidden max-w-2xl mx-auto">
      {/* Email client header */}
      {showChrome && (
        <div className="bg-muted-bg border-b border-default px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBackClick && (
                <Button variant="ghost" size="sm" onClick={onBackClick}>
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Mail className="size-4" />
                <span>Inbox</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <Archive className="size-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="size-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Star className="size-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Email header */}
      <div className="px-6 py-4 border-b border-default">
        <div className="flex items-start gap-4">
          {/* Sender avatar with glass formula */}
          <div className="size-12 rounded-full bg-accent/20 dark:bg-accent/20 border-2 border-accent/40 flex items-center justify-center shrink-0">
            <Shield className="size-6 text-accent" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Subject */}
            <h2 className="text-lg font-semibold text-primary">
              You've been invited to join {companyName}
            </h2>

            {/* From/To info */}
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-secondary w-12">From:</span>
                <span className="text-primary font-medium">
                  {companyName} EHS Platform
                </span>
                <span className="text-tertiary">
                  &lt;noreply@{companyName.toLowerCase().replace(/\s/g, '')}.com&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-secondary w-12">To:</span>
                <span className="text-primary">{recipientEmail}</span>
              </div>
            </div>

            {/* Time */}
            <div className="mt-2 flex items-center gap-1.5 text-xs text-tertiary">
              <Clock className="size-3" />
              {sentTime}
            </div>
          </div>
        </div>
      </div>

      {/* Email body */}
      <div className="px-6 py-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={LOGOS.flow.dark}
            alt={`${companyName} Logo`}
            className="h-10 w-auto"
          />
        </div>

        {/* Email content card with colored glass */}
        <Card className="border-2 border-accent/40 bg-accent/20 dark:bg-accent/20 shadow-sm">
          <CardContent className="p-6 text-center space-y-6">
            {/* Main message */}
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-primary">
                Welcome to {companyName}, {recipientName}!
              </h3>
              <p className="text-secondary">
                <span className="font-medium text-primary">{invitedBy}</span> has invited you
                to join the {companyName} EHS Platform.
              </p>
            </div>

            {/* Role & Location info - Glass layer */}
            <div className="bg-white/60 dark:bg-black/60 rounded-lg p-4 space-y-3 text-left border border-default">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-secondary">Your Role:</span>
                  <p className="font-medium text-primary mt-0.5">{roleName}</p>
                </div>
                {locationName && (
                  <div>
                    <span className="text-secondary">Primary Location:</span>
                    <p className="font-medium text-primary mt-0.5">{locationName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Custom message - Glass layer */}
            {customMessage && (
              <div className="bg-white/40 dark:bg-black/40 rounded-lg p-4 text-left border border-muted">
                <p className="text-xs text-secondary mb-1">Message from {invitedBy}:</p>
                <p className="text-sm text-primary italic">"{customMessage}"</p>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                size="lg"
                className="min-w-[200px]"
                onClick={onActivateClick}
              >
                Activate Your Account
                <ExternalLink className="ml-2 size-4" />
              </Button>
            </div>

            {/* Expiry notice */}
            <p className="text-xs text-tertiary">
              This invitation link will expire in 7 days.
            </p>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-default">
          <div className="text-center space-y-4">
            <p className="text-xs text-secondary">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
            <p className="text-xs text-tertiary">
              This email was sent by {companyName} • 123 Business Park, Houston, TX 77001
            </p>
            <div className="flex justify-center gap-4 text-xs">
              <a href="#" className="text-link hover:underline">Privacy Policy</a>
              <span className="text-muted">•</span>
              <a href="#" className="text-link hover:underline">Terms of Service</a>
              <span className="text-muted">•</span>
              <a href="#" className="text-link hover:underline">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

EmailInvitePreview.displayName = 'EmailInvitePreview'

export default EmailInvitePreview
