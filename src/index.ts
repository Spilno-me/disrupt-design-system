// Import styles
import './styles.css'

// Export all components
export { Button, buttonVariants } from './components/ui/button'
export { Badge, badgeVariants } from './components/ui/badge'
export {
  Card,
  cardVariants,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './components/ui/card'
export { PricingConnector } from './components/ui/pricing-connector'
export { Input } from './components/ui/input'
export { Textarea } from './components/ui/textarea'
export { Checkbox } from './components/ui/checkbox'
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'
export { Separator } from './components/ui/separator'
export { Skeleton, SkeletonImage, SkeletonText } from './components/ui/Skeleton'
export { Slider } from './components/ui/Slider'
export type { SliderProps } from './components/ui/Slider'
export { FeatureCard } from './components/ui/FeatureCard'
export type { FeatureCardProps } from './components/ui/FeatureCard'
export { FeatureItem } from './components/ui/FeatureItem'
export type { FeatureItemProps } from './components/ui/FeatureItem'
export { ElectricButtonWrapper, GlassInputWrapper, ElectricInputWrapper, GlassButtonWrapper } from './components/ui/GlassEffect'
export { ElectricLucideIcon } from './components/ui/ElectricLucideIcon'
export { AnimatedCheck } from './components/ui/AnimatedCheck'
export { HeroParticles } from './components/ui/HeroParticles'
export { MouseParticleRenderer } from './components/ui/MouseParticleRenderer'
export { BlurImage } from './components/ui/BlurImage'
export { CheckListItem } from './components/ui/CheckListItem'
export { OptimizedImage } from './components/ui/OptimizedImage'
export { ResponsiveImage } from './components/ui/ResponsiveImage'
export { ResponsivePicture } from './components/ui/ResponsivePicture'
export { ParallaxImage } from './components/ui/ParallaxImage'
export { ScrollToTopButton } from './components/ui/ScrollToTopButton'
export type { ScrollToTopButtonProps } from './components/ui/ScrollToTopButton'
export { Accordion } from './components/ui/Accordion'
export type { AccordionProps, AccordionItem } from './components/ui/Accordion'
export { LinkedInButton } from './components/ui/LinkedInButton'
export type { LinkedInButtonProps } from './components/ui/LinkedInButton'
export { ScrollableTableWrapper } from './components/ui/ScrollableTableWrapper'
export { SectionWrapper, SectionHeading, SectionContainer, ContentSection, TwoColumnLayout, Column } from './components/ui/SectionLayout'
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from './components/ui/dialog'
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './components/ui/sheet'
export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './components/ui/tooltip'
export { Label } from './components/ui/label'
export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from './components/ui/form'
export { AnimatedLogo } from './components/ui/AnimatedLogo'
export type { AnimatedLogoProps } from './components/ui/AnimatedLogo'
export { MobileMenu } from './components/ui/MobileMenu'
export type { MobileMenuProps } from './components/ui/MobileMenu'
export { Header } from './components/ui/Header'
export type { HeaderProps, NavItem } from './components/ui/Header'
export { AppHeader, WavePattern, LogoContainer, NotificationBell, NotificationBadge, UserAvatar, UserMenu, IconButton } from './components/ui/AppHeader'
export type { AppHeaderProps, ProductType, UserMenuItem, UserInfo, ProductConfig, IconButtonProps } from './components/ui/AppHeader'
export { CursorPixels } from './components/ui/cursor-pixels'
export type { CursorPixelsProps } from './components/ui/cursor-pixels'
export { ElectricInputWrapper as ElectricInput } from './components/ui/ElectricInput'
export { GridBlobBackground, GridBlobCanvas, BlobSection } from './components/ui/GridBlobCanvas'
export { MapWithMarkers } from './components/ui/MapWithMarkers'
export { ErrorBoundary, CanvasErrorBoundary, SectionErrorBoundary } from './components/ui/ErrorBoundary'

// Export section components
export { FAQSection } from './components/sections/FAQSection'
export type { FAQSectionProps, FAQItem } from './components/sections/FAQSection'
export { CTASection } from './components/sections/CTASection'
export type { CTASectionProps } from './components/sections/CTASection'
export { FeaturesSection } from './components/sections/FeaturesSection'
export type { FeaturesSectionProps, Feature } from './components/sections/FeaturesSection'
export { HeroSection } from './components/sections/HeroSection'
export type { HeroSectionProps } from './components/sections/HeroSection'
export { IndustryCarouselSection } from './components/sections/IndustryCarouselSection'
export type { IndustryCarouselSectionProps } from './components/sections/IndustryCarouselSection'

// Website section components
export { AIPlatformSection } from './components/sections/AIPlatformSection'
export { AboutHeroSection } from './components/sections/AboutHeroSection'
export { AboutProofSection } from './components/sections/AboutProofSection'
export { ContactInfo } from './components/sections/ContactInfo'
export { ContactSection } from './components/sections/ContactSection'
export { FeatureCard as FeatureCardSection } from './components/sections/FeatureCard'
export { FeaturesGridSection } from './components/sections/FeaturesGridSection'
export { FutureCapabilitiesSection } from './components/sections/FutureCapabilitiesSection'
export { OurMissionSection } from './components/sections/OurMissionSection'
export { OurStorySection } from './components/sections/OurStorySection'
export { OurValuesSection } from './components/sections/OurValuesSection'
export { OurVisionSection } from './components/sections/OurVisionSection'
export { PartnersSection } from './components/sections/PartnersSection'
// PlatformTiersSection moved to _archive - not exported
export { PricingCardsSection } from './components/sections/PricingCardsSection'
export { ProductHeroSection } from './components/sections/ProductHeroSection'
export { ProofSection } from './components/sections/ProofSection'
export { ReadyToAchieveSection } from './components/sections/ReadyToAchieveSection'
export { StrategicAdvisorySection } from './components/sections/StrategicAdvisorySection'
export { WhatDisruptDoesSection } from './components/sections/WhatDisruptDoesSection'
export { WhoWeHelpSection } from './components/sections/WhoWeHelpSection'
export { WhyDifferentSection } from './components/sections/WhyDifferentSection'

// Export form components
export { ContactForm } from './components/forms/ContactForm'
export type { ContactFormProps, ContactFormField } from './components/forms/ContactForm'
export { ContactFormSuccessModal } from './components/forms/ContactFormSuccessModal'
export type { ContactFormSuccessModalProps } from './components/forms/ContactFormSuccessModal'
export { ContactFormErrorModal } from './components/forms/ContactFormErrorModal'
export type { ContactFormErrorModalProps } from './components/forms/ContactFormErrorModal'

// Export layout components
export { Footer } from './components/layout/Footer'
export type { FooterProps, FooterLink } from './components/layout/Footer'
export { PageLayout, Container } from './components/layout/PageLayout'
export type { PageLayoutProps, ContainerProps } from './components/layout/PageLayout'

// Export design tokens
export * from './constants/designTokens'

// Export utilities
export { cn } from './lib/utils'

// Export hooks
export { useIsMobile } from './hooks/useIsMobile'
export { useMouseParticles } from './hooks/useMouseParticles'
export type { MouseParticle } from './hooks/useMouseParticles'
export { useHeroTitleRotation } from './hooks/useHeroTitleRotation'

// Export assets
export { optimizedImages } from './assets/optimized'
export { aboutImages } from './assets/optimized/about'
export { productImages } from './assets/optimized/product'
