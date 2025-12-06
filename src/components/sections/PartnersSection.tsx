import { ContentSection } from '@/components/ui/SectionLayout'
import { aboutImages } from '@/assets/optimized/about'

// =============================================================================
// COMPONENT
// =============================================================================

export function PartnersSection() {
  return (
    <ContentSection
      title="Partners and Community"
      subtitle="Building the future of compliance together."
      image={aboutImages.partners}
      imageAlt="Partners and Community"
      background="white"
      showBlob
      imagePosition="left"
      dataElement="partners-section"
    >
      <p className="text-muted text-base lg:text-lg leading-[1.6]">
        Disrupt is more than software. It's a growing ecosystem of safety leaders,
        consultants, and partners determined to change how enterprises approach
        compliance. Together, we're proving that technology can keep people safe, reduce
        costs, and free teams to do meaningful work.
      </p>
    </ContentSection>
  )
}
