import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pagination } from './Pagination'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof Pagination> = {
  title: 'Shared/Data/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `**Type:** ORGANISM

A comprehensive pagination component with smart ellipsis, page size selector, and keyboard accessibility.

## Features
- Page number buttons with smart ellipsis
- Previous/Next navigation
- Optional First/Last page buttons
- Page size selector
- "Showing X-Y of Z results" text
- Keyboard accessible (Tab, Enter, Space)
- Loading state support

## Testing
- Use \`data-slot="pagination"\` to target the root container
- Use \`data-slot="pagination-button"\` for page number buttons
- Use \`data-slot="pagination-prev"\` and \`data-slot="pagination-next"\` for navigation buttons
        `,
      },
    },
  },
  tags: ['autodocs'],
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
 * Visual reference showing all states and configurations.
 * Use this as a reference for testing and visual regression.
 */
export const AllStates: Story = {
  render: function AllStatesExample() {
    const [page1, setPage1] = useState(1)
    const [page2, setPage2] = useState(5)
    const [page3, setPage3] = useState(50)
    const [pageSize, setPageSize] = useState(10)

    return (
      <div className="flex flex-col gap-12 w-full max-w-4xl">
        {/* Anatomy */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Anatomy</h3>
          <div className="space-y-2 text-sm text-secondary mb-4">
            <p>Component type: MOLECULE</p>
            <p>Composed of: Button, Select components</p>
            <p>Testing: Use data-slot attributes for targeting elements</p>
          </div>
        </div>

        {/* First Page */}
        <div>
          <h3 className="text-lg font-semibold mb-4">First Page (Previous/First disabled)</h3>
          <Pagination
            currentPage={page1}
            totalItems={100}
            pageSize={pageSize}
            onPageChange={setPage1}
            onPageSizeChange={setPageSize}
          />
        </div>

        {/* Middle Page */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Middle Page (All buttons enabled)</h3>
          <Pagination
            currentPage={page2}
            totalItems={100}
            pageSize={pageSize}
            onPageChange={setPage2}
            onPageSizeChange={setPageSize}
          />
        </div>

        {/* Last Page */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Last Page (Next/Last disabled)</h3>
          <Pagination
            currentPage={10}
            totalItems={100}
            pageSize={pageSize}
            onPageChange={() => {}}
            onPageSizeChange={setPageSize}
          />
        </div>

        {/* Many Pages with Ellipsis */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Many Pages (Smart ellipsis)</h3>
          <Pagination
            currentPage={page3}
            totalItems={1000}
            pageSize={10}
            onPageChange={setPage3}
            onPageSizeChange={setPageSize}
          />
        </div>

        {/* Few Pages */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Few Pages (No ellipsis)</h3>
          <Pagination
            currentPage={2}
            totalItems={35}
            pageSize={10}
            onPageChange={() => {}}
          />
        </div>

        {/* Loading State */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Loading State (All buttons disabled)</h3>
          <Pagination
            currentPage={5}
            totalItems={100}
            pageSize={10}
            onPageChange={() => {}}
            onPageSizeChange={setPageSize}
            loading
          />
        </div>

        {/* Without Page Size Selector */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Without Page Size Selector</h3>
          <Pagination
            currentPage={3}
            totalItems={100}
            pageSize={10}
            onPageChange={() => {}}
            showPageSizeSelector={false}
          />
        </div>

        {/* Without Results Text */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Without Results Text</h3>
          <Pagination
            currentPage={3}
            totalItems={100}
            pageSize={10}
            onPageChange={() => {}}
            onPageSizeChange={setPageSize}
            showResultsText={false}
          />
        </div>

        {/* Without First/Last Buttons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Without First/Last Buttons</h3>
          <Pagination
            currentPage={5}
            totalItems={100}
            pageSize={10}
            onPageChange={() => {}}
            onPageSizeChange={setPageSize}
            showFirstLastButtons={false}
          />
        </div>

        {/* Custom Results Text */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Custom Results Text</h3>
          <Pagination
            currentPage={1}
            totalItems={156}
            pageSize={10}
            onPageChange={() => {}}
            onPageSizeChange={setPageSize}
            resultsTextFormat={(start, end, total) =>
              `Displaying items ${start}-${end} of ${total} total`
            }
          />
        </div>

        {/* Keyboard Navigation Reference */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Keyboard Navigation</h3>
          <div className="space-y-2 text-sm text-secondary">
            <p><kbd className="px-2 py-1 bg-surface rounded text-xs border">Tab</kbd> - Navigate between buttons</p>
            <p><kbd className="px-2 py-1 bg-surface rounded text-xs border">Enter</kbd> / <kbd className="px-2 py-1 bg-surface rounded text-xs border">Space</kbd> - Activate focused button</p>
            <p><kbd className="px-2 py-1 bg-surface rounded text-xs border">Shift + Tab</kbd> - Navigate backwards</p>
          </div>
        </div>
      </div>
    )
  },
}
