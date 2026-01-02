/**
 * FormBuilderContent - Three-panel layout with palette, canvas, and properties
 *
 * Uses DDS glass panels with collapsible sidebars. Panels use Depth 2
 * styling (bg-white/40, border-2 border-accent) to float above the
 * GridBlobBackground at Depth 1.
 *
 * @component MOLECULE
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useFormBuilder } from '../context';
import { ComponentPalette } from './palette';
import { FormCanvas } from './canvas';
import { PropertiesPanel } from './properties';
import { JsonEditor } from './JsonEditor';
import { FormPreview } from './FormPreview';

// =============================================================================
// TYPES
// =============================================================================

interface FormBuilderContentProps {
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FormBuilderContent({ className }: FormBuilderContentProps) {
  const { activeTab, previewMode } = useFormBuilder();

  // Panel collapse state
  const [isPaletteCollapsed, setIsPaletteCollapsed] = React.useState(false);
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = React.useState(false);

  // Designer tab shows the three-panel layout (or just canvas in preview mode)
  if (activeTab === 'designer') {
    // Preview mode: show only the canvas panel (full width)
    if (previewMode) {
      return (
        <div
          data-slot="form-builder-content"
          data-preview-mode="true"
          className={cn(
            'flex flex-1 min-h-0 overflow-hidden',
            'p-4',
            className
          )}
        >
          {/* Center Panel: Form Canvas (Full Width in Preview Mode) */}
          <FormCanvas className="flex-1 min-w-0 max-w-4xl mx-auto" />
        </div>
      );
    }

    // Normal editing mode: three-panel layout
    return (
      <div
        data-slot="form-builder-content"
        className={cn(
          'flex flex-1 min-h-0 overflow-hidden',
          // DDS spacing: 16px gap between panels
          'gap-4 p-4',
          className
        )}
      >
        {/* Left Panel: Component Palette (Depth 2) */}
        <ComponentPalette
          isCollapsed={isPaletteCollapsed}
          onCollapsedChange={setIsPaletteCollapsed}
          className="flex-shrink-0"
        />

        {/* Center Panel: Form Canvas (Depth 2) */}
        <FormCanvas className="flex-1 min-w-0" />

        {/* Right Panel: Properties (Depth 2) */}
        <PropertiesPanel
          isCollapsed={isPropertiesCollapsed}
          onCollapsedChange={setIsPropertiesCollapsed}
          className="flex-shrink-0"
        />
      </div>
    );
  }

  // JSON tab shows schema editor
  if (activeTab === 'json') {
    return (
      <div
        data-slot="form-builder-content"
        className={cn(
          'flex-1 min-h-0 overflow-hidden p-4',
          className
        )}
      >
        <JsonEditor />
      </div>
    );
  }

  // Preview tab shows form preview
  if (activeTab === 'preview') {
    return (
      <div
        data-slot="form-builder-content"
        className={cn(
          'flex-1 min-h-0 overflow-hidden p-4',
          className
        )}
      >
        <FormPreview />
      </div>
    );
  }

  return null;
}

FormBuilderContent.displayName = 'FormBuilderContent';
