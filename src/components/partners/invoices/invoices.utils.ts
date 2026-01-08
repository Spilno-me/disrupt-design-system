import type { FilterState } from '../../shared/SearchFilter/types'
import type { SortDirection } from '../../ui/DataTable'
import type { Invoice } from './types'

// =============================================================================
// SORTING UTILITIES
// =============================================================================

type SortableValue = string | number | null

function getSortValue(invoice: Invoice, column: string): SortableValue {
  switch (column) {
    case 'invoiceNumber':
      return invoice.invoiceNumber
    case 'company':
      return invoice.company.name.toLowerCase()
    case 'total':
      return invoice.total
    case 'status':
      return invoice.status
    case 'dates':
      return new Date(invoice.dueDate).getTime()
    default:
      return null
  }
}

function compareValues(a: SortableValue, b: SortableValue): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  }
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Sort invoices by column and direction
 */
export function sortInvoices(
  invoices: Invoice[],
  column: string | null,
  direction: SortDirection
): Invoice[] {
  if (!column || !direction) return invoices

  return [...invoices].sort((a, b) => {
    const valueA = getSortValue(a, column)
    const valueB = getSortValue(b, column)
    const comparison = compareValues(valueA, valueB)
    return direction === 'desc' ? -comparison : comparison
  })
}

// =============================================================================
// FILTERING UTILITIES
// =============================================================================

function matchesSearch(invoice: Invoice, searchLower: string): boolean {
  return (
    invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
    invoice.company.name.toLowerCase().includes(searchLower) ||
    (invoice.description?.toLowerCase().includes(searchLower) ?? false)
  )
}

/**
 * Filter invoices by search value and filter state
 */
export function filterInvoices(
  invoices: Invoice[],
  searchValue: string,
  filters: FilterState
): Invoice[] {
  return invoices.filter((invoice) => {
    if (searchValue && !matchesSearch(invoice, searchValue.toLowerCase())) {
      return false
    }
    if (filters.status.length > 0 && !filters.status.includes(invoice.status)) {
      return false
    }
    if (filters.terms.length > 0 && !filters.terms.includes(invoice.paymentTerms)) {
      return false
    }
    return true
  })
}

// =============================================================================
// PAGINATION UTILITIES
// =============================================================================

/**
 * Paginate an array of items
 */
export function paginateItems<T>(items: T[], currentPage: number, pageSize: number): T[] {
  const startIndex = (currentPage - 1) * pageSize
  return items.slice(startIndex, startIndex + pageSize)
}
