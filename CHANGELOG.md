# Changelog

All notable changes to the Disrupt Design System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- NotificationsPanel component export
- QuickFilter component export
- DropdownMenu component export (full Radix wrapper)
- Tabs component export (Radix wrapper)
- Base Wizard components exports (Wizard, WizardStepper, WizardStep, WizardNavigation, useWizard)

---

## [2.4.0] - 2025-12-17

### Added

- **BrandHero component** - Unified hero component for documentation pages with particle animations, decorative background icons, and Pilat Extended font support
- **IconText component** - Combined icon + text molecule for consistent layouts
- **Core Components Overview page** - Documentation page listing all 19 core components organized by category (Form Controls, Display, Overlays, Layout)
- **Standalone PricingCalculator delivery package** - Production-ready component package in `delivery/` folder with data assets
- **HeroParticles component** - Dynamic particle animation for hero sections
- **GenericErrorPage component** - Full-page error display using DDS tokens
- **Provisioning dialogs** - ApproveRequestDialog, RejectRequestDialog, DeleteRequestDialog for tenant management
- **Partner Portal pages** - SettingsPage, HelpPage, and PricingCalculator integrated into partner portal
- **DataTableStatusDot component** - Minimal dot + label pattern for status columns
- **DataTableSeverity component** - Squircle icon + label pattern for priority/severity columns
- **AllStates visual matrix stories** - Comprehensive state visualization for Badge, Input, Checkbox, Select, Textarea, and Skeleton
- **Automated token generation** - Single source of truth with `npm run generate-tokens` script
- **Color matrix and contrast matrix** - WCAG compliance reference files
- **Foundation documentation** - Colors, Typography, Spacing, Shadows documentation pages
- **Delivery package guide** - Documentation for standalone component packaging

**Components (continued from previous work):**
- **AppCard** - Application card for in-app use with variants (default, elevated, flat) and shadow levels
- **Shadow System Redesign** - 2-layer umbra/penumbra approach with natural light physics
- **Testing Guidelines** - 3-tier testId strategy (Atoms/Molecules/Pages)

### Changed

- **TenantProvisioningChat redesigned** - Section-based forms with AI tips replacing step-by-step chat
- **LoginPage enhanced** - Particle effects, frosted glass backdrop-blur, increased hero vibrancy
- **Storybook navigation reorganized** - Cleaner hierarchy (Partner/Components, Shared/App Shell)
- **Brand MDX files** - Numeric prefixes (01-08) for consistent ordering
- **Focus ring color** - Changed from blue (#2563EB) to teal (#08A4BD)
- **Checkbox visibility** - Darker teal brand colors for better contrast
- **Select menu styling** - Teal hover backgrounds, semibold selected items
- **Shadow and radius** - Migrated from inline styles to Tailwind classes
- **Card** - FROZEN for website-only use (pricing cards only)

### Fixed

- **MDX paragraph wrapping bug** - Resolved colorPrimary override from automatic `<p>` tag wrapping
- **Pilat Extended font loading** - Configured proper font loading in Storybook preview
- **Code element contrast** - Use `bg-muted-bg` (light) instead of `bg-muted` (dark) for readability
- **Dialog, Sheet, Tooltip accessibility** - Improved ARIA compliance
- **Accordion contrast** - Changed text-secondary to text-primary
- **Pagination contrast** - Changed text-muted to text-secondary
- **SeverityIndicator token compliance** - Migrated from PRIMITIVES to ALIAS tokens
- **ESLint warnings** - Resolved all lint warnings across codebase

### Improved

- **Component stabilization** - Stabilized 15+ core components: Input, Textarea, Select, Checkbox, Slider, Label, Separator, Tabs, Accordion, AppHeader, AppSidebar, AppFooter, BottomNav, DataTable, Pagination
- **JSDoc documentation** - All stabilized components have @component type, @testing data-slot, @accessibility notes
- **Focus ring visibility** - Increased opacity (ring-accent/50), width (ring-4), added !border-accent
- **Badge** - Enhanced with text-inverse, JSDoc, display name, testId support
- **Skeleton** - Extended props, display names, Tailwind migration
- **Input/Label/Checkbox/Select/Textarea** - Exported TypeScript interfaces, comprehensive JSDoc

### Documentation

- **DESIGN-SYSTEM.md** - Comprehensive design system reference
- **Spacing rules** - Hierarchical spacing system (4px base, 5 levels)
- **Storybook rules** - MDX bugs, composition rules, modal patterns
- **Error handling rule** - Fix errors, never revert commits
- **Co-authored-by rule** - Never include in commits

### Deprecated

- **Skeleton `variant` prop** - Will be removed in v3.0.0 (all variants render as 'shimmer')

### Removed

- **Deprecated stories** - Standalone page stories consolidated into PartnerPortal
- **Redundant auth form stories** - Covered by AuthPages.stories
- **Obsolete directories** - findings/, reviews/

---

## [2.3.1] - 2025-12-12

### Fixed
- Re-enabled EditLeadDialog export that was incorrectly disabled
- Resolved all ESLint violations across the codebase
- Fixed hardcoded asset paths for npm package consumption

### Added
- New dialog components for lead management
- Improved type safety across components

---

## [2.3.0] - 2024-XX-XX

### Added
- Initial version tracking
- Core component library established
- Design token system
- Radix UI integration

---

## Version Numbering Guide

```
MAJOR.MINOR.PATCH (e.g., 2.3.1)
  |     |     |
  |     |     └─ Bug fixes (backwards compatible)
  |     └─────── New features (backwards compatible)
  └───────────── BREAKING CHANGES
```

### When to Bump Each Number

**PATCH (x.x.X)** - Bug fixes only, no API changes
- Fix hover states
- Fix styling issues
- Fix TypeScript errors
- Performance improvements (no API change)

**MINOR (x.X.x)** - New features, backwards compatible
- Add new components
- Add new optional props (with defaults)
- Add new variants to existing components
- Deprecate features (but keep them working)
- Internal refactoring (no external API change)

**MAJOR (X.x.x)** - Breaking changes
- Rename props
- Remove props
- Change prop types (non-compatible)
- Change default values
- Remove components
- Any change that breaks existing code

---

## [3.0.0] - TBD (Future Major Release)

**Status:** Planning Phase

This will be the next major release containing all breaking changes accumulated during v2.x development.

**📋 Full Details:** See `.claude/v3-breaking-changes.md` for comprehensive tracking

### Planned Breaking Changes

#### SeverityIndicator - Design Token Architecture Refactor
**Status:** Identified (2025-12-13) | **Priority:** HIGH
- **Breaking:** Refactor from PRIMITIVES to ALIAS tokens
- **Details:** See `.claude/v3-breaking-changes.md` #1

#### Skeleton - Remove Animation Variant Prop
**Status:** Deprecated in v2.x (2025-12-13) | **Priority:** MEDIUM
- **Breaking:** Remove `variant` prop (purely aesthetic, creates inconsistency)
- **Details:** See `.claude/v3-breaking-changes.md` #2

#### Button - Redesign Color Strategy (Brand vs Action Colors)
**Status:** Documented (2025-12-13) | **Priority:** HIGH
- **Breaking:** Separate brand color from action color, redesign variants
- **Current Issue:** Uses brand color (Abyss, Teal) for all primary buttons (design anti-pattern)
- **Solution:** Create `ALIAS.action` tokens (neutral blue for actions, teal for brand CTAs)
- **Impact:** Visual change for all buttons, variant consolidation (8→5)
- **Constraint:** FROZEN for website in v2.x (used in 8 sections, 58 occurrences)
- **Details:** See `.claude/v3-breaking-changes.md` #3

**Full Tracking:** See `.claude/v3-breaking-changes.md` for all planned breaking changes

### Pre-Release Plan

1. **v2.9.0** (Deprecation Release - 1-2 months before v3.0.0)
   - Add deprecation warnings for all features changing in v3
   - Provide migration guides
   - Support both old and new APIs temporarily

2. **v3.0.0** (Major Release)
   - Remove all deprecated features
   - Implement all breaking changes
   - Complete migration guide
   - Update all documentation

---

## Maintenance Notes

### Before Making Changes

1. **Check if change is breaking** (see CLAUDE.md versioning section)
2. **If breaking** → Mark for v3.0.0, don't implement in v2.x
3. **If safe** → Implement and update this CHANGELOG
4. **Update version** in package.json according to change type
5. **Run tests** to ensure no regressions

### How to Update This File

When making changes, add them under `[Unreleased]` section:

```markdown
## [Unreleased]

### Added
- New component or feature

### Changed
- Modifications to existing features (backwards compatible)

### Deprecated
- Features marked for removal in next major version

### Fixed
- Bug fixes

### Security
- Security-related fixes
```

Before releasing a new version:
1. Move items from `[Unreleased]` to new version section
2. Add release date
3. Update version in package.json
4. Create git tag
5. Publish to npm

---

## Links

- [Repository](https://github.com/your-org/disrupt-design-system)
- [Documentation](https://storybook-url.com)
- [npm Package](https://www.npmjs.com/package/disrupt-design-system)

---

**Note:** This project is under active development. Version 2.x is pre-release. Version 3.0.0 will be the first stable major release with a finalized API.
