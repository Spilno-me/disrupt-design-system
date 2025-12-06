import { ContentSection } from '@/components/ui/SectionLayout'
import { aboutImages } from '@/assets/optimized/about'

// =============================================================================
// COMPONENT
// =============================================================================

export function OurVisionSection() {
  return (
    <ContentSection
      title="Our Vision"
      subtitle="EHS today. Enterprise tomorrow."
      image={aboutImages.ourVision}
      imageAlt="Our Vision"
      background="cream"
      imagePosition="right"
      dataElement="our-vision-section"
    >
      <p className="text-muted text-base lg:text-lg leading-[1.6]">
        We start where the pain is greatest — EHS. But the foundation we've built is
        bigger. Disrupt is designed to scale across the enterprise: sustainability, risk,
        finance, operations. Any workflow slowed by admin can be reimagined.
        EHS first. Enterprise quality always!
      </p>
    </ContentSection>
  )
}
