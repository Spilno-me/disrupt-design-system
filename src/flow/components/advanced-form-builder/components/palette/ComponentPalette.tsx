/**
 * ComponentPalette - Left panel with draggable field types
 *
 * Displays field blueprints organized by category in collapsible
 * accordion sections with color-coded headers.
 *
 * @component MOLECULE
 */

import * as React from 'react';
import { Layers, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AccordionRoot,
  AccordionItemPrimitive,
  AccordionContent,
  AccordionTrigger,
  AccordionHeader,
} from '@/components/ui/Accordion';
import { FIELD_CATEGORIES, FIELD_BLUEPRINTS_BY_CATEGORY } from '../../constants';
import { CATEGORY_COLORS, type FieldCategory } from '../../types';
import { PaletteItem } from './PaletteItem';

// =============================================================================
// TYPES
// =============================================================================

export interface ComponentPaletteProps {
  /** Whether the palette is collapsed (icon-only mode) */
  isCollapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// CATEGORY HEADER COLORS
// =============================================================================

/**
 * Accordion item left border color per category
 * Uses DDS semantic color tokens via CSS variables:
 * - layout: accent (abyss/purple) - Layout & Structure
 * - form: success (harbor/green)
 * - data: aging (orange)
 * - dictionary: error (coral/red)
 */
const CATEGORY_BORDER_COLORS: Record<FieldCategory, string> = {
  layout: 'var(--color-accent)',
  form: 'var(--color-success)',
  data: 'var(--color-aging)',
  dictionary: 'var(--color-error)',
};

/**
 * Accordion header background per category
 * Uses DDS semantic background tokens with transparency
 */
const HEADER_BG_STYLES: Record<FieldCategory, string> = {
  layout: 'bg-accent/10',
  form: 'bg-success-bg',
  data: 'bg-aging-light',
  dictionary: 'bg-error-bg',
};

// =============================================================================
// COMPONENT
// =============================================================================

export function ComponentPalette({
  isCollapsed = false,
  onCollapsedChange,
  className,
}: ComponentPaletteProps) {
  // Expand all categories by default
  const defaultOpenCategories = FIELD_CATEGORIES.map((c) => c.key);

  return (
    <aside
      data-slot="component-palette"
      data-testid="component-palette"
      className={cn(
        // Glass panel (Depth 2)
        'flex flex-col rounded-xl',
        'bg-white/40 dark:bg-black/40 backdrop-blur-[4px]',
        'border-2 border-accent shadow-md',
        // Responsive width
        isCollapsed ? 'w-16' : 'w-72',
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
        {/* Icon */}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted-bg">
          <Layers className="size-5 text-accent" />
        </div>

        {/* Title & Subtitle (hidden when collapsed) */}
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-primary">
              Component Library
            </h2>
            <p className="text-xs text-secondary">
              Drag fields to canvas
            </p>
          </div>
        )}

        {/* Collapse toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCollapsedChange?.(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
              className="size-8 shrink-0"
            >
              {isCollapsed ? (
                <PanelLeft className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? 'Expand panel' : 'Collapse panel'}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Field Categories */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isCollapsed ? (
            // Collapsed mode: show category icons with field icons below
            <div className="flex flex-col gap-2">
              {FIELD_CATEGORIES.map((category) => {
                const blueprints = FIELD_BLUEPRINTS_BY_CATEGORY[category.key];
                const colors = CATEGORY_COLORS[category.key];

                return (
                  <div key={category.key} className="flex flex-col gap-1">
                    {/* Category divider */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'flex items-center justify-center py-2 rounded-md',
                            colors.headerBg
                          )}
                        >
                          <span className="text-xs font-bold text-secondary">
                            {category.count}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {category.label} ({category.count})
                      </TooltipContent>
                    </Tooltip>

                    {/* Field items (compact) */}
                    {blueprints.map((blueprint) => (
                      <PaletteItem
                        key={blueprint.key}
                        blueprint={blueprint}
                        isCompact
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            // Expanded mode: accordion with categories
            <AccordionRoot
              type="multiple"
              defaultValue={defaultOpenCategories}
              className="space-y-2"
            >
              {FIELD_CATEGORIES.map((category) => {
                const blueprints = FIELD_BLUEPRINTS_BY_CATEGORY[category.key];

                return (
                  <AccordionItemPrimitive
                    key={category.key}
                    value={category.key}
                    className="rounded-lg border-y border-r border-default border-l-4"
                    style={{ borderLeftColor: CATEGORY_BORDER_COLORS[category.key] }}
                  >
                    <AccordionHeader className="flex">
                      <AccordionTrigger
                        className={cn(
                          'flex flex-1 items-center justify-between',
                          'px-3 py-2.5',
                          'text-sm font-medium text-primary',
                          '[&[data-state=open]>svg]:rotate-180',
                          // Background tint
                          HEADER_BG_STYLES[category.key]
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span>{category.label}</span>
                          <span className="text-xs font-normal text-secondary">
                            {blueprints.length}
                          </span>
                        </span>
                      </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent className="bg-surface/50 dark:bg-surface/30">
                      <div className="space-y-1 p-2">
                        {blueprints.map((blueprint) => (
                          <PaletteItem
                            key={blueprint.key}
                            blueprint={blueprint}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItemPrimitive>
                );
              })}
            </AccordionRoot>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

ComponentPalette.displayName = 'ComponentPalette';

export default ComponentPalette;
