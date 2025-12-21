/**
 * Shared Documentation Components
 * Beautiful, token-synced components for Storybook documentation
 */
import React, { useState } from 'react';
import { Check, Copy, ArrowRight } from 'lucide-react';
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  CORAL,
  WAVE,
  SUNRISE,
  HARBOR,
  ORANGE,
  SLATE,
  PRIMITIVES,
  SHADOWS,
  RADIUS,
  ALIAS,
  SPACING,
} from '../../constants/designTokens';
import { navigateToStory } from '../brand/BrandComponents';

// =============================================================================
// DESIGN TOKENS EXPORT (for MDX usage)
// =============================================================================

export const TOKENS = {
  // Color scales
  abyss: ABYSS,
  deepCurrent: DEEP_CURRENT,
  duskReef: DUSK_REEF,
  coral: CORAL,
  wave: WAVE,
  sunrise: SUNRISE,
  harbor: HARBOR,
  orange: ORANGE,
  slate: SLATE,
  primitives: PRIMITIVES,

  // Semantic
  alias: ALIAS,
  shadows: SHADOWS,
  radius: RADIUS,

  // Quick access
  colors: {
    dark: ABYSS[500],
    teal: DEEP_CURRENT[500],
    purple: DUSK_REEF[500],
    cream: PRIMITIVES.cream,
    white: PRIMITIVES.softLinen,
    border: SLATE[200],
    borderStrong: SLATE[300],
  },
};

// =============================================================================
// STYLE CONSTANTS
// =============================================================================

const styles = {
  fontFamily: '"Fixel", system-ui, sans-serif',
  fontDisplay: '"Pilat Extended", Arial, sans-serif',
  colors: {
    text: ABYSS[500],
    textMuted: DUSK_REEF[500],
    textSubtle: SLATE[500],
    bg: PRIMITIVES.softLinen,
    bgSubtle: SLATE[50],
    border: SLATE[200],
    borderStrong: SLATE[300],
    accent: DEEP_CURRENT[500],
    accentLight: DEEP_CURRENT[50],
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const isLightColor = (hex: string): boolean => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
};

// =============================================================================
// SECTION WRAPPER (Handles vertical rhythm for MDX pages)
// =============================================================================

interface SectionProps {
  children: React.ReactNode;
  /** Remove top margin for first section after hero */
  first?: boolean;
}

/**
 * Section - Wrapper component that handles vertical rhythm
 *
 * Usage in MDX:
 * ```jsx
 * <Section first>
 *   <SectionHeader title="First Section" />
 *   <Content />
 * </Section>
 *
 * <Section>
 *   <SectionHeader title="Second Section" />
 *   <Content />
 * </Section>
 * ```
 */
export const Section: React.FC<SectionProps> = ({ children, first = false }) => (
  <div
    style={{
      marginTop: first ? 0 : SPACING.px.sectionHeadingTop,
    }}
  >
    {children}
  </div>
);

// =============================================================================
// SECTION HEADER
// =============================================================================

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  icon,
}) => (
  <div style={{ marginBottom: SPACING.px.sectionHeadingBottom }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: description ? '8px' : '0' }}>
      {icon && (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: RADIUS.md,
            background: DEEP_CURRENT[50],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: DEEP_CURRENT[700],
          }}
        >
          {icon}
        </div>
      )}
      <h2
        style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: 700,
          fontFamily: styles.fontDisplay,
          color: styles.colors.text,
        }}
      >
        {title}
      </h2>
    </div>
    {description && (
      <p
        style={{
          margin: 0,
          fontSize: '15px',
          fontFamily: styles.fontFamily,
          color: styles.colors.textMuted,
          lineHeight: 1.6,
          maxWidth: '600px',
        }}
      >
        {description}
      </p>
    )}
  </div>
);

// =============================================================================
// INFO BOX
// =============================================================================

interface InfoBoxProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'tip';
}

export const InfoBox: React.FC<InfoBoxProps> = ({ children, variant = 'info' }) => {
  const variants = {
    info: { bg: WAVE[50], border: WAVE[200], accent: WAVE[500] },
    warning: { bg: SUNRISE[50], border: SUNRISE[200], accent: SUNRISE[600] },
    success: { bg: HARBOR[50], border: HARBOR[200], accent: HARBOR[600] },
    tip: { bg: DEEP_CURRENT[50], border: DEEP_CURRENT[200], accent: DEEP_CURRENT[500] },
  };

  const v = variants[variant];

  return (
    <div
      style={{
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderLeft: `4px solid ${v.accent}`,
        borderRadius: RADIUS.sm,
        padding: '16px 20px',
        marginBottom: '24px',
        fontFamily: styles.fontFamily,
        fontSize: '14px',
        color: styles.colors.text,
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
};

// =============================================================================
// COLOR SWATCH (Token-Aware)
// =============================================================================

interface ColorSwatchProps {
  name: string;
  value: string;
  tokenPath?: string;
  usage?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  value,
  tokenPath,
  usage,
  size = 'md',
}) => {
  const [copied, setCopied] = useState(false);
  const textColor = isLightColor(value) ? ABYSS[500] : PRIMITIVES.white;

  const sizes = {
    sm: { height: '48px', padding: '8px' },
    md: { height: '72px', padding: '12px' },
    lg: { height: '100px', padding: '16px' },
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tokenPath || value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        background: PRIMITIVES.softLinen,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        boxShadow: SHADOWS.sm,
        border: `1px solid ${SLATE[200]}`,
        transition: 'all 200ms ease',
      }}
    >
      <div
        onClick={handleCopy}
        style={{
          background: value,
          height: sizes[size].height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 150ms ease',
        }}
        title={`Click to copy ${tokenPath || value}`}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: copied ? 'rgba(0,0,0,0.1)' : 'transparent',
            transition: 'background 150ms ease',
          }}
        >
          {copied ? (
            <Check size={18} color={textColor} />
          ) : (
            <Copy size={14} color={textColor} style={{ opacity: 0.6 }} />
          )}
        </div>
      </div>
      <div style={{ padding: sizes[size].padding }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: styles.colors.text,
            fontFamily: styles.fontFamily,
            marginBottom: '2px',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            color: styles.colors.textSubtle,
            marginBottom: usage ? '4px' : 0,
          }}
        >
          {value.toUpperCase()}
        </div>
        {usage && (
          <div
            style={{
              fontSize: '11px',
              color: styles.colors.textMuted,
              fontFamily: styles.fontFamily,
            }}
          >
            {usage}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// COLOR SCALE (Full scale display)
// =============================================================================

interface ColorScaleProps {
  name: string;
  scale: Record<string | number, string>;
  baseShade?: number;
}

export const ColorScale: React.FC<ColorScaleProps> = ({
  name,
  scale,
  baseShade = 500,
}) => {
  const shades = Object.entries(scale).sort((a, b) => Number(a[0]) - Number(b[0]));

  return (
    <div style={{ marginBottom: '32px' }}>
      <h4
        style={{
          margin: '0 0 12px 0',
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: styles.fontFamily,
          color: styles.colors.text,
        }}
      >
        {name}
      </h4>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
          gap: '8px',
        }}
      >
        {shades.map(([shade, hex]) => (
          <ColorSwatch
            key={shade}
            name={shade === String(baseShade) ? `${shade} (base)` : shade}
            value={hex}
            tokenPath={`${name.toUpperCase()}[${shade}]`}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// TOKEN TABLE
// =============================================================================

interface TokenTableProps {
  tokens: Array<{
    name: string;
    value: string;
    cssVar?: string;
    tailwind?: string;
    usage: string;
  }>;
}

export const TokenTable: React.FC<TokenTableProps> = ({ tokens }) => (
  <div
    style={{
      borderRadius: RADIUS.md,
      border: `1px solid ${SLATE[200]}`,
      overflow: 'hidden',
      marginBottom: '24px',
    }}
  >
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
        fontFamily: styles.fontFamily,
      }}
    >
      <thead>
        <tr style={{ background: SLATE[50] }}>
          <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: styles.colors.text, borderBottom: `2px solid ${SLATE[200]}` }}>
            Token
          </th>
          <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: styles.colors.text, borderBottom: `2px solid ${SLATE[200]}` }}>
            Value
          </th>
          {tokens[0]?.tailwind && (
            <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: styles.colors.text, borderBottom: `2px solid ${SLATE[200]}` }}>
              Tailwind
            </th>
          )}
          <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: styles.colors.text, borderBottom: `2px solid ${SLATE[200]}` }}>
            Usage
          </th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, i) => (
          <tr
            key={token.name}
            style={{
              borderBottom: i < tokens.length - 1 ? `1px solid ${SLATE[200]}` : 'none',
            }}
          >
            <td style={{ padding: '12px 16px' }}>
              <code
                style={{
                  background: SLATE[100],
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                }}
              >
                {token.name}
              </code>
            </td>
            <td style={{ padding: '12px 16px' }}>
              <code style={{ fontSize: '12px', fontFamily: '"JetBrains Mono", ui-monospace, monospace', color: styles.colors.textSubtle }}>
                {token.value}
              </code>
            </td>
            {token.tailwind && (
              <td style={{ padding: '12px 16px' }}>
                <code
                  style={{
                    background: DEEP_CURRENT[50],
                    color: DEEP_CURRENT[700],
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  }}
                >
                  {token.tailwind}
                </code>
              </td>
            )}
            <td style={{ padding: '12px 16px', color: styles.colors.textMuted }}>
              {token.usage}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// =============================================================================
// SHADOW CARD
// =============================================================================

interface ShadowCardProps {
  name: string;
  value: string;
  usage: string;
  examples: string;
  isRecommended?: boolean;
}

export const ShadowCard: React.FC<ShadowCardProps> = ({
  name,
  value,
  usage,
  examples,
  isRecommended,
}) => (
  <div
    style={{
      background: PRIMITIVES.softLinen,
      borderRadius: RADIUS.lg,
      padding: '24px',
      boxShadow: value,
      border: isRecommended ? `2px solid ${DEEP_CURRENT[500]}` : `1px solid ${SLATE[200]}`,
      position: 'relative',
    }}
  >
    {isRecommended && (
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          right: '16px',
          background: DEEP_CURRENT[700],
          color: PRIMITIVES.white,
          padding: '4px 12px',
          borderRadius: RADIUS.full,
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: styles.fontFamily,
        }}
      >
        RECOMMENDED
      </div>
    )}
    <div
      style={{
        fontSize: '18px',
        fontWeight: 700,
        color: isRecommended ? DEEP_CURRENT[500] : styles.colors.text,
        fontFamily: styles.fontFamily,
        marginBottom: '4px',
      }}
    >
      {name}
    </div>
    <div
      style={{
        fontSize: '13px',
        color: styles.colors.textMuted,
        fontFamily: styles.fontFamily,
        marginBottom: '12px',
      }}
    >
      {usage}
    </div>
    <div
      style={{
        fontSize: '12px',
        color: styles.colors.textSubtle,
        fontFamily: styles.fontFamily,
      }}
    >
      <strong>Examples:</strong> {examples}
    </div>
  </div>
);

// =============================================================================
// HIGHLIGHT CARD
// =============================================================================

interface HighlightCardProps {
  name: string;
  value: string;
  usage: string;
  examples: string;
}

/**
 * HighlightCard - Displays highlight tokens on a dark background
 * where the inset white glow is visible.
 */
export const HighlightCard: React.FC<HighlightCardProps> = ({
  name,
  value,
  usage,
  examples,
}) => (
  <div
    style={{
      background: ABYSS[500],
      borderRadius: RADIUS.lg,
      padding: '24px',
      boxShadow: value,
      border: `1px solid ${ABYSS[400]}`,
      position: 'relative',
    }}
  >
    <div
      style={{
        fontSize: '18px',
        fontWeight: 700,
        color: PRIMITIVES.white,
        fontFamily: styles.fontFamily,
        marginBottom: '4px',
      }}
    >
      {name}
    </div>
    <div
      style={{
        fontSize: '13px',
        color: SLATE[300],
        fontFamily: styles.fontFamily,
        marginBottom: '12px',
      }}
    >
      {usage}
    </div>
    <div
      style={{
        fontSize: '12px',
        color: SLATE[400],
        fontFamily: styles.fontFamily,
      }}
    >
      <strong style={{ color: SLATE[300] }}>Examples:</strong> {examples}
    </div>
  </div>
);

// =============================================================================
// DEPTH CARD (Combined Shadow + Highlight)
// =============================================================================

interface DepthCardProps {
  name: string;
  shadow: string;
  highlight: string;
  description: string;
  isRecommended?: boolean;
}

/**
 * DepthCard - Demonstrates realistic depth with BOTH shadow and highlight
 * Shows how combining shadow below + highlight above creates natural lighting.
 */
export const DepthCard: React.FC<DepthCardProps> = ({
  name,
  shadow,
  highlight,
  description,
  isRecommended,
}) => (
  <div
    style={{
      background: SLATE[100],
      borderRadius: RADIUS.lg,
      padding: '24px',
      boxShadow: `${shadow}, ${highlight}`,
      border: isRecommended ? `2px solid ${DEEP_CURRENT[500]}` : `1px solid ${SLATE[200]}`,
      position: 'relative',
    }}
  >
    {isRecommended && (
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          right: '16px',
          background: DEEP_CURRENT[700],
          color: PRIMITIVES.white,
          padding: '4px 12px',
          borderRadius: RADIUS.full,
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: styles.fontFamily,
        }}
      >
        REALISTIC
      </div>
    )}
    <div
      style={{
        fontSize: '18px',
        fontWeight: 700,
        color: isRecommended ? DEEP_CURRENT[500] : styles.colors.text,
        fontFamily: styles.fontFamily,
        marginBottom: '8px',
      }}
    >
      {name}
    </div>
    <div
      style={{
        fontSize: '13px',
        color: styles.colors.textMuted,
        fontFamily: styles.fontFamily,
        marginBottom: '16px',
      }}
    >
      {description}
    </div>
    <div
      style={{
        display: 'flex',
        gap: '16px',
        fontSize: '11px',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      }}
    >
      <div style={{ color: ABYSS[400] }}>
        <div style={{ color: styles.colors.textMuted, fontFamily: styles.fontFamily, marginBottom: '2px' }}>Shadow</div>
        {shadow.split(',')[0]}...
      </div>
      <div style={{ color: ABYSS[400] }}>
        <div style={{ color: styles.colors.textMuted, fontFamily: styles.fontFamily, marginBottom: '2px' }}>Highlight</div>
        {highlight.split(',')[0]}...
      </div>
    </div>
  </div>
);

// =============================================================================
// NAVIGATION CARD
// =============================================================================

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color?: string;
}

export const NavCard: React.FC<NavCardProps> = ({
  title,
  description,
  href,
  icon,
  color = DEEP_CURRENT[500],
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToStory(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      style={{
        display: 'block',
        background: PRIMITIVES.softLinen,
        borderRadius: RADIUS.lg,
        padding: '24px',
        boxShadow: SHADOWS.md,
        border: `1px solid ${SLATE[200]}`,
        textDecoration: 'none',
        transition: 'all 200ms ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = SHADOWS.elevated;
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = SHADOWS.md;
        e.currentTarget.style.borderColor = SLATE[200];
      }}
    >
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: RADIUS.md,
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        marginBottom: '16px',
      }}
    >
      {icon}
    </div>
    <div
      style={{
        fontSize: '18px',
        fontWeight: 600,
        color: styles.colors.text,
        fontFamily: styles.fontFamily,
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {title}
      <ArrowRight size={16} style={{ opacity: 0.5 }} />
    </div>
    <div
      style={{
        fontSize: '14px',
        color: styles.colors.textMuted,
        fontFamily: styles.fontFamily,
        lineHeight: 1.5,
      }}
    >
      {description}
    </div>
  </a>
  );
};

// =============================================================================
// RADIUS SHOWCASE
// =============================================================================

interface RadiusShowcaseProps {
  name: string;
  value: string;
  usage: string;
}

export const RadiusShowcase: React.FC<RadiusShowcaseProps> = ({
  name,
  value,
  usage,
}) => (
  <div
    style={{
      background: PRIMITIVES.softLinen,
      borderRadius: RADIUS.md,
      padding: '16px',
      border: `1px solid ${SLATE[200]}`,
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}
  >
    <div
      style={{
        width: '64px',
        height: '64px',
        background: DEEP_CURRENT[500],
        borderRadius: value,
        flexShrink: 0,
      }}
    />
    <div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: styles.colors.text,
          fontFamily: styles.fontFamily,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: '12px',
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          color: styles.colors.textSubtle,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: styles.colors.textMuted,
          fontFamily: styles.fontFamily,
          marginTop: '4px',
        }}
      >
        {usage}
      </div>
    </div>
  </div>
);

// =============================================================================
// CODE BLOCK
// =============================================================================

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'tsx' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        position: 'relative',
        background: ABYSS[700],
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          background: ABYSS[800],
          borderBottom: `1px solid ${ABYSS[600]}`,
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            color: SLATE[400],
            textTransform: 'uppercase',
          }}
        >
          {language}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: SLATE[400],
            fontSize: '11px',
            fontFamily: styles.fontFamily,
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = ABYSS[600];
            e.currentTarget.style.color = PRIMITIVES.white;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = SLATE[400];
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '16px',
          overflow: 'auto',
          fontSize: '13px',
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          color: SLATE[300],
          lineHeight: 1.6,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

// =============================================================================
// GRADIENT SWATCH
// =============================================================================

interface GradientSwatchProps {
  name: string;
  value: string;
  tokenPath: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GradientSwatch: React.FC<GradientSwatchProps> = ({
  name,
  value,
  tokenPath,
  description,
  size = 'md',
}) => {
  const [copied, setCopied] = useState(false);

  const sizes = {
    sm: { height: '60px', padding: '8px' },
    md: { height: '80px', padding: '12px' },
    lg: { height: '120px', padding: '16px' },
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tokenPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        background: PRIMITIVES.softLinen,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        boxShadow: SHADOWS.sm,
        border: `1px solid ${SLATE[200]}`,
      }}
    >
      <div
        onClick={handleCopy}
        style={{
          background: value,
          height: sizes[size].height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
        title={`Click to copy ${tokenPath}`}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: copied ? 'rgba(0,0,0,0.2)' : 'transparent',
            transition: 'background 150ms ease',
          }}
        >
          {copied ? (
            <Check size={18} color={PRIMITIVES.white} />
          ) : (
            <Copy size={14} color={PRIMITIVES.white} style={{ opacity: 0.7 }} />
          )}
        </div>
      </div>
      <div style={{ padding: sizes[size].padding }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: styles.colors.text,
            fontFamily: styles.fontFamily,
            marginBottom: '2px',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            color: styles.colors.textSubtle,
            marginBottom: description ? '4px' : 0,
            wordBreak: 'break-all',
          }}
        >
          {tokenPath}
        </div>
        {description && (
          <div
            style={{
              fontSize: '11px',
              color: styles.colors.textMuted,
              fontFamily: styles.fontFamily,
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// USAGE GUIDELINES (When to use X - Two column Do/Don't)
// =============================================================================

interface UsageGuidelinesProps {
  /** Optional title like "When to use font-mono" */
  title?: string;
  /** Items for the green "Use for:" column */
  useFor: string[];
  /** Items for the red "Never use for:" column */
  dontUseFor: string[];
}

/**
 * UsageGuidelines - Two-column panel showing appropriate and inappropriate uses
 *
 * Usage:
 * ```jsx
 * <UsageGuidelines
 *   title="When to use font-mono"
 *   useFor={['Code snippets', 'Token paths', 'Technical IDs']}
 *   dontUseFor={['Headings', 'Body text', 'Button labels']}
 * />
 * ```
 */
export const UsageGuidelines: React.FC<UsageGuidelinesProps> = ({
  title,
  useFor,
  dontUseFor,
}) => (
  <div
    style={{
      background: PRIMITIVES.softLinen,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: `1px solid ${SLATE[200]}`,
    }}
  >
    {title && (
      <h4
        style={{
          margin: '0 0 20px 0',
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: styles.fontFamily,
          color: styles.colors.text,
        }}
      >
        {title}
      </h4>
    )}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
      }}
    >
      {/* Use for column */}
      <div
        style={{
          background: HARBOR[50],
          borderRadius: RADIUS.md,
          padding: '20px',
          border: `1px solid ${HARBOR[200]}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: `1px solid ${HARBOR[200]}`,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: RADIUS.full,
              background: HARBOR[700],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: PRIMITIVES.white,
            }}
          >
            ✓
          </div>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: styles.fontFamily,
              color: HARBOR[700],
            }}
          >
            Use for:
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {useFor.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                fontFamily: styles.fontFamily,
                color: styles.colors.text,
              }}
            >
              <span style={{ color: HARBOR[500], fontSize: '12px' }}>→</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Never use for column */}
      <div
        style={{
          background: CORAL[50],
          borderRadius: RADIUS.md,
          padding: '20px',
          border: `1px solid ${CORAL[200]}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: `1px solid ${CORAL[200]}`,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: RADIUS.full,
              background: CORAL[700],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: PRIMITIVES.white,
            }}
          >
            ✗
          </div>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: styles.fontFamily,
              color: CORAL[700],
            }}
          >
            Never use for:
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dontUseFor.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                fontFamily: styles.fontFamily,
                color: styles.colors.text,
              }}
            >
              <span style={{ color: CORAL[500], fontSize: '12px' }}>→</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// =============================================================================
// DOS AND DONTS PANEL (Simple bullet list boxes)
// =============================================================================

interface DosDontsPanelProps {
  /** Items for the green "Do" list */
  dos: string[];
  /** Items for the red "Don't" list */
  donts: string[];
}

/**
 * DosDontsPanel - Two-column panel with simple Do/Don't bullet lists
 *
 * Usage:
 * ```jsx
 * <DosDontsPanel
 *   dos={['Use semantic tokens', 'Maintain contrast ratios']}
 *   donts={['Hardcode hex values', 'Mix status colors']}
 * />
 * ```
 */
export const DosDontsPanel: React.FC<DosDontsPanelProps> = ({ dos, donts }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
    }}
  >
    {/* Do column */}
    <div
      style={{
        background: HARBOR[50],
        borderRadius: RADIUS.lg,
        padding: '24px',
        border: `1px solid ${HARBOR[200]}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: RADIUS.full,
            background: HARBOR[700],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: PRIMITIVES.white,
          }}
        >
          ✓
        </div>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: styles.fontFamily,
            color: HARBOR[700],
          }}
        >
          Do
        </span>
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: '20px',
          fontSize: '14px',
          color: styles.colors.text,
          fontFamily: styles.fontFamily,
          lineHeight: 2,
        }}
      >
        {dos.map((item, i) => (
          <li key={i}>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Don't column */}
    <div
      style={{
        background: CORAL[50],
        borderRadius: RADIUS.lg,
        padding: '24px',
        border: `1px solid ${CORAL[200]}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: RADIUS.full,
            background: CORAL[700],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: PRIMITIVES.white,
          }}
        >
          ✗
        </div>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: styles.fontFamily,
            color: CORAL[700],
          }}
        >
          Don't
        </span>
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: '20px',
          fontSize: '14px',
          color: styles.colors.text,
          fontFamily: styles.fontFamily,
          lineHeight: 2,
        }}
      >
        {donts.map((item, i) => (
          <li key={i}>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// =============================================================================
// QUICK NAV (Navigation grid for sub-pages)
// =============================================================================

interface QuickNavItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
}

interface QuickNavProps {
  /** Title above the navigation grid */
  title?: string;
  /** Navigation items */
  items: QuickNavItem[];
  /** Number of columns (default: 3) */
  columns?: number;
}

/**
 * QuickNav - Navigation grid linking to documentation sub-pages
 *
 * Usage:
 * ```jsx
 * <QuickNav
 *   title="Documentation Sections"
 *   items={[
 *     { icon: <Palette size={20} />, title: 'Colors', description: 'Full color system', path: 'colors' }
 *   ]}
 * />
 * ```
 */
export const QuickNav: React.FC<QuickNavProps> = ({
  title,
  items,
  columns = 3,
}) => (
  <div
    style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '32px',
      border: `1px solid ${SLATE[200]}`,
    }}
  >
    {title && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: styles.fontFamily,
            color: styles.colors.text,
          }}
        >
          {title}
        </h2>
      </div>
    )}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '16px',
      }}
    >
      {items.map((item) => (
        <a
          key={item.path}
          href={item.path}
          onClick={(e) => {
            e.preventDefault();
            navigateToStory(item.path);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: SLATE[50],
            borderRadius: RADIUS.sm,
            padding: '16px',
            textDecoration: 'none',
            transition: 'all 200ms ease-out',
            border: '1px solid transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = PRIMITIVES.white;
            e.currentTarget.style.borderColor = DEEP_CURRENT[200];
            e.currentTarget.style.boxShadow = SHADOWS.sm;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = SLATE[50];
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: RADIUS.sm,
              background: SLATE[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: DEEP_CURRENT[700],
              flexShrink: 0,
            }}
          >
            {item.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: styles.fontFamily,
                color: styles.colors.text,
              }}
            >
              <span>{item.title}</span>
            </div>
            <div
              style={{
                fontSize: '12px',
                fontFamily: styles.fontFamily,
                color: styles.colors.textMuted,
              }}
            >
              <span>{item.description}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  </div>
);

export default {
  TOKENS,
  Section,
  SectionHeader,
  InfoBox,
  ColorSwatch,
  ColorScale,
  TokenTable,
  ShadowCard,
  NavCard,
  RadiusShowcase,
  CodeBlock,
  GradientSwatch,
  UsageGuidelines,
  DosDontsPanel,
  QuickNav,
};
