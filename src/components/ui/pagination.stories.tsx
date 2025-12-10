import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pagination } from './Pagination'

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof Pagination> = {
  title: 'Core/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A comprehensive pagination component with:
- Page number buttons with smart ellipsis
- Previous/Next navigation
- Optional First/Last page buttons
- Page size selector
- "Showing X-Y of Z results" text
- Keyboard accessible
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Current page (1-indexed)',
    },
    totalItems: {
      control: { type: 'number', min: 0 },
      description: 'Total number of items',
    },
    pageSize: {
      control: { type: 'number', min: 1 },
      description: 'Number of items per page',
    },
    showPageSizeSelector: {
      control: 'boolean',
      description: 'Whether to show page size selector',
    },
    showResultsText: {
      control: 'boolean',
      description: 'Whether to show results text',
    },
    showFirstLastButtons: {
      control: 'boolean',
      description: 'Whether to show first/last page buttons',
    },
  },
}

export default meta
type Story = StoryObj<typeof Pagination>

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  render: function DefaultExample() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={100}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    )
  },
}

export const FewPages: Story = {
  render: function FewPagesExample() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={35}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    )
  },
}

export const ManyPages: Story = {
  render: function ManyPagesExample() {
    const [page, setPage] = useState(50)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={1000}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    )
  },
}

export const ThousandsOfItems: Story = {
  render: function ThousandsExample() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)

    return (
      <div className="w-[600px]">
        <Pagination
          currentPage={page}
          totalItems={12543}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          showPageSizeSelector
          showResultsText
        />
      </div>
    )
  },
}

export const WithoutPageSizeSelector: Story = {
  render: function NoSelectorExample() {
    const [page, setPage] = useState(1)

    return (
      <Pagination
        currentPage={page}
        totalItems={100}
        pageSize={10}
        onPageChange={setPage}
        showPageSizeSelector={false}
      />
    )
  },
}

export const WithoutResultsText: Story = {
  render: function NoResultsTextExample() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={100}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        showResultsText={false}
      />
    )
  },
}

export const WithoutFirstLastButtons: Story = {
  render: function NoFirstLastExample() {
    const [page, setPage] = useState(5)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={100}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        showFirstLastButtons={false}
      />
    )
  },
}

export const Compact: Story = {
  render: function CompactExample() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={100}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        compact
      />
    )
  },
}

export const Loading: Story = {
  render: function LoadingExample() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={100}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading
      />
    )
  },
}

export const CustomResultsText: Story = {
  render: function CustomResultsExample() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={156}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        resultsTextFormat={(start, end, total) =>
          `Displaying leads ${start} to ${end} (${total} total)`
        }
      />
    )
  },
}

export const OnFirstPage: Story = {
  render: function FirstPageExample() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={100}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    )
  },
}

export const OnLastPage: Story = {
  render: function LastPageExample() {
    const [page, setPage] = useState(10)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={100}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    )
  },
}

export const SinglePage: Story = {
  render: function SinglePageExample() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <Pagination
        currentPage={page}
        totalItems={5}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    )
  },
}

export const EmptyResults: Story = {
  render: function EmptyExample() {
    return (
      <Pagination
        currentPage={1}
        totalItems={0}
        pageSize={10}
        onPageChange={() => {}}
      />
    )
  },
}
