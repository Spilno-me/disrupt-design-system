import type { Meta, StoryObj } from '@storybook/react'
import { PageLayout, Container } from './PageLayout'
import { Header } from '../ui/Header'
import { Footer } from './Footer'
import { Button } from '../ui/button'

const meta: Meta<typeof PageLayout> = {
  title: 'Website/Layout/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full', 'container'],
      description: 'Main content max-width',
    },
    padded: {
      control: 'boolean',
      description: 'Add padding to main content',
    },
    background: {
      control: 'select',
      options: ['white', 'cream', 'transparent'],
      description: 'Background color',
    },
  },
}

export default meta
type Story = StoryObj<typeof PageLayout>

// Sample nav items
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Products', path: '/products' },
  { label: 'Contact', path: '/contact' },
]

// Default page layout
export const Default: Story = {
  render: () => (
    <PageLayout
      header={<Header navItems={navItems} contactButtonText="Get Started" colorMode="light" showContactButton />}
      footer={<Footer companyName="DisruptInc.io" copyrightYear={2024} />}
    >
      <div className="py-16">
        <h1 className="text-3xl font-bold text-dark mb-4">Page Title</h1>
        <p className="text-muted-foreground mb-8">
          This is the main content area of the page layout component.
        </p>
        <Button variant="contact">Call to Action</Button>
      </div>
    </PageLayout>
  ),
}

// Without header
export const WithoutHeader: Story = {
  render: () => (
    <PageLayout
      footer={<Footer companyName="DisruptInc.io" copyrightYear={2024} />}
    >
      <div className="py-16">
        <h1 className="text-3xl font-bold text-dark mb-4">No Header Layout</h1>
        <p className="text-muted-foreground">
          This layout doesn't include a header component.
        </p>
      </div>
    </PageLayout>
  ),
}

// Without footer
export const WithoutFooter: Story = {
  render: () => (
    <PageLayout
      header={<Header navItems={navItems} contactButtonText="Get Started" colorMode="light" showContactButton />}
    >
      <div className="py-16">
        <h1 className="text-3xl font-bold text-dark mb-4">No Footer Layout</h1>
        <p className="text-muted-foreground">
          This layout doesn't include a footer component.
        </p>
      </div>
    </PageLayout>
  ),
}

// Cream background
export const CreamBackground: Story = {
  render: () => (
    <PageLayout
      header={<Header navItems={navItems} contactButtonText="Get Started" colorMode="light" showContactButton />}
      footer={<Footer companyName="DisruptInc.io" copyrightYear={2024} />}
      background="cream"
    >
      <div className="py-16">
        <h1 className="text-3xl font-bold text-dark mb-4">Cream Background</h1>
        <p className="text-muted-foreground">
          The page has a cream background color.
        </p>
      </div>
    </PageLayout>
  ),
}

// Narrow max-width
export const NarrowWidth: Story = {
  render: () => (
    <PageLayout
      header={<Header navItems={navItems} contactButtonText="Get Started" colorMode="light" showContactButton />}
      footer={<Footer companyName="DisruptInc.io" copyrightYear={2024} />}
      maxWidth="md"
    >
      <div className="py-16">
        <h1 className="text-3xl font-bold text-dark mb-4">Narrow Width</h1>
        <p className="text-muted-foreground">
          This content area has a narrower max-width, useful for blog posts or documentation.
        </p>
      </div>
    </PageLayout>
  ),
}

// Full width
export const FullWidth: Story = {
  render: () => (
    <PageLayout
      header={<Header navItems={navItems} contactButtonText="Get Started" colorMode="light" showContactButton />}
      footer={<Footer companyName="DisruptInc.io" copyrightYear={2024} />}
      maxWidth="full"
      padded={false}
    >
      <div className="bg-dark text-white py-16 px-4">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-3xl font-bold mb-4">Full Width Section</h1>
          <p className="text-white/80">
            This layout uses full width with no padding, allowing sections to span the entire viewport.
          </p>
        </div>
      </div>
    </PageLayout>
  ),
}

// Container component standalone
export const ContainerDemo: Story = {
  render: () => (
    <div className="bg-cream min-h-screen py-8">
      <Container maxWidth="container" className="space-y-8">
        <h1 className="text-2xl font-bold">Container Component</h1>
        <p className="text-muted-foreground">
          The Container component provides consistent max-width and padding.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">Card 1</div>
          <div className="bg-white p-4 rounded-lg shadow">Card 2</div>
          <div className="bg-white p-4 rounded-lg shadow">Card 3</div>
        </div>
      </Container>

      <div className="bg-primary text-white py-8 mt-8">
        <Container>
          <h2 className="text-xl font-bold">Full-width background with contained content</h2>
          <p className="text-white/80 mt-2">
            Using Container inside a full-width section.
          </p>
        </Container>
      </div>
    </div>
  ),
}

// Complex page example
export const ComplexPage: Story = {
  render: () => (
    <PageLayout
      header={<Header navItems={navItems} contactButtonText="Get Started" colorMode="light" showContactButton />}
      footer={<Footer companyName="DisruptInc.io" copyrightYear={2024} />}
      padded={false}
    >
      {/* Hero section - full width */}
      <div className="bg-dark text-white py-20">
        <Container>
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-teal text-lg mb-8">The future of compliance management</p>
          <Button variant="contact">Get Started</Button>
        </Container>
      </div>

      {/* Features section */}
      <div className="py-16 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-dark mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal/10 rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-dark mb-2">Feature 1</h3>
              <p className="text-muted-foreground text-sm">Description of feature one.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal/10 rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-dark mb-2">Feature 2</h3>
              <p className="text-muted-foreground text-sm">Description of feature two.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal/10 rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-dark mb-2">Feature 3</h3>
              <p className="text-muted-foreground text-sm">Description of feature three.</p>
            </div>
          </div>
        </Container>
      </div>

      {/* CTA section */}
      <div className="py-16 bg-cream">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of companies using our platform.</p>
          <Button variant="contact">Start Free Trial</Button>
        </Container>
      </div>
    </PageLayout>
  ),
}
