/**
 * AI Assistant Components
 *
 * Global floating AI assistant with FAB, quick actions, and chat panel.
 *
 * @example
 * ```tsx
 * import {
 *   AIAssistantProvider,
 *   AIAssistantFab,
 *   AIAssistantPanel,
 *   useAIAssistant
 * } from '@dds/design-system'
 *
 * function App() {
 *   return (
 *     <AIAssistantProvider
 *       onAnalyze={() => console.log('Analyze')}
 *       onSuggest={() => console.log('Suggest')}
 *       onHelp={() => console.log('Help')}
 *     >
 *       <YourApp />
 *       <AIAssistantFab />
 *       <AIAssistantPanel />
 *     </AIAssistantProvider>
 *   )
 * }
 * ```
 */

// Provider and hook
export { AIAssistantProvider, useAIAssistant } from './AIAssistantProvider'

// Components
export { AIAssistantFab } from './AIAssistantFab'
export { AIAssistantPanel } from './AIAssistantPanel'
export { AIAssistantQuickActions } from './AIAssistantQuickActions'

// Types
export type {
  AIAssistantContextValue,
  AIAssistantProviderProps,
  AIAssistantFabProps,
  AIAssistantPanelProps,
  AIAssistantQuickActionsProps,
  LogoState,
  PageContext,
  ContextualAction,
} from './types'
