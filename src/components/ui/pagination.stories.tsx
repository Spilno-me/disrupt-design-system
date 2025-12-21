import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  MOLECULE_META,
  moleculeDescription,
} from '@/stories/_infrastructure'
import { IPhoneFrame, IPadFrame } from '@/stories/_infrastructure/device-frames'
import { Pagination } from './Pagination'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof Pagination> = {
  title: 'Shared/Data/Pagination',
  component: Pagination,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          `Comprehensive pagination component with smart ellipsis, page size selector, and keyboard accessibility.

**Features:**
- Page number buttons with smart ellipsis
- Previous/Next navigation
- Optional First/Last page buttons
- Page size selector
- "Showing X-Y of Z results" text
- Loading state support

**Testing:** Use data-slot="pagination", "pagination-button", "pagination-prev", "pagination-next"`
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Pagination>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default pagination with all features enabled.
 * Shows page selector, results text, and first/last buttons.
 */
export const Default: Story = {
  render: function DefaultExample() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <div className="w-full max-w-4xl">
        <Pagination
          currentPage={page}
          totalItems={100}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    )
  },
}

/**
 * Pagination with many pages showing smart ellipsis behavior.
 * Demonstrates how the component handles large datasets.
 */
export const ManyPages: Story = {
  render: function ManyPagesExample() {
    const [page, setPage] = useState(50)
    const [pageSize, setPageSize] = useState(25)

    return (
      <div className="w-full max-w-4xl">
        <Pagination
          currentPage={page}
          totalItems={2500}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    )
  },
}

/**
 * Minimal pagination without page size selector or results text.
 * Use when space is limited or functionality is not needed.
 */
export const Minimal: Story = {
  render: function MinimalExample() {
    const [page, setPage] = useState(5)

    return (
      <div className="w-full max-w-4xl">
        <Pagination
          currentPage={page}
          totalItems={100}
          pageSize={10}
          onPageChange={setPage}
          showPageSizeSelector={false}
          showResultsText={false}
          showFirstLastButtons={false}
        />
      </div>
    )
  },
}

/**
 * Visual reference showing responsive variants.
 * Standard pattern: Mobile (iPhone 16 Pro), Tablet (iPad Pro 11")
 */
export const AllStates: Story = {
  render: function AllStatesExample() {
    const [mobilePage, setMobilePage] = useState(5)
    const [mobilePageSize, setMobilePageSize] = useState(10)
    const [tabletPage, setTabletPage] = useState(5)
    const [tabletPageSize, setTabletPageSize] = useState(10)

    return (
      <div className="flex flex-col gap-16 w-full items-start">
        {/* Mobile - iPhone 16 Pro */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Mobile</h3>
          <p className="text-sm text-secondary mb-4">iPhone 16 Pro (402×874) • 44px touch targets • 5 page buttons max</p>
          <IPhoneFrame model="iphone16pro">
            <div className="flex-1 flex flex-col justify-end px-4 pb-8 bg-page">
              <Pagination
                currentPage={mobilePage}
                totalItems={200}
                pageSize={mobilePageSize}
                onPageChange={setMobilePage}
                onPageSizeChange={setMobilePageSize}
                maxPageButtons={5}
              />
            </div>
          </IPhoneFrame>
        </div>

        {/* Tablet - iPad Pro 11" */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Tablet</h3>
          <p className="text-sm text-secondary mb-4">iPad Pro 11" landscape (1194×834)</p>
          <IPadFrame model="ipadPro11" orientation="landscape">
            <div className="flex-1 flex flex-col justify-end px-8 pb-10 bg-page">
              <Pagination
                currentPage={tabletPage}
                totalItems={200}
                pageSize={tabletPageSize}
                onPageChange={setTabletPage}
                onPageSizeChange={setTabletPageSize}
              />
            </div>
          </IPadFrame>
        </div>
      </div>
    )
  },
}
