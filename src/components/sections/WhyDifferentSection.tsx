import { Button } from '../ui/button'
import { ElectricButtonWrapper } from '@/components/ui/ElectricInput'
import { scrollToElement } from '@/utils/navigation'
import { ContentSection } from '@/components/ui/SectionLayout'
import { optimizedImages } from '@/assets/optimized'

// =============================================================================
// COMPONENT
// =============================================================================

export function WhyDifferentSection() {
  return (
    <ContentSection
      title="Why We're Different"
      subtitle="Not Another Tool. A New Model."
      image={optimizedImages.feature4}
      imageAlt="Why we're different visualization"
      background="cream"
      imagePosition="left"
      dataElement="why-different-section"
    >
      <div className="flex flex-col gap-4 mb-6">
        <p className="text-muted leading-relaxed text-base">
          Legacy systems were built for process, not people — leaving you dependent on consultants and trapped in admin.
        </p>
        <p className="text-muted leading-relaxed text-base">
          Disrupt is built differently: AI-native, adaptive, and designed to keep people safer, give teams better training, and prevent incidents — while reducing the busywork that slows everyone down.
        </p>
      </div>

      <ElectricButtonWrapper className="w-fit">
        <Button
          variant="contact"
          onClick={() => scrollToElement('contact')}
        >
          Contact us
        </Button>
      </ElectricButtonWrapper>
    </ContentSection>
  )
}
