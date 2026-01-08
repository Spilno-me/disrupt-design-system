/**
 * HelpContent - Help tab content for Partner Portal
 *
 * Help articles, search, and support contact.
 */

import * as React from 'react'
import { HelpPage, HelpArticle } from '../../../components/partners/HelpPage'

export interface HelpContentProps {
  /** Callback when article is clicked */
  onArticleClick?: (article: HelpArticle) => void
  /** Callback when contacting support */
  onContactSupport?: () => void
  /** Callback when searching */
  onSearch?: (query: string) => void
}

export function HelpContent({
  onArticleClick,
  onContactSupport,
  onSearch,
}: HelpContentProps) {
  return (
    <HelpPage
      onArticleClick={onArticleClick}
      onContactSupport={onContactSupport}
      onSearch={onSearch}
    />
  )
}
