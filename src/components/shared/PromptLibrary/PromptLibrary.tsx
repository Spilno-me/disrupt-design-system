/**
 * PromptLibrary - Interactive documentation for agent prompts
 *
 * Features:
 * - Search across all prompts
 * - Category filtering with tabs
 * - Expandable prompt cards
 * - Copy-to-clipboard
 * - Variable highlighting
 *
 * Uses DDS semantic Tailwind classes (no primitive tokens)
 */

import * as React from 'react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  FileCode,
  Palette,
  FileText,
  ClipboardCheck,
  BookOpen,
  Brush,
  Brain,
  Smartphone,
  Grid3X3,
  Package,
  Plug,
  TestTube2,
} from 'lucide-react'
import { cn } from '../../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface Prompt {
  id: string
  title: string
  description: string
  category: PromptCategory
  prompt: string
  variables?: string[]
  tags?: string[]
}

export type PromptCategory =
  | 'planning'
  | 'stories'
  | 'components'
  | 'tokens'
  | 'styling'
  | 'ux'
  | 'responsive'
  | 'icons'
  | 'documentation'
  | 'review'
  | 'testing'
  | 'delivery'
  | 'mcp'

// =============================================================================
// CATEGORY CONFIG - Using Tailwind classes
// =============================================================================

const CATEGORY_CONFIG: Record<
  PromptCategory,
  {
    label: string
    icon: React.ReactNode
    badgeClass: string
    activeClass: string
    headerClass: string
  }
> = {
  planning: {
    label: 'Planning',
    icon: <Brain className="w-4 h-4" />,
    badgeClass: 'bg-accent-subtle text-accent',
    activeClass: 'bg-accent-strong text-inverse',
    headerClass: 'text-accent',
  },
  stories: {
    label: 'Stories',
    icon: <BookOpen className="w-4 h-4" />,
    badgeClass: 'bg-accent-subtle text-accent',
    activeClass: 'bg-accent-strong text-inverse',
    headerClass: 'text-accent',
  },
  components: {
    label: 'Components',
    icon: <Sparkles className="w-4 h-4" />,
    badgeClass: 'bg-success-subtle text-success',
    activeClass: 'bg-success-strong text-inverse',
    headerClass: 'text-success',
  },
  tokens: {
    label: 'Tokens',
    icon: <Palette className="w-4 h-4" />,
    badgeClass: 'bg-error-subtle text-error',
    activeClass: 'bg-error-strong text-inverse',
    headerClass: 'text-error',
  },
  documentation: {
    label: 'Documentation',
    icon: <FileText className="w-4 h-4" />,
    badgeClass: 'bg-muted-bg text-primary',
    activeClass: 'bg-inverse-bg text-inverse',
    headerClass: 'text-primary',
  },
  review: {
    label: 'Review',
    icon: <ClipboardCheck className="w-4 h-4" />,
    badgeClass: 'bg-warning-subtle text-warning',
    activeClass: 'bg-warning-strong text-inverse',
    headerClass: 'text-warning',
  },
  testing: {
    label: 'Testing',
    icon: <TestTube2 className="w-4 h-4" />,
    badgeClass: 'bg-success-subtle text-success',
    activeClass: 'bg-success-strong text-inverse',
    headerClass: 'text-success',
  },
  styling: {
    label: 'Styling',
    icon: <Brush className="w-4 h-4" />,
    badgeClass: 'bg-info-subtle text-info',
    activeClass: 'bg-info-strong text-inverse',
    headerClass: 'text-info',
  },
  ux: {
    label: 'UX',
    icon: <Brain className="w-4 h-4" />,
    badgeClass: 'bg-accent-subtle text-accent',
    activeClass: 'bg-accent-strong text-inverse',
    headerClass: 'text-accent',
  },
  responsive: {
    label: 'Responsive',
    icon: <Smartphone className="w-4 h-4" />,
    badgeClass: 'bg-success-subtle text-success',
    activeClass: 'bg-success-strong text-inverse',
    headerClass: 'text-success',
  },
  icons: {
    label: 'Icons',
    icon: <Grid3X3 className="w-4 h-4" />,
    badgeClass: 'bg-muted-bg text-secondary',
    activeClass: 'bg-inverse-bg text-inverse',
    headerClass: 'text-secondary',
  },
  delivery: {
    label: 'Delivery',
    icon: <Package className="w-4 h-4" />,
    badgeClass: 'bg-error-subtle text-error',
    activeClass: 'bg-error-strong text-inverse',
    headerClass: 'text-error',
  },
  mcp: {
    label: 'MCP Tools',
    icon: <Plug className="w-4 h-4" />,
    badgeClass: 'bg-info-subtle text-info',
    activeClass: 'bg-info-strong text-inverse',
    headerClass: 'text-info',
  },
}

// =============================================================================
// HELPER: Parse prompt text and highlight variables safely
// =============================================================================

function HighlightedPrompt({
  text,
  variables,
}: {
  text: string
  variables?: string[]
}) {
  if (!variables || variables.length === 0) {
    return <span>{text}</span>
  }

  // Create regex pattern for all variables
  const pattern = new RegExp(`(\\{(?:${variables.join('|')})\\})`, 'g')
  const parts = text.split(pattern)

  return (
    <>
      {parts.map((part, index) => {
        const isVariable = variables.some((v) => part === `{${v}}`)
        if (isVariable) {
          return (
            <span
              key={index}
              className="px-1 py-0.5 rounded text-xs font-mono bg-accent-subtle text-accent"
            >
              {part}
            </span>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}

// =============================================================================
// PROMPT CARD COMPONENT
// =============================================================================

interface PromptCardProps {
  prompt: Prompt
  isExpanded: boolean
  onToggle: () => void
}

function PromptCard({ prompt, isExpanded, onToggle }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const config = CATEGORY_CONFIG[prompt.category]

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(prompt.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      layout
      className="border border-default rounded-lg overflow-hidden bg-surface"
    >
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted-bg/50 transition-colors text-left"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4 text-secondary" />
        </motion.div>

        {/* Category badge */}
        <span
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
            config.badgeClass
          )}
        >
          {config.icon}
          {config.label}
        </span>

        {/* Title */}
        <span className="font-medium text-primary flex-1">{prompt.title}</span>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="p-2 rounded-md hover:bg-muted-bg transition-colors"
          title="Copy prompt"
        >
          {copied ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <Copy className="w-4 h-4 text-secondary" />
          )}
        </button>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 border-t border-default">
              {/* Description */}
              <p className="text-sm text-secondary mt-3 mb-4">
                {prompt.description}
              </p>

              {/* Variables */}
              {prompt.variables && prompt.variables.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                    Variables:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prompt.variables.map((v) => (
                      <code
                        key={v}
                        className="px-2 py-1 rounded text-xs font-mono bg-accent-subtle text-accent"
                      >
                        {`{${v}}`}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt content - safely rendered */}
              <div className="p-4 rounded-lg font-mono text-sm whitespace-pre-wrap leading-relaxed bg-inverse-bg text-inverse">
                <HighlightedPrompt
                  text={prompt.prompt}
                  variables={prompt.variables}
                />
              </div>

              {/* Tags */}
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-xs bg-muted-bg text-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export interface PromptLibraryProps {
  prompts: Prompt[]
  className?: string
}

export function PromptLibrary({ prompts, className }: PromptLibraryProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<PromptCategory | 'all'>(
    'all'
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Get unique categories from prompts
  const categories = useMemo(() => {
    const cats = new Set(prompts.map((p) => p.category))
    return ['all', ...Array.from(cats)] as (PromptCategory | 'all')[]
  }, [prompts])

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchesCategory =
        activeCategory === 'all' || p.category === activeCategory
      const matchesSearch =
        search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.prompt.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [prompts, activeCategory, search])

  // Group by category for display
  const groupedPrompts = useMemo(() => {
    if (activeCategory !== 'all') {
      return { [activeCategory]: filteredPrompts }
    }
    return filteredPrompts.reduce(
      (acc, p) => {
        if (!acc[p.category]) acc[p.category] = []
        acc[p.category].push(p)
        return acc
      },
      {} as Record<PromptCategory, Prompt[]>
    )
  }, [filteredPrompts, activeCategory])

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-default bg-surface text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isAll = cat === 'all'
            const config = isAll ? null : CATEGORY_CONFIG[cat]
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  isActive
                    ? isAll
                      ? 'bg-inverse-bg text-inverse'
                      : config?.activeClass
                    : 'text-secondary hover:text-primary hover:bg-muted-bg'
                )}
              >
                {config?.icon}
                {isAll ? 'All' : config?.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-secondary">
        {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}{' '}
        found
      </p>

      {/* Grouped prompts */}
      <div className="space-y-8">
        {Object.entries(groupedPrompts).map(([category, categoryPrompts]) => (
          <div key={category}>
            {activeCategory === 'all' && (
              <h3
                className={cn(
                  'flex items-center gap-2 text-lg font-semibold mb-4',
                  CATEGORY_CONFIG[category as PromptCategory].headerClass
                )}
              >
                {CATEGORY_CONFIG[category as PromptCategory].icon}
                {CATEGORY_CONFIG[category as PromptCategory].label}
              </h3>
            )}
            <div className="space-y-3">
              {categoryPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isExpanded={expandedId === prompt.id}
                  onToggle={() =>
                    setExpandedId(expandedId === prompt.id ? null : prompt.id)
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <FileCode className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-secondary">
            No prompts found matching your search.
          </p>
        </div>
      )}
    </div>
  )
}

export default PromptLibrary
