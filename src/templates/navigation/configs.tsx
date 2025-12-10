/**
 * Pre-built Navigation Configurations
 *
 * Convenience configs for common DDS products.
 * You can use these directly or create your own navItems array.
 */

import * as React from 'react'
import {
  LayoutDashboard,
  Users,
  Zap,
  ClipboardList,
  FileText,
  Building2,
  Network,
  DollarSign,
  Settings,
  AlertTriangle,
  ClipboardCheck,
  FileCheck,
  Calendar,
  BarChart3,
  Shield,
  Search,
  ShoppingCart,
  Package,
  Star,
  MessageSquare,
  Bookmark,
} from 'lucide-react'
import type { NavItem } from '../../components/ui/navigation'
import { addBadges as addBadgesUtil } from '../../components/ui/navigation'

// Re-export NavItem for convenience
export type { NavItem }

// Re-export addBadges utility
export const addBadges = addBadgesUtil

// =============================================================================
// PARTNER PORTAL NAVIGATION
// =============================================================================

export const partnerNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    href: '/dashboard',
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: <Users />,
    href: '/leads',
  },
  {
    id: 'tenant-provisioning',
    label: 'Tenant Provisioning',
    icon: <Zap />,
    href: '/tenant-provisioning',
  },
  {
    id: 'tenant-requests',
    label: 'Tenant Requests',
    icon: <ClipboardList />,
    href: '/tenant-requests',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: <FileText />,
    href: '/invoices',
  },
  {
    id: 'partners',
    label: 'Partners',
    icon: <Building2 />,
    href: '/partners',
  },
  {
    id: 'partner-network',
    label: 'Partner Network',
    icon: <Network />,
    href: '/partner-network',
  },
  {
    id: 'pricing-calculator',
    label: 'Pricing Calculator',
    icon: <DollarSign />,
    href: '/pricing-calculator',
  },
]

// =============================================================================
// FLOW APP NAVIGATION
// =============================================================================

export const flowNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    href: '/dashboard',
  },
  {
    id: 'incidents',
    label: 'Incidents',
    icon: <AlertTriangle />,
    href: '/incidents',
  },
  {
    id: 'inspections',
    label: 'Inspections',
    icon: <ClipboardCheck />,
    href: '/inspections',
  },
  {
    id: 'permits',
    label: 'Permits',
    icon: <FileCheck />,
    href: '/permits',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: <ClipboardList />,
    href: '/tasks',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: <Calendar />,
    href: '/calendar',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <BarChart3 />,
    href: '/reports',
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: <Shield />,
    href: '/compliance',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings />,
    href: '/settings',
  },
]

// =============================================================================
// MARKET APP NAVIGATION
// =============================================================================

export const marketNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    href: '/dashboard',
  },
  {
    id: 'browse',
    label: 'Browse',
    icon: <Search />,
    href: '/browse',
  },
  {
    id: 'cart',
    label: 'Cart',
    icon: <ShoppingCart />,
    href: '/cart',
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: <Package />,
    href: '/orders',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: <Star />,
    href: '/favorites',
  },
  {
    id: 'saved',
    label: 'Saved',
    icon: <Bookmark />,
    href: '/saved',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: <MessageSquare />,
    href: '/messages',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings />,
    href: '/settings',
  },
]

