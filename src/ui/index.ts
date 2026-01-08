/**
 * UI Primitives - Core UI components for building interfaces
 *
 * This subpath export provides granular access to UI primitives,
 * enabling better tree-shaking for consuming applications.
 *
 * @usage
 * ```tsx
 * import { Button, Input, Card } from '@adrozdenko/design-system/ui'
 * ```
 *
 * @module ui
 */

// =============================================================================
// BUTTONS & ACTIONS
// =============================================================================

export { Button, buttonVariants } from '../components/ui/button'
export { SplitButton, splitButtonVariants } from '../components/shared/SplitButton'
export type { SplitButtonProps } from '../components/shared/SplitButton'

// =============================================================================
// FORM INPUTS
// =============================================================================

export { Input } from '../components/ui/input'
export { Textarea } from '../components/ui/textarea'
export { Checkbox } from '../components/ui/checkbox'
export { Switch } from '../components/ui/switch'
export type { SwitchProps } from '../components/ui/switch'
export { Slider } from '../components/ui/Slider'
export type { SliderProps } from '../components/ui/Slider'
export { Label } from '../components/ui/label'
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

// =============================================================================
// FORM SYSTEM (react-hook-form integration)
// =============================================================================

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '../components/ui/form'

// =============================================================================
// CARDS & CONTAINERS
// =============================================================================

export {
  Card,
  cardVariants,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/card'
export type { CardProps } from '../components/ui/card'

export {
  AppCard,
  appCardVariants,
  AppCardHeader,
  AppCardTitle,
  AppCardDescription,
  AppCardContent,
  AppCardFooter,
  AppCardAction,
} from '../components/ui/app-card'
export type { AppCardProps } from '../components/ui/app-card'

// =============================================================================
// OVERLAYS & DIALOGS
// =============================================================================

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from '../components/ui/dialog'

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '../components/ui/sheet'

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../components/ui/tooltip'

// =============================================================================
// MENUS & DROPDOWNS
// =============================================================================

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '../components/ui/dropdown-menu'

export {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetSeparator,
  ActionSheetLabel,
} from '../components/ui/ActionSheet'
export type {
  ActionSheetProps,
  ActionSheetTriggerProps,
  ActionSheetContentProps,
  ActionSheetItemProps,
  ActionSheetSeparatorProps,
  ActionSheetLabelProps,
} from '../components/ui/ActionSheet'

export {
  ResponsiveActionMenu,
  ResponsiveActionMenuTrigger,
  ResponsiveActionMenuContent,
  ResponsiveActionMenuItem,
  ResponsiveActionMenuSeparator,
  ResponsiveActionMenuLabel,
} from '../components/ui/ResponsiveActionMenu'
export type {
  ResponsiveActionMenuProps,
  ResponsiveActionMenuTriggerProps,
  ResponsiveActionMenuContentProps,
  ResponsiveActionMenuItemProps,
  ResponsiveActionMenuSeparatorProps,
  ResponsiveActionMenuLabelProps,
} from '../components/ui/ResponsiveActionMenu'

// =============================================================================
// NAVIGATION & TABS
// =============================================================================

export { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from '../components/ui/tabs'

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants, toggleGroupItemVariants } from '../components/ui/toggle-group'
export type { ToggleGroupProps, ToggleGroupItemProps } from '../components/ui/toggle-group'

// =============================================================================
// DATA DISPLAY
// =============================================================================

export { Badge, badgeVariants } from '../components/ui/badge'
export { Separator } from '../components/ui/separator'
export { Avatar, AvatarImage, AvatarFallback, avatarVariants } from '../components/ui/avatar'

export {
  Accordion,
  AccordionRoot,
  AccordionItemPrimitive,
  AccordionTrigger,
  AccordionContent,
  AccordionHeader,
} from '../components/ui/Accordion'
export type { AccordionProps, AccordionItem } from '../components/ui/Accordion'

export { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../components/ui/collapsible'

// =============================================================================
// DATA TABLE
// =============================================================================

export { DataTable } from '../components/ui/DataTable'
export type { DataTableProps, ColumnDef, SortDirection, RowPriority } from '../components/ui/DataTable'
export { Pagination } from '../components/ui/Pagination'
export type { PaginationProps } from '../components/ui/Pagination'
export { RowActions } from '../components/ui/RowActions'
export type { RowActionsProps, RowAction } from '../components/ui/RowActions'
export { ScrollableTableWrapper } from '../components/ui/ScrollableTableWrapper'

// =============================================================================
// FEEDBACK & STATUS
// =============================================================================

export { Skeleton, SkeletonImage, SkeletonText } from '../components/ui/Skeleton'
export { Toaster, toast } from '../components/ui/sonner'
export { ErrorState, errorStateVariants } from '../components/ui/ErrorState'
export type { ErrorStateProps } from '../components/ui/ErrorState'
export { EmptyState } from '../components/ui/EmptyState'
export type { EmptyStateProps, EmptyStateVariant } from '../components/ui/EmptyState'
export { SeverityIndicator } from '../components/ui/SeverityIndicator'
export type { SeverityIndicatorProps, SeverityLevel } from '../components/ui/SeverityIndicator'

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

export { CopyButton } from '../components/ui/CopyButton'
export type { CopyButtonProps } from '../components/ui/CopyButton'
export { TruncatedId } from '../components/ui/TruncatedId'
export type { TruncatedIdProps } from '../components/ui/TruncatedId'
export { StepIndicator } from '../components/ui/StepIndicator'
export type { StepIndicatorProps, Step as StepIndicatorStep } from '../components/ui/StepIndicator'
