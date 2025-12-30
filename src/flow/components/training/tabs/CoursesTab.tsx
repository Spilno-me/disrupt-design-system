/**
 * CoursesTab - Training courses catalog tab
 *
 * Displays all training courses in a filterable grid with
 * quick filters by status and search functionality.
 *
 * @example
 * ```tsx
 * <CoursesTab
 *   courses={courses}
 *   onCourseCreate={handleCreate}
 *   onCourseUpdate={handleUpdate}
 * />
 * ```
 */

import * as React from 'react'
import { Search, Plus } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { QuickFilter, QuickFilterItem } from '../../../../components/ui/QuickFilter'
import { CourseCard } from '../cards/CourseCard'
import type {
  TrainingCourse,
  CourseStatus,
  CourseQuickFilter,
  CoursesTabProps,
} from '../types'

// =============================================================================
// QUICK FILTER CONFIG
// =============================================================================

const QUICK_FILTERS: Array<{
  id: CourseQuickFilter
  label: string
  variant?: 'default' | 'info' | 'warning' | 'primary'
}> = [
  { id: 'all', label: 'All Courses' },
  { id: 'active', label: 'Active', variant: 'info' },
  { id: 'draft', label: 'Draft', variant: 'warning' },
  { id: 'archived', label: 'Archived', variant: 'default' },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function CoursesTab({
  courses,
  isLoading = false,
  onCourseCreate,
  onCourseUpdate,
  onCourseDelete,
  onCourseArchive,
}: CoursesTabProps) {
  const [activeFilter, setActiveFilter] = React.useState<CourseQuickFilter>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  // Filter courses
  const filteredCourses = React.useMemo(() => {
    let result = courses

    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter((course) => course.status === activeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return result
  }, [courses, activeFilter, searchQuery])

  // Calculate counts for filters
  const counts = React.useMemo(() => {
    return {
      all: courses.length,
      active: courses.filter((c) => c.status === 'active').length,
      draft: courses.filter((c) => c.status === 'draft').length,
      archived: courses.filter((c) => c.status === 'archived').length,
    }
  }, [courses])

  return (
    <div data-slot="courses-tab" className="space-y-6">
      {/* Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Quick Filters */}
        <QuickFilter fullBleed className="sm:w-auto">
          {QUICK_FILTERS.map((filter) => (
            <QuickFilterItem
              key={filter.id}
              label={filter.label}
              selected={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
              count={counts[filter.id]}
              variant={filter.variant}
              size="xs"
            />
          ))}
        </QuickFilter>

        {/* Search + Add */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-tertiary" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {onCourseCreate && (
            <Button onClick={() => onCourseCreate({} as any)} className="gap-1.5">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add Course</span>
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-secondary">
        {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
        {activeFilter !== 'all' && ` (${activeFilter})`}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-muted-bg/50 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-16 rounded-full bg-muted-bg flex items-center justify-center mb-4">
            <Search className="size-8 text-tertiary" />
          </div>
          <h3 className="text-lg font-medium text-primary mb-1">No courses found</h3>
          <p className="text-sm text-secondary max-w-sm">
            {searchQuery
              ? `No courses match "${searchQuery}". Try adjusting your search.`
              : 'No courses in this category. Add a new course to get started.'}
          </p>
          {onCourseCreate && !searchQuery && (
            <Button onClick={() => onCourseCreate({} as any)} className="mt-4 gap-1.5">
              <Plus className="size-4" />
              Add Course
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              showActions
              onView={() => console.log('View', course.id)}
              onEdit={onCourseUpdate ? () => console.log('Edit', course.id) : undefined}
              onArchive={onCourseArchive ? () => onCourseArchive(course.id) : undefined}
              onDelete={onCourseDelete ? () => onCourseDelete(course.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

CoursesTab.displayName = 'CoursesTab'

export default CoursesTab
