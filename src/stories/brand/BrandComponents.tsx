/**
 * Brand Documentation Components
 * Shared components for the Brand section - all values imported from designTokens.ts
 *
 * DESIGN SYSTEM RULE: No emojis - always use Lucide icons for consistency
 */
import React from 'react';
import {
  Info,
  Lightbulb,
  AlertTriangle,
  Construction,
} from 'lucide-react';

// =============================================================================
// STORYBOOK NAVIGATION HELPER
// =============================================================================

/**
 * Navigate to a Storybook path (works in both iframe and standalone contexts)
 * Handles the parent frame navigation that native <a> tags can't do properly
 */
export const navigateToStory = (path: string) => {
  // Remove leading ?path= if present
  const cleanPath = path.replace(/^\?path=/, '');

  // Try to navigate the parent frame (Storybook manager)
  try {
    if (window.parent !== window) {
      // We're in an iframe, update parent URL
      window.parent.location.href = `${window.parent.location.origin}${window.parent.location.pathname}?path=${cleanPath}`;
    } else {
      // Standalone, just update current URL
      window.location.href = `?path=${cleanPath}`;
    }
  } catch {
    // Fallback for cross-origin restrictions
    window.location.href = `?path=${cleanPath}`;
  }
};

interface StoryLinkProps {
  to: string; // Path like "/docs/foundation-design-tokens-overview--docs"
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * StoryLink - A link component for navigating between Storybook pages
 * Use this instead of native <a> tags for internal Storybook navigation
 */
export const StoryLink: React.FC<StoryLinkProps> = ({ to, children, style, className }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToStory(to);
  };

  return (
    <a
      href={`?path=${to}`}
      onClick={handleClick}
      style={{ cursor: 'pointer', ...style }}
      className={className}
    >
      {children}
    </a>
  );
};
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  CORAL,
  SLATE,
  PRIMITIVES,
  SHADOWS,
  RADIUS,
  ALIAS,
  SPACING,
} from '../../constants/designTokens';

// Re-export tokens for MDX usage
export const TOKENS = {
  abyss: ABYSS,
  deepCurrent: DEEP_CURRENT,
  duskReef: DUSK_REEF,
  coral: CORAL,
  slate: SLATE,
  primitives: PRIMITIVES,
  shadows: SHADOWS,
  radius: RADIUS,
  alias: ALIAS,
};

// Also export individual tokens for direct import
export {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  CORAL,
  SLATE,
  PRIMITIVES,
  SHADOWS,
  RADIUS,
  ALIAS,
  SPACING,
};

interface HeroHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: 'primary' | 'teal' | 'purple';
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  icon,
  title,
  description,
  gradient = 'primary',
}) => {
  const gradients = {
    primary: `linear-gradient(135deg, ${ABYSS[500]} 0%, ${ABYSS[700]} 100%)`,
    teal: `linear-gradient(135deg, ${DEEP_CURRENT[500]} 0%, ${DEEP_CURRENT[700]} 100%)`,
    purple: `linear-gradient(135deg, ${DUSK_REEF[500]} 0%, ${DUSK_REEF[700]} 100%)`,
  };

  // CONTRAST: All dark backgrounds need light text
  const subtitleColors = {
    primary: SLATE[300],      // Light gray on dark ABYSS
    teal: SLATE[200],         // Light gray on dark DEEP_CURRENT
    purple: SLATE[200],       // Light gray on dark DUSK_REEF
  };

  return (
    <div
      style={{
        background: gradients[gradient],
        borderRadius: RADIUS.xl,
        padding: '40px',
        marginBottom: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${DEEP_CURRENT[500]}30 0%, transparent 70%)`,
          borderRadius: '50%',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          {icon}
        </div>

        <h1
          style={{
            margin: '0 0 12px 0',
            fontSize: '36px',
            fontWeight: 700,
            fontFamily: '"Pilat Extended", sans-serif',
            color: PRIMITIVES.white,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: '16px',
            fontFamily: '"Fixel", sans-serif',
            color: subtitleColors[gradient],
            lineHeight: 1.6,
            maxWidth: '500px',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

interface InfoBoxProps {
  variant?: 'info' | 'tip' | 'warning';
  children: React.ReactNode;
}

export const InfoBox: React.FC<InfoBoxProps> = ({ variant = 'info', children }) => {
  const styles = {
    info: {
      bg: DEEP_CURRENT[50],
      border: DEEP_CURRENT[200],
      iconColor: DEEP_CURRENT[600],
      Icon: Info,
    },
    tip: {
      bg: DUSK_REEF[50],
      border: DUSK_REEF[200],
      iconColor: DUSK_REEF[600],
      Icon: Lightbulb,
    },
    warning: {
      bg: CORAL[50],
      border: CORAL[200],
      iconColor: CORAL[600],
      Icon: AlertTriangle,
    },
  };

  const style = styles[variant];
  const IconComponent = style.Icon;

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: RADIUS.md,
        padding: `${SPACING.px.base} ${SPACING.px.cardGap}`,
        marginBottom: SPACING.px.comfortable,
        display: 'flex',
        gap: SPACING.px.tight,
        alignItems: 'baseline',
      }}
    >
      <IconComponent size={20} color={style.iconColor} style={{ flexShrink: 0, position: 'relative', top: '3px' }} />
      <div
        style={{
          fontSize: '14px',
          fontFamily: '"Fixel", sans-serif',
          color: ABYSS[500],
          lineHeight: 1.6,
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  link,
}) => {
  const content = (
    <div
      style={{
        background: PRIMITIVES.white,
        borderRadius: RADIUS.lg,
        padding: '24px',
        border: `1px solid ${SLATE[200]}`,
        boxShadow: SHADOWS.sm,
        transition: 'all 200ms ease-out',
        cursor: link ? 'pointer' : 'default',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: RADIUS.md,
          background: DEEP_CURRENT[50],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: '"Fixel", sans-serif',
          color: ABYSS[500],
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: '14px',
          fontFamily: '"Fixel", sans-serif',
          color: DUSK_REEF[500],
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  );

  if (link) {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      navigateToStory(link);
    };

    return (
      <a
        href={link}
        onClick={handleClick}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        {content}
      </a>
    );
  }

  return content;
};

interface ProductCardProps {
  name: string;
  logo: string;
  description: string;
  color: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  logo,
  description,
  color,
}) => {
  return (
    <div
      style={{
        background: PRIMITIVES.white,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        border: `1px solid ${SLATE[200]}`,
        boxShadow: SHADOWS.md,
      }}
    >
      <div
        style={{
          background: SLATE[50],
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100px',
          borderBottom: `1px solid ${SLATE[200]}`,
        }}
      >
        <img
          src={logo}
          alt={name}
          style={{ maxHeight: '48px', maxWidth: '160px' }}
        />
      </div>
      <div style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: color,
            }}
          />
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: '"Fixel", sans-serif',
              color: ABYSS[500],
            }}
          >
            {name}
          </h3>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            fontFamily: '"Fixel", sans-serif',
            color: DUSK_REEF[500],
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

interface NavCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

export const NavCard: React.FC<NavCardProps> = ({ icon, title, description, href }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToStory(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: PRIMITIVES.white,
        borderRadius: RADIUS.md,
        padding: '20px',
        border: `1px solid ${SLATE[200]}`,
        textDecoration: 'none',
        transition: 'all 200ms ease-out',
        boxShadow: SHADOWS.sm,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: RADIUS.md,
          background: DEEP_CURRENT[50],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: DEEP_CURRENT[600],
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: '"Fixel", sans-serif',
            color: ABYSS[500],
            marginBottom: '4px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '13px',
            fontFamily: '"Fixel", sans-serif',
            color: DUSK_REEF[500],
          }}
        >
          {description}
        </div>
      </div>
    </a>
  );
};

interface GuidelineCardProps {
  type: 'do' | 'dont';
  title: string;
  children: React.ReactNode;
  image?: string;
}

export const GuidelineCard: React.FC<GuidelineCardProps> = ({
  type,
  title,
  children,
  image,
}) => {
  const isDo = type === 'do';

  return (
    <div
      style={{
        background: PRIMITIVES.white,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        border: `1px solid ${isDo ? DEEP_CURRENT[200] : CORAL[200]}`,
      }}
    >
      {image && (
        <div
          style={{
            background: SLATE[50],
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '120px',
            borderBottom: `1px solid ${SLATE[200]}`,
          }}
        >
          <img src={image} alt={title} style={{ maxHeight: '80px' }} />
        </div>
      )}
      <div style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: isDo ? DEEP_CURRENT[500] : CORAL[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: PRIMITIVES.white,
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            {isDo ? '✓' : '✕'}
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: '"Fixel", sans-serif',
              color: isDo ? DEEP_CURRENT[600] : CORAL[600],
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {isDo ? 'Do' : "Don't"}
          </span>
        </div>
        <h4
          style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: '"Fixel", sans-serif',
            color: ABYSS[500],
          }}
        >
          {title}
        </h4>
        <div
          style={{
            fontSize: '13px',
            fontFamily: '"Fixel", sans-serif',
            color: DUSK_REEF[500],
            lineHeight: 1.5,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

interface DownloadCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  formats: string[];
  onDownload?: () => void;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({
  icon,
  title,
  description,
  formats,
  onDownload,
}) => {
  return (
    <div
      style={{
        background: PRIMITIVES.white,
        borderRadius: RADIUS.lg,
        padding: '24px',
        border: `1px solid ${SLATE[200]}`,
        boxShadow: SHADOWS.sm,
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: RADIUS.md,
          background: DEEP_CURRENT[50],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: DEEP_CURRENT[600],
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: '"Fixel", sans-serif',
          color: ABYSS[500],
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: '0 0 16px 0',
          fontSize: '13px',
          fontFamily: '"Fixel", sans-serif',
          color: DUSK_REEF[500],
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '16px',
        }}
      >
        {formats.map((format) => (
          <span
            key={format}
            style={{
              background: DEEP_CURRENT[50],
              color: DEEP_CURRENT[700],
              padding: '4px 10px',
              borderRadius: RADIUS.xs,
              fontSize: '11px',
              fontWeight: 500,
              fontFamily: '"Fixel", sans-serif',
              textTransform: 'uppercase',
            }}
          >
            {format}
          </span>
        ))}
      </div>
      <button
        onClick={onDownload}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: ABYSS[500],
          color: PRIMITIVES.white,
          border: 'none',
          borderRadius: RADIUS.sm,
          fontSize: '13px',
          fontWeight: 500,
          fontFamily: '"Fixel", sans-serif',
          cursor: 'pointer',
          transition: 'background 200ms ease-out',
        }}
      >
        Download
      </button>
    </div>
  );
};

interface IconShowcaseProps {
  icons: Array<{ name: string; icon: React.ReactNode }>;
}

export const IconShowcase: React.FC<IconShowcaseProps> = ({ icons }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '12px',
      }}
    >
      {icons.map(({ name, icon }) => (
        <div
          key={name}
          style={{
            background: PRIMITIVES.white,
            borderRadius: RADIUS.sm,
            padding: '16px',
            border: `1px solid ${SLATE[200]}`,
            textAlign: 'center',
            transition: 'all 200ms ease-out',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              color: ABYSS[500],
            }}
          >
            {icon}
          </div>
          <div
            style={{
              fontSize: '11px',
              fontFamily: '"Fixel", sans-serif',
              color: SLATE[500],
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </div>
        </div>
      ))}
    </div>
  );
};

interface TechStackItemProps {
  name: string;
  version?: string;
  description: string;
  icon: React.ReactNode;
}

export const TechStackItem: React.FC<TechStackItemProps> = ({
  name,
  version,
  description,
  icon,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: SLATE[50],
        borderRadius: RADIUS.sm,
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: RADIUS.sm,
          background: PRIMITIVES.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: DEEP_CURRENT[600],
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: '"Fixel", sans-serif',
              color: ABYSS[500],
            }}
          >
            {name}
          </span>
          {version && (
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'ui-monospace, monospace',
                color: DEEP_CURRENT[600],
                background: DEEP_CURRENT[50],
                padding: '2px 6px',
                borderRadius: RADIUS.xs,
              }}
            >
              {version}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: '13px',
            fontFamily: '"Fixel", sans-serif',
            color: DUSK_REEF[500],
            marginTop: '2px',
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: description ? '8px' : '0',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: RADIUS.sm,
            background: DEEP_CURRENT[50],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: DEEP_CURRENT[600],
          }}
        >
          {icon}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            fontFamily: '"Fixel", sans-serif',
            color: ABYSS[500],
          }}
        >
          {title}
        </h2>
      </div>
      {description && (
        <p
          style={{
            margin: 0,
            marginLeft: '48px',
            fontSize: '14px',
            fontFamily: '"Fixel", sans-serif',
            color: DUSK_REEF[500],
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

interface ComingSoonProps {
  title: string;
  items: string[];
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ title, items }) => {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${SLATE[50]} 0%, ${SLATE[100]} 100%)`,
        borderRadius: RADIUS.lg,
        padding: '48px',
        textAlign: 'center',
        border: `2px dashed ${SLATE[300]}`,
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: PRIMITIVES.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: SHADOWS.sm,
        }}
      >
        <Construction size={28} color={DUSK_REEF[500]} />
      </div>
      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: '"Fixel", sans-serif',
          color: ABYSS[500],
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: '0 0 24px 0',
          fontSize: '14px',
          fontFamily: '"Fixel", sans-serif',
          color: DUSK_REEF[500],
        }}
      >
        This section is under development
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
        }}
      >
        {items.map((item) => (
          <span
            key={item}
            style={{
              background: PRIMITIVES.white,
              padding: '8px 16px',
              borderRadius: RADIUS.sm,
              fontSize: '13px',
              fontFamily: '"Fixel", sans-serif',
              color: ABYSS[500],
              boxShadow: SHADOWS.sm,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
