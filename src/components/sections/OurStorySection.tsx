import { ContentSection } from '@/components/ui/SectionLayout'
import { aboutImages } from '@/assets/optimized/about'

// =============================================================================
// COMPONENT
// =============================================================================

export function OurStorySection() {
  return (
    <ContentSection
      title="Our Story"
      subtitle="Compliance reimagined from the ground up."
      image={aboutImages.ourStory}
      imageAlt="Our Story"
      background="cream"
      imagePosition="right"
      dataElement="our-story-section"
    >
      <p className="text-muted text-base lg:text-lg leading-[1.6] mb-4">
        For too long, compliance systems have trapped teams in endless admin.
        Hours lost to forms. Safety delayed by red tape. "Digital transformation"
        that only digitized inefficiency.
      </p>

      <p className="text-muted text-base lg:text-lg leading-[1.6] mb-4">
        Disrupt was created to change that.
      </p>

      <p className="text-muted text-base lg:text-lg leading-[1.6]">
        Born from EHS expertise and enterprise AI engineering, we set out to
        eliminate—not just digitize—administrative waste. Because compliance
        should mean safer workplaces, smarter strategy, and more time for people.
      </p>
    </ContentSection>
  )
}
