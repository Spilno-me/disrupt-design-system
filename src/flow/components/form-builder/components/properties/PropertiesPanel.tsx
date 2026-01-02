/**
 * PropertiesPanel - Right panel for Configuration
 *
 * Contains Form Structure tree view and Field Properties editor.
 * Uses tabbed interface with DDS glass styling.
 *
 * @component MOLECULE
 */

import * as React from 'react';
import { Settings, PanelRightClose, PanelRight, List, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FormStructureTree } from './FormStructureTree';
import { FieldPropertiesPanel } from './FieldPropertiesPanel';
import { useFormBuilder } from '../../context';

// =============================================================================
// TYPES
// =============================================================================

export interface PropertiesPanelProps {
  /** Whether the panel is collapsed */
  isCollapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PropertiesPanel({
  isCollapsed = false,
  onCollapsedChange,
  className,
}: PropertiesPanelProps) {
  const { selectedFieldPath } = useFormBuilder();
  const hasSelection = Boolean(selectedFieldPath);

  return (
    <aside
      data-slot="properties-panel"
      data-testid="properties-panel"
      className={cn(
        // Glass panel (Depth 2)
        'flex flex-col rounded-xl',
        'bg-white/40 dark:bg-black/40 backdrop-blur-[4px]',
        'border-2 border-accent shadow-md',
        // Responsive width
        isCollapsed ? 'w-16' : 'w-80',
        'transition-all duration-300',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center gap-3 border-b border-default px-4 py-3',
          isCollapsed && 'justify-center px-2'
        )}
      >
        {/* Collapse toggle (left side when collapsed) */}
        {isCollapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCollapsedChange?.(!isCollapsed)}
                aria-label="Expand panel"
                className="size-8"
              >
                <PanelRight className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Expand panel</TooltipContent>
          </Tooltip>
        )}

        {/* Icon (when expanded) */}
        {!isCollapsed && (
          <>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted-bg">
              <Settings className="size-5 text-accent" />
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-primary">
                Configuration Panel
              </h2>
              <p className="text-xs text-secondary">
                {hasSelection ? 'Edit field properties' : 'Form structure'}
              </p>
            </div>

            {/* Collapse toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCollapsedChange?.(!isCollapsed)}
                  aria-label="Collapse panel"
                  className="size-8 shrink-0"
                >
                  <PanelRightClose className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Collapse panel</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>

      {/* Content */}
      {isCollapsed ? (
        // Collapsed mode: icon buttons for quick access
        <div className="flex flex-col items-center gap-2 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-10"
                onClick={() => onCollapsedChange?.(false)}
              >
                <List className="size-5 text-secondary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Form Structure</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-10"
                disabled={!hasSelection}
                onClick={() => onCollapsedChange?.(false)}
              >
                <Sliders
                  className={cn(
                    'size-5',
                    hasSelection ? 'text-accent' : 'text-secondary'
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {hasSelection ? 'Field Properties' : 'Select a field first'}
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
        // Expanded mode: full tabs
        <Tabs
          defaultValue={hasSelection ? 'properties' : 'structure'}
          className="flex flex-col flex-1 min-h-0"
        >
          {/* Tab Header */}
          <div className="flex-shrink-0 px-3 pt-3">
            <TabsList variant="accent" animated className="w-full">
              <TabsTrigger
                variant="accent"
                value="structure"
                className="text-xs gap-1.5"
              >
                <List className="size-3.5" />
                Structure
              </TabsTrigger>
              <TabsTrigger
                variant="accent"
                value="properties"
                className="text-xs gap-1.5"
                disabled={!hasSelection}
              >
                <Sliders className="size-3.5" />
                Properties
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0">
            <TabsContent value="structure" className="h-full m-0 mt-0">
              <ScrollArea className="h-full">
                <div className="p-3">
                  <FormStructureTree />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="properties" className="h-full m-0 mt-0">
              <ScrollArea className="h-full">
                <div className="p-3">
                  <FieldPropertiesPanel />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      )}
    </aside>
  );
}

PropertiesPanel.displayName = 'PropertiesPanel';

export default PropertiesPanel;
