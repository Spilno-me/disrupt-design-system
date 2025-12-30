/**
 * Search Utilities for Organization Directory
 *
 * Provides unified search across people and locations.
 */

import type { DirectoryPerson, LocationWithPeople, DirectorySearchResult } from '../types'

/**
 * Perform unified search across people and locations
 */
export function searchDirectory(
  query: string,
  people: DirectoryPerson[],
  locations: LocationWithPeople[],
  options: { maxPeople?: number; maxLocations?: number } = {}
): DirectorySearchResult {
  const { maxPeople = 5, maxLocations = 3 } = options

  if (!query || query.trim().length < 2) {
    return {
      people: [],
      locations: [],
      totalPeopleCount: 0,
      totalLocationCount: 0,
    }
  }

  const searchLower = query.toLowerCase().trim()

  // Search people
  const matchedPeople = people.filter((person) => {
    const searchableFields = [
      person.firstName,
      person.lastName,
      `${person.firstName} ${person.lastName}`,
      person.email,
      person.jobTitle,
      person.department,
      person.roleName,
      person.phone || '',
    ]

    return searchableFields.some((field) =>
      field.toLowerCase().includes(searchLower)
    )
  })

  // Search locations (recursive)
  const matchedLocations = searchLocationsRecursive(locations, searchLower)

  return {
    people: matchedPeople.slice(0, maxPeople),
    locations: matchedLocations.slice(0, maxLocations),
    totalPeopleCount: matchedPeople.length,
    totalLocationCount: matchedLocations.length,
  }
}

/**
 * Recursively search locations by name and code
 */
function searchLocationsRecursive(
  locations: LocationWithPeople[],
  searchLower: string
): LocationWithPeople[] {
  const results: LocationWithPeople[] = []

  for (const location of locations) {
    const nameMatch = location.name.toLowerCase().includes(searchLower)
    const codeMatch = location.code?.toLowerCase().includes(searchLower)

    if (nameMatch || codeMatch) {
      results.push(location)
    }

    // Search children
    if (location.children) {
      results.push(...searchLocationsRecursive(location.children, searchLower))
    }
  }

  return results
}

/**
 * Flatten all people from location tree into a single array
 * Deduplicates by person ID
 */
export function flattenAllPeople(
  locations: LocationWithPeople[]
): DirectoryPerson[] {
  const peopleMap = new Map<string, DirectoryPerson>()

  function collectPeople(locs: LocationWithPeople[]) {
    for (const loc of locs) {
      if (loc.people) {
        for (const person of loc.people) {
          if (!peopleMap.has(person.id)) {
            peopleMap.set(person.id, person)
          }
        }
      }
      if (loc.children) {
        collectPeople(loc.children)
      }
    }
  }

  collectPeople(locations)
  return Array.from(peopleMap.values())
}

/**
 * Find the path of location IDs from root to target location
 * Returns array of IDs to expand in tree
 */
export function findLocationPath(
  locations: LocationWithPeople[],
  targetId: string
): string[] {
  function searchPath(
    locs: LocationWithPeople[],
    target: string,
    currentPath: string[]
  ): string[] | null {
    for (const loc of locs) {
      if (loc.id === target) {
        return currentPath
      }
      if (loc.children) {
        const result = searchPath(loc.children, target, [...currentPath, loc.id])
        if (result) return result
      }
    }
    return null
  }

  return searchPath(locations, targetId, []) || []
}

/**
 * Find location containing a specific person
 */
export function findPersonLocation(
  locations: LocationWithPeople[],
  personId: string
): LocationWithPeople | null {
  function search(locs: LocationWithPeople[]): LocationWithPeople | null {
    for (const loc of locs) {
      if (loc.people?.some((p) => p.id === personId)) {
        return loc
      }
      if (loc.children) {
        const found = search(loc.children)
        if (found) return found
      }
    }
    return null
  }

  return search(locations)
}

/**
 * Highlight matching text in a string
 * Returns segments with match flags for rendering
 */
export function highlightMatch(
  text: string,
  query: string
): Array<{ text: string; isMatch: boolean }> {
  if (!query || query.length < 2) {
    return [{ text, isMatch: false }]
  }

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const segments: Array<{ text: string; isMatch: boolean }> = []

  let lastIndex = 0
  let index = lowerText.indexOf(lowerQuery)

  while (index !== -1) {
    // Add non-matching segment before match
    if (index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, index),
        isMatch: false,
      })
    }

    // Add matching segment
    segments.push({
      text: text.slice(index, index + query.length),
      isMatch: true,
    })

    lastIndex = index + query.length
    index = lowerText.indexOf(lowerQuery, lastIndex)
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isMatch: false,
    })
  }

  return segments.length > 0 ? segments : [{ text, isMatch: false }]
}
