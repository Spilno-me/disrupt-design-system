/**
 * Section Components - Pre-built page sections for marketing and content pages
 *
 * This subpath export provides granular access to section components,
 * enabling better tree-shaking for consuming applications.
 *
 * @usage
 * ```tsx
 * import { HeroSection, FAQSection, CTASection } from '@adrozdenko/design-system/sections'
 * ```
 *
 * @module sections
 */

// =============================================================================
// HERO SECTIONS
// =============================================================================

export { HeroSection } from '../components/sections/HeroSection'
export type { HeroSectionProps } from '../components/sections/HeroSection'
export { ProductHeroSection } from '../components/sections/ProductHeroSection'
export { AboutHeroSection } from '../components/sections/AboutHeroSection'

// =============================================================================
// FEATURE SECTIONS
// =============================================================================

export { FeaturesSection } from '../components/sections/FeaturesSection'
export type { FeaturesSectionProps, Feature } from '../components/sections/FeaturesSection'
export { FeaturesGridSection } from '../components/sections/FeaturesGridSection'
export { FeatureCard as FeatureCardSection } from '../components/sections/FeatureCard'
export { FutureCapabilitiesSection } from '../components/sections/FutureCapabilitiesSection'
export { AIPlatformSection } from '../components/sections/AIPlatformSection'

// =============================================================================
// CONTENT SECTIONS
// =============================================================================

export { FAQSection } from '../components/sections/FAQSection'
export type { FAQSectionProps, FAQItem } from '../components/sections/FAQSection'
export { CTASection } from '../components/sections/CTASection'
export type { CTASectionProps } from '../components/sections/CTASection'
export { ProofSection } from '../components/sections/ProofSection'
export { AboutProofSection } from '../components/sections/AboutProofSection'

// =============================================================================
// ABOUT & COMPANY SECTIONS
// =============================================================================

export { OurMissionSection } from '../components/sections/OurMissionSection'
export { OurStorySection } from '../components/sections/OurStorySection'
export { OurValuesSection } from '../components/sections/OurValuesSection'
export { OurVisionSection } from '../components/sections/OurVisionSection'
export { WhatDisruptDoesSection } from '../components/sections/WhatDisruptDoesSection'
export { WhoWeHelpSection } from '../components/sections/WhoWeHelpSection'
export { WhyDifferentSection } from '../components/sections/WhyDifferentSection'
export { StrategicAdvisorySection } from '../components/sections/StrategicAdvisorySection'

// =============================================================================
// PRICING & PARTNERS
// =============================================================================

export { PricingCardsSection } from '../components/sections/PricingCardsSection'
export { ROICalculatorSection } from '../components/sections/ROICalculatorSection'
export { PartnersSection } from '../components/sections/PartnersSection'

// =============================================================================
// CONTACT & CTA
// =============================================================================

export { ContactSection } from '../components/sections/ContactSection'
export { ContactInfo } from '../components/sections/ContactInfo'
export { ReadyToAchieveSection } from '../components/sections/ReadyToAchieveSection'

// =============================================================================
// CAROUSEL & INTERACTIVE
// =============================================================================

export { IndustryCarouselSection } from '../components/sections/IndustryCarouselSection'
export type { IndustryCarouselSectionProps } from '../components/sections/IndustryCarouselSection'
