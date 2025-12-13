# Changelog

All notable changes to the Disrupt Design System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### To Be Added in v2.4.0
- NotificationsPanel component export
- QuickFilter component export
- DropdownMenu component export (full Radix wrapper)
- Tabs component export (Radix wrapper)
- Base Wizard components exports (Wizard, WizardStepper, WizardStep, WizardNavigation, useWizard)

### Improved
- **Badge**: Enhanced code quality and documentation (backwards compatible)
  - Fixed text color consistency (`text-white` → `text-inverse`)
  - Added JSDoc comments for better DX
  - Added React display name for debugging
  - Cleaned up redundant size styles in base className
  - Expanded Storybook documentation (added success/warning/info variants, size variants, icon examples)
  - ATOM: Accepts data-testid via props for Playwright testing

- **SeverityIndicator**: Enhanced code quality and documentation (backwards compatible)
  - Extended props to accept all HTMLDivElement attributes (enables data-testid)
  - Added React display name for debugging
  - Removed hardcoded font family (now inherits from parent)
  - Updated JSDoc with ATOM testId pattern (consumer provides context)
  - Known Issue: Uses PRIMITIVES tokens directly (documented for v3.0.0 refactor)

- **Skeleton**: Enhanced code quality and documentation (backwards compatible)
  - Extended all three components (Skeleton, SkeletonImage, SkeletonText) to accept HTMLDivElement attributes
  - Added React display names for all three components
  - Updated JSDoc with ATOM testId pattern for all three components
  - Replaced hardcoded inline styles with Tailwind classes in Storybook stories
  - Simplified Storybook stories (removed redundant animation variant stories)

### Added
- **Testing Guidelines**: Implemented 3-tier testId strategy (Atoms/Molecules/Pages)
  - ATOMS: Accept data-testid via props (no defaults, consumer provides context)
  - MOLECULES: Auto-generate default testId from props with optional override
  - PAGES: Hardcoded data-testid on major sections
  - QA Documentation: `TESTING.md` - Complete guide with naming propagation, examples, and Playwright patterns
  - Agent Documentation: `.claude/testing-quick-ref.md` with decision tree and implementation patterns
  - Agent enforcement: Updated hookify rules and agent-context.json
  - Naming propagation: Page-level naming flows down to all nested components (critical for consistency)

- **Variant Reduction Strategy**: Opinionated design system philosophy
  - Minimal variants for design consistency
  - Decision framework: Functional vs aesthetic variants
  - Target limits: animations (1), state variants (4-5), sizes (2-3)
  - Documentation: `.claude/variant-reduction-strategy.md`
  - Philosophy: Strong design vision over unlimited flexibility

### Deprecated
- **Skeleton**: `variant` prop deprecated (will be removed in v3.0.0)
  - Reason: Purely aesthetic animations create UI inconsistency
  - Impact: All variants now render as 'shimmer' for consistency
  - Migration: Remove `variant` prop from Skeleton usages
  - Backwards Compatible: Prop still accepted but ignored in v2.x

### Under Consideration
- Partner Network components (PartnerNetworkPage, related dialogs)
- Invoice advanced components (InvoicePDFDialog, InvoicePreviewSheet, InvoicesDataTable)

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
