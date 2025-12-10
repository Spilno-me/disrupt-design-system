/** Single filter option */
export interface FilterOption {
  /** Unique identifier for the option */
  id: string
  /** Display label */
  label: string
}

/** Group of filter options */
export interface FilterGroup {
  /** Unique key for the group (used in state) */
  key: string
  /** Display label for the group */
  label: string
  /** Available options in this group */
  options: FilterOption[]
}

/** Generic filter state - Record of group keys to selected option IDs */
export type FilterState = Record<string, string[]>
