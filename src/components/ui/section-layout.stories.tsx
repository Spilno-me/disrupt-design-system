import type { Meta, StoryObj } from '@storybook/react'
import {
  TEMPLATE_META,
  templateDescription,
} from '@/stories/_infrastructure'
import {
  SectionWrapper,
  SectionContainer,
  TwoColumnLayout,
  SectionImage,
  SectionHeading,
  Column,
  ContentSection,
} from './SectionLayout'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Website/Layout/SectionLayout',
  ...TEMPLATE_META,
  parameters: {
    ...TEMPLATE_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: templateDescription(
          'Layout primitives for website sections. Includes SectionWrapper, SectionContainer, TwoColumnLayout, SectionImage, SectionHeading, Column, and ContentSection components.'
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// STORIES
// =============================================================================

// SectionWrapper examples
export const SectionWrapperDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <SectionWrapper background="white">
        <SectionContainer>
          <h2 className="text-xl font-bold">White Background Section</h2>
          <p className="text-muted-foreground mt-2">
            Default section wrapper with white background and dashed borders.
          </p>
        </SectionContainer>
      </SectionWrapper>

      <SectionWrapper background="cream">
        <SectionContainer>
          <h2 className="text-xl font-bold">Cream Background Section</h2>
          <p className="text-muted-foreground mt-2">
            Section wrapper with cream background for visual variety.
          </p>
        </SectionContainer>
      </SectionWrapper>
    </div>
  ),
}

// SectionHeading examples
export const SectionHeadingDemo: Story = {
  render: () => (
    <SectionWrapper>
      <SectionContainer className="space-y-12">
        <div>
          <h3 className="text-sm text-muted-foreground mb-4">Left Aligned (Default)</h3>
          <SectionHeading
            title="Section Title Here"
            subtitle="Supporting subtitle in teal"
          />
        </div>

        <div>
          <h3 className="text-sm text-muted-foreground mb-4">Centered</h3>
          <SectionHeading
            title="Centered Section Title"
            subtitle="Centered subtitle with separator"
            centered
          />
        </div>

        <div>
          <h3 className="text-sm text-muted-foreground mb-4">Without Separator</h3>
          <SectionHeading
            title="Title Only"
            subtitle="No separator line below"
            showSeparator={false}
          />
        </div>
      </SectionContainer>
    </SectionWrapper>
  ),
}

// TwoColumnLayout examples
export const TwoColumnLayoutDemo: Story = {
  render: () => (
    <SectionWrapper>
      <SectionContainer className="space-y-12">
        <div>
          <h3 className="text-sm text-muted-foreground mb-4">Default (Content Left, Image Right)</h3>
          <TwoColumnLayout>
            <Column>
              <div className="bg-muted/20 p-6 rounded-lg h-full">
                <h3 className="font-bold mb-2">Content Column</h3>
                <p className="text-muted-foreground">
                  This is the content column. On mobile, columns stack vertically.
                </p>
              </div>
            </Column>
            <Column>
              <div className="bg-accent/20 p-6 rounded-lg h-full aspect-[4/3] flex items-center justify-center">
                <span className="text-accent font-medium">Image Column</span>
              </div>
            </Column>
          </TwoColumnLayout>
        </div>

        <div>
          <h3 className="text-sm text-muted-foreground mb-4">Reversed (Image Left, Content Right)</h3>
          <TwoColumnLayout reverse>
            <Column>
              <div className="bg-muted/20 p-6 rounded-lg h-full">
                <h3 className="font-bold mb-2">Content Column</h3>
                <p className="text-muted-foreground">
                  With reverse=true, the order is flipped on desktop.
                </p>
              </div>
            </Column>
            <Column>
              <div className="bg-accent/20 p-6 rounded-lg h-full aspect-[4/3] flex items-center justify-center">
                <span className="text-accent font-medium">Image Column</span>
              </div>
            </Column>
          </TwoColumnLayout>
        </div>
      </SectionContainer>
    </SectionWrapper>
  ),
}

// Column width variations
export const ColumnWidths: Story = {
  render: () => (
    <SectionWrapper>
      <SectionContainer className="space-y-8">
        <div>
          <h3 className="text-sm text-muted-foreground mb-4">50/50 Split (Default)</h3>
          <TwoColumnLayout>
            <Column width="1/2">
              <div className="bg-blue-100 p-4 rounded h-20 flex items-center justify-center">
                50%
              </div>
            </Column>
            <Column width="1/2">
              <div className="bg-blue-100 p-4 rounded h-20 flex items-center justify-center">
                50%
              </div>
            </Column>
          </TwoColumnLayout>
        </div>

        <div>
          <h3 className="text-sm text-muted-foreground mb-4">45/55 Split</h3>
          <TwoColumnLayout>
            <Column width="45%">
              <div className="bg-green-100 p-4 rounded h-20 flex items-center justify-center">
                45%
              </div>
            </Column>
            <Column width="55%">
              <div className="bg-green-100 p-4 rounded h-20 flex items-center justify-center">
                55%
              </div>
            </Column>
          </TwoColumnLayout>
        </div>
      </SectionContainer>
    </SectionWrapper>
  ),
}

// SectionImage examples
export const SectionImageDemo: Story = {
  render: () => (
    <SectionWrapper>
      <SectionContainer className="space-y-8">
        <div>
          <h3 className="text-sm text-muted-foreground mb-4">Simple src usage</h3>
          <div className="max-w-md">
            <SectionImage
              src="https://picsum.photos/800/600"
              alt="Sample image"
              aspectRatio="4/3"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Square</h3>
            <SectionImage
              src="https://picsum.photos/400/400"
              alt="Square"
              aspectRatio="square"
            />
          </div>
          <div>
            <h3 className="text-sm text-muted-foreground mb-2">16:9</h3>
            <SectionImage
              src="https://picsum.photos/640/360"
              alt="Wide"
              aspectRatio="16/9"
            />
          </div>
        </div>
      </SectionContainer>
    </SectionWrapper>
  ),
}

// Full ContentSection example
export const ContentSectionDemo: Story = {
  render: () => (
    <ContentSection
      title="Platform Features"
      subtitle="Discover what makes us different"
      image={{
        mobile: {
          webp: 'https://picsum.photos/400/300.webp',
          avif: 'https://picsum.photos/400/300.webp',
          fallback: 'https://picsum.photos/400/300',
        },
        tablet: {
          webp: 'https://picsum.photos/600/450.webp',
          avif: 'https://picsum.photos/600/450.webp',
          fallback: 'https://picsum.photos/600/450',
        },
      }}
      imageAlt="Platform features illustration"
      background="white"
      imagePosition="right"
    >
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Our platform provides comprehensive environmental compliance management
          with real-time monitoring and automated reporting capabilities.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</span>
            Real-time compliance monitoring
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</span>
            Automated report generation
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</span>
            Risk assessment tools
          </li>
        </ul>
      </div>
    </ContentSection>
  ),
}

// ContentSection with image on left
export const ContentSectionImageLeft: Story = {
  render: () => (
    <ContentSection
      title="Our Approach"
      subtitle="Built for compliance professionals"
      image={{
        mobile: {
          webp: 'https://picsum.photos/seed/left/400/300.webp',
          avif: 'https://picsum.photos/seed/left/400/300.webp',
          fallback: 'https://picsum.photos/seed/left/400/300',
        },
        tablet: {
          webp: 'https://picsum.photos/seed/left/600/450.webp',
          avif: 'https://picsum.photos/seed/left/600/450.webp',
          fallback: 'https://picsum.photos/seed/left/600/450',
        },
      }}
      imageAlt="Our approach illustration"
      background="cream"
      imagePosition="left"
    >
      <p className="text-muted-foreground">
        We understand the challenges of environmental compliance. That's why we've
        built a platform that simplifies complex regulatory requirements and helps
        you stay ahead of changes.
      </p>
    </ContentSection>
  ),
}

// Complete page layout example
export const FullPageExample: Story = {
  render: () => (
    <div>
      <SectionWrapper background="white">
        <SectionContainer>
          <SectionHeading
            title="Welcome to Our Platform"
            subtitle="The future of environmental compliance"
            centered
          />
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            Streamline your compliance workflows with our AI-powered platform.
          </p>
        </SectionContainer>
      </SectionWrapper>

      <ContentSection
        title="Real-time Monitoring"
        subtitle="Stay informed 24/7"
        image={{
          mobile: {
            webp: 'https://picsum.photos/seed/monitor/400/300.webp',
            avif: 'https://picsum.photos/seed/monitor/400/300.webp',
            fallback: 'https://picsum.photos/seed/monitor/400/300',
          },
          tablet: {
            webp: 'https://picsum.photos/seed/monitor/600/450.webp',
            avif: 'https://picsum.photos/seed/monitor/600/450.webp',
            fallback: 'https://picsum.photos/seed/monitor/600/450',
          },
        }}
        imageAlt="Monitoring dashboard"
        imagePosition="right"
      >
        <p className="text-muted-foreground">
          Track your compliance status in real-time with our comprehensive
          monitoring dashboard. Get instant alerts when action is needed.
        </p>
      </ContentSection>

      <ContentSection
        title="Automated Reports"
        subtitle="Save time on documentation"
        image={{
          mobile: {
            webp: 'https://picsum.photos/seed/reports/400/300.webp',
            avif: 'https://picsum.photos/seed/reports/400/300.webp',
            fallback: 'https://picsum.photos/seed/reports/400/300',
          },
          tablet: {
            webp: 'https://picsum.photos/seed/reports/600/450.webp',
            avif: 'https://picsum.photos/seed/reports/600/450.webp',
            fallback: 'https://picsum.photos/seed/reports/600/450',
          },
        }}
        imageAlt="Report generation"
        background="cream"
        imagePosition="left"
      >
        <p className="text-muted-foreground">
          Generate professional compliance reports with a single click.
          Our system automatically compiles your data into regulator-ready formats.
        </p>
      </ContentSection>
    </div>
  ),
}
