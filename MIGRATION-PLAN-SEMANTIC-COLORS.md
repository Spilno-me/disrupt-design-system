# Migration Plan: Semantic Color Classes

> Created: 2025-12-10
> Status: IN PROGRESS

## Overview

Migrate from brand-specific color classes (e.g., `text-dark`, `text-darkPurple`) to semantic color classes (e.g., `text-primary`, `text-secondary`) for better maintainability and theming support.

---

## Phase 1: Foundation Setup

### 1.1 Update `src/styles/tokens.css`
- [ ] Add CSS custom properties for all semantic colors
- [ ] Text colors: `--color-text-primary`, `--color-text-secondary`, `--color-text-accent`, etc.
- [ ] Background colors: `--color-bg-page`, `--color-bg-surface`, `--color-bg-inverse`, etc.
- [ ] Border colors: `--color-border-default`, `--color-border-accent`, etc.

### 1.2 Update `tailwind-preset.js`
- [ ] Map Tailwind color classes to CSS variables
- [ ] Add safelist for semantic classes
- [ ] Keep backward compatibility aliases (deprecated)

### 1.3 Update `src/constants/designTokens.ts`
- [ ] Update ALIAS object to use new semantic names
- [ ] Add deprecation comments for old names

---

## Phase 2: Component Migration

### Color Mapping Reference

| Old Class | New Class | CSS Variable |
|-----------|-----------|--------------|
| `text-dark` | `text-primary` | `--color-text-primary` |
| `text-darkPurple` | `text-secondary` | `--color-text-secondary` |
| `text-muted` | `text-muted` | `--color-text-muted` (keep) |
| `text-teal` | `text-accent` | `--color-text-accent` |
| `text-red` | `text-error` | `--color-text-error` |
| `text-white` | `text-inverse` | `--color-text-inverse` |
| `bg-dark` | `bg-inverse` | `--color-bg-inverse` |
| `bg-cream` | `bg-page` | `--color-bg-page` |
| `bg-white` | `bg-surface` | `--color-bg-surface` |
| `bg-teal` | `bg-accent` | `--color-bg-accent` |
| `bg-lightPurple` | `bg-muted` | `--color-bg-muted` |
| `border-slate` | `border-default` | `--color-border-default` |
| `border-teal` | `border-accent` | `--color-border-accent` |

### 2.1 UI Components (`src/components/ui/`)
Files to update:
- [ ] button.tsx
- [ ] input.tsx
- [ ] textarea.tsx
- [ ] checkbox.tsx
- [ ] select.tsx
- [ ] dropdown-menu.tsx
- [ ] dialog.tsx
- [ ] sheet.tsx
- [ ] card.tsx
- [ ] badge.tsx
- [ ] label.tsx
- [ ] separator.tsx
- [ ] skeleton.tsx
- [ ] tooltip.tsx
- [ ] accordion.tsx (Accordion.tsx)
- [ ] slider.tsx (Slider.tsx)
- [ ] Header.tsx
- [ ] AppHeader.tsx
- [ ] AppFooter.tsx
- [ ] AppSidebar.tsx
- [ ] MobileMenu.tsx
- [ ] MobileNav.tsx
- [ ] BottomNav.tsx
- [ ] ScrollToTopButton.tsx
- [ ] AnimatedLogo.tsx
- [ ] BlurImage.tsx
- [ ] GlassEffect.tsx
- [ ] GridBlobCanvas.tsx
- [ ] ElectricInput.tsx
- [ ] QuickFilter.tsx
- [ ] DataTable.tsx
- [ ] Pagination.tsx
- [ ] ErrorBoundary.tsx
- [ ] MadeWithLove.tsx
- [ ] SeverityIndicator.tsx
- [ ] tabs.tsx

### 2.2 Form Components (`src/components/forms/`)
- [ ] ContactForm.tsx
- [ ] ContactFormSuccessModal.tsx
- [ ] ContactFormErrorModal.tsx

### 2.3 Section Components (`src/components/sections/`)
- [ ] HeroSection.tsx
- [ ] FAQSection.tsx
- [ ] ContactSection.tsx
- [ ] ContactInfo.tsx
- [ ] CTASection.tsx
- [ ] FeaturesSection.tsx
- [ ] FeaturesGridSection.tsx
- [ ] FeatureCard.tsx
- [ ] PricingCardsSection.tsx
- [ ] StrategicAdvisorySection.tsx
- [ ] IndustryCarouselSection.tsx
- [ ] ROICalculatorSection.tsx
- [ ] AIPlatformSection.tsx
- [ ] AboutHeroSection.tsx
- [ ] AboutProofSection.tsx
- [ ] FutureCapabilitiesSection.tsx
- [ ] OurMissionSection.tsx
- [ ] OurStorySection.tsx
- [ ] OurValuesSection.tsx
- [ ] OurVisionSection.tsx
- [ ] PartnersSection.tsx
- [ ] ProductHeroSection.tsx
- [ ] ProofSection.tsx
- [ ] ReadyToAchieveSection.tsx
- [ ] WhoWeHelpSection.tsx
- [ ] WhyDifferentSection.tsx
- [ ] WhatDisruptDoesSection.tsx

### 2.4 Layout Components (`src/components/layout/`)
- [ ] PageLayout.tsx
- [ ] Footer.tsx

### 2.5 Auth Components (`src/components/auth/`)
- [ ] LoginPage.tsx
- [ ] AuthLayout.tsx
- [ ] SocialLoginButtons.tsx

### 2.6 Partner Components (`src/components/partners/`)
- [ ] PartnersPage.tsx
- [ ] PartnerNetworkPage.tsx
- [ ] PartnerLoginAccountsPage.tsx
- [ ] HelpPage.tsx
- [ ] SettingsPage.tsx
- [ ] PricingCalculator.tsx
- [ ] ResetPasswordDialog.tsx
- [ ] EditPartnerDialog.tsx
- [ ] DeletePartnerDialog.tsx
- [ ] EditNetworkPartnerDialog.tsx
- [ ] DeleteNetworkPartnerDialog.tsx
- [ ] DeleteLoginAccountDialog.tsx
- [ ] invoices/InvoiceCard.tsx
- [ ] invoices/InvoicesDataTable.tsx
- [ ] invoices/InvoicePreviewSheet.tsx

### 2.7 Leads Components (`src/components/leads/`)
- [ ] LeadCard.tsx
- [ ] LeadsDataTable.tsx

### 2.8 Provisioning Components (`src/components/provisioning/`)
- [ ] TenantProvisioningWizard.tsx
- [ ] TenantProvisioningChat.tsx
- [ ] WizardStepper.tsx
- [ ] WizardNavigation.tsx
- [ ] ProvisioningMethodSelector.tsx

### 2.9 Shared Components (`src/components/shared/`)
- [ ] SearchFilter/FilterDropdown.tsx
- [ ] SearchFilter/MobileFilterSheet.tsx
- [ ] SearchFilter/SearchInput.tsx
- [ ] SearchFilter/MobileFilterButton.tsx
- [ ] SearchFilter/FilterBadge.tsx

### 2.10 Template Components (`src/templates/`)
- [ ] layout/AppLayoutShell.tsx
- [ ] pages/DashboardPage.tsx
- [ ] pages/PlaceholderPage.tsx

---

## Phase 3: Configuration Files

### 3.1 Update Agent Configuration
- [ ] `.claude/agents/component-builder.md` - Update color class references

### 3.2 Update ESLint Rules
- [ ] Check for any color-related lint rules
- [ ] Update any deprecated class warnings

### 3.3 Update CLAUDE.md
- [ ] Update color class documentation
- [ ] Update examples with new semantic classes

### 3.4 Update Storybook Files
- [ ] Update story files that use old classes (lower priority)

---

## Phase 4: Website Project Updates

### 4.1 Website Components
- [ ] `/Users/adrozdenko/Desktop/DisruptInc.io - Webite/src/pages/TermsOfService.tsx`
- [ ] `/Users/adrozdenko/Desktop/DisruptInc.io - Webite/src/pages/PrivacyPolicy.tsx`
- [ ] `/Users/adrozdenko/Desktop/DisruptInc.io - Webite/src/components/forms/ContactFormHeader.tsx`
- [ ] `/Users/adrozdenko/Desktop/DisruptInc.io - Webite/src/input.css`

---

## Phase 5: Testing & Verification

- [ ] Run TypeScript check (`npm run typecheck`)
- [ ] Run build (`npm run build`)
- [ ] Visual verification in Storybook
- [ ] Test website with linked DDS

---

## Execution Log

### Started: 2025-12-10

| Time | Task | Status |
|------|------|--------|
| | Phase 1.1: tokens.css | PENDING |
| | Phase 1.2: tailwind-preset.js | PENDING |
| | Phase 1.3: designTokens.ts | PENDING |
| | Phase 2: Components | PENDING |
| | Phase 3: Config files | PENDING |
| | Phase 4: Website | PENDING |
| | Phase 5: Testing | PENDING |

---

## Rollback Plan

If issues arise:
1. Git revert all changes
2. Rebuild DDS
3. Re-link to website

---

## Notes

- Keep backward compatibility for transition period
- Stories are lower priority than actual components
- Test after each major phase
