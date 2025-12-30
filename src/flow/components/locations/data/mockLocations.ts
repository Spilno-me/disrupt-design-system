/**
 * Mock Location Data
 *
 * SINGLE SOURCE OF TRUTH for location hierarchy used by:
 * - LocationsPage (location management)
 * - DirectoryPage (organization directory)
 * - Flow Dashboard stories
 *
 * Hierarchy: Facility > Building > Floor > Area > Equipment
 * Each location can have assigned users via mockLocationUsers map.
 */

import type { Location } from '../types'

// =============================================================================
// CORPORATE HEADQUARTERS - Deep hierarchy with equipment
// =============================================================================

export const mockLocations: Location[] = [
  {
    id: 'loc-corp',
    name: 'Corporate HQ',
    type: 'facility',
    code: 'HQ-001',
    description: 'Main corporate headquarters with EHS oversight for all facilities',
    address: '100 Corporate Center, New York, NY 10001',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
    parentId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-08-01T00:00:00Z',
    children: [
      {
        id: 'loc-admin-building',
        name: 'Administration Building',
        type: 'building',
        code: 'HQ-ADMIN',
        description: 'Executive offices and administration',
        timezone: 'America/New_York',
        parentId: 'loc-corp',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-01T00:00:00Z',
        children: [
          {
            id: 'loc-admin-floor-1',
            name: 'Floor 1 - Reception',
            type: 'floor',
            code: 'HQ-ADMIN-F1',
            description: 'Reception and visitor services',
            timezone: 'America/New_York',
            parentId: 'loc-admin-building',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-08-01T00:00:00Z',
          },
          {
            id: 'loc-ehs-office',
            name: 'Floor 2 - EHS Office',
            type: 'floor',
            code: 'HQ-ADMIN-F2',
            description: 'Environmental Health & Safety department',
            timezone: 'America/New_York',
            parentId: 'loc-admin-building',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-08-01T00:00:00Z',
          },
        ],
      },
    ],
  },
  // =============================================================================
  // PLANT A - CHICAGO - Full manufacturing hierarchy with equipment
  // =============================================================================
  {
    id: 'loc-plant-a',
    name: 'Plant A - Chicago',
    type: 'facility',
    code: 'PLANT-A',
    description: 'Primary manufacturing facility for production operations',
    address: '500 Industrial Boulevard, Chicago, IL 60601',
    latitude: 41.8781,
    longitude: -87.6298,
    timezone: 'America/Chicago',
    parentId: null,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T14:30:00Z',
    children: [
      {
        id: 'loc-production-building',
        name: 'Production Building',
        type: 'building',
        code: 'PLANT-A-PROD',
        description: 'Main production and assembly building',
        timezone: 'America/Chicago',
        parentId: 'loc-plant-a',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-06-01T14:30:00Z',
        children: [
          {
            id: 'loc-production-floor-a',
            name: 'Production Floor A',
            type: 'floor',
            code: 'PLANT-A-PROD-FA',
            description: 'Assembly line operations',
            timezone: 'America/Chicago',
            parentId: 'loc-production-building',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-06-01T14:30:00Z',
            children: [
              {
                id: 'loc-assembly-zone-a',
                name: 'Assembly Zone A',
                type: 'area',
                code: 'PLANT-A-AZ-A',
                description: 'Primary assembly workstations',
                timezone: 'America/Chicago',
                parentId: 'loc-production-floor-a',
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-06-01T14:30:00Z',
                children: [
                  {
                    id: 'loc-robot-1',
                    name: 'Welding Robot #1',
                    type: 'equipment',
                    code: 'WR-001',
                    description: 'Automated welding station',
                    timezone: 'America/Chicago',
                    parentId: 'loc-assembly-zone-a',
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-06-01T14:30:00Z',
                  },
                  {
                    id: 'loc-robot-2',
                    name: 'Welding Robot #2',
                    type: 'equipment',
                    code: 'WR-002',
                    description: 'Automated welding station',
                    timezone: 'America/Chicago',
                    parentId: 'loc-assembly-zone-a',
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-06-01T14:30:00Z',
                  },
                  {
                    id: 'loc-press-1',
                    name: 'Hydraulic Press #1',
                    type: 'equipment',
                    code: 'HP-001',
                    description: '200-ton hydraulic press',
                    timezone: 'America/Chicago',
                    parentId: 'loc-assembly-zone-a',
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-06-01T14:30:00Z',
                  },
                ],
              },
              {
                id: 'loc-qa-zone',
                name: 'Quality Assurance Zone',
                type: 'area',
                code: 'PLANT-A-QA',
                description: 'Quality control and testing area',
                timezone: 'America/Chicago',
                parentId: 'loc-production-floor-a',
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-06-01T14:30:00Z',
                children: [
                  {
                    id: 'loc-cmm-1',
                    name: 'CMM Machine #1',
                    type: 'equipment',
                    code: 'CMM-001',
                    description: 'Coordinate measuring machine',
                    timezone: 'America/Chicago',
                    parentId: 'loc-qa-zone',
                    createdAt: '2024-01-15T10:00:00Z',
                    updatedAt: '2024-06-01T14:30:00Z',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'loc-warehouse-1',
        name: 'Warehouse 1',
        type: 'building',
        code: 'PLANT-A-WH1',
        description: 'Raw materials and finished goods storage',
        timezone: 'America/Chicago',
        parentId: 'loc-plant-a',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-06-01T14:30:00Z',
        children: [
          {
            id: 'loc-wh-raw',
            name: 'Raw Materials Section',
            type: 'area',
            code: 'PLANT-A-WH1-RAW',
            description: 'Incoming raw materials storage',
            timezone: 'America/Chicago',
            parentId: 'loc-warehouse-1',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-06-01T14:30:00Z',
            children: [
              {
                id: 'loc-forklift-1',
                name: 'Forklift FL-001',
                type: 'equipment',
                code: 'FL-001',
                description: 'Electric forklift - 5000 lb capacity',
                timezone: 'America/Chicago',
                parentId: 'loc-wh-raw',
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-06-01T14:30:00Z',
              },
              {
                id: 'loc-forklift-2',
                name: 'Forklift FL-002',
                type: 'equipment',
                code: 'FL-002',
                description: 'Electric forklift - 5000 lb capacity',
                timezone: 'America/Chicago',
                parentId: 'loc-wh-raw',
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-06-01T14:30:00Z',
              },
            ],
          },
          {
            id: 'loc-warehouse-2',
            name: 'Warehouse 2 (Finished Goods)',
            type: 'area',
            code: 'PLANT-A-WH2',
            description: 'Outbound finished products',
            timezone: 'America/Chicago',
            parentId: 'loc-warehouse-1',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-06-01T14:30:00Z',
          },
        ],
      },
    ],
  },
  // =============================================================================
  // PLANT B - DETROIT - Distribution center with production floor
  // =============================================================================
  {
    id: 'loc-plant-b',
    name: 'Plant B - Detroit',
    type: 'facility',
    code: 'PLANT-B',
    description: 'Distribution and logistics center',
    address: '789 Commerce Drive, Detroit, MI 48201',
    latitude: 42.3314,
    longitude: -83.0458,
    timezone: 'America/Detroit',
    parentId: null,
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-07-15T11:00:00Z',
    children: [
      {
        id: 'loc-production-1',
        name: 'Production Floor 1',
        type: 'building',
        code: 'PLANT-B-PF1',
        description: 'Main production and assembly floor',
        timezone: 'America/Detroit',
        parentId: 'loc-plant-b',
        createdAt: '2024-02-20T09:00:00Z',
        updatedAt: '2024-07-15T11:00:00Z',
        children: [
          {
            id: 'loc-production-1-line-a',
            name: 'Assembly Line A',
            type: 'area',
            code: 'PLANT-B-PF1-LA',
            description: 'Primary assembly line',
            timezone: 'America/Detroit',
            parentId: 'loc-production-1',
            createdAt: '2024-02-20T09:00:00Z',
            updatedAt: '2024-07-15T11:00:00Z',
            children: [
              {
                id: 'loc-cnc-1',
                name: 'CNC Machine #1',
                type: 'equipment',
                code: 'CNC-001',
                description: 'Computer numerical control machine',
                timezone: 'America/Detroit',
                parentId: 'loc-production-1-line-a',
                createdAt: '2024-02-20T09:00:00Z',
                updatedAt: '2024-07-15T11:00:00Z',
              },
              {
                id: 'loc-lathe-1',
                name: 'Industrial Lathe #1',
                type: 'equipment',
                code: 'LATHE-001',
                description: 'Heavy-duty industrial lathe',
                timezone: 'America/Detroit',
                parentId: 'loc-production-1-line-a',
                createdAt: '2024-02-20T09:00:00Z',
                updatedAt: '2024-07-15T11:00:00Z',
              },
            ],
          },
        ],
      },
      {
        id: 'loc-dock',
        name: 'Loading Dock',
        type: 'building',
        code: 'PLANT-B-DOCK',
        description: 'Shipping and receiving area',
        timezone: 'America/Detroit',
        parentId: 'loc-plant-b',
        createdAt: '2024-02-20T09:00:00Z',
        updatedAt: '2024-07-15T11:00:00Z',
        children: [
          {
            id: 'loc-dock-bay-1',
            name: 'Dock Bay 1',
            type: 'area',
            code: 'PLANT-B-D1',
            description: 'Inbound receiving bay',
            timezone: 'America/Detroit',
            parentId: 'loc-dock',
            createdAt: '2024-02-20T09:00:00Z',
            updatedAt: '2024-07-15T11:00:00Z',
            children: [
              {
                id: 'loc-conveyor-1',
                name: 'Conveyor System #1',
                type: 'equipment',
                code: 'CONV-001',
                description: 'Automated conveyor belt system',
                timezone: 'America/Detroit',
                parentId: 'loc-dock-bay-1',
                createdAt: '2024-02-20T09:00:00Z',
                updatedAt: '2024-07-15T11:00:00Z',
              },
            ],
          },
          {
            id: 'loc-dock-bay-2',
            name: 'Dock Bay 2',
            type: 'area',
            code: 'PLANT-B-D2',
            description: 'Outbound shipping bay',
            timezone: 'America/Detroit',
            parentId: 'loc-dock',
            createdAt: '2024-02-20T09:00:00Z',
            updatedAt: '2024-07-15T11:00:00Z',
          },
        ],
      },
    ],
  },
]

// =============================================================================
// USER-LOCATION ASSIGNMENTS (for Directory integration)
// Maps location IDs to arrays of user IDs with assignment metadata
// =============================================================================

export interface UserLocationAssignment {
  userId: string
  locationId: string
  roleId: string
  isPrimary: boolean
  includeChildren: boolean
}

/**
 * Mock user-location assignments
 * This data is used by Directory to determine who works where.
 * Must match location IDs from mockLocations and user role scopes in mockUsers.
 */
export const mockUserLocationAssignments: UserLocationAssignment[] = [
  // Corporate HQ - Executive leadership (includeChildren = cascades to all plants)
  { userId: 'user-1', locationId: 'loc-corp', roleId: 'role-admin', isPrimary: true, includeChildren: true },
  { userId: 'user-7', locationId: 'loc-corp', roleId: 'role-viewer', isPrimary: true, includeChildren: false },
  { userId: 'user-10', locationId: 'loc-corp', roleId: 'role-manager', isPrimary: true, includeChildren: true },

  // Plant A - Site leadership (includeChildren = cascades to warehouse & production)
  { userId: 'user-2', locationId: 'loc-plant-a', roleId: 'role-manager', isPrimary: true, includeChildren: true },
  { userId: 'user-3', locationId: 'loc-plant-a', roleId: 'role-investigator', isPrimary: true, includeChildren: false },
  { userId: 'user-9', locationId: 'loc-plant-a', roleId: 'role-investigator', isPrimary: true, includeChildren: true },

  // Plant A - Warehouse (specific location)
  { userId: 'user-11', locationId: 'loc-warehouse-1', roleId: 'role-reporter', isPrimary: true, includeChildren: false },

  // Plant B - Site leadership
  { userId: 'user-3', locationId: 'loc-plant-b', roleId: 'role-investigator', isPrimary: false, includeChildren: false },
  { userId: 'user-8', locationId: 'loc-plant-b', roleId: 'role-reporter', isPrimary: true, includeChildren: false },

  // Plant B - Production Floor 1 (equipment operators)
  { userId: 'user-4', locationId: 'loc-production-1', roleId: 'role-reporter', isPrimary: true, includeChildren: false },
]

// =============================================================================
// HELPER: Get all location IDs (flat list)
// =============================================================================

export function getAllLocationIds(locations: Location[]): string[] {
  return locations.flatMap((loc) => [
    loc.id,
    ...(loc.children ? getAllLocationIds(loc.children) : []),
  ])
}

// =============================================================================
// LEGACY EXPORTS (backwards compatibility)
// =============================================================================

/**
 * Extended mock data (now just an alias to mockLocations)
 * @deprecated Use mockLocations directly
 */
export const mockLocationsExtended: Location[] = mockLocations

/**
 * Empty locations array for empty state testing
 */
export const emptyLocations: Location[] = []
