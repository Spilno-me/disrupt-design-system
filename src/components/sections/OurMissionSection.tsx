import { ContentSection } from '@/components/ui/SectionLayout'
import { aboutImages } from '@/assets/optimized/about'

// =============================================================================
// COMPONENT
// =============================================================================

export function OurMissionSection() {
  return (
    <ContentSection
      title="Our Mission"
      subtitle="Safety first. Admin last."
      image={aboutImages.ourMission}
      imageAlt="Our Mission"
      background="white"
      showBlob
      imagePosition="left"
      dataElement="our-mission-section"
    >
      <p className="text-muted text-base lg:text-lg leading-[1.6]">
        To free people from compliance admin so they can focus on keeping
        workplaces safe and making better decisions.
      </p>
    </ContentSection>
  )
}
