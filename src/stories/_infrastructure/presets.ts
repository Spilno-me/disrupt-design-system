/**
 * Story Meta Presets
 *
 * Pre-configured parameter objects for each atomic design level.
 * These ensure consistent story configuration across the codebase.
 *
 * IMPORTANT: Storybook's CSF indexer requires the default export to be a
 * static object literal. We provide parameter presets to spread into meta,
 * NOT factory functions that return meta.
 *
 * @example
 * import { ATOM_META, atomDescription } from '@/stories/_infrastructure/presets'
 *
 * const meta: Meta<typeof Button> = {
 *   title: 'Core/Button',
 *   component: Button,
 *   ...ATOM_META,
 *   parameters: {
 *     ...ATOM_META.parameters,
 *     docs: {
 *       description: { component: atomDescription('Primary button.') },
 *     },
 *   },
 * }
 */

import type { StoryObj } from '@storybook/react'

// =============================================================================
// ATOMIC LEVEL LABELS
// =============================================================================

export const ATOMIC_LEVELS = {
  atom: 'ATOM',
  molecule: 'MOLECULE',
  organism: 'ORGANISM',
  template: 'TEMPLATE',
  page: 'PAGE',
} as const

// =============================================================================
// DESCRIPTION HELPERS
// =============================================================================

/**
 * Creates a description with ATOM type badge.
 * @example atomDescription('Primary button for user actions.')
 */
export const atomDescription = (desc: string) =>
  `**Type:** ${ATOMIC_LEVELS.atom}\n\n${desc}`

/**
 * Creates a description with MOLECULE type badge.
 * @example moleculeDescription('Container with header and content.')
 */
export const moleculeDescription = (desc: string) =>
  `**Type:** ${ATOMIC_LEVELS.molecule}\n\n${desc}`

/**
 * Creates a description with ORGANISM type badge.
 * @example organismDescription('Application header component.')
 */
export const organismDescription = (desc: string) =>
  `**Type:** ${ATOMIC_LEVELS.organism}\n\n${desc}`

/**
 * Creates a description with TEMPLATE type badge.
 * @example templateDescription('Page layout shell.')
 */
export const templateDescription = (desc: string) =>
  `**Type:** ${ATOMIC_LEVELS.template}\n\n${desc}`

/**
 * Creates a description with PAGE type badge.
 * @example pageDescription('Login page with authentication form.')
 */
export const pageDescription = (desc: string) =>
  `**Type:** ${ATOMIC_LEVELS.page}\n\n${desc}`

// =============================================================================
// META PRESETS - Spread these into your meta object
// =============================================================================

/**
 * Base parameters shared by all atomic levels.
 */
const BASE_PARAMETERS = {
  docs: {
    toc: true,
    canvas: { sourceState: 'shown' as const },
  },
}

/**
 * Meta preset for ATOM components.
 * ATOMs are the smallest functional UI units: Button, Input, Label, etc.
 *
 * @example
 * const meta: Meta<typeof Button> = {
 *   title: 'Core/Button',
 *   component: Button,
 *   ...ATOM_META,
 *   parameters: {
 *     ...ATOM_META.parameters,
 *     docs: { description: { component: atomDescription('Primary button.') } },
 *   },
 * }
 */
export const ATOM_META = {
  tags: ['autodocs'],
  parameters: {
    ...BASE_PARAMETERS,
    layout: 'centered' as const,
  },
}

/**
 * Meta preset for MOLECULE components.
 * MOLECULEs are groups of atoms: Card, Dialog, Form, etc.
 *
 * @example
 * const meta: Meta<typeof Card> = {
 *   title: 'Core/Card',
 *   component: Card,
 *   ...MOLECULE_META,
 *   parameters: {
 *     ...MOLECULE_META.parameters,
 *     docs: { description: { component: moleculeDescription('Container.') } },
 *   },
 * }
 */
export const MOLECULE_META = {
  tags: ['autodocs'],
  parameters: {
    ...BASE_PARAMETERS,
    layout: 'centered' as const,
  },
}

/**
 * Meta preset for ORGANISM components.
 * ORGANISMs are complex sections: AppHeader, DataTable, etc.
 *
 * @example
 * const meta: Meta<typeof AppHeader> = {
 *   title: 'Shared/AppHeader',
 *   component: AppHeader,
 *   ...ORGANISM_META,
 *   parameters: {
 *     ...ORGANISM_META.parameters,
 *     docs: { description: { component: organismDescription('Header.') } },
 *   },
 * }
 */
export const ORGANISM_META = {
  tags: ['autodocs'],
  parameters: {
    ...BASE_PARAMETERS,
    layout: 'fullscreen' as const,
  },
}

/**
 * Meta preset for TEMPLATE components.
 * TEMPLATEs are page layouts: AppLayoutShell, AuthLayout, etc.
 *
 * @example
 * const meta: Meta<typeof AppLayout> = {
 *   title: 'Templates/AppLayout',
 *   component: AppLayout,
 *   ...TEMPLATE_META,
 *   parameters: {
 *     ...TEMPLATE_META.parameters,
 *     docs: { description: { component: templateDescription('Layout.') } },
 *   },
 * }
 */
export const TEMPLATE_META = {
  tags: ['autodocs'],
  parameters: {
    ...BASE_PARAMETERS,
    layout: 'fullscreen' as const,
  },
}

/**
 * Meta preset for PAGE stories.
 * PAGEs are specific template instances: LoginPage, DashboardHome, etc.
 *
 * @example
 * const meta: Meta<typeof LoginPage> = {
 *   title: 'Pages/Login',
 *   component: LoginPage,
 *   ...PAGE_META,
 *   parameters: {
 *     ...PAGE_META.parameters,
 *     docs: { description: { component: pageDescription('Login.') } },
 *   },
 * }
 */
export const PAGE_META = {
  tags: ['autodocs'],
  parameters: {
    ...BASE_PARAMETERS,
    layout: 'fullscreen' as const,
  },
}

// =============================================================================
// HELPER TYPES
// =============================================================================

/**
 * Story type helper - use with your component's meta.
 *
 * @example
 * const meta: Meta<typeof Button> = { ... }
 * export default meta
 * type Story = StoryOf<typeof Button>
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoryOf<T extends React.ComponentType<any>> = StoryObj<T>
