import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

// Layout
import { PageLayout } from '@/components/layout/PageLayout'
import { Header, NavItem } from '@/components/ui/Header'
import { Footer } from '@/components/layout/Footer'

// Device Frames
import { IPhoneFrame } from '@/stories/_infrastructure/device-frames'

// Home Page Sections (matches App.tsx)
import { HeroSection } from '@/components/sections/HeroSection'
import { WhoWeHelpSection } from '@/components/sections/WhoWeHelpSection'
import { WhatDisruptDoesSection } from '@/components/sections/WhatDisruptDoesSection'
import { AIPlatformSection } from '@/components/sections/AIPlatformSection'
import { ProofSection } from '@/components/sections/ProofSection'
import { WhyDifferentSection } from '@/components/sections/WhyDifferentSection'
import { FutureCapabilitiesSection } from '@/components/sections/FutureCapabilitiesSection'
import { ContactSection } from '@/components/sections/ContactSection'

// Product Page Sections (matches Product.tsx)
import { ProductHeroSection } from '@/components/sections/ProductHeroSection'
import { IndustryCarouselSection } from '@/components/sections/IndustryCarouselSection'
import { FeaturesGridSection } from '@/components/sections/FeaturesGridSection'
import { ROICalculatorSection } from '@/components/sections/ROICalculatorSection'
import { PricingCardsSection } from '@/components/sections/PricingCardsSection'
import { StrategicAdvisorySection } from '@/components/sections/StrategicAdvisorySection'
import { ReadyToAchieveSection } from '@/components/sections/ReadyToAchieveSection'
import { FAQSection } from '@/components/sections/FAQSection'

// About Page Sections (matches About.tsx)
import { AboutHeroSection } from '@/components/sections/AboutHeroSection'
import { OurStorySection } from '@/components/sections/OurStorySection'
import { AboutProofSection } from '@/components/sections/AboutProofSection'
import { PartnersSection } from '@/components/sections/PartnersSection'
import { OurMissionSection } from '@/components/sections/OurMissionSection'
import { OurVisionSection } from '@/components/sections/OurVisionSection'
import { OurValuesSection } from '@/components/sections/OurValuesSection'

// Assets
import { optimizedImages } from '@/assets/optimized'

// Infrastructure
import { PAGE_META, pageDescription } from '../_infrastructure/presets'

// =============================================================================
// META
// =============================================================================

const meta: Meta = {
  title: 'Website/Complete Website',
  ...PAGE_META,
  parameters: {
    ...PAGE_META.parameters,
    docs: {
      description: {
        component: pageDescription(
          'Complete website showcase with all pages connected. Navigate between Home, Product, About, and Contact pages using the header navigation.'
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// NAVIGATION CONFIG
// =============================================================================

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Product', path: '/product' },
  { label: 'About', path: '/about' },
]

const FOOTER_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/#contact' },
]

// =============================================================================
// HERO DATA
// =============================================================================

// Matches App.tsx from DisruptInc.io website
const HOME_ROTATING_TITLES = [
  'Protect People',
  'Empower Strategy',
  'Cut the Admin',
]

// =============================================================================
// PAGE COMPONENTS
// =============================================================================

/**
 * Home Page - matches App.tsx from DisruptInc.io website
 */
function HomePageContent() {
  return (
    <>
      <HeroSection
        title="Protect People"
        rotatingTitles={HOME_ROTATING_TITLES}
        subtitle="Make workplaces safer and decisions smarter — without the paperwork."
        backgroundImage={optimizedImages.heroFrame}
        layout="center"
        showParticles={true}
        showGridBlob={false}
      />
      <WhoWeHelpSection />
      <WhatDisruptDoesSection />
      <AIPlatformSection />
      <ProofSection />
      <WhyDifferentSection />
      <FutureCapabilitiesSection />
      <ContactSection />
    </>
  )
}

/**
 * Product Page - matches Product.tsx from DisruptInc.io website
 */
function ProductPageContent() {
  return (
    <>
      <ProductHeroSection />
      <IndustryCarouselSection />
      <FeaturesGridSection />
      <ROICalculatorSection />
      <PricingCardsSection />
      <StrategicAdvisorySection />
      <ReadyToAchieveSection />
      <FAQSection />
      <ContactSection />
    </>
  )
}

/**
 * About Page - matches About.tsx from DisruptInc.io website
 */
function AboutPageContent() {
  return (
    <>
      <AboutHeroSection />
      <OurStorySection />
      <AboutProofSection />
      <PartnersSection />
      <OurMissionSection />
      <OurVisionSection />
      <OurValuesSection />
      <ContactSection />
    </>
  )
}

/**
 * Contact Page - standalone contact section
 */
function ContactPageContent() {
  return (
    <>
      <div className="mt-[82px]" /> {/* Spacer for fixed header */}
      <ContactSection />
    </>
  )
}

// =============================================================================
// MAIN WEBSITE COMPONENT
// =============================================================================

interface WebsiteProps {
  initialPage?: '/' | '/product' | '/about' | '/contact'
}

function Website({ initialPage = '/' }: WebsiteProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  // Mark current nav item as active
  const navItemsWithActive = NAV_ITEMS.map((item) => ({
    ...item,
    isActive: item.path === currentPage,
  }))

  // Handle navigation
  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    e.preventDefault()
    if (item.path === '/#contact') {
      setCurrentPage('/contact')
    } else {
      setCurrentPage(item.path as typeof currentPage)
    }
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle logo click - go home
  const handleLogoClick = () => {
    setCurrentPage('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle contact button click
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentPage('/contact')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Render current page content
  const renderPage = () => {
    switch (currentPage) {
      case '/product':
        return <ProductPageContent />
      case '/about':
        return <AboutPageContent />
      case '/contact':
        return <ContactPageContent />
      default:
        return <HomePageContent />
    }
  }

  return (
    <PageLayout
      header={
        <Header
          navItems={navItemsWithActive}
          onNavItemClick={handleNavClick}
          onLogoClick={handleLogoClick}
          onContactClick={handleContactClick}
          colorMode="auto"
          disableMobileMenuPortal
        />
      }
      footer={<Footer companyName="Disrupt Inc." links={FOOTER_LINKS} />}
      showHeader={false}
      showFooter={false}
      maxWidth="full"
      background="cream"
    >
      {renderPage()}
    </PageLayout>
  )
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Complete website with all pages connected via navigation.
 * Click on navigation items to switch between pages.
 */
export const Default: Story = {
  render: () => <Website />,
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
}

/**
 * Website starting on the Home page.
 * Features rotating hero titles, feature cards, proof section, and more.
 */
export const HomePage: Story = {
  name: 'Home Page',
  render: () => <Website initialPage="/" />,
}

/**
 * Website starting on the Product page.
 * Showcases product hero, AI platform features, pricing, and ROI calculator.
 */
export const ProductPageStory: Story = {
  name: 'Product Page',
  render: () => <Website initialPage="/product" />,
}

/**
 * Website starting on the About page.
 * Displays company story, mission, vision, values, and team information.
 */
export const AboutPageStory: Story = {
  name: 'About Page',
  render: () => <Website initialPage="/about" />,
}

/**
 * Website starting on the Contact page.
 * Shows contact form and FAQ section.
 */
export const ContactPageStory: Story = {
  name: 'Contact Page',
  render: () => <Website initialPage="/contact" />,
}

/**
 * Mobile viewport - 375px width (iPhone SE).
 * Test responsive behavior across all pages.
 */
export const MobileView: Story = {
  render: () => <Website />,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

/**
 * Tablet viewport - 768px width (iPad).
 * Test responsive behavior at medium breakpoint.
 */
export const TabletView: Story = {
  render: () => <Website />,
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
}

// =============================================================================
// DEVICE FRAME STORIES
// =============================================================================

/**
 * Scrollable mobile content wrapper for device frames.
 * Uses transform to create a containing block that traps position:fixed elements.
 */
function ScrollableMobileContent({ initialPage = '/' }: { initialPage?: '/' | '/product' | '/about' | '/contact' }) {
  return (
    <div
      className="h-full overflow-y-auto overflow-x-hidden"
      style={{ transform: 'translate(0)' }}
    >
      <Website initialPage={initialPage} />
    </div>
  )
}

/**
 * iPhone 16 device frame - FULL SIZE (393×852).
 * Shows the complete website in a full-size iPhone 16 frame.
 * Scroll within the device frame to navigate the page.
 */
export const IPhone16: Story = {
  name: 'iPhone 16',
  render: () => (
    <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4">
      <IPhoneFrame model="iphone16">
        <ScrollableMobileContent />
      </IPhoneFrame>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * iPhone 16 Pro Max device frame - FULL SIZE (440×956).
 * Shows the complete website in a full-size iPhone 16 Pro Max frame.
 * Scroll within the device frame to navigate the page.
 */
export const IPhone16ProMax: Story = {
  name: 'iPhone 16 Pro Max',
  render: () => (
    <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4">
      <IPhoneFrame model="iphone16promax">
        <ScrollableMobileContent />
      </IPhoneFrame>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
