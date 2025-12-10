import { ALIAS } from '@/constants/designTokens'
import { Check, X } from 'lucide-react'
import { Button } from '../ui/button'
import { ElectricButtonWrapper } from '@/components/ui/ElectricInput'
import { scrollToElement } from '@/utils/navigation'
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'
import { ScrollableTableWrapper } from '@/components/ui/ScrollableTableWrapper'

// =============================================================================
// TYPES
// =============================================================================

interface PricingTier {
  name: string
  price: string
  description: string
  isHighlighted?: boolean
}

interface FeatureRow {
  label: string
  description?: string
  viewer: 'check' | 'x' | string
  contributor: 'check' | 'x' | string
  powerUser: 'check' | 'x' | string
  creator: 'check' | 'x' | string
}

// =============================================================================
// DATA
// =============================================================================

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Viewer',
    price: '$10/mo',
    description: 'Field workers, contractors, employees. Report observations, receive training.',
  },
  {
    name: 'Contributor',
    price: '$30/mo',
    description: 'Department heads, supervisors. Full incident entry, workflow approvals.',
  },
  {
    name: 'Power User',
    price: '$60/mo',
    description: 'EHS Specialists, managers. Advanced data analysis, report building.',
    isHighlighted: true,
  },
  {
    name: 'Creator',
    price: '$150/mo',
    description: 'Core EHS team, administrators. All model building, system configuration.',
  },
]

// Core Capabilities Table
const CORE_CAPABILITIES_HEADER: FeatureRow = {
  label: 'CORE CAPABILITIES',
  viewer: 'Viewer',
  contributor: 'Contributor',
  powerUser: 'Power User',
  creator: 'Creator',
}

const CORE_CAPABILITIES: FeatureRow[] = [
  {
    label: 'Annual Platform Fee',
    description: 'Quoted based on total business siz...',
    viewer: '',
    contributor: '',
    powerUser: 'Get a Custom Quote',
    creator: '',
  },
  {
    label: 'Per-User Fee (Monthly)',
    viewer: '$10/mo',
    contributor: '$30/mo',
    powerUser: '$60/mo',
    creator: '$150/mo',
  },
  {
    label: 'Definition:',
    viewer: 'Field workers, contractors, employees. Report observations, receive training.',
    contributor: 'Department heads, supervisors. Full incident entry, workflow approvals.',
    powerUser: 'EHS Specialists, managers. Advanced data analysis, report building.',
    creator: 'Core EHS team, administrators. All model building, system configuration.',
  },
]

// Foundational EHS Modules Table
const FOUNDATIONAL_EHS_MODULES: FeatureRow[] = [
  {
    label: 'Always Included:',
    description: 'Incidents, Observations, Actions Tracking, Risk, JHA, Bow-ties, Safety Meetings, Training Management, Doc Control, Basic Reporting.',
    viewer: 'check',
    contributor: 'check',
    powerUser: 'check',
    creator: 'check',
  },
  {
    label: 'Safety Essentials Bundle:',
    description: 'Inspections & Audits. Target: High-Growth SMEs',
    viewer: 'x',
    contributor: 'check',
    powerUser: 'check',
    creator: 'check',
  },
  {
    label: 'Enterprise Disruptor Bundle:',
    description: 'Permit to Work (LOTO), Contractor & Chemical Management. Target: Mid/Enterprise High-Hazard',
    viewer: 'x',
    contributor: 'x',
    powerUser: 'check',
    creator: 'check',
  },
]

// Agentic AI Modules Table
const AGENTIC_AI_MODULES: FeatureRow[] = [
  {
    label: 'Tier 1: Time Saver Agents',
    description: '(Photo/Voice → Data)',
    viewer: 'check',
    contributor: 'check',
    powerUser: 'check',
    creator: 'check',
  },
  {
    label: 'Tier 2: Process Agents',
    description: '(Workflow Orchestration)',
    viewer: 'x',
    contributor: 'check',
    powerUser: 'check',
    creator: 'check',
  },
  {
    label: 'Tier 3: Analytical Agents',
    description: '(Predictive Risk Scoring)',
    viewer: 'x',
    contributor: 'x',
    powerUser: 'check',
    creator: 'check',
  },
  {
    label: 'Agent Master Suite',
    description: '(Full Autonomy) Includes Builder, Integrator, Engager Agents',
    viewer: 'x',
    contributor: 'x',
    powerUser: 'x',
    creator: 'check',
  },
]

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function FeatureCell({
  value,
  isHighlighted,
  isPrice,
  isDefinition,
  isLastRow,
}: {
  value: 'check' | 'x' | string
  isHighlighted?: boolean
  isPrice?: boolean
  isDefinition?: boolean
  isLastRow?: boolean
}) {
  const isCheck = value === 'check'
  const isX = value === 'x'
  const isEmpty = value === ''
  const isGetQuote = value === 'Get a Custom Quote'

  return (
    <td
      className={`px-4 py-4 text-center align-middle ${
        isLastRow ? '' : 'border-b border-slate-200'
      } ${isHighlighted ? 'bg-inverse-bg text-inverse' : ''}`}
    >
      {isCheck && (
        <Check
          className="w-5 h-5 mx-auto"
          style={{ color: isHighlighted ? '#fff' : ALIAS.text.primary }}
        />
      )}
      {isX && (
        <X
          className="w-5 h-5 mx-auto"
          style={{ color: isHighlighted ? 'rgba(255,255,255,0.5)' : ALIAS.border.default }}
        />
      )}
      {isGetQuote && (
        <span
          className="text-sm font-medium"
          style={{ color: isHighlighted ? '#fff' : ALIAS.brand.secondary }}
        >
          {value}
        </span>
      )}
      {isPrice && !isCheck && !isX && !isEmpty && !isGetQuote && (
        <span
          className={`font-display font-bold text-xl lg:text-2xl ${isHighlighted ? 'text-white' : ''}`}
          style={{ color: isHighlighted ? undefined : ALIAS.brand.tertiary }}
        >
          {value}
        </span>
      )}
      {isDefinition && !isCheck && !isX && !isEmpty && !isGetQuote && (
        <span
          className={`text-xs leading-relaxed block text-left ${isHighlighted ? 'text-white/80' : ''}`}
          style={{ color: isHighlighted ? undefined : ALIAS.text.secondary }}
        >
          {value}
        </span>
      )}
      {isEmpty && <span>&nbsp;</span>}
    </td>
  )
}

function PricingFeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex-1 p-6 bg-white rounded-[14px] border border-dashed border-slate-300">
      <h3
        className="font-sans font-bold text-lg mb-2"
        style={{ color: ALIAS.text.primary }}
      >
        {title}
      </h3>
      <p
        className="font-sans text-sm leading-relaxed"
        style={{ color: ALIAS.text.secondary }}
      >
        {description}
      </p>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PlatformTiersSection() {
  return (
    <section
      className="py-8 sm:py-12 lg:py-16 relative"
      data-element="platform-tiers-section"
    >
      <GridBlobBackground scale={1.5} />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-[1]">
        {/* Header */}
        <div className="flex flex-col items-start lg:items-center gap-4 mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-display font-bold leading-[1.2] text-left lg:text-center text-primary">
            Platform Tiers: Foundational EHS & Agentic AI
          </h2>
          <p className="text-sm sm:text-base lg:text-lg font-display font-medium text-left lg:text-center max-w-[800px] text-accent">
            Pricing is structured with two components
          </p>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-col md:flex-row gap-6 mb-11">
          <PricingFeatureCard
            title="A: Base Platform Fee"
            description="Annual cost, quoted based on total employee count to cover core engine, API, security and hosting"
          />
          <PricingFeatureCard
            title="B: Per-User Fee"
            description="Monthly cost dependent on the access level required (Viewer, Contributor, etc)"
          />
        </div>

        {/* Core Capabilities Table */}
        <div className="bg-white rounded-[14px] overflow-hidden mb-4 border border-dashed border-slate-300">
          <ScrollableTableWrapper>
            <table className="w-full min-w-[800px] table-fixed">
              <colgroup>
                <col className="w-[320px]" />
                <col className="w-[145px]" />
                <col className="w-[145px]" />
                <col className="w-[145px]" />
                <col className="w-[145px]" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    className="px-4 py-4 text-left bg-slate-100 font-sans font-semibold text-sm uppercase tracking-wider"
                    style={{ color: ALIAS.text.primary }}
                  >
                    CORE CAPABILITIES
                  </th>
                  {PRICING_TIERS.map((tier) => (
                    <th
                      key={tier.name}
                      className={`px-4 py-4 text-center font-sans font-semibold text-sm ${
                        tier.isHighlighted ? 'bg-inverse-bg text-inverse' : 'bg-muted-bg'
                      }`}
                      style={{ color: tier.isHighlighted ? undefined : ALIAS.text.primary }}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Annual Platform Fee */}
                <tr className="bg-[#5E4F7E]/10">
                  <td className="px-4 py-4 border-b border-slate-200">
                    <span className="font-sans font-semibold text-sm block" style={{ color: ALIAS.text.primary }}>
                      Annual Platform Fee
                    </span>
                    <span className="font-sans text-xs block mt-1" style={{ color: ALIAS.text.secondary }}>
                      Quoted based on total business size
                    </span>
                  </td>
                  <td colSpan={4} className="px-4 py-4 text-center border-b border-slate-200">
                    <button
                      onClick={() => scrollToElement('contact')}
                      className="text-sm font-medium text-accent hover:underline cursor-pointer"
                    >
                      Get a Custom Quote
                    </button>
                  </td>
                </tr>

                {/* Per-User Fee */}
                <tr>
                  <td className="px-4 py-4 border-b border-slate-200">
                    <span className="font-sans font-semibold text-sm block" style={{ color: ALIAS.text.primary }}>
                      Per-User Fee (Monthly)
                    </span>
                  </td>
                  {PRICING_TIERS.map((tier) => (
                    <td
                      key={tier.name}
                      className={`px-4 py-4 text-center border-b border-slate-200 ${
                        tier.isHighlighted ? 'bg-inverse-bg' : ''
                      }`}
                    >
                      <span
                        className={`font-display font-bold text-xl lg:text-2xl ${
                          tier.isHighlighted ? 'text-white' : ''
                        }`}
                        style={{ color: tier.isHighlighted ? undefined : ALIAS.text.primaryPurple }}
                      >
                        {tier.price}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Definition - Last row, no bottom border */}
                <tr>
                  <td className="px-4 py-4">
                    <span className="font-sans font-semibold text-sm block" style={{ color: ALIAS.text.primary }}>
                      Definition:
                    </span>
                  </td>
                  {PRICING_TIERS.map((tier) => (
                    <td
                      key={tier.name}
                      className={`px-4 py-4 ${tier.isHighlighted ? 'bg-inverse-bg' : ''}`}
                    >
                      <span
                        className={`text-xs leading-relaxed block ${
                          tier.isHighlighted ? 'text-white/80' : ''
                        }`}
                        style={{ color: tier.isHighlighted ? undefined : ALIAS.text.secondary }}
                      >
                        {tier.description}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </ScrollableTableWrapper>
        </div>

        {/* Foundational EHS Modules Table */}
        <div className="bg-white rounded-[14px] overflow-hidden mb-4 border border-dashed border-slate-300">
          <ScrollableTableWrapper>
            <table className="w-full min-w-[800px] table-fixed">
              <colgroup>
                <col className="w-[320px]" />
                <col className="w-[145px]" />
                <col className="w-[145px]" />
                <col className="w-[145px]" />
                <col className="w-[145px]" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    className="px-4 py-4 text-left bg-slate-100 font-sans font-semibold text-sm uppercase tracking-wider"
                    style={{ color: ALIAS.text.primaryPurple }}
                  >
                    FOUNDATIONAL EHS MODULES (The Data Engine)
                  </th>
                  {PRICING_TIERS.map((tier) => (
                    <th
                      key={tier.name}
                      className={`px-4 py-4 text-center font-sans font-semibold text-sm ${
                        tier.isHighlighted ? 'bg-inverse-bg text-inverse' : 'bg-muted-bg'
                      }`}
                      style={{ color: tier.isHighlighted ? undefined : ALIAS.text.primary }}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FOUNDATIONAL_EHS_MODULES.map((row, idx) => {
                  const isLastRow = idx === FOUNDATIONAL_EHS_MODULES.length - 1
                  return (
                    <tr key={row.label}>
                      <td className={`px-4 py-4 ${isLastRow ? '' : 'border-b border-slate-200'}`}>
                        <span className="font-sans font-semibold text-sm block" style={{ color: ALIAS.text.primary }}>
                          {row.label} <span className="font-normal">{row.description?.split('.')[0]}.</span>
                        </span>
                        {row.description?.includes('Target:') && (
                          <span className="font-sans text-xs block mt-1" style={{ color: ALIAS.brand.secondary }}>
                            Target: {row.description.split('Target:')[1]}
                          </span>
                        )}
                      </td>
                      <FeatureCell value={row.viewer} isLastRow={isLastRow} />
                      <FeatureCell value={row.contributor} isLastRow={isLastRow} />
                      <FeatureCell value={row.powerUser} isHighlighted isLastRow={isLastRow} />
                      <FeatureCell value={row.creator} isLastRow={isLastRow} />
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </ScrollableTableWrapper>
        </div>

        {/* Agentic AI Modules Table */}
        <div className="bg-white rounded-[14px] overflow-hidden mb-8 border border-dashed border-slate-300">
          <ScrollableTableWrapper>
            <table className="w-full min-w-[800px] table-fixed">
              <colgroup>
                <col className="w-[320px]" />
                <col className="w-[145px]" />
                <col className="w-[145px]" />
                <col className="w-[145px]" />
                <col className="w-[145px]" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    className="px-4 py-4 text-left bg-slate-100 font-sans font-semibold text-sm uppercase tracking-wider"
                    style={{ color: ALIAS.text.primaryPurple }}
                  >
                    AGENTIC AI MODULES (The Automation Layer)
                  </th>
                  {PRICING_TIERS.map((tier) => (
                    <th
                      key={tier.name}
                      className={`px-4 py-4 text-center font-sans font-semibold text-sm ${
                        tier.isHighlighted ? 'bg-inverse-bg text-inverse' : 'bg-muted-bg'
                      }`}
                      style={{ color: tier.isHighlighted ? undefined : ALIAS.text.primary }}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AGENTIC_AI_MODULES.map((row, idx) => {
                  const isLastRow = idx === AGENTIC_AI_MODULES.length - 1
                  return (
                    <tr key={row.label}>
                      <td className={`px-4 py-4 ${isLastRow ? '' : 'border-b border-slate-200'}`}>
                        <span className="font-sans font-semibold text-sm block" style={{ color: ALIAS.text.primary }}>
                          {row.label}
                        </span>
                        {row.description && (
                          <span className="font-sans text-xs block mt-1" style={{ color: ALIAS.brand.secondary }}>
                            {row.description}
                          </span>
                        )}
                      </td>
                      <FeatureCell value={row.viewer} isLastRow={isLastRow} />
                      <FeatureCell value={row.contributor} isLastRow={isLastRow} />
                      <FeatureCell value={row.powerUser} isHighlighted isLastRow={isLastRow} />
                      <FeatureCell value={row.creator} isLastRow={isLastRow} />
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </ScrollableTableWrapper>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <ElectricButtonWrapper>
            <Button
              variant="contact"
              onClick={() => scrollToElement('contact')}
            >
              Get Custom Quote
            </Button>
          </ElectricButtonWrapper>
        </div>
      </div>
    </section>
  )
}
