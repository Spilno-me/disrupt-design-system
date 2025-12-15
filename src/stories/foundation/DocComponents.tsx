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
} from '../../constants/designTokens';

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
    white: PRIMITIVES.white,
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
    bg: PRIMITIVES.white,
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
  <div style={{ marginBottom: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
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
            color: DEEP_CURRENT[500],
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
        background: PRIMITIVES.white,
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
            fontFamily: 'ui-monospace, monospace',
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
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {token.name}
              </code>
            </td>
            <td style={{ padding: '12px 16px' }}>
              <code style={{ fontSize: '12px', fontFamily: 'ui-monospace, monospace', color: styles.colors.textSubtle }}>
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
                    fontFamily: 'ui-monospace, monospace',
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
      background: PRIMITIVES.white,
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
          background: DEEP_CURRENT[500],
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
}) => (
  <a
    href={href}
    style={{
      display: 'block',
      background: PRIMITIVES.white,
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
      background: PRIMITIVES.white,
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
          fontFamily: 'ui-monospace, monospace',
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
            fontFamily: 'ui-monospace, monospace',
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
          fontFamily: 'ui-monospace, monospace',
          color: SLATE[300],
          lineHeight: 1.6,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default {
  TOKENS,
  SectionHeader,
  InfoBox,
  ColorSwatch,
  ColorScale,
  TokenTable,
  ShadowCard,
  NavCard,
  RadiusShowcase,
  CodeBlock,
};
