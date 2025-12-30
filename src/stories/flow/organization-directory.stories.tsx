/**
 * Organization Directory Stories
 *
 * Location-first directory for browsing employees by location hierarchy.
 * "Location is King" - All people are organized by where they work.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PAGE_META, pageDescription, IPhoneMobileFrame } from '../_infrastructure'
import {
  DirectoryPage,
  DirectoryTree,
  UserProfilePage,
  PersonCard,
  LocationPeoplePanel,
  MobileLocationDirectory,
  createUserProfileData,
  type DirectoryPerson,
  type LocationWithPeople,
  type PeopleByRoleLevel,
  type UserProfileData,
} from '../../flow/components/directory'
import { ROLE_LEVEL_CONFIG, type User, type RoleLevel } from '../../flow/components/users/types'

// =============================================================================
// MOCK DATA - Comprehensive realistic dataset
// Global manufacturing company with EHS operations across 3 regions
// =============================================================================

// Complete unique user database - 58 employees across all locations
const allUsers: Array<{
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarUrl?: string
  jobTitle: string
  department: string
  status: 'active' | 'inactive' | 'pending' | 'locked'
  roleName: string
  roleLevel: RoleLevel
}> = [
  // === CORPORATE HEADQUARTERS (loc-corp-hq) ===
  { id: 'u001', firstName: 'Victoria', lastName: 'Sterling', email: 'v.sterling@globalmanufacturing.com', phone: '+1 312-555-0100', avatarUrl: 'https://i.pravatar.cc/150?u=victoria.sterling', jobTitle: 'Chief Safety Officer', department: 'Executive Leadership', status: 'active', roleName: 'Administrator', roleLevel: 1 },
  { id: 'u002', firstName: 'Richard', lastName: 'Pemberton', email: 'r.pemberton@globalmanufacturing.com', phone: '+1 312-555-0101', avatarUrl: 'https://i.pravatar.cc/150?u=richard.pemberton', jobTitle: 'VP of Environmental Compliance', department: 'Environmental Affairs', status: 'active', roleName: 'Administrator', roleLevel: 1 },
  { id: 'u003', firstName: 'Diana', lastName: 'Nakamura', email: 'd.nakamura@globalmanufacturing.com', phone: '+1 312-555-0102', avatarUrl: 'https://i.pravatar.cc/150?u=diana.nakamura', jobTitle: 'Director of Global EHS Programs', department: 'Environmental Health & Safety', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u004', firstName: 'Marcus', lastName: 'Washington', email: 'm.washington@globalmanufacturing.com', phone: '+1 312-555-0103', avatarUrl: 'https://i.pravatar.cc/150?u=marcus.washington', jobTitle: 'Senior Legal Counsel - EHS', department: 'Legal', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u005', firstName: 'Elena', lastName: 'Kowalski', email: 'e.kowalski@globalmanufacturing.com', phone: '+1 312-555-0104', avatarUrl: 'https://i.pravatar.cc/150?u=elena.kowalski', jobTitle: 'EHS Training Manager', department: 'Human Resources', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },

  // === NORTH AMERICA REGIONAL OFFICE (loc-na-regional) ===
  { id: 'u006', firstName: 'James', lastName: 'O\'Connor', email: 'j.oconnor@globalmanufacturing.com', phone: '+1 312-555-0200', avatarUrl: 'https://i.pravatar.cc/150?u=james.oconnor', jobTitle: 'Regional EHS Director - North America', department: 'Environmental Health & Safety', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u007', firstName: 'Patricia', lastName: 'Mendoza', email: 'p.mendoza@globalmanufacturing.com', phone: '+1 312-555-0201', avatarUrl: 'https://i.pravatar.cc/150?u=patricia.mendoza', jobTitle: 'Regional Safety Coordinator', department: 'Environmental Health & Safety', status: 'active', roleName: 'Investigator', roleLevel: 3 },
  { id: 'u008', firstName: 'William', lastName: 'Thompson', email: 'w.thompson@globalmanufacturing.com', phone: '+1 312-555-0202', avatarUrl: 'https://i.pravatar.cc/150?u=william.thompson', jobTitle: 'Environmental Compliance Analyst', department: 'Environmental Affairs', status: 'active', roleName: 'Investigator', roleLevel: 3 },

  // === CHICAGO MANUFACTURING PLANT (loc-chicago-plant) ===
  { id: 'u009', firstName: 'Robert', lastName: 'Mitchell', email: 'r.mitchell@globalmanufacturing.com', phone: '+1 773-555-0300', avatarUrl: 'https://i.pravatar.cc/150?u=robert.mitchell', jobTitle: 'Plant Manager', department: 'Operations', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u010', firstName: 'Sandra', lastName: 'Reyes', email: 's.reyes@globalmanufacturing.com', phone: '+1 773-555-0301', avatarUrl: 'https://i.pravatar.cc/150?u=sandra.reyes', jobTitle: 'Site Safety Manager', department: 'Environmental Health & Safety', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u011', firstName: 'Kevin', lastName: 'Park', email: 'k.park@globalmanufacturing.com', phone: '+1 773-555-0302', avatarUrl: 'https://i.pravatar.cc/150?u=kevin.park', jobTitle: 'Safety Engineer', department: 'Environmental Health & Safety', status: 'active', roleName: 'Investigator', roleLevel: 3 },
  { id: 'u012', firstName: 'Michelle', lastName: 'Brooks', email: 'm.brooks@globalmanufacturing.com', phone: '+1 773-555-0303', avatarUrl: 'https://i.pravatar.cc/150?u=michelle.brooks', jobTitle: 'Industrial Hygienist', department: 'Environmental Health & Safety', status: 'active', roleName: 'Investigator', roleLevel: 3 },

  // Chicago Plant - Building A (Assembly)
  { id: 'u013', firstName: 'Anthony', lastName: 'Garcia', email: 'a.garcia@globalmanufacturing.com', phone: '+1 773-555-0310', avatarUrl: 'https://i.pravatar.cc/150?u=anthony.garcia', jobTitle: 'Assembly Floor Supervisor', department: 'Operations', status: 'active', roleName: 'Reporter', roleLevel: 4 },
  { id: 'u014', firstName: 'Jennifer', lastName: 'Liu', email: 'j.liu@globalmanufacturing.com', phone: '+1 773-555-0311', avatarUrl: 'https://i.pravatar.cc/150?u=jennifer.liu', jobTitle: 'Quality Control Lead', department: 'Quality Assurance', status: 'pending', roleName: 'Reporter', roleLevel: 4 }, // New hire awaiting training
  { id: 'u015', firstName: 'David', lastName: 'Nguyen', email: 'd.nguyen@globalmanufacturing.com', phone: '+1 773-555-0312', avatarUrl: 'https://i.pravatar.cc/150?u=david.nguyen', jobTitle: 'Assembly Technician', department: 'Operations', status: 'active', roleName: 'Viewer', roleLevel: 5 },
  { id: 'u016', firstName: 'Lisa', lastName: 'Anderson', email: 'l.anderson@globalmanufacturing.com', phone: '+1 773-555-0313', avatarUrl: 'https://i.pravatar.cc/150?u=lisa.anderson', jobTitle: 'Assembly Technician', department: 'Operations', status: 'inactive', roleName: 'Viewer', roleLevel: 5 }, // On leave
  { id: 'u017', firstName: 'Christopher', lastName: 'Brown', email: 'c.brown@globalmanufacturing.com', phone: '+1 773-555-0314', avatarUrl: 'https://i.pravatar.cc/150?u=christopher.brown', jobTitle: 'Equipment Operator', department: 'Operations', status: 'active', roleName: 'Viewer', roleLevel: 5 },

  // Chicago Plant - Building B (Fabrication)
  { id: 'u018', firstName: 'Michael', lastName: 'Johnson', email: 'm.johnson@globalmanufacturing.com', phone: '+1 773-555-0320', avatarUrl: 'https://i.pravatar.cc/150?u=michael.johnson', jobTitle: 'Fabrication Supervisor', department: 'Operations', status: 'active', roleName: 'Reporter', roleLevel: 4 },
  { id: 'u019', firstName: 'Amanda', lastName: 'Taylor', email: 'a.taylor@globalmanufacturing.com', phone: '+1 773-555-0321', avatarUrl: 'https://i.pravatar.cc/150?u=amanda.taylor', jobTitle: 'CNC Machinist Lead', department: 'Operations', status: 'locked', roleName: 'Reporter', roleLevel: 4 }, // Security hold - credential investigation
  { id: 'u020', firstName: 'Jason', lastName: 'Williams', email: 'j.williams@globalmanufacturing.com', phone: '+1 773-555-0322', avatarUrl: 'https://i.pravatar.cc/150?u=jason.williams', jobTitle: 'Welder', department: 'Operations', status: 'pending', roleName: 'Viewer', roleLevel: 5 }, // Completing safety certification
  { id: 'u021', firstName: 'Stephanie', lastName: 'Martinez', email: 's.martinez@globalmanufacturing.com', phone: '+1 773-555-0323', avatarUrl: 'https://i.pravatar.cc/150?u=stephanie.martinez', jobTitle: 'CNC Operator', department: 'Operations', status: 'active', roleName: 'Viewer', roleLevel: 5 },

  // Chicago Plant - Warehouse
  { id: 'u022', firstName: 'Brian', lastName: 'Davis', email: 'b.davis@globalmanufacturing.com', phone: '+1 773-555-0330', avatarUrl: 'https://i.pravatar.cc/150?u=brian.davis', jobTitle: 'Warehouse Manager', department: 'Logistics', status: 'active', roleName: 'Reporter', roleLevel: 4 },
  { id: 'u023', firstName: 'Nicole', lastName: 'Wilson', email: 'n.wilson@globalmanufacturing.com', phone: '+1 773-555-0331', avatarUrl: 'https://i.pravatar.cc/150?u=nicole.wilson', jobTitle: 'Forklift Operator', department: 'Logistics', status: 'active', roleName: 'Viewer', roleLevel: 5 },
  { id: 'u024', firstName: 'Joshua', lastName: 'Moore', email: 'j.moore@globalmanufacturing.com', phone: '+1 773-555-0332', avatarUrl: 'https://i.pravatar.cc/150?u=joshua.moore', jobTitle: 'Shipping Coordinator', department: 'Logistics', status: 'active', roleName: 'Viewer', roleLevel: 5 },

  // === DETROIT AUTOMOTIVE PLANT (loc-detroit-plant) ===
  { id: 'u025', firstName: 'Thomas', lastName: 'Clark', email: 't.clark@globalmanufacturing.com', phone: '+1 313-555-0400', avatarUrl: 'https://i.pravatar.cc/150?u=thomas.clark', jobTitle: 'Plant Director', department: 'Operations', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u026', firstName: 'Rachel', lastName: 'Green', email: 'r.green@globalmanufacturing.com', phone: '+1 313-555-0401', avatarUrl: 'https://i.pravatar.cc/150?u=rachel.green', jobTitle: 'EHS Site Coordinator', department: 'Environmental Health & Safety', status: 'inactive', roleName: 'Investigator', roleLevel: 3 }, // Maternity leave
  { id: 'u027', firstName: 'Daniel', lastName: 'Lewis', email: 'd.lewis@globalmanufacturing.com', phone: '+1 313-555-0402', avatarUrl: 'https://i.pravatar.cc/150?u=daniel.lewis', jobTitle: 'Production Manager', department: 'Operations', status: 'active', roleName: 'Reporter', roleLevel: 4 },
  { id: 'u028', firstName: 'Emily', lastName: 'Hall', email: 'e.hall@globalmanufacturing.com', phone: '+1 313-555-0403', avatarUrl: 'https://i.pravatar.cc/150?u=emily.hall', jobTitle: 'Automotive Assembly Tech', department: 'Operations', status: 'pending', roleName: 'Viewer', roleLevel: 5 }, // Onboarding
  { id: 'u029', firstName: 'Ryan', lastName: 'Young', email: 'r.young@globalmanufacturing.com', phone: '+1 313-555-0404', avatarUrl: 'https://i.pravatar.cc/150?u=ryan.young', jobTitle: 'Paint Line Operator', department: 'Operations', status: 'locked', roleName: 'Viewer', roleLevel: 5 }, // Failed safety test - retaking
  { id: 'u030', firstName: 'Megan', lastName: 'King', email: 'm.king@globalmanufacturing.com', phone: '+1 313-555-0405', avatarUrl: 'https://i.pravatar.cc/150?u=megan.king', jobTitle: 'Quality Inspector', department: 'Quality Assurance', status: 'active', roleName: 'Reporter', roleLevel: 4 },

  // === HOUSTON CHEMICAL FACILITY (loc-houston-facility) ===
  { id: 'u031', firstName: 'Gregory', lastName: 'Scott', email: 'g.scott@globalmanufacturing.com', phone: '+1 713-555-0500', avatarUrl: 'https://i.pravatar.cc/150?u=gregory.scott', jobTitle: 'Facility Manager', department: 'Operations', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u032', firstName: 'Laura', lastName: 'Adams', email: 'l.adams@globalmanufacturing.com', phone: '+1 713-555-0501', avatarUrl: 'https://i.pravatar.cc/150?u=laura.adams', jobTitle: 'Chemical Safety Officer', department: 'Environmental Health & Safety', status: 'active', roleName: 'Investigator', roleLevel: 3 },
  { id: 'u033', firstName: 'Steven', lastName: 'Nelson', email: 's.nelson@globalmanufacturing.com', phone: '+1 713-555-0502', avatarUrl: 'https://i.pravatar.cc/150?u=steven.nelson', jobTitle: 'Process Engineer', department: 'Engineering', status: 'inactive', roleName: 'Reporter', roleLevel: 4 }, // Transferred to another site
  { id: 'u034', firstName: 'Katherine', lastName: 'Hill', email: 'k.hill@globalmanufacturing.com', phone: '+1 713-555-0503', avatarUrl: 'https://i.pravatar.cc/150?u=katherine.hill', jobTitle: 'Lab Technician', department: 'Research & Development', status: 'pending', roleName: 'Viewer', roleLevel: 5 }, // Lab certification in progress
  { id: 'u035', firstName: 'Andrew', lastName: 'Baker', email: 'a.baker@globalmanufacturing.com', phone: '+1 713-555-0504', avatarUrl: 'https://i.pravatar.cc/150?u=andrew.baker', jobTitle: 'Chemical Operator', department: 'Operations', status: 'active', roleName: 'Viewer', roleLevel: 5 },

  // === EUROPE REGIONAL OFFICE - LONDON (loc-eu-regional) ===
  { id: 'u036', firstName: 'Charlotte', lastName: 'Wright', email: 'c.wright@globalmanufacturing.com', phone: '+44 20-7555-0600', avatarUrl: 'https://i.pravatar.cc/150?u=charlotte.wright', jobTitle: 'Regional EHS Director - Europe', department: 'Environmental Health & Safety', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u037', firstName: 'Oliver', lastName: 'Campbell', email: 'o.campbell@globalmanufacturing.com', phone: '+44 20-7555-0601', avatarUrl: 'https://i.pravatar.cc/150?u=oliver.campbell', jobTitle: 'EU Regulatory Compliance Manager', department: 'Legal', status: 'active', roleName: 'Investigator', roleLevel: 3 },
  { id: 'u038', firstName: 'Sophie', lastName: 'Evans', email: 's.evans@globalmanufacturing.com', phone: '+44 20-7555-0602', avatarUrl: 'https://i.pravatar.cc/150?u=sophie.evans', jobTitle: 'Environmental Analyst', department: 'Environmental Affairs', status: 'active', roleName: 'Investigator', roleLevel: 3 },

  // === GERMANY MANUFACTURING - MUNICH (loc-munich-plant) ===
  { id: 'u039', firstName: 'Hans', lastName: 'Mueller', email: 'h.mueller@globalmanufacturing.com', phone: '+49 89-555-0700', avatarUrl: 'https://i.pravatar.cc/150?u=hans.mueller', jobTitle: 'Werksleiter (Plant Manager)', department: 'Operations', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u040', firstName: 'Franziska', lastName: 'Schmidt', email: 'f.schmidt@globalmanufacturing.com', phone: '+49 89-555-0701', avatarUrl: 'https://i.pravatar.cc/150?u=franziska.schmidt', jobTitle: 'Arbeitssicherheit (Safety Specialist)', department: 'Environmental Health & Safety', status: 'locked', roleName: 'Investigator', roleLevel: 3 }, // Account under IT review
  { id: 'u041', firstName: 'Klaus', lastName: 'Weber', email: 'k.weber@globalmanufacturing.com', phone: '+49 89-555-0702', avatarUrl: 'https://i.pravatar.cc/150?u=klaus.weber', jobTitle: 'Production Supervisor', department: 'Operations', status: 'active', roleName: 'Reporter', roleLevel: 4 },
  { id: 'u042', firstName: 'Anna', lastName: 'Fischer', email: 'a.fischer@globalmanufacturing.com', phone: '+49 89-555-0703', avatarUrl: 'https://i.pravatar.cc/150?u=anna.fischer', jobTitle: 'Manufacturing Technician', department: 'Operations', status: 'inactive', roleName: 'Viewer', roleLevel: 5 }, // Sabbatical
  { id: 'u043', firstName: 'Markus', lastName: 'Bauer', email: 'm.bauer@globalmanufacturing.com', phone: '+49 89-555-0704', avatarUrl: 'https://i.pravatar.cc/150?u=markus.bauer', jobTitle: 'Quality Engineer', department: 'Quality Assurance', status: 'active', roleName: 'Reporter', roleLevel: 4 },

  // === ASIA-PACIFIC REGIONAL OFFICE - SINGAPORE (loc-apac-regional) ===
  { id: 'u044', firstName: 'Wei', lastName: 'Chen', email: 'w.chen@globalmanufacturing.com', phone: '+65 6555-0800', avatarUrl: 'https://i.pravatar.cc/150?u=wei.chen', jobTitle: 'Regional EHS Director - Asia Pacific', department: 'Environmental Health & Safety', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u045', firstName: 'Priya', lastName: 'Sharma', email: 'p.sharma@globalmanufacturing.com', phone: '+65 6555-0801', avatarUrl: 'https://i.pravatar.cc/150?u=priya.sharma', jobTitle: 'APAC Safety Coordinator', department: 'Environmental Health & Safety', status: 'active', roleName: 'Investigator', roleLevel: 3 },
  { id: 'u046', firstName: 'Tan', lastName: 'Ming Hui', email: 't.minghui@globalmanufacturing.com', phone: '+65 6555-0802', avatarUrl: 'https://i.pravatar.cc/150?u=tan.minghui', jobTitle: 'Regional Compliance Officer', department: 'Legal', status: 'active', roleName: 'Investigator', roleLevel: 3 },

  // === CHINA MANUFACTURING - SHANGHAI (loc-shanghai-plant) ===
  { id: 'u047', firstName: 'Li', lastName: 'Jun', email: 'l.jun@globalmanufacturing.com', phone: '+86 21-5555-0900', avatarUrl: 'https://i.pravatar.cc/150?u=li.jun', jobTitle: 'Plant General Manager', department: 'Operations', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u048', firstName: 'Zhang', lastName: 'Mei', email: 'z.mei@globalmanufacturing.com', phone: '+86 21-5555-0901', avatarUrl: 'https://i.pravatar.cc/150?u=zhang.mei', jobTitle: 'Safety Manager', department: 'Environmental Health & Safety', status: 'active', roleName: 'Investigator', roleLevel: 3 },
  { id: 'u049', firstName: 'Wang', lastName: 'Fang', email: 'w.fang@globalmanufacturing.com', phone: '+86 21-5555-0902', avatarUrl: 'https://i.pravatar.cc/150?u=wang.fang', jobTitle: 'Production Line Manager', department: 'Operations', status: 'active', roleName: 'Reporter', roleLevel: 4 },
  { id: 'u050', firstName: 'Chen', lastName: 'Xiao', email: 'c.xiao@globalmanufacturing.com', phone: '+86 21-5555-0903', avatarUrl: 'https://i.pravatar.cc/150?u=chen.xiao', jobTitle: 'Assembly Worker', department: 'Operations', status: 'active', roleName: 'Viewer', roleLevel: 5 },
  { id: 'u051', firstName: 'Liu', lastName: 'Yang', email: 'l.yang@globalmanufacturing.com', phone: '+86 21-5555-0904', avatarUrl: 'https://i.pravatar.cc/150?u=liu.yang', jobTitle: 'Maintenance Technician', department: 'Maintenance', status: 'active', roleName: 'Viewer', roleLevel: 5 },

  // === JAPAN FACILITY - OSAKA (loc-osaka-facility) ===
  { id: 'u052', firstName: 'Kenji', lastName: 'Tanaka', email: 'k.tanaka@globalmanufacturing.com', phone: '+81 6-5555-1000', avatarUrl: 'https://i.pravatar.cc/150?u=kenji.tanaka', jobTitle: 'Facility Director', department: 'Operations', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
  { id: 'u053', firstName: 'Yuki', lastName: 'Yamamoto', email: 'y.yamamoto@globalmanufacturing.com', phone: '+81 6-5555-1001', avatarUrl: 'https://i.pravatar.cc/150?u=yuki.yamamoto', jobTitle: 'EHS Specialist', department: 'Environmental Health & Safety', status: 'active', roleName: 'Investigator', roleLevel: 3 },
  { id: 'u054', firstName: 'Takeshi', lastName: 'Watanabe', email: 't.watanabe@globalmanufacturing.com', phone: '+81 6-5555-1002', avatarUrl: 'https://i.pravatar.cc/150?u=takeshi.watanabe', jobTitle: 'Production Coordinator', department: 'Operations', status: 'active', roleName: 'Reporter', roleLevel: 4 },
  { id: 'u055', firstName: 'Sakura', lastName: 'Suzuki', email: 's.suzuki@globalmanufacturing.com', phone: '+81 6-5555-1003', avatarUrl: 'https://i.pravatar.cc/150?u=sakura.suzuki', jobTitle: 'Quality Control Analyst', department: 'Quality Assurance', status: 'active', roleName: 'Reporter', roleLevel: 4 },
  { id: 'u056', firstName: 'Hiroshi', lastName: 'Sato', email: 'h.sato@globalmanufacturing.com', phone: '+81 6-5555-1004', avatarUrl: 'https://i.pravatar.cc/150?u=hiroshi.sato', jobTitle: 'Machine Operator', department: 'Operations', status: 'active', roleName: 'Viewer', roleLevel: 5 },

  // === SUPPORT STAFF (distributed) ===
  { id: 'u057', firstName: 'Carlos', lastName: 'Rivera', email: 'c.rivera@globalmanufacturing.com', phone: '+1 312-555-0150', avatarUrl: 'https://i.pravatar.cc/150?u=carlos.rivera', jobTitle: 'IT Security Administrator', department: 'Information Technology', status: 'active', roleName: 'Administrator', roleLevel: 1 },
  { id: 'u058', firstName: 'Isabella', lastName: 'Romano', email: 'i.romano@globalmanufacturing.com', phone: '+1 312-555-0151', avatarUrl: 'https://i.pravatar.cc/150?u=isabella.romano', jobTitle: 'HR Business Partner - EHS', department: 'Human Resources', status: 'active', roleName: 'EHS Manager', roleLevel: 2 },
]

// Helper to create DirectoryPerson from user
const toDirectoryPerson = (
  user: typeof allUsers[0],
  assignmentType: 'direct' | 'inherited' = 'direct',
  isPrimaryLocation: boolean = true,
  inheritedFrom?: string
): DirectoryPerson => ({
  ...user,
  assignmentType,
  isPrimaryLocation,
  inheritedFrom,
})

// Helper to get users by IDs
const getUsersByIds = (ids: string[], assignmentType: 'direct' | 'inherited' = 'direct', inheritedFrom?: string): DirectoryPerson[] =>
  ids.map(id => {
    const user = allUsers.find(u => u.id === id)!
    return toDirectoryPerson(user, assignmentType, assignmentType === 'direct', inheritedFrom)
  })

// Type for location before count calculation
type RawLocation = {
  id: string
  name: string
  type: LocationWithPeople['type']
  code: string
  parentId?: string
  people: DirectoryPerson[]
  directUserCount: number
  children?: RawLocation[]
}

/**
 * Helper to calculate inherited user counts recursively
 * This ensures the counts are accurate based on actual children
 */
function calculateLocationCounts(location: RawLocation): LocationWithPeople {
  // First, recursively process all children
  const processedChildren = location.children?.map(child => calculateLocationCounts(child))

  // Calculate inherited count from all children (their total = their direct + their inherited)
  const inheritedUserCount = processedChildren?.reduce((sum, child) => sum + child.totalUserCount, 0) ?? 0

  // Total = direct + all inherited from children
  const totalUserCount = location.directUserCount + inheritedUserCount

  return {
    ...location,
    inheritedUserCount,
    totalUserCount,
    children: processedChildren,
  } as LocationWithPeople
}

// =============================================================================
// LOCATION → USER MAPPING (Source of Truth)
// Each location has specific users directly assigned to it
// =============================================================================

const locationUserMapping: Record<string, string[]> = {
  // Corporate HQ - Executive & support staff
  'loc-corp-hq': ['u001', 'u002', 'u003', 'u004', 'u005', 'u057', 'u058'],

  // North America Regional - Regional leadership
  'loc-na-regional': ['u006', 'u007', 'u008'],

  // Chicago Plant - Plant-level management
  'loc-chicago-plant': ['u009', 'u010', 'u011', 'u012'],

  // Chicago Buildings - Workers in each building
  'loc-chicago-bldg-a': ['u013', 'u014', 'u015', 'u016', 'u017'],
  'loc-chicago-bldg-b': ['u018', 'u019', 'u020', 'u021'],
  'loc-chicago-warehouse': ['u022', 'u023', 'u024'],

  // Detroit Plant - All plant staff (no sub-buildings)
  'loc-detroit-plant': ['u025', 'u026', 'u027', 'u028', 'u029', 'u030'],

  // Houston Facility - All facility staff (no sub-buildings)
  'loc-houston-facility': ['u031', 'u032', 'u033', 'u034', 'u035'],

  // Europe Regional - Regional leadership
  'loc-eu-regional': ['u036', 'u037', 'u038'],

  // Munich Plant - All plant staff
  'loc-munich-plant': ['u039', 'u040', 'u041', 'u042', 'u043'],

  // Asia-Pacific Regional - Regional leadership
  'loc-apac-regional': ['u044', 'u045', 'u046'],

  // Shanghai Plant - All plant staff
  'loc-shanghai-plant': ['u047', 'u048', 'u049', 'u050', 'u051'],

  // Osaka Facility - All facility staff
  'loc-osaka-facility': ['u052', 'u053', 'u054', 'u055', 'u056'],
}

// Helper to build a location node with proper user assignment
function buildLocation(
  id: string,
  name: string,
  type: LocationWithPeople['type'],
  code: string,
  parentId?: string,
  children?: RawLocation[]
): RawLocation {
  const userIds = locationUserMapping[id] || []
  return {
    id,
    name,
    type,
    code,
    parentId,
    people: getUsersByIds(userIds),
    directUserCount: userIds.length,
    children,
  }
}

// Build the location hierarchy using helper functions
// Counts are calculated automatically from children
// Using valid LocationType: 'facility' | 'department' | 'zone' | 'building' | 'floor' | 'area' | 'equipment'
const rawLocationHierarchy = [
  buildLocation('loc-corp-hq', 'Corporate Headquarters', 'facility', 'CORP-HQ', undefined, [
    // === NORTH AMERICA ===
    buildLocation('loc-na-regional', 'North America Region', 'zone', 'NA-REG', 'loc-corp-hq', [
      buildLocation('loc-chicago-plant', 'Chicago Manufacturing Plant', 'facility', 'CHI-MFG', 'loc-na-regional', [
        buildLocation('loc-chicago-bldg-a', 'Building A - Assembly', 'building', 'CHI-A', 'loc-chicago-plant'),
        buildLocation('loc-chicago-bldg-b', 'Building B - Fabrication', 'building', 'CHI-B', 'loc-chicago-plant'),
        buildLocation('loc-chicago-warehouse', 'Warehouse & Distribution', 'building', 'CHI-WH', 'loc-chicago-plant'),
      ]),
      buildLocation('loc-detroit-plant', 'Detroit Automotive Plant', 'facility', 'DET-AUTO', 'loc-na-regional'),
      buildLocation('loc-houston-facility', 'Houston Chemical Facility', 'facility', 'HOU-CHEM', 'loc-na-regional'),
    ]),
    // === EUROPE ===
    buildLocation('loc-eu-regional', 'Europe Region', 'zone', 'EU-REG', 'loc-corp-hq', [
      buildLocation('loc-munich-plant', 'Munich Manufacturing', 'facility', 'MUC-MFG', 'loc-eu-regional'),
    ]),
    // === ASIA-PACIFIC ===
    buildLocation('loc-apac-regional', 'Asia-Pacific Region', 'zone', 'APAC-REG', 'loc-corp-hq', [
      buildLocation('loc-shanghai-plant', 'Shanghai Manufacturing', 'facility', 'SHA-MFG', 'loc-apac-regional'),
      buildLocation('loc-osaka-facility', 'Osaka Precision Facility', 'facility', 'OSA-PREC', 'loc-apac-regional'),
    ]),
  ]),
]

// Calculate inherited counts recursively - this makes counts accurate!
const mockLocationsWithPeople: LocationWithPeople[] = rawLocationHierarchy.map(loc => calculateLocationCounts(loc))

// Combined flat list for stories that need it
const mockDirectoryPeople: DirectoryPerson[] = allUsers.map((u) => toDirectoryPerson(u))

// Mock user for profile page (Victoria Sterling - CSO)
const mockUserForProfile: User = {
  id: 'u001',
  email: 'v.sterling@globalmanufacturing.com',
  firstName: 'Victoria',
  lastName: 'Sterling',
  phone: '+1 312-555-0100',
  avatarUrl: 'https://i.pravatar.cc/150?u=victoria.sterling',
  jobTitle: 'Chief Safety Officer',
  department: 'Executive Leadership',
  bio: 'Over 20 years of experience in environmental health and safety leadership across global manufacturing operations. Board Certified Safety Professional (CSP) with expertise in developing world-class safety cultures and implementing enterprise-wide EHS management systems.',
  status: 'active',
  createdAt: '2020-03-15T10:00:00Z',
  lastLoginAt: '2025-01-10T08:30:00Z',
  officeLocation: 'Corporate HQ, Executive Floor, Suite 2100',
  workingHours: '7:00 AM - 6:00 PM',
  timezone: 'America/Chicago',
  isEmergencyContact: true,
  teamsEmail: 'v.sterling@globalmanufacturing.onmicrosoft.com',
  slackHandle: 'vsterling',
  roleAssignments: [
    {
      id: 'ra-1',
      role: {
        id: 'role-admin',
        name: 'Administrator',
        description: 'Full system access with all permissions',
        permissions: [
          { id: 'p1', resource: 'incidents', actions: ['create', 'read', 'update', 'delete'] },
          { id: 'p2', resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
          { id: 'p3', resource: 'reports', actions: ['create', 'read'] },
        ],
        isSystem: true,
        userCount: 3,
        level: 1,
      },
      scopes: [
        {
          id: 'scope-1',
          locationId: 'loc-corp-hq',
          locationName: 'Corporate Headquarters',
          locationPath: ['Corporate Headquarters'],
          includeChildren: true,
        },
      ],
      assignedAt: '2020-03-15T10:00:00Z',
      assignedBy: 'System',
    },
  ],
}

const mockUserProfile = createUserProfileData(mockUserForProfile)

// =============================================================================
// STORY META
// =============================================================================

const meta: Meta<typeof DirectoryPage> = {
  title: 'Flow/Organization Directory',
  component: DirectoryPage,
  parameters: {
    ...PAGE_META,
    docs: {
      description: {
        component: pageDescription(`
# Organization Directory

Location-first directory for browsing employees by location hierarchy. "Location is King" - All people are organized by where they work.

## Features
- Browse employees by location hierarchy (tree view)
- See who manages/works at each location
- Full user profiles with contact info
- Direct [D] vs Inherited [I] user distinction
- Search people across all locations
- Global company structure: Corporate HQ → Regions → Sites → Buildings
        `),
      },
    },
  },
}

export default meta

// =============================================================================
// STORIES
// =============================================================================

/**
 * Full directory page with two-panel layout
 */
export const DirectoryPageStory: StoryObj<typeof DirectoryPage> = {
  name: 'Directory Page',
  render: () => (
    <div className="h-[700px] border border-default rounded-lg overflow-hidden">
      <DirectoryPage
        locations={mockLocationsWithPeople}
        users={[]}
        roles={[]}
        departments={[
          'Executive Leadership',
          'Environmental Health & Safety',
          'Environmental Affairs',
          'Operations',
          'Legal',
          'Human Resources',
          'Quality Assurance',
          'Logistics',
          'Engineering',
          'Research & Development',
          'Information Technology',
          'Maintenance',
        ]}
        onViewProfile={(userId) => console.log('View profile:', userId)}
        onRefresh={() => console.log('Refreshing directory...')}
      />
    </div>
  ),
}

/**
 * Directory tree component in isolation
 */
export const DirectoryTreeStory: StoryObj<typeof DirectoryTree> = {
  name: 'Directory Tree',
  render: () => {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['loc-corp-hq', 'loc-na-regional']))
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    return (
      <div className="h-[600px] w-[400px] border border-default rounded-lg overflow-hidden">
        <DirectoryTree
          locations={mockLocationsWithPeople}
          expandedIds={expandedIds}
          selectedLocationId={selectedId}
          searchValue={search}
          showInherited={true}
          onLocationSelect={setSelectedId}
          onToggleExpand={(id) => {
            setExpandedIds(prev => {
              const next = new Set(prev)
              if (next.has(id)) next.delete(id)
              else next.add(id)
              return next
            })
          }}
          onPersonClick={(person) => console.log('Person clicked:', person)}
          onSearchChange={setSearch}
        />
      </div>
    )
  },
}

/**
 * Person card variants
 */
export const PersonCardStory: StoryObj<typeof PersonCard> = {
  name: 'Person Card',
  render: () => (
    <div className="space-y-6 max-w-lg">
      <div>
        <h3 className="text-sm font-medium text-secondary mb-2">Compact Variant (List)</h3>
        <div className="space-y-1 border border-default rounded-lg p-2">
          {mockDirectoryPeople.slice(0, 5).map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              variant="compact"
              onClick={() => console.log('Clicked:', person.firstName)}
              onEmail={(email) => console.log('Email:', email)}
              onCall={(phone) => console.log('Call:', phone)}
              onViewProfile={(id) => console.log('Profile:', id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-secondary mb-2">Full Variant (Detail)</h3>
        <div className="space-y-3">
          <PersonCard
            person={mockDirectoryPeople[0]}
            variant="full"
            onClick={() => console.log('Clicked')}
            onEmail={(email) => console.log('Email:', email)}
            onCall={(phone) => console.log('Call:', phone)}
            onViewProfile={(id) => console.log('Profile:', id)}
          />
          <PersonCard
            person={mockDirectoryPeople[8]}
            variant="full"
            onClick={() => console.log('Clicked')}
            onEmail={(email) => console.log('Email:', email)}
            onViewProfile={(id) => console.log('Profile:', id)}
          />
        </div>
      </div>
    </div>
  ),
}

/**
 * Location people panel (right side of desktop)
 */
export const LocationPeoplePanelStory: StoryObj<typeof LocationPeoplePanel> = {
  name: 'Location People Panel',
  render: () => {
    const [showInherited, setShowInherited] = useState(true)

    // Get Chicago plant people for demo
    const chicagoLocation = mockLocationsWithPeople[0].children![0].children![0]
    const chicagoPeople = [...(chicagoLocation.people || [])]

    // Add people from child buildings
    chicagoLocation.children?.forEach(building => {
      if (building.people) {
        chicagoPeople.push(...building.people)
      }
    })

    const peopleByLevel: PeopleByRoleLevel[] = ([1, 2, 3, 4, 5] as RoleLevel[]).map((level) => ({
      level,
      label: ROLE_LEVEL_CONFIG[level].label,
      description: ROLE_LEVEL_CONFIG[level].description,
      badgeVariant: ROLE_LEVEL_CONFIG[level].badgeVariant,
      iconColor: ROLE_LEVEL_CONFIG[level].iconColor,
      people: chicagoPeople.filter((p) => p.roleLevel === level),
    })).filter((g) => g.people.length > 0)

    return (
      <div className="h-[600px] w-[500px] border border-default rounded-lg overflow-hidden">
        <LocationPeoplePanel
          location={chicagoLocation}
          peopleByLevel={peopleByLevel}
          showInherited={showInherited}
          onToggleInherited={setShowInherited}
          onPersonClick={(person) => console.log('Person clicked:', person)}
          onViewProfile={(id) => console.log('View profile:', id)}
        />
      </div>
    )
  },
}

/**
 * Full user profile page
 */
export const UserProfileStory: StoryObj<typeof UserProfilePage> = {
  name: 'User Profile Page',
  render: () => (
    <div className="h-screen border border-default rounded-lg overflow-y-auto">
      <UserProfilePage
        profile={mockUserProfile}
        onBack={() => console.log('Back')}
        onEmail={(email) => console.log('Email:', email)}
        onCall={(phone) => console.log('Call:', phone)}
        onTeamsChat={(email) => console.log('Teams:', email)}
        onSlackChat={(handle) => console.log('Slack:', handle)}
      />
    </div>
  ),
}

/**
 * Mobile directory with drill-down navigation
 */
export const MobileDirectoryStory: StoryObj<typeof MobileLocationDirectory> = {
  name: 'Mobile Directory',
  render: () => (
    <IPhoneMobileFrame>
      <MobileLocationDirectory
        locations={mockLocationsWithPeople}
        onViewProfile={(id) => console.log('View profile:', id)}
        onEmail={(email) => console.log('Email:', email)}
        onCall={(phone) => console.log('Call:', phone)}
      />
    </IPhoneMobileFrame>
  ),
}
