import { BlobSection } from '@/components/ui/GridBlobCanvas'
import { CheckListItem } from '@/components/ui/CheckListItem'
import {
  SectionContainer,
  SectionHeading,
  TwoColumnLayout,
  Column,
} from '@/components/ui/SectionLayout'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { optimizedImages } from '@/assets/optimized'

// =============================================================================
// DATA
// =============================================================================

const PROOF_ITEMS = [
  {
    label: '8–12× Faster Go-Live →',
    text: 'Your team operational in weeks, not years.',
  },
  {
    label: 'ROI in 6–12 months →',
    text: '239% ROI modeled over 5 years — proof your board will trust.',
  },
  {
    label: 'Lower total cost of ownership →',
    text: 'Without sacrificing compliance.',
  },
  {
    label: 'Fewer admin errors →',
    text: 'Safer workplaces and more time for training and prevention.',
  },
  {
    label: 'Flexible foundation →',
    text: 'Built for EHS today, designed to expand across the enterprise.',
  },
] as const

// =============================================================================
// COMPONENT
// =============================================================================

export function ProofSection() {
  return (
    <BlobSection className="py-8 sm:py-11 lg:py-16">
      <SectionContainer>
        <div className="flex flex-col lg:items-center lg:text-center">
          <SectionHeading
            title="Proof at a Glance"
            subtitle="Real Impact. Measurable Outcomes."
            centered
          />

          <TwoColumnLayout className="w-full text-left">
            {/* Content - Left on desktop */}
            <Column width="55%">
              <div className="flex flex-col gap-4">
                {PROOF_ITEMS.map((item, index) => (
                  <CheckListItem key={item.label} {...item} index={index} />
                ))}
              </div>
            </Column>

            {/* Image - Right on desktop, After header on mobile */}
            <Column width="45%" className="order-first lg:order-none">
              <div className="-mx-4 sm:mx-0">
                <ResponsiveImage
                  images={optimizedImages.feature2}
                  alt="Proof metrics visualization"
                  className="object-[center_20%] sm:object-center"
                />
              </div>
            </Column>
          </TwoColumnLayout>
        </div>
      </SectionContainer>
    </BlobSection>
  )
}
