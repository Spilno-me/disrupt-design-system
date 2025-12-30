/**
 * Training Management Stories
 *
 * Demonstrates the Training Management module for EHS compliance tracking.
 * Includes course catalog, requirements configuration, and compliance dashboard.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { GraduationCap } from 'lucide-react'
import { PAGE_META, pageDescription, IPhoneMobileFrame } from '../_infrastructure'
import { TrainingPage } from '../../flow/components/training'
import {
  mockTrainingCourses,
  mockTrainingPackages,
  mockTrainingRequirements,
  mockUserCompliance,
  mockTrainingStats,
  mockRoles,
} from '../../flow/data'

// =============================================================================
// MOCK LOCATIONS (simplified for training)
// =============================================================================

const mockLocationTree = [
  {
    id: 'loc-corp',
    label: 'Corporate HQ',
    level: 0,
    children: [
      { id: 'loc-plant-a', label: 'Plant A - Chicago', level: 1 },
      { id: 'loc-plant-b', label: 'Plant B - Detroit', level: 1 },
      { id: 'loc-warehouse', label: 'Warehouse', level: 1 },
    ],
  },
]

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof TrainingPage> = {
  title: 'Flow/Training Management',
  component: TrainingPage,
  parameters: {
    ...PAGE_META,
    docs: {
      description: {
        component: pageDescription([
          'Training Management module for EHS compliance tracking.',
          '',
          '**Features:**',
          '- Track employee training requirements and completions',
          '- Manage training course catalog with categories and delivery methods',
          '- Configure requirements by role, location, or training package',
          '- Monitor organization-wide compliance status',
          '- View expiring certifications and non-compliant users',
        ].join('\n')),
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TrainingPage>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default training management page with all tabs.
 * Shows course catalog, requirements, and compliance dashboard.
 */
export const Default: Story = {
  args: {
    courses: mockTrainingCourses,
    packages: mockTrainingPackages,
    requirements: mockTrainingRequirements,
    stats: mockTrainingStats,
    userCompliance: mockUserCompliance,
    roles: mockRoles,
    locations: mockLocationTree,
  },
  render: (args) => (
    <div className="min-h-screen bg-background">
      <TrainingPage {...args} />
    </div>
  ),
}

/**
 * Courses tab focused view.
 * Shows all training courses in a filterable grid.
 */
export const CoursesView: Story = {
  args: {
    courses: mockTrainingCourses,
    packages: mockTrainingPackages,
    requirements: mockTrainingRequirements,
    stats: mockTrainingStats,
    userCompliance: mockUserCompliance,
    roles: mockRoles,
    locations: mockLocationTree,
  },
  render: (args) => (
    <div className="min-h-screen bg-background">
      <TrainingPage {...args} />
    </div>
  ),
}

/**
 * Mobile responsive view.
 * Shows how the training page adapts to mobile screens.
 */
export const MobileView: Story = {
  args: {
    courses: mockTrainingCourses,
    packages: mockTrainingPackages,
    requirements: mockTrainingRequirements,
    stats: mockTrainingStats,
    userCompliance: mockUserCompliance,
    roles: mockRoles,
    locations: mockLocationTree,
  },
  render: (args) => (
    <IPhoneMobileFrame>
      <TrainingPage {...args} />
    </IPhoneMobileFrame>
  ),
}

/**
 * Loading state.
 * Shows skeleton loading indicators while data is being fetched.
 */
export const Loading: Story = {
  args: {
    courses: [],
    packages: [],
    requirements: [],
    userCompliance: [],
    roles: [],
    locations: [],
    isLoading: true,
  },
  render: (args) => (
    <div className="min-h-screen bg-background">
      <TrainingPage {...args} />
    </div>
  ),
}

/**
 * Empty state.
 * Shows when no courses are configured yet.
 */
export const Empty: Story = {
  args: {
    courses: [],
    packages: [],
    requirements: [],
    userCompliance: [],
    roles: mockRoles,
    locations: mockLocationTree,
  },
  render: (args) => (
    <div className="min-h-screen bg-background">
      <TrainingPage {...args} />
    </div>
  ),
}

/**
 * High compliance scenario.
 * Shows an organization with excellent training compliance.
 */
export const HighCompliance: Story = {
  args: {
    courses: mockTrainingCourses,
    packages: mockTrainingPackages,
    requirements: mockTrainingRequirements,
    stats: {
      ...mockTrainingStats,
      compliance: {
        totalUsers: 58,
        compliantUsers: 55,
        expiringSoonUsers: 3,
        nonCompliantUsers: 0,
        overallPercentage: 95,
      },
    },
    userCompliance: mockUserCompliance.map((u, i) => ({
      ...u,
      overallStatus: i < 55 ? 'compliant' : 'expiring_soon',
    })),
    roles: mockRoles,
    locations: mockLocationTree,
  },
  render: (args) => (
    <div className="min-h-screen bg-background">
      <TrainingPage {...args} />
    </div>
  ),
}

/**
 * Low compliance scenario.
 * Shows an organization with training compliance issues.
 */
export const LowCompliance: Story = {
  args: {
    courses: mockTrainingCourses,
    packages: mockTrainingPackages,
    requirements: mockTrainingRequirements,
    stats: {
      ...mockTrainingStats,
      compliance: {
        totalUsers: 58,
        compliantUsers: 30,
        expiringSoonUsers: 8,
        nonCompliantUsers: 20,
        overallPercentage: 52,
      },
    },
    userCompliance: mockUserCompliance.map((u, i) => ({
      ...u,
      overallStatus: i < 30 ? 'compliant' : i < 38 ? 'expiring_soon' : 'non_compliant',
    })),
    roles: mockRoles,
    locations: mockLocationTree,
  },
  render: (args) => (
    <div className="min-h-screen bg-background">
      <TrainingPage {...args} />
    </div>
  ),
}
