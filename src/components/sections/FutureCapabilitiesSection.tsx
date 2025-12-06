import { CheckListItem } from '@/components/ui/CheckListItem'
import { ContentSection } from '@/components/ui/SectionLayout'
import { optimizedImages } from '@/assets/optimized'

// =============================================================================
// DATA
// =============================================================================

const FUTURE_CAPABILITIES = [
  { label: 'Sustainability reporting', text: 'with one-click outputs.' },
  { label: 'Risk and operations', text: 'with predictive alerts.' },
  { label: 'Finance and quality', text: 'with AI-driven workflows.' },
] as const

// =============================================================================
// COMPONENT
// =============================================================================

export function FutureCapabilitiesSection() {
  return (
    <ContentSection
      title="EHS First. Enterprise Always."
      subtitle="Starting with EHS — building a platform that grows."
      image={optimizedImages.feature5}
      imageAlt="Construction worker using tablet"
      background="white"
      showBlob
      imagePosition="right"
      dataElement="future-capabilities-section"
    >
      <div className="flex flex-col gap-4">
        {FUTURE_CAPABILITIES.map((item, index) => (
          <CheckListItem key={item.label} {...item} boldLabel={false} index={index} />
        ))}
      </div>
    </ContentSection>
  )
}
