import { BlobSection } from '@/components/ui/GridBlobCanvas'
import { CheckListItem } from '@/components/ui/CheckListItem'
import {
  SectionContainer,
  SectionHeading,
  TwoColumnLayout,
  Column,
} from '@/components/ui/SectionLayout'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { aboutImages } from '@/assets/optimized/about'

// =============================================================================
// DATA
// =============================================================================

const PROOF_ITEMS = [
  {
    label: '87% reduction in data entry (AI auto-fill)',
    text: 'Your team operational in weeks, not years.',
  },
  {
    label: '3× faster process completion with AI guidance',
    text: 'Built for EHS today, designed to expand across the enterprise.',
  },
  {
    label: '239% ROI modeled over 5 years',
    text: 'Reduce spend without sacrificing compliance.',
  },
  {
    label: '95% user adoption vs. 35% industry average',
    text: '239% ROI modeled over 5 years — proof your board will trust.',
  },
  {
    label: 'Fewer incidents from faster protocol deployment',
    text: 'Create safer workplaces and free time for training and prevention.',
  },
] as const

// =============================================================================
// COMPONENT
// =============================================================================

export function AboutProofSection() {
  return (
    <BlobSection className="py-8 sm:py-11 lg:py-16 border-y-dashed-figma">
      <SectionContainer>
        <div className="flex flex-col lg:items-center lg:text-center">
          <SectionHeading
            title="Proof at a Glance"
            subtitle="Numbers that speak for themselves."
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
                  images={aboutImages.proofAtGlance}
                  alt="Proof at a Glance"
                />
              </div>
            </Column>
          </TwoColumnLayout>
        </div>
      </SectionContainer>
    </BlobSection>
  )
}
