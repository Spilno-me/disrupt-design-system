import { AnimatedCheck } from '@/components/ui/AnimatedCheck'
import { ContentSection } from '@/components/ui/SectionLayout'
import { aboutImages } from '@/assets/optimized/about'

// =============================================================================
// CONSTANTS
// =============================================================================

const VALUES = [
  { title: 'Safety', description: 'protecting people is the outcome that matters most.' },
  { title: 'Simplicity and UX', description: 'software people actually want to use.' },
  { title: 'Speed as a standard', description: 'days not weeks. Months, not years.' },
  { title: 'Scalability', description: 'software universal by nature.' },
] as const

// =============================================================================
// COMPONENT
// =============================================================================

export function OurValuesSection() {
  return (
    <ContentSection
      title="Our Values"
      subtitle="The four S's that drive everything we do."
      image={aboutImages.ourValues}
      imageAlt="Our Values"
      background="white"
      showBlob
      imagePosition="left"
      dataElement="our-values-section"
    >
      <ul className="flex flex-col gap-4">
        {VALUES.map((value, index) => (
          <li key={value.title} className="flex items-start gap-3">
            <AnimatedCheck className="w-5 h-5" index={index} />
            <span className="text-muted text-base lg:text-lg leading-[1.5]">
              <strong className="text-primary">{value.title}</strong> – {value.description}
            </span>
          </li>
        ))}
      </ul>
    </ContentSection>
  )
}
