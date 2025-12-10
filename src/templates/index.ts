/**
 * DDS Templates - Pure UI Components for App Building
 *
 * These are presentation-only components. Your app owns:
 * - State management (Zustand, Redux, Context, etc.)
 * - Routing (React Router, Next.js, etc.)
 * - Business logic
 * - API integration
 *
 * @example Basic usage
 * ```tsx
 * import { AppLayoutShell, DashboardPage, LoginPage } from '@disrupt/design-system'
 *
 * function App() {
 *   const { user, isAuthenticated } = useYourAuthStore()
 *   const [page, setPage] = useState('dashboard')
 *
 *   if (!isAuthenticated) {
 *     return <LoginPage product="partner" onLogin={yourLoginHandler} />
 *   }
 *
 *   return (
 *     <AppLayoutShell
 *       product="partner"
 *       navItems={navItems}
 *       user={user}
 *       currentPageId={page}
 *       onPageChange={setPage}
 *     >
 *       {page === 'dashboard' && <DashboardPage kpis={yourKpis} />}
 *     </AppLayoutShell>
 *   )
 * }
 * ```
 *
 * See Storybook "Integration Examples" for complete patterns.
 */

// Layout
export { AppLayoutShell, useAppLayoutState } from './layout/AppLayoutShell'
export type { AppLayoutShellProps, AppNavItem } from './layout/AppLayoutShell'

// Pages
export { DashboardPage } from './pages/DashboardPage'
export type {
  DashboardPageProps,
  KPICardData,
  ActivityItemData,
  QuickActionData,
} from './pages/DashboardPage'

export { PlaceholderPage } from './pages/PlaceholderPage'
export type { PlaceholderPageProps } from './pages/PlaceholderPage'

// Navigation configs (convenience - can use your own)
export {
  partnerNavItems,
  flowNavItems,
  marketNavItems,
} from './navigation/configs'
