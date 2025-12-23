/**
 * Cohere Lab - Experimental UI Components
 *
 * Inspired by Cohere's website design by Pentagram
 * All values are hardcoded for experimentation - NOT part of DDS tokens
 *
 * Color Palette Extracted:
 * - Primary Sage: #2D4739 (dark forest green)
 * - Coral Accent: #D4726A (warm coral/salmon)
 * - Light Sage BG: #E8EDE6 (soft mint background)
 * - Cream BG: #F8F7F4 (off-white)
 * - Deep Navy: #1E2A25 (code blocks)
 * - Purple Accent: #8B7BAA (lavender)
 * - Soft Yellow: #F5F0E6 (warm cream)
 */

import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import {
  Grid2X2,
  List,
  X,
  Plus,
  Copy,
  Play,
  ChevronDown,
  Lock,
  Sparkles,
  Star,
  ChevronLeft,
  Gamepad2,
  MoreVertical,
  Bug,
  BookOpen,
  ArrowRight,
  Trash2,
  Check,
  ExternalLink,
  Users,
  LayoutGrid,
} from 'lucide-react'

// ============================================================================
// HARDCODED STYLE CONSTANTS (Not DDS Tokens - Experimental Only)
// ============================================================================

const COHERE = {
  // Core Colors
  sage: {
    900: '#1E2A25',
    800: '#2D4739',
    700: '#3D5A4A',
    600: '#4D6D5B',
    500: '#5D806C',
    400: '#7D9A8C',
    300: '#9DB4AC',
    200: '#BDD0C8',
    100: '#DDE8E4',
    50: '#F0F4F2',
  },
  coral: {
    600: '#B85A52',
    500: '#D4726A',
    400: '#E08B84',
    300: '#ECA4A0',
    200: '#F4C4C0',
    100: '#FAE2E0',
  },
  purple: {
    600: '#6B5B8A',
    500: '#8B7BAA',
    400: '#A595BA',
    300: '#BFAFCA',
    200: '#D9CFDC',
    100: '#EDE8F0',
  },
  cream: {
    100: '#F8F7F4',
    200: '#F5F0E6',
    300: '#EDE6D8',
  },
  // Semantic
  background: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceMuted: '#F8F7F4',
  border: '#E8E6E2',
  borderSubtle: '#F0EEEA',
  text: {
    primary: '#1E2A25',
    secondary: '#5D6B64',
    muted: '#8A9490',
  },
  // Status
  success: '#4CAF50',
  error: '#D4726A',
}

// Typography
const FONT = {
  sans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
}

// ============================================================================
// COMPONENT: Language Tabs
// ============================================================================

const languages = ['PYTHON', 'NODE.JS', 'RUBY', 'GO', 'PHP', 'CLI'] as const

function LanguageTabs({
  active = 'PYTHON',
  onChange
}: {
  active?: string
  onChange?: (lang: string) => void
}) {
  return (
    <div style={{
      background: COHERE.surface,
      borderRadius: '12px',
      padding: '8px',
      border: `1px solid ${COHERE.border}`,
    }}>
      <div style={{
        display: 'flex',
        gap: '4px',
        fontSize: '13px',
        fontFamily: FONT.sans,
        fontWeight: 500,
      }}>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onChange?.(lang)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: active === lang ? COHERE.sage[100] : 'transparent',
              color: active === lang ? COHERE.sage[800] : COHERE.text.secondary,
              fontWeight: active === lang ? 600 : 500,
            }}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Code Editor Card (Safe syntax highlighting)
// ============================================================================

// Token types for syntax highlighting
type TokenType = 'keyword' | 'string' | 'method' | 'variable' | 'comment' | 'function' | 'default'

interface CodeToken {
  text: string
  type: TokenType
}

// Simple tokenizer that returns React-safe tokens
function tokenizeLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = []
  const keywords = ['import', 'from', 'def', 'class', 'return', 'if', 'else', 'for', 'in', 'print']
  const moduleNames = ['cohere'] // Module names that appear after import

  // Simple regex-based tokenization
  let remaining = line

  while (remaining.length > 0) {
    // Check for comments
    const commentMatch = remaining.match(/^(#.*)/)
    if (commentMatch) {
      tokens.push({ text: commentMatch[1], type: 'comment' })
      remaining = remaining.slice(commentMatch[1].length)
      continue
    }

    // Check for f-strings (Python)
    const fstringMatch = remaining.match(/^(f")/)
    if (fstringMatch) {
      tokens.push({ text: fstringMatch[1], type: 'string' })
      remaining = remaining.slice(fstringMatch[1].length)
      continue
    }

    // Check for strings (double or single quotes)
    const stringMatch = remaining.match(/^("[^"]*"|'[^']*')/)
    if (stringMatch) {
      tokens.push({ text: stringMatch[1], type: 'string' })
      remaining = remaining.slice(stringMatch[1].length)
      continue
    }

    // Check for method calls (co. or cohere.) - these are object references
    const methodMatch = remaining.match(/^(co\.|cohere\.|response\.)/)
    if (methodMatch) {
      tokens.push({ text: methodMatch[1], type: 'method' })
      remaining = remaining.slice(methodMatch[1].length)
      continue
    }

    // Check for keywords (import, from, etc.)
    const keywordMatch = remaining.match(new RegExp(`^(${keywords.join('|')})(?![a-zA-Z_])`))
    if (keywordMatch) {
      tokens.push({ text: keywordMatch[1], type: 'keyword' })
      remaining = remaining.slice(keywordMatch[1].length)
      continue
    }

    // Check for module names (cohere after import) - standalone word
    const moduleMatch = remaining.match(new RegExp(`^(${moduleNames.join('|')})(?![a-zA-Z_.])`))
    if (moduleMatch) {
      tokens.push({ text: moduleMatch[1], type: 'keyword' }) // Same color as keywords
      remaining = remaining.slice(moduleMatch[1].length)
      continue
    }

    // Check for template variables {apiKey}
    const templateMatch = remaining.match(/^(\{[^}]+\})/)
    if (templateMatch) {
      tokens.push({ text: templateMatch[1], type: 'variable' })
      remaining = remaining.slice(templateMatch[1].length)
      continue
    }

    // Check for function/method names (Client, embed, etc.) - word followed by (
    const funcMatch = remaining.match(/^([A-Za-z_][A-Za-z0-9_]*)(?=\()/)
    if (funcMatch) {
      tokens.push({ text: funcMatch[1], type: 'function' })
      remaining = remaining.slice(funcMatch[1].length)
      continue
    }

    // Default: take one character
    tokens.push({ text: remaining[0], type: 'default' })
    remaining = remaining.slice(1)
  }

  return tokens
}

function getTokenColor(type: TokenType): string {
  switch (type) {
    case 'keyword': return COHERE.coral[500]    // import, cohere, print, etc.
    case 'string': return COHERE.purple[400]    // "strings"
    case 'method': return COHERE.sage[400]      // co., cohere. (object refs)
    case 'function': return COHERE.sage[200]    // Client, embed (function names)
    case 'variable': return COHERE.coral[400]   // {apiKey}
    case 'comment': return COHERE.text.muted    // # comments
    default: return COHERE.sage[100]            // everything else
  }
}

const sampleCode = `import cohere
co = cohere.Client('{apiKey}');

questions = [
    "When do you close?",
    "What are the hours?",
    "Do you have vegan options?"
]

response = co.embed(texts=questions, model="large")
print(f"Embeddings: {response.embeddings}")`

function CodeEditor({
  title = 'REQUEST',
  code = sampleCode,
  showExamples = true,
  showTryIt = true,
}: {
  title?: string
  code?: string
  showExamples?: boolean
  showTryIt?: boolean
}) {
  const lines = code.split('\n')

  return (
    <div style={{
      background: COHERE.sage[900],
      borderRadius: '16px',
      overflow: 'hidden',
      fontFamily: FONT.mono,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: `1px solid ${COHERE.sage[800]}`,
      }}>
        <span style={{
          color: COHERE.sage[300],
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          fontFamily: FONT.sans,
        }}>
          {title}
        </span>
        {showExamples && (
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            color: COHERE.sage[300],
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: FONT.sans,
          }}>
            Examples <ChevronDown size={14} />
          </button>
        )}
      </div>

      {/* Code Block */}
      <div style={{
        padding: '16px',
        fontSize: '13px',
        lineHeight: 1.6,
      }}>
        {lines.map((line, i) => {
          const tokens = tokenizeLine(line)
          return (
            <div key={i} style={{ display: 'flex' }}>
              <span style={{
                color: COHERE.sage[600],
                width: '32px',
                flexShrink: 0,
                userSelect: 'none',
              }}>
                {i + 1}
              </span>
              <span>
                {tokens.length > 0 ? tokens.map((token, j) => (
                  <span key={j} style={{ color: getTokenColor(token.type) }}>
                    {token.text}
                  </span>
                )) : '\u00A0'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderTop: `1px solid ${COHERE.sage[800]}`,
      }}>
        <button style={{
          background: 'transparent',
          border: 'none',
          color: COHERE.sage[400],
          cursor: 'pointer',
          padding: '4px',
        }}>
          <Copy size={16} />
        </button>
        {showTryIt && (
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: COHERE.sage[800],
            border: 'none',
            color: COHERE.sage[100],
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: FONT.sans,
          }}>
            Try it <Play size={14} fill={COHERE.sage[100]} />
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Response Card
// ============================================================================

function ResponseCard() {
  return (
    <div style={{
      background: COHERE.surface,
      borderRadius: '16px',
      border: `1px solid ${COHERE.border}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: `1px solid ${COHERE.border}`,
      }}>
        <span style={{
          color: COHERE.text.secondary,
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          fontFamily: FONT.sans,
        }}>
          RESPONSE
        </span>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'transparent',
          border: 'none',
          color: COHERE.text.secondary,
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: FONT.sans,
        }}>
          Examples <ChevronDown size={14} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <p style={{
          color: COHERE.text.secondary,
          fontSize: '14px',
          margin: 0,
          fontFamily: FONT.sans,
        }}>
          Click <span style={{ color: COHERE.sage[800], fontWeight: 600 }}>Try It!</span> to start a request. Or choose an preset example
        </p>

        {/* Status Tags */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: COHERE.sage[50],
            fontSize: '13px',
            fontFamily: FONT.sans,
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: COHERE.sage[500],
            }} />
            200 <span style={{ color: COHERE.text.muted }}>-Result</span>
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: COHERE.coral[100],
            fontSize: '13px',
            fontFamily: FONT.sans,
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: COHERE.coral[500],
            }} />
            -200 <span style={{ color: COHERE.text.muted }}>-Result</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Toggle Buttons (Grid/List)
// ============================================================================

function ViewToggle({
  view = 'grid',
  onChange
}: {
  view?: 'grid' | 'list'
  onChange?: (view: 'grid' | 'list') => void
}) {
  const Button = ({
    active,
    children,
    onClick
  }: {
    active: boolean
    children: React.ReactNode
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        background: active ? COHERE.sage[800] : COHERE.surface,
        color: active ? COHERE.surface : COHERE.text.secondary,
        borderRadius: '12px',
      }}
    >
      {children}
    </button>
  )

  return (
    <div style={{
      display: 'inline-flex',
      gap: '4px',
      padding: '4px',
      background: COHERE.surfaceMuted,
      borderRadius: '16px',
    }}>
      <Button active={view === 'grid'} onClick={() => onChange?.('grid')}>
        <Grid2X2 size={20} />
      </Button>
      <Button active={view === 'list'} onClick={() => onChange?.('list')}>
        <List size={20} />
      </Button>
    </div>
  )
}

// ============================================================================
// COMPONENT: Chips/Tags (Dashed border style)
// ============================================================================

function Chip({
  label,
  onRemove,
  variant = 'neutral'
}: {
  label: string
  onRemove?: () => void
  variant?: 'neutral' | 'sage' | 'blue' | 'coral' | 'dark' | 'muted'
}) {
  // Color configurations for each variant (dashed border style)
  const config = {
    neutral: {
      borderColor: COHERE.text.muted,
      textColor: COHERE.text.primary,
      background: 'transparent',
    },
    sage: {
      borderColor: COHERE.sage[400],
      textColor: COHERE.sage[700],
      background: 'transparent',
    },
    blue: {
      borderColor: '#7BA3C9',
      textColor: '#4A7BA7',
      background: '#EBF3FA',
    },
    coral: {
      borderColor: COHERE.coral[400],
      textColor: COHERE.coral[600],
      background: COHERE.coral[100],
    },
    dark: {
      borderColor: COHERE.sage[800],
      textColor: COHERE.text.primary,
      background: 'transparent',
    },
    muted: {
      borderColor: COHERE.border,
      textColor: COHERE.text.muted,
      background: 'transparent',
    },
  }

  const style = config[variant]

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: FONT.sans,
      fontWeight: 500,
      background: style.background,
      border: `1.5px dashed ${style.borderColor}`,
      color: style.textColor,
    }}>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: style.textColor,
            opacity: 0.7,
          }}
        >
          <X size={14} />
        </button>
      )}
    </span>
  )
}

// ============================================================================
// COMPONENT: Usage Tabs (Underlined)
// ============================================================================

function UsageTabs({
  active = 'USAGE',
  onChange
}: {
  active?: string
  onChange?: (tab: string) => void
}) {
  const tabs = ['USAGE', 'INVOICES', 'PAYMENT']

  return (
    <div style={{
      display: 'flex',
      borderBottom: `1px solid ${COHERE.border}`,
    }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange?.(tab)}
          style={{
            padding: '12px 20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: FONT.sans,
            color: active === tab ? COHERE.sage[800] : COHERE.text.muted,
            borderBottom: active === tab ? `2px solid ${COHERE.sage[800]}` : '2px solid transparent',
            marginBottom: '-1px',
            letterSpacing: '0.3px',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// COMPONENT: Metric Display (with gradient-colored digits)
// ============================================================================

function MetricDisplay({
  label = 'SUBTOTAL',
  value = '116.38',
  unit = 'USD',
  timestamp = 'Last updated: 2 mins ago',
}: {
  label?: string
  value?: string
  unit?: string
  timestamp?: string
}) {
  // Color each digit with gradient effect (purple -> coral -> sage)
  const digitColors = [
    COHERE.purple[500],  // 1 - purple
    COHERE.text.primary, // 1 - dark
    COHERE.coral[500],   // 6 - coral
    COHERE.text.primary, // . - dark
    COHERE.sage[500],    // 3 - sage
    COHERE.coral[400],   // 8 - coral light
  ]

  return (
    <div style={{ fontFamily: FONT.sans }}>
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.5px',
        color: COHERE.text.muted,
        marginBottom: '8px',
      }}>
        {label}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
      }}>
        <span style={{
          fontSize: '48px',
          fontWeight: 300,
          letterSpacing: '-2px',
          display: 'flex',
        }}>
          {value.split('').map((char, i) => (
            <span key={i} style={{ color: digitColors[i % digitColors.length] }}>
              {char}
            </span>
          ))}
        </span>
        <span style={{
          fontSize: '16px',
          fontWeight: 500,
          color: COHERE.text.secondary,
        }}>
          {unit}
        </span>
      </div>
      <div style={{
        fontSize: '13px',
        color: COHERE.text.muted,
        marginTop: '8px',
      }}>
        {timestamp}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Model Card with Geometric Mosaic Header
// ============================================================================

// Geometric mosaic pattern component for card headers
function GeometricMosaic({ palette = 'sage' }: { palette?: 'sage' | 'green' | 'coral' }) {
  const palettes = {
    sage: [
      COHERE.sage[400],
      COHERE.cream[200],
      COHERE.sage[300],
      COHERE.cream[300],
      COHERE.sage[500],
      COHERE.sage[200],
    ],
    green: [
      COHERE.sage[500],
      COHERE.sage[400],
      COHERE.sage[600],
      COHERE.sage[300],
      COHERE.sage[700],
      COHERE.sage[800],
    ],
    coral: [
      COHERE.coral[400],
      COHERE.coral[300],
      COHERE.sage[400],
      COHERE.coral[200],
      COHERE.sage[500],
      COHERE.coral[500],
    ],
  }

  const colors = palettes[palette]

  return (
    <svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
      {/* Background */}
      <rect width="200" height="120" fill={COHERE.cream[100]} />

      {/* Geometric shapes - abstract mosaic pattern */}
      {/* Top left region */}
      <path d="M0 0 L70 0 L50 45 L0 60 Z" fill={colors[0]} />
      <path d="M70 0 L90 0 L75 35 L50 45 Z" fill={colors[1]} />

      {/* Top right region */}
      <path d="M90 0 L140 0 L130 50 L75 35 Z" fill={colors[2]} />
      <path d="M140 0 L200 0 L200 40 L180 55 L130 50 Z" fill={colors[3]} />

      {/* Middle region */}
      <path d="M0 60 L50 45 L75 35 L130 50 L120 85 L60 95 L0 80 Z" fill={colors[4]} />
      <path d="M130 50 L180 55 L200 40 L200 90 L160 100 L120 85 Z" fill={colors[5]} />

      {/* Bottom region */}
      <path d="M0 80 L60 95 L40 120 L0 120 Z" fill={colors[1]} />
      <path d="M60 95 L120 85 L100 120 L40 120 Z" fill={colors[3]} />
      <path d="M120 85 L160 100 L150 120 L100 120 Z" fill={colors[0]} />
      <path d="M160 100 L200 90 L200 120 L150 120 Z" fill={colors[2]} />
    </svg>
  )
}

function ModelCard({
  title,
  subtitle = 'by Cohere',
  palette = 'sage',
  status,
  action,
}: {
  title: string
  subtitle?: string
  palette?: 'sage' | 'green' | 'coral'
  status?: { label: string; state: 'ready' | 'asleep' }
  action?: { label: string; state: 'ready' | 'default' }
}) {
  return (
    <div style={{
      background: COHERE.surface,
      borderRadius: '16px',
      border: `1px solid ${COHERE.border}`,
      overflow: 'hidden',
      width: '220px',
    }}>
      {/* Geometric Mosaic Header */}
      <div style={{
        height: '120px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <GeometricMosaic palette={palette} />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '6px',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Sparkles size={14} style={{ color: COHERE.sage[700] }} />
        </div>
      </div>

      {/* Content - Using 4px grid spacing rhythm */}
      <div style={{ padding: '16px', fontFamily: FONT.sans }}>
        {/* Title + Subtitle group */}
        <h4 style={{
          margin: 0,
          fontSize: '15px',
          fontWeight: 600,
          color: COHERE.text.primary,
          lineHeight: 1.3,
          minHeight: '40px', // Reserve 2 lines (15px × 1.3 × 2 ≈ 40px) for consistent card heights
        }}>
          {title}
        </h4>
        <p style={{
          margin: '8px 0 0',  // tight (8px) - title↔subtitle
          fontSize: '12px',
          color: COHERE.text.muted,
        }}>
          {subtitle}
        </p>

        {/* Model ID - base spacing (16px) from title group */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',        // micro (4px) - icon↔text
          marginTop: '16px', // base (16px) - between sections
          fontSize: '12px',
          color: COHERE.text.secondary,
        }}>
          Model ID <Lock size={10} />
        </div>

        {/* Status/Action - base spacing (16px) from Model ID */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px', // base (16px) - consistent rhythm
          minHeight: '24px', // ensure consistent height even when empty
        }}>
          {status && (
            <>
              <span style={{ fontSize: '12px', color: COHERE.text.muted }}>
                Wake
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '4px',
                background: status.state === 'asleep' ? COHERE.surfaceMuted : COHERE.sage[100],
                color: status.state === 'asleep' ? COHERE.text.muted : COHERE.sage[700],
                letterSpacing: '0.5px',
              }}>
                {status.label}
              </span>
            </>
          )}
          {action && (
            <>
              <span style={{ fontSize: '12px', color: COHERE.text.muted }}>
                {action.label}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '4px',
                background: action.state === 'ready' ? COHERE.sage[100] : COHERE.surfaceMuted,
                color: action.state === 'ready' ? COHERE.sage[700] : COHERE.text.muted,
                letterSpacing: '0.5px',
              }}>
                READY
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Action Card (Preset Cards)
// ============================================================================

function ActionCard({
  icon: Icon,
  title,
  description,
  iconColor,
}: {
  icon: React.ElementType
  title: string
  description: string
  iconColor?: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      style={{
        background: isHovered ? COHERE.surface : COHERE.surfaceMuted,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        fontFamily: FONT.sans,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        border: `1px solid ${isHovered ? COHERE.border : 'transparent'}`,
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Three-dot menu */}
      <button style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        color: COHERE.text.muted,
      }}>
        <MoreVertical size={16} />
      </button>

      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        background: COHERE.surface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: iconColor || COHERE.sage[600],
        flexShrink: 0,
      }}>
        <Icon size={24} />
      </div>
      <div style={{ flex: 1, paddingRight: '24px' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          color: COHERE.text.muted,
          marginBottom: '4px',
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '14px',
          color: COHERE.text.secondary,
          lineHeight: 1.4,
        }}>
          {description}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: CTA Buttons (Cohere Style) - Split button with diagonal divider
// ============================================================================

function CohereButton({
  children,
  variant = 'filled',
  showIcon = true,
}: {
  children: React.ReactNode
  variant?: 'filled' | 'outline' | 'ghost'
  showIcon?: boolean
}) {
  // Style configurations for each variant
  const config = {
    filled: {
      mainBg: COHERE.sage[600],
      iconBg: COHERE.sage[700],
      textColor: COHERE.surface,
      iconColor: COHERE.surface,
      border: 'none',
      outerBg: COHERE.sage[700],
    },
    outline: {
      mainBg: COHERE.sage[800],
      iconBg: COHERE.sage[900],
      textColor: COHERE.surface,
      iconColor: COHERE.surface,
      border: 'none',
      outerBg: COHERE.sage[900],
    },
    ghost: {
      mainBg: COHERE.surface,
      iconBg: COHERE.surfaceMuted,
      textColor: COHERE.text.secondary,
      iconColor: COHERE.text.muted,
      border: `1px solid ${COHERE.border}`,
      outerBg: COHERE.surfaceMuted,
    },
  }

  const style = config[variant]

  return (
    <button style={{
      display: 'inline-flex',
      alignItems: 'stretch',
      padding: 0,
      borderRadius: '14px',
      fontSize: '16px',
      fontWeight: 500,
      fontFamily: FONT.sans,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      border: style.border,
      overflow: 'hidden',
      background: style.outerBg,
      position: 'relative',
    }}>
      {/* Main text section with diagonal clip */}
      <span style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 48px 16px 28px',
        background: style.mainBg,
        color: style.textColor,
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 100%, 0 100%)',
        marginRight: '-16px',
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </span>

      {/* Icon section */}
      {showIcon && (
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 24px 16px 28px',
          background: style.iconBg,
          color: style.iconColor,
        }}>
          <Plus size={20} strokeWidth={2} />
        </span>
      )}
    </button>
  )
}

// ============================================================================
// COMPONENT: Input Fields (Floating label inside input)
// ============================================================================

function CohereInput({
  label,
  value,
  placeholder,
  error,
  disabled = false,
}: {
  label: string
  value?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}) {
  const hasError = !!error

  // Determine background color
  const getBg = () => {
    if (hasError) return COHERE.coral[100]
    if (disabled) return COHERE.surfaceMuted
    return COHERE.surface
  }

  return (
    <div style={{ fontFamily: FONT.sans }}>
      {/* Input container with label inside */}
      <div style={{
        position: 'relative',
        borderRadius: '12px',
        border: `1px solid ${hasError ? COHERE.coral[400] : COHERE.border}`,
        background: getBg(),
        padding: '12px 16px',
      }}>
        {/* Floating label */}
        <label style={{
          display: 'block',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          color: hasError ? COHERE.coral[500] : COHERE.text.muted,
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}>
          {label}
        </label>
        {/* Value display */}
        <div style={{
          fontSize: '16px',
          color: hasError ? COHERE.coral[600] : COHERE.text.primary,
          fontWeight: 400,
        }}>
          {value || placeholder || '\u00A0'}
        </div>
      </div>
      {/* Error message */}
      {error && (
        <div style={{
          fontSize: '13px',
          color: COHERE.coral[500],
          marginTop: '8px',
          fontFamily: FONT.mono,
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// COMPONENT: Classification Table
// ============================================================================

// Extended color palette for classification toggles
const CLASSIFY_COLORS = {
  purple: '#C4A7E7',    // Soft lavender purple
  sage: '#2D4739',      // Dark forest green (Cohere sage)
  blue: '#4A6FA5',      // Muted blue
  coral: '#E07B6B',     // Warm coral/salmon
  khaki: '#8B8668',     // Olive khaki
}

function ClassificationTable() {
  const categories = ['Restaurant', 'Takeaway', 'Logistics', 'Allergies', 'Delivery']

  // Each row has: values (which toggles are on), colors (color per toggle), selected (radio)
  const rows = [
    { values: [true, false, false, false, false], colors: [CLASSIFY_COLORS.purple, null, null, null, null] },
    { values: [false, false, true, false, false], colors: [null, null, CLASSIFY_COLORS.sage, null, null] },
    { values: [false, false, false, false, true], colors: [null, null, null, null, CLASSIFY_COLORS.khaki] },
    { values: [false, true, false, false, false], colors: [null, CLASSIFY_COLORS.sage, null, null, null] },
    { values: [false, false, true, false, false], colors: [null, null, CLASSIFY_COLORS.blue, null, null] },
    { values: [false, false, false, true, false], colors: [null, null, null, CLASSIFY_COLORS.coral, null] },
    { values: [false, false, false, false, true], colors: [null, null, null, null, CLASSIFY_COLORS.khaki] },
  ]

  // Legacy fallback colors (not used with per-cell colors)
  const toggleColors = [
    CLASSIFY_COLORS.purple,
    CLASSIFY_COLORS.sage,
    CLASSIFY_COLORS.blue,
    CLASSIFY_COLORS.coral,
    CLASSIFY_COLORS.khaki,
  ]

  return (
    <div style={{
      background: COHERE.surface,
      borderRadius: '16px',
      border: `1px solid ${COHERE.border}`,
      overflow: 'hidden',
      fontFamily: FONT.sans,
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${categories.length}, 1fr) 48px 40px`,
        borderBottom: `1px solid ${COHERE.border}`,
        background: COHERE.surfaceMuted,
      }}>
        {categories.map((cat) => (
          <div key={cat} style={{
            padding: '14px 12px',
            fontSize: '13px',
            fontWeight: 500,
            color: COHERE.text.secondary,
            textAlign: 'center',
          }}>
            {cat}
          </div>
        ))}
        {/* Add Category Button */}
        <div style={{
          padding: '14px 8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: `1.5px solid ${COHERE.purple[400]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <Plus size={14} style={{ color: COHERE.purple[500] }} />
          </div>
        </div>
        {/* Radio column header (empty) */}
        <div style={{ padding: '14px 12px' }} />
      </div>

      {/* Rows */}
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${categories.length}, 1fr) 48px 40px`,
            borderBottom: rowIndex < rows.length - 1 ? `1px solid ${COHERE.borderSubtle}` : 'none',
          }}
        >
          {row.values.map((isOn, colIndex) => {
            // Use per-cell color if active, otherwise fallback to column color
            const activeColor = row.colors[colIndex] || toggleColors[colIndex]
            return (
              <div key={colIndex} style={{
                padding: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <div style={{
                  width: '56px',
                  height: '26px',
                  borderRadius: '13px',
                  background: isOn ? activeColor : COHERE.surfaceMuted,
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: COHERE.surface,
                    position: 'absolute',
                    top: '3px',
                    left: isOn ? '33px' : '3px',
                    transition: 'left 0.15s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }} />
                </div>
              </div>
            )
          })}
          {/* Empty spacer for + column */}
          <div style={{ padding: '12px' }} />
          {/* Row selection radio button */}
          <div style={{
            padding: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: `1.5px solid ${COHERE.border}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }} />
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: `1px solid ${COHERE.border}`,
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'transparent',
          border: 'none',
          color: COHERE.text.primary,
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 400,
          padding: 0,
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: COHERE.purple[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Plus size={14} style={{ color: COHERE.purple[500] }} />
          </div>
          Add training example
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Review Card (Use Case Cards)
// ============================================================================

function ReviewCard({
  title,
  rating,
  totalRatings,
  reviews,
}: {
  title: string
  rating: number
  totalRatings: string
  reviews: Array<{
    title: string
    content: string
    rating: number
    category: { label: string; color: string }
    accuracy: string
  }>
}) {
  const categoryConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    Story: { bg: COHERE.sage[100], text: COHERE.sage[700], icon: BookOpen },
    Gameplay: { bg: COHERE.purple[100], text: COHERE.purple[600], icon: Gamepad2 },
    Bug: { bg: COHERE.coral[100], text: COHERE.coral[600], icon: Bug },
  }

  // Rating distribution data (visual representation)
  const ratingBars = [
    { width: '90%', color: COHERE.sage[400] },
    { width: '60%', color: COHERE.sage[300] },
    { width: '30%', color: COHERE.purple[300] },
  ]

  return (
    <div style={{
      background: COHERE.surface,
      borderRadius: '16px',
      border: `1px solid ${COHERE.border}`,
      overflow: 'hidden',
      fontFamily: FONT.sans,
      maxWidth: '320px',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${COHERE.border}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}>
          <ChevronLeft size={16} style={{ color: COHERE.sage[600] }} />
          <span style={{ color: COHERE.sage[600], fontSize: '13px', fontWeight: 500 }}>Back</span>
          <span style={{
            marginLeft: 'auto',
            fontSize: '13px',
            color: COHERE.text.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <Gamepad2 size={14} /> Mobile Heroes: Boom Boom
          </span>
        </div>
        <h3 style={{ margin: '8px 0 4px', fontSize: '18px', fontWeight: 600 }}>
          {title}
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
        }}>
          <span style={{ fontSize: '32px', fontWeight: 300 }}>{rating}</span>
          <span style={{ fontSize: '14px', color: COHERE.text.muted }}>out of 5</span>
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: COHERE.text.muted }}>
            {totalRatings} Ratings
          </span>
        </div>

        {/* Rating Distribution Bars */}
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {ratingBars.map((bar, i) => (
            <div key={i} style={{
              height: '4px',
              background: COHERE.surfaceMuted,
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: bar.width,
                height: '100%',
                background: bar.color,
                borderRadius: '2px',
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div style={{ maxHeight: '300px', overflow: 'auto' }}>
        {reviews.map((review, i) => (
          <div key={i} style={{
            padding: '16px',
            borderBottom: i < reviews.length - 1 ? `1px solid ${COHERE.borderSubtle}` : 'none',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px',
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{review.title}</div>
                <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={12}
                      fill={idx < review.rating ? COHERE.sage[500] : 'transparent'}
                      stroke={idx < review.rating ? COHERE.sage[500] : COHERE.text.muted}
                    />
                  ))}
                </div>
              </div>
              {/* Category Badge with Diagonal Divider */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'stretch',
                borderRadius: '8px',
                overflow: 'hidden',
                border: `1px solid ${COHERE.coral[200]}`,
                fontSize: '12px',
                fontWeight: 500,
              }}>
                {(() => {
                  const config = categoryConfig[review.category.label] || categoryConfig.Story
                  const IconComponent = config.icon
                  return (
                    <>
                      {/* Category section */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 10px',
                        background: 'transparent',
                        color: config.text,
                        position: 'relative',
                      }}>
                        <IconComponent size={12} />
                        {review.category.label}
                      </span>
                      {/* Diagonal divider using SVG */}
                      <span style={{
                        width: '12px',
                        position: 'relative',
                        background: `linear-gradient(to bottom right, transparent 49%, ${COHERE.coral[200]} 49%, ${COHERE.coral[200]} 51%, transparent 51%)`,
                      }} />
                      {/* Accuracy section */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 10px',
                        color: COHERE.text.secondary,
                      }}>
                        {review.accuracy}
                      </span>
                    </>
                  )
                })()}
              </div>
            </div>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: COHERE.text.secondary,
              lineHeight: 1.5,
            }}>
              {review.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: Chat Sentiment Card
// ============================================================================

function SentimentCard() {
  return (
    <div style={{
      background: COHERE.sage[800],
      borderRadius: '16px',
      padding: '20px',
      fontFamily: FONT.sans,
      maxWidth: '280px',
    }}>
      {/* Question Bubble */}
      <div style={{
        background: COHERE.sage[700],
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
      }}>
        <p style={{
          margin: 0,
          color: COHERE.sage[100],
          fontSize: '14px',
          lineHeight: 1.5,
        }}>
          Do people prefer going to the cinema over watching Netflix?
        </p>
      </div>

      {/* Response */}
      <div style={{
        background: COHERE.coral[400],
        borderRadius: '12px',
        padding: '16px',
      }}>
        <p style={{
          margin: 0,
          color: 'white',
          fontSize: '14px',
          lineHeight: 1.5,
        }}>
          I'm so excited to go see N...
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.8)',
        }}>
          <span>Ali M. - July 2022</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px',
        }}>
          <span style={{
            fontSize: '12px',
            color: 'white',
            fontWeight: 500,
          }}>
            Yes
          </span>
          <span style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.8)',
          }}>
            99.6% Accuracy
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        marginTop: '16px',
        height: '6px',
        background: COHERE.sage[700],
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: '65%',
          height: '100%',
          background: `linear-gradient(90deg, ${COHERE.sage[400]} 0%, ${COHERE.purple[400]} 100%)`,
        }} />
      </div>
    </div>
  )
}

// ============================================================================
// FULL PAGE COMPOSITION
// ============================================================================

function CohereLabPage() {
  const [activeLanguage, setActiveLanguage] = useState('PYTHON')
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('USAGE')

  return (
    <div style={{
      background: COHERE.background,
      minHeight: '100vh',
      padding: '40px',
      fontFamily: FONT.sans,
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 300,
            color: COHERE.text.primary,
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            Cohere Lab
          </h1>
          <p style={{
            fontSize: '16px',
            color: COHERE.text.secondary,
            margin: '8px 0 0',
          }}>
            Experimental UI components inspired by Pentagram's design for Cohere
          </p>
        </div>

        {/* Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
        }}>
          {/* Code Editor Section */}
          <div style={{ gridColumn: 'span 5' }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                color: COHERE.text.muted,
              }}>
                LANGUAGE
              </span>
            </div>
            <LanguageTabs active={activeLanguage} onChange={setActiveLanguage} />

            <div style={{ marginTop: '16px' }}>
              <div style={{
                fontSize: '13px',
                color: COHERE.text.secondary,
                marginBottom: '8px',
              }}>
                COHERE PYTHON SDK
              </div>
              <CodeEditor />
            </div>

            <div style={{ marginTop: '16px' }}>
              <ResponseCard />
            </div>
          </div>

          {/* Middle Section */}
          <div style={{ gridColumn: 'span 4' }}>
            {/* Toggles & Chips */}
            <div style={{
              display: 'flex',
              gap: '24px',
              marginBottom: '24px',
            }}>
              <div>
                <ViewToggle view={activeView} onChange={setActiveView} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Chip label="Trial" onRemove={() => {}} variant="neutral" />
                <Chip label="Trial" onRemove={() => {}} variant="sage" />
                <Chip label="Trial" onRemove={() => {}} variant="blue" />
                <Chip label="Trial" onRemove={() => {}} variant="coral" />
                <Chip label="Trial" onRemove={() => {}} variant="dark" />
                <Chip label="Trial" onRemove={() => {}} variant="muted" />
              </div>
            </div>

            {/* Usage Section */}
            <div style={{
              background: COHERE.surface,
              borderRadius: '16px',
              border: `1px solid ${COHERE.border}`,
              overflow: 'hidden',
              marginBottom: '24px',
            }}>
              <UsageTabs active={activeTab} onChange={setActiveTab} />
              <div style={{ padding: '24px' }}>
                <MetricDisplay />
              </div>
            </div>

            {/* Action Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              marginBottom: '24px',
              background: COHERE.border,
              borderRadius: '16px',
              border: `1px solid ${COHERE.border}`,
              overflow: 'hidden',
            }}>
              <ActionCard
                icon={Users}
                title="BUSINESS MODEL CANVAS"
                description="Generate a satellite model canvas"
                iconColor={COHERE.purple[500]}
              />
              <ActionCard
                icon={LayoutGrid}
                title="PRODUCT REVIEW SENTIMENT"
                description="Determine customer satisfaction scores"
                iconColor={COHERE.text.muted}
              />
            </div>

            {/* Classification Table */}
            <ClassificationTable />
          </div>

          {/* Right Section */}
          <div style={{ gridColumn: 'span 3' }}>
            {/* Model Cards */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    color: COHERE.text.muted,
                    marginBottom: '8px',
                  }}>
                    Generate
                  </div>
                  <ModelCard
                    title="Finance Headline Sentiment Analyzer"
                    palette="sage"
                    status={{ label: 'ASLEEP', state: 'asleep' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    color: COHERE.text.muted,
                    marginBottom: '8px',
                  }}>
                    Embed
                  </div>
                  <ModelCard
                    title="Resume Entity Extractor"
                    palette="green"
                    action={{ label: 'Try in Playground', state: 'ready' }}
                  />
                </div>
              </div>
            </div>

            {/* Sentiment Card */}
            <div style={{ marginBottom: '24px' }}>
              <SentimentCard />
            </div>

            {/* Review Card */}
            <ReviewCard
              title="Ratings & Reviews"
              rating={4.8}
              totalRatings="14,653"
              reviews={[
                {
                  title: "Couldn't put it down",
                  content: "I have always been a fan of this story. It was one of my go to book as a primary school teacher.",
                  rating: 5,
                  category: { label: 'Story', color: 'green' },
                  accuracy: '95%',
                },
                {
                  title: "Great game with some flaws",
                  content: "You control the Storm Boy using left and right arrows you cannot deviate from the assigned path. The story is superb otherwise",
                  rating: 4,
                  category: { label: 'Gameplay', color: 'purple' },
                  accuracy: '96%',
                },
                {
                  title: "Had to stop playing",
                  content: "The screen was just black. Reinstalled multiple times but nothing helped with the game.",
                  rating: 2,
                  category: { label: 'Bug', color: 'coral' },
                  accuracy: '99.8%',
                },
              ]}
            />
          </div>

          {/* Bottom Section - Buttons & Inputs */}
          <div style={{ gridColumn: 'span 12', marginTop: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}>
              {/* Buttons */}
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  color: COHERE.text.muted,
                  marginBottom: '16px',
                }}>
                  BUTTONS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <CohereButton variant="filled">Get Started</CohereButton>
                  <CohereButton variant="outline">Get Started</CohereButton>
                  <CohereButton variant="ghost">Get Started</CohereButton>
                </div>
              </div>

              {/* Inputs */}
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  color: COHERE.text.muted,
                  marginBottom: '16px',
                }}>
                  INPUT FIELDS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <CohereInput label="First Name" value="Geoffrey Everest" />
                  <CohereInput label="Last Name" value="Hinton" />
                  <CohereInput label="Age" value="Not applicable" />
                  <CohereInput label="Occupation" value="Pilot Astronaut" error="Incorrect occupation" />
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  color: COHERE.text.muted,
                  marginBottom: '16px',
                }}>
                  COLOR PALETTE
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { name: 'Sage 800', color: COHERE.sage[800] },
                    { name: 'Sage 500', color: COHERE.sage[500] },
                    { name: 'Coral 500', color: COHERE.coral[500] },
                    { name: 'Purple 500', color: COHERE.purple[500] },
                    { name: 'Cream 200', color: COHERE.cream[200] },
                  ].map((c) => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: c.color,
                        border: `1px solid ${COHERE.border}`,
                      }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: COHERE.text.muted }}>{c.color}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STORYBOOK EXPORT
// ============================================================================

const meta: Meta = {
  title: 'Experiments/CohereLab',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'cohere',
      values: [
        { name: 'cohere', value: COHERE.background },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
}

export default meta

export const FullPage: StoryObj = {
  render: () => <CohereLabPage />,
  parameters: {
    docs: {
      description: {
        story: 'Full page composition showing all Cohere-inspired UI components together.',
      },
    },
  },
}

export const LanguageTabsDemo: StoryObj = {
  render: () => {
    const [active, setActive] = useState('PYTHON')
    return (
      <div style={{ padding: '40px', background: COHERE.background }}>
        <LanguageTabs active={active} onChange={setActive} />
      </div>
    )
  },
}

export const CodeEditorDemo: StoryObj = {
  render: () => (
    <div style={{ padding: '40px', background: COHERE.background, maxWidth: '500px' }}>
      <CodeEditor />
    </div>
  ),
}

export const ModelCardsDemo: StoryObj = {
  render: () => (
    <div style={{
      padding: '40px',
      background: COHERE.background,
      display: 'flex',
      gap: '24px',
    }}>
      <ModelCard
        title="Finance Headline Sentiment Analyzer"
        palette="sage"
        status={{ label: 'ASLEEP', state: 'asleep' }}
      />
      <ModelCard
        title="Resume Entity Extractor"
        palette="green"
        action={{ label: 'Try in Playground', state: 'ready' }}
      />
      <ModelCard
        title="Product Classifier"
        palette="coral"
        status={{ label: 'READY', state: 'ready' }}
      />
    </div>
  ),
}

export const ButtonsDemo: StoryObj = {
  render: () => (
    <div style={{
      padding: '40px',
      background: COHERE.background,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'flex-start',
    }}>
      <CohereButton variant="filled">Get Started</CohereButton>
      <CohereButton variant="outline">Get Started</CohereButton>
      <CohereButton variant="ghost">Get Started</CohereButton>
    </div>
  ),
}

// ============================================================================
// DDS BRANDED SPLIT BUTTONS - Using DDS Design Tokens
// ============================================================================

// DDS Design System Colors (from designTokens.ts)
const DDS = {
  // DEEP_CURRENT (Teal - Primary Accent)
  teal: {
    50: '#E6F7FA',
    100: '#CCEFF5',
    200: '#99DFEB',
    300: '#66CFE1',
    400: '#33BFD7',
    500: '#08A4BD',
    600: '#068397',
    700: '#056271',
    800: '#03424B',
    900: '#022125',
  },
  // ABYSS (Dark Neutral)
  abyss: {
    50: '#E8E9EB',
    100: '#D1D3D7',
    200: '#A3A7AF',
    300: '#757B87',
    400: '#474F5F',
    500: '#2D3142',
    600: '#252836',
    700: '#1D1F2A',
    800: '#14161E',
    900: '#0C0D12',
  },
  // DUSK_REEF (Purple)
  purple: {
    50: '#EFEDF3',
    100: '#DFDBE7',
    200: '#BFB7CF',
    300: '#9F93B7',
    400: '#7F6F9F',
    500: '#5E4F7E',
    600: '#4B3F65',
    700: '#382F4C',
    800: '#262033',
    900: '#13101A',
  },
  // CORAL (Red)
  coral: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#F70D1A',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  // HARBOR (Green)
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  // SLATE (Neutral Gray)
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  white: '#FFFFFF',
}

function DDSSplitButton({
  children,
  variant = 'primary',
  icon: Icon = ArrowRight,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  icon?: React.ElementType
}) {
  const config = {
    primary: {
      mainBg: DDS.teal[500],
      iconBg: DDS.teal[700],
      textColor: DDS.white,
      iconColor: DDS.white,
      outerBg: DDS.teal[700],
    },
    secondary: {
      mainBg: DDS.abyss[500],
      iconBg: DDS.abyss[700],
      textColor: DDS.white,
      iconColor: DDS.white,
      outerBg: DDS.abyss[700],
    },
    danger: {
      mainBg: DDS.coral[500],
      iconBg: DDS.coral[700],
      textColor: DDS.white,
      iconColor: DDS.white,
      outerBg: DDS.coral[700],
    },
    success: {
      mainBg: DDS.green[600],
      iconBg: DDS.green[700],
      textColor: DDS.white,
      iconColor: DDS.white,
      outerBg: DDS.green[700],
    },
    ghost: {
      mainBg: DDS.white,
      iconBg: DDS.slate[100],
      textColor: DDS.abyss[500],
      iconColor: DDS.abyss[400],
      outerBg: DDS.slate[100],
    },
  }

  const style = config[variant]

  return (
    <button style={{
      display: 'inline-flex',
      alignItems: 'stretch',
      padding: 0,
      borderRadius: '14px',
      fontSize: '16px',
      fontWeight: 500,
      fontFamily: FONT.sans,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      border: variant === 'ghost' ? `1px solid ${DDS.slate[300]}` : 'none',
      overflow: 'hidden',
      background: style.outerBg,
      position: 'relative',
    }}>
      {/* Main text section with diagonal clip */}
      <span style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 48px 16px 28px',
        background: style.mainBg,
        color: style.textColor,
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 100%, 0 100%)',
        marginRight: '-16px',
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </span>

      {/* Icon section */}
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 24px 16px 28px',
        background: style.iconBg,
        color: style.iconColor,
      }}>
        <Icon size={20} strokeWidth={2} />
      </span>
    </button>
  )
}

export const DDSButtonsDemo: StoryObj = {
  render: () => (
    <div style={{
      padding: '40px',
      background: DDS.slate[50],
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'flex-start',
    }}>
      <div style={{ marginBottom: '8px', fontFamily: FONT.sans, fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', color: DDS.slate[500] }}>
        DDS SPLIT BUTTONS (Using Design System Tokens)
      </div>
      <DDSSplitButton variant="primary" icon={ArrowRight}>Get Started</DDSSplitButton>
      <DDSSplitButton variant="secondary" icon={Plus}>Create New</DDSSplitButton>
      <DDSSplitButton variant="danger" icon={Trash2}>Delete Item</DDSSplitButton>
      <DDSSplitButton variant="success" icon={Check}>Confirm</DDSSplitButton>
      <DDSSplitButton variant="ghost" icon={ExternalLink}>Learn More</DDSSplitButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Split buttons using DDS design tokens - teal (primary), abyss (secondary), coral (danger), harbor (success), slate (ghost).',
      },
    },
  },
}

export const InputFieldsDemo: StoryObj = {
  render: () => (
    <div style={{
      padding: '40px',
      background: COHERE.background,
      maxWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <CohereInput label="First Name" value="Geoffrey Everest" />
      <CohereInput label="Last Name" value="Hinton" />
      <CohereInput label="Occupation" value="Pilot Astronaut" error="Incorrect occupation" />
    </div>
  ),
}

export const ClassificationTableDemo: StoryObj = {
  render: () => (
    <div style={{ padding: '40px', background: COHERE.background, maxWidth: '700px' }}>
      <ClassificationTable />
    </div>
  ),
}

export const ReviewCardDemo: StoryObj = {
  render: () => (
    <div style={{ padding: '40px', background: COHERE.background }}>
      <ReviewCard
        title="Ratings & Reviews"
        rating={4.8}
        totalRatings="14,653"
        reviews={[
          {
            title: "Couldn't put it down",
            content: "I have always been a fan of this story. It was one of my go to book as a primary school teacher.",
            rating: 5,
            category: { label: 'Story', color: 'green' },
            accuracy: '95%',
          },
          {
            title: "Great game with some flaws",
            content: "You control the Storm Boy using left and right arrows you cannot deviate from the assigned path.",
            rating: 4,
            category: { label: 'Gameplay', color: 'purple' },
            accuracy: '96%',
          },
        ]}
      />
    </div>
  ),
}

export const SentimentCardDemo: StoryObj = {
  render: () => (
    <div style={{ padding: '40px', background: COHERE.background }}>
      <SentimentCard />
    </div>
  ),
}

export const ColorPalette: StoryObj = {
  render: () => (
    <div style={{ padding: '40px', background: COHERE.background, fontFamily: FONT.sans }}>
      <h2 style={{ fontSize: '24px', fontWeight: 300, marginBottom: '32px' }}>Cohere Color Palette</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
        {/* Sage */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Sage (Primary)</h3>
          {Object.entries(COHERE.sage).map(([shade, color]) => (
            <div key={shade} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '48px',
                height: '32px',
                borderRadius: '6px',
                background: color,
                border: `1px solid ${COHERE.border}`,
              }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500 }}>{shade}</div>
                <div style={{ fontSize: '10px', color: COHERE.text.muted }}>{color}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Coral */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Coral (Accent)</h3>
          {Object.entries(COHERE.coral).map(([shade, color]) => (
            <div key={shade} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '48px',
                height: '32px',
                borderRadius: '6px',
                background: color,
                border: `1px solid ${COHERE.border}`,
              }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500 }}>{shade}</div>
                <div style={{ fontSize: '10px', color: COHERE.text.muted }}>{color}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Purple */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Purple (Accent)</h3>
          {Object.entries(COHERE.purple).map(([shade, color]) => (
            <div key={shade} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '48px',
                height: '32px',
                borderRadius: '6px',
                background: color,
                border: `1px solid ${COHERE.border}`,
              }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500 }}>{shade}</div>
                <div style={{ fontSize: '10px', color: COHERE.text.muted }}>{color}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Cream & Semantic */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Cream & Semantic</h3>
          {Object.entries(COHERE.cream).map(([shade, color]) => (
            <div key={shade} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '48px',
                height: '32px',
                borderRadius: '6px',
                background: color,
                border: `1px solid ${COHERE.border}`,
              }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500 }}>Cream {shade}</div>
                <div style={{ fontSize: '10px', color: COHERE.text.muted }}>{color}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '48px',
                height: '32px',
                borderRadius: '6px',
                background: COHERE.background,
                border: `1px solid ${COHERE.border}`,
              }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500 }}>Background</div>
                <div style={{ fontSize: '10px', color: COHERE.text.muted }}>{COHERE.background}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '48px',
                height: '32px',
                borderRadius: '6px',
                background: COHERE.surface,
                border: `1px solid ${COHERE.border}`,
              }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500 }}>Surface</div>
                <div style={{ fontSize: '10px', color: COHERE.text.muted }}>{COHERE.surface}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}
