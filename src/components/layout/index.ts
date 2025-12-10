// Layout components
export { PageLayout, type PageLayoutProps } from './PageLayout'
export { Footer, type FooterProps } from './Footer'

// Mock data utilities (for Storybook demos)
export {
  mockUsers,
  mockPartnerUser,
  mockFlowUser,
  mockMarketUser,
  defaultUserMenuItems,
  mockNotifications,
  mockRecentActivity,
  mockPartnerKPIs,
  mockFlowKPIs,
  mockMarketKPIs,
  simulateAction,
  simulateRequest,
  prototypeAlert,
  prototypeLog,
  randomName,
  randomCompany,
  randomId,
  randomAmount,
  type Notification,
  type ActivityItem,
  type KPIData,
} from './mock-data'

// NOTE: AppLayoutShell and navigation configs moved to src/templates/
