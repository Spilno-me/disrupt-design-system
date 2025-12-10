/**
 * Mock Data Utilities for DDS Product Prototypes
 *
 * Provides sample data and simulation utilities for Storybook prototypes.
 */

import { UserInfo, UserMenuItem } from '../ui/AppHeader'

// =============================================================================
// USER DATA
// =============================================================================

export const mockPartnerUser: UserInfo = {
  name: 'John Partner',
  email: 'john@partnercompany.com',
  initials: 'JP',
}

export const mockFlowUser: UserInfo = {
  name: 'Sarah Safety',
  email: 'sarah@company.com',
  initials: 'SS',
}

export const mockMarketUser: UserInfo = {
  name: 'Mike Market',
  email: 'mike@marketplace.com',
  initials: 'MM',
}

export const mockUsers = {
  partner: mockPartnerUser,
  flow: mockFlowUser,
  market: mockMarketUser,
} as const

// =============================================================================
// MENU ITEMS
// =============================================================================

export const defaultUserMenuItems: UserMenuItem[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
  { id: 'logout', label: 'Log out', destructive: true, separator: true },
]

// =============================================================================
// NOTIFICATION DATA
// =============================================================================

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'New lead assigned',
    message: 'Lisa Chen from Novacorp Industries has been assigned to you.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Invoice paid',
    message: 'Global Manufacturing has paid invoice INV-2025-0928.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Tenant request pending',
    message: 'Fine Goods Corp is awaiting payment verification.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '4',
    type: 'error',
    title: 'Invoice overdue',
    message: 'Startup Ventures Co. invoice is 30 days overdue.',
    timestamp: '3 days ago',
    read: true,
  },
]

// =============================================================================
// ACTIVITY DATA
// =============================================================================

export interface ActivityItem {
  id: string
  type: 'lead' | 'invoice' | 'tenant' | 'partner' | 'incident' | 'inspection'
  action: string
  subject: string
  details?: string
  timestamp: string
  icon?: 'clock' | 'check' | 'alert' | 'zap' | 'user' | 'file'
}

export const mockRecentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'lead',
    action: 'New lead from website',
    subject: 'Lisa Chen - Novacorp Industries',
    timestamp: '2h ago',
    icon: 'clock',
  },
  {
    id: '2',
    type: 'invoice',
    action: 'Invoice paid',
    subject: 'Global Manufacturing - $150,000',
    timestamp: '1d ago',
    icon: 'check',
  },
  {
    id: '3',
    type: 'tenant',
    action: 'Tenant provisioned',
    subject: 'Fine Goods corp. - 670 users',
    timestamp: '2d ago',
    icon: 'zap',
  },
  {
    id: '4',
    type: 'partner',
    action: 'Partner activated',
    subject: 'Apex Manufacturing',
    timestamp: '3d ago',
    icon: 'user',
  },
]

// =============================================================================
// KPI DATA
// =============================================================================

export interface KPIData {
  label: string
  value: string | number
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  suffix?: string
}

export const mockPartnerKPIs: KPIData[] = [
  { label: 'Total Revenue', value: '$1.2M', trend: '+12%', trendDirection: 'up' },
  { label: 'Active Partners', value: 24, trend: '+3', trendDirection: 'up' },
  { label: 'Open Leads', value: 18, trend: '-2', trendDirection: 'down' },
  { label: 'Pending Invoices', value: '$45K', trend: '1 overdue', trendDirection: 'neutral' },
]

export const mockFlowKPIs: KPIData[] = [
  { label: 'Open Incidents', value: 12, trend: '-3', trendDirection: 'up' },
  { label: 'Due Inspections', value: 5, trend: '+2', trendDirection: 'down' },
  { label: 'Compliance Rate', value: '94%', trend: '+2%', trendDirection: 'up' },
  { label: 'Open Tasks', value: 28, trend: '-5', trendDirection: 'up' },
]

export const mockMarketKPIs: KPIData[] = [
  { label: 'Products Viewed', value: 156, trend: '+23', trendDirection: 'up' },
  { label: 'Cart Value', value: '$2,450', trend: '+$500', trendDirection: 'up' },
  { label: 'Pending Orders', value: 3, trend: '+1', trendDirection: 'neutral' },
  { label: 'Saved Items', value: 12, trend: '+4', trendDirection: 'up' },
]

// =============================================================================
// SIMULATION UTILITIES
// =============================================================================

/**
 * Simulate an async action with optional delay
 */
export function simulateAction<T>(
  action: string,
  data?: T,
  delay: number = 500
): Promise<T | undefined> {
  console.log(`[Simulation] ${action}`, data)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, delay)
  })
}

/**
 * Simulate a network request
 */
export function simulateRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: unknown,
  delay: number = 800
): Promise<T> {
  console.log(`[Simulation] ${method} ${endpoint}`, data)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional failures (5% chance)
      if (Math.random() < 0.05) {
        reject(new Error('Simulated network error'))
      } else {
        resolve(data as T)
      }
    }, delay)
  })
}

/**
 * Create a toast/alert message for prototype actions
 */
export function prototypeAlert(
  action: string,
  details?: string
): void {
  const message = details ? `${action}\n\n${details}` : action
  alert(`[Prototype Action]\n\n${message}`)
}

/**
 * Log a prototype action to console
 */
export function prototypeLog(
  action: string,
  data?: unknown
): void {
  console.log(`[Prototype] ${action}`, data ?? '')
}

// =============================================================================
// RANDOM DATA GENERATORS
// =============================================================================

const firstNames = ['John', 'Sarah', 'Mike', 'Lisa', 'David', 'Emma', 'James', 'Anna']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Chen', 'Garcia', 'Miller', 'Davis']
const companies = ['Acme Corp', 'Tech Solutions', 'Global Industries', 'First Enterprise', 'Nova Systems']

/**
 * Generate a random name
 */
export function randomName(): string {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)]
  const last = lastNames[Math.floor(Math.random() * lastNames.length)]
  return `${first} ${last}`
}

/**
 * Generate a random company name
 */
export function randomCompany(): string {
  return companies[Math.floor(Math.random() * companies.length)]
}

/**
 * Generate a random ID
 */
export function randomId(prefix: string = 'ID'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
}

/**
 * Generate a random amount
 */
export function randomAmount(min: number = 1000, max: number = 100000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
