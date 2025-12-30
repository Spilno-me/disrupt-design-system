/**
 * User Seed Data
 *
 * Re-exports existing mock users from the flow data layer.
 * This ensures a single source of truth while providing
 * a consistent interface for the API layer.
 */

// Import existing mock data
import { mockUsers } from '../../../flow/data/mockUsers'
import type { User } from '../../types/user.types'

/**
 * Seed users for API initialization
 * These are the 58 pre-defined users with various roles and departments.
 */
export const seedUsers: User[] = mockUsers

/**
 * Get all unique departments from seed users
 */
export function getSeedDepartments(): string[] {
  const departments = new Set(seedUsers.map((u) => u.department))
  return Array.from(departments).sort()
}

/**
 * Get all unique job titles from seed users
 */
export function getSeedJobTitles(): string[] {
  const titles = new Set(seedUsers.map((u) => u.jobTitle))
  return Array.from(titles).sort()
}

/**
 * Get user count by status
 */
export function getSeedUserStats(): Record<string, number> {
  return seedUsers.reduce(
    (acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1
      acc.total = (acc.total || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}
