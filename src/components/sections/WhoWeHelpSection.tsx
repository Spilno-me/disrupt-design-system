import { Button } from '../ui/button'
import { CheckListItem } from '@/components/ui/CheckListItem'
import { ElectricButtonWrapper } from '@/components/ui/ElectricInput'
import { scrollToElement } from '@/utils/navigation'
import { ContentSection } from '@/components/ui/SectionLayout'
import { optimizedImages } from '@/assets/optimized'

// =============================================================================
// DATA
// =============================================================================

const WHO_WE_HELP_ITEMS = [
  {
    label: 'For Companies –',
    text: 'Free your teams from repetitive admin. Cut costs while training more, preventing incidents, and reaching compliance faster.',
  },
  {
    label: 'For Consultants –',
    text: 'Slash paperwork. Gain visibility. Spend more time guiding strategy, not chasing data.',
  },
] as const

// =============================================================================
// COMPONENT
// =============================================================================

export function WhoWeHelpSection() {
  return (
    <ContentSection
      title="Who We Help"
      subtitle="One Platform. Two Wins."
      image={optimizedImages.whoWeHelp}
      imageAlt="Who we help visualization"
      background="white"
      showBlob
      imagePosition="right"
      dataElement="who-we-help-section"
      imageClassName="object-[70%_center]"
    >
      <div className="flex flex-col gap-4 mb-8">
        {WHO_WE_HELP_ITEMS.map((item, index) => (
          <CheckListItem key={item.label} {...item} index={index} />
        ))}
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
