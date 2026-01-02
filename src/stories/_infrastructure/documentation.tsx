/**
 * DDS Documentation Components
 * Constraint-driven documentation blocks inspired by Vibe Design System
 */
import React, { ReactElement } from 'react';
import {
  Check,
  X,
  Beaker,
  AlertTriangle,
  CheckCircle,
  Lock,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { PRIMITIVES } from '../../constants/designTokens';
import { navigateToStory } from '../brand/BrandComponents';

// Shared font family
const fontFamily = '"Fixel", system-ui, sans-serif';
const fontDisplay = '"Pilat Extended", Arial, sans-serif';

// =============================================================================
// COMPONENT RULES - Live Do/Don't with rendered components
// =============================================================================

interface ComponentRule {
  do: { component: ReactElement; description: string };
  dont: { component: ReactElement; description: string };
}

export interface ComponentRulesProps {
  rules: ComponentRule[];
  title?: string;
}

export const ComponentRules: React.FC<ComponentRulesProps> = ({ rules, title }) => (
  <div className="mb-8">
    {title && (
      <h3 className="text-base font-semibold text-abyss-500 mb-4 mt-0">
        {title}
      </h3>
    )}
    <div className="flex flex-col gap-6">
      {rules.map((rule, index) => (
        <div key={index} className="grid grid-cols-2 gap-6">
          {/* DO panel */}
          <div className="bg-harbor-50 rounded-xl border border-harbor-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-harbor-200 bg-harbor-100">
              <div className="w-5 h-5 rounded-full bg-harbor-700 flex items-center justify-center">
                <Check size={12} color={PRIMITIVES.white} strokeWidth={3} />
              </div>
              <span className="text-xs font-semibold text-harbor-700 uppercase tracking-wide">
                Do
              </span>
            </div>
            <div className="p-6 flex items-center justify-center min-h-[80px] bg-soft-linen">
              {rule.do.component}
            </div>
            <div className="px-4 py-3 text-sm text-abyss-500 leading-relaxed border-t border-harbor-200">
              {rule.do.description}
            </div>
          </div>

          {/* DON'T panel */}
          <div className="bg-coral-50 rounded-xl border border-coral-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-coral-200 bg-coral-100">
              <div className="w-5 h-5 rounded-full bg-coral-700 flex items-center justify-center">
                <X size={12} color={PRIMITIVES.white} strokeWidth={3} />
              </div>
              <span className="text-xs font-semibold text-coral-700 uppercase tracking-wide">
                Don't
              </span>
            </div>
            <div className="p-6 flex items-center justify-center min-h-[80px] bg-soft-linen">
              {rule.dont.component}
            </div>
            <div className="px-4 py-3 text-sm text-abyss-500 leading-relaxed border-t border-coral-200">
              {rule.dont.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// RELATED COMPONENTS - Navigation links to related docs
// =============================================================================

const COMPONENT_PATHS: Record<string, string> = {
  Button: 'Core/Button',
  Badge: 'Core/Badge',
  Checkbox: 'Core/Checkbox',
  Input: 'Core/Input',
  Select: 'Core/Select',
  Dialog: 'Core/Dialog',
  Card: 'Components/Card',
  Avatar: 'Components/Avatar',
  Toggle: 'Core/Toggle',
  Tabs: 'Core/Tabs',
  Tooltip: 'Core/Tooltip',
  Typography: 'Foundation/Typography',
  Colors: 'Foundation/Colors',
  Spacing: 'Foundation/Spacing',
  Shadows: 'Foundation/Shadows',
};

export interface RelatedComponentsProps {
  components: string[];
  title?: string;
}

export const RelatedComponents: React.FC<RelatedComponentsProps> = ({
  components,
  title = 'Related Components',
}) => (
  <div className="mt-12 mb-8">
    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 mt-0">
      {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {components.map((name) => {
        const path = COMPONENT_PATHS[name];
        return (
          <button
            key={name}
            onClick={() => path && navigateToStory(path)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm font-medium text-abyss-500 cursor-pointer transition-all duration-150 hover:bg-deep-current-50 hover:border-deep-current-200 hover:text-deep-current-700 disabled:opacity-60 disabled:cursor-default"
            disabled={!path}
            title={path ? `Go to ${name} docs` : `${name} (path not configured)`}
          >
            {name}
            {path && <ArrowRight size={12} />}
          </button>
        );
      })}
    </div>
  </div>
);

// =============================================================================
// STATUS WARNINGS - Alpha, Deprecated, Stable, Frozen
// =============================================================================

interface StatusBannerProps {
  icon: React.ReactNode;
  title: string;
  message: React.ReactNode;
  variant: 'alpha' | 'deprecated' | 'stable' | 'frozen';
}

const statusVariants = {
  alpha: 'bg-dusk-reef-50 border-dusk-reef-200 border-l-dusk-reef-500',
  deprecated: 'bg-coral-50 border-coral-200 border-l-coral-500',
  stable: 'bg-harbor-50 border-harbor-200 border-l-harbor-500',
  frozen: 'bg-wave-50 border-wave-200 border-l-wave-500',
};

const statusIconColors = {
  alpha: 'text-dusk-reef-500',
  deprecated: 'text-coral-500',
  stable: 'text-harbor-500',
  frozen: 'text-wave-500',
};

const statusTextColors = {
  alpha: 'text-dusk-reef-900',
  deprecated: 'text-coral-900',
  stable: 'text-harbor-900',
  frozen: 'text-wave-900',
};

const StatusBanner: React.FC<StatusBannerProps> = ({ icon, title, message, variant }) => (
  <div
    className={`flex items-start gap-3 p-4 pr-5 border border-l-4 rounded-lg mb-6 ${statusVariants[variant]}`}
  >
    <div className={`shrink-0 mt-0.5 ${statusIconColors[variant]}`}>{icon}</div>
    <div>
      <div className={`text-sm font-semibold mb-1 ${statusTextColors[variant]}`}>
        {title}
      </div>
      <div className={`text-sm leading-relaxed opacity-85 ${statusTextColors[variant]}`}>
        {message}
      </div>
    </div>
  </div>
);

export interface AlphaWarningProps {
  message?: string;
}

export const AlphaWarning: React.FC<AlphaWarningProps> = ({
  message = 'This component is experimental and may change significantly. Use with caution in production.',
}) => (
  <StatusBanner
    icon={<Beaker size={20} />}
    title="Alpha Component"
    message={message}
    variant="alpha"
  />
);

export interface DeprecatedWarningProps {
  alternative: string;
  alternativeLink?: string;
}

export const DeprecatedWarning: React.FC<DeprecatedWarningProps> = ({
  alternative,
  alternativeLink,
}) => (
  <StatusBanner
    icon={<AlertTriangle size={20} />}
    title="Deprecated"
    message={
      <>
        This component is deprecated and will be removed in a future version. Use{' '}
        {alternativeLink ? (
          <button
            onClick={() => navigateToStory(alternativeLink)}
            className="bg-transparent border-none p-0 text-coral-700 font-semibold underline cursor-pointer"
          >
            {alternative}
          </button>
        ) : (
          <strong>{alternative}</strong>
        )}{' '}
        instead.
      </>
    }
    variant="deprecated"
  />
);

export interface StableNoticeProps {
  since?: string;
}

export const StableNotice: React.FC<StableNoticeProps> = ({ since }) => (
  <StatusBanner
    icon={<CheckCircle size={20} />}
    title="Stable"
    message={`This component is stable and production-ready.${since ? ` Stable since ${since}.` : ''}`}
    variant="stable"
  />
);

export interface FrozenNoticeProps {
  reason?: string;
}

export const FrozenNotice: React.FC<FrozenNoticeProps> = ({
  reason = 'This component is frozen and will not receive new features. Bug fixes only.',
}) => (
  <StatusBanner icon={<Lock size={20} />} title="Frozen" message={reason} variant="frozen" />
);

// =============================================================================
// COMPOSITION GUIDE - DDS constraint enforcement
// =============================================================================

export interface CompositionGuideProps {
  component: ReactElement;
  message: string;
  contactInfo?: string;
  title?: string;
}

export const CompositionGuide: React.FC<CompositionGuideProps> = ({
  component,
  message,
  contactInfo = 'Contact the DDS team if you need changes.',
  title = 'Approved Composition',
}) => (
  <div className="bg-deep-current-50 border border-deep-current-200 rounded-xl overflow-hidden mb-8">
    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-deep-current-100 border-b border-deep-current-200">
      <Shield size={18} className="text-deep-current-600" />
      <span className="text-sm font-semibold text-deep-current-800">{title}</span>
    </div>
    <div className="p-8 flex items-center justify-center bg-soft-linen border-b border-deep-current-200">
      {component}
    </div>
    <div className="px-5 py-4 text-sm text-deep-current-900 leading-relaxed">
      <p className="m-0 mb-2">{message}</p>
      {contactInfo && (
        <p className="m-0 text-xs text-deep-current-600 italic">{contactInfo}</p>
      )}
    </div>
  </div>
);

// =============================================================================
// MDX HEADING COMPONENTS - For automatic mapping in preview.ts
// =============================================================================

export interface HeadingProps {
  children: React.ReactNode;
  id?: string;
}

export const ComponentName: React.FC<HeadingProps> = ({ children, id }) => (
  <h1
    id={id}
    className="text-3xl font-bold text-abyss-500 mt-0 mb-4 tracking-tight leading-tight"
    style={{ fontFamily: fontDisplay }}
  >
    {children}
  </h1>
);

export const SectionName: React.FC<HeadingProps> = ({ children, id }) => (
  <h2
    id={id}
    className="text-xl font-semibold text-abyss-500 mt-12 mb-4 pb-3 border-b border-slate-200 tracking-tight leading-snug"
    style={{ fontFamily: fontDisplay }}
  >
    {children}
  </h2>
);

export const SubsectionName: React.FC<HeadingProps> = ({ children, id }) => (
  <h3
    id={id}
    className="text-base font-semibold text-abyss-500 mt-8 mb-3 tracking-tight leading-normal"
  >
    {children}
  </h3>
);

export const SubSubsectionName: React.FC<HeadingProps> = ({ children, id }) => (
  <h4
    id={id}
    className="text-sm font-semibold text-slate-600 mt-6 mb-2 uppercase tracking-wide leading-normal"
  >
    {children}
  </h4>
);
