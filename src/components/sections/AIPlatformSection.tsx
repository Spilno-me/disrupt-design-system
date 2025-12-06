import { ContentSection } from '@/components/ui/SectionLayout'
import { optimizedImages } from '@/assets/optimized'

// =============================================================================
// COMPONENT
// =============================================================================

export function AIPlatformSection() {
  return (
    <ContentSection
      title="AI-native platform"
      subtitle="Reduce admin. Prevent incidents. Scale with confidence."
      image={optimizedImages.feature1}
      imageAlt="AI-native platform visualization"
      background="cream"
      imagePosition="left"
      dataElement="ai-platform-section"
    >
      <p className="text-muted text-base lg:text-lg leading-[1.6] mb-4">
        That's why we built Disrupt — an AI-native platform that reduces admin, prevents incidents, and adapts to any compliance challenge.
      </p>
      <p className="text-muted text-base lg:text-lg leading-[1.6] font-semibold">
        Starting with EHS, architected for the enterprise.
      </p>
    </ContentSection>
  )
}
