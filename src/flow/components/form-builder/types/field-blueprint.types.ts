/**
 * Field Blueprint Types
 * Defines the component palette items that can be dragged onto the form
 */

import type { LucideIcon } from 'lucide-react';
import type { SchemaProperty } from './schema.types';

/** Category for organizing fields in the palette */
export type FieldCategory = 'form' | 'data' | 'dictionary';

/** Blueprint for a field type in the component palette */
export interface FieldBlueprint {
  /** Unique identifier for the field type */
  key: string;
  /** Display name in the palette */
  name: string;
  /** Icon component to display (Lucide icon component) */
  icon: LucideIcon;
  /** Category for grouping in palette */
  category: FieldCategory;
  /** Tooltip/description text */
  description: string;
  /** Default schema generated when field is added */
  defaultSchema: SchemaProperty;
}

/** Dragging state for palette items */
export interface DragState {
  isDragging: boolean;
  activeId: string | null;
  activeBlueprint: FieldBlueprint | null;
}

/** Drop target information */
export interface DropTarget {
  path: string[];
  position: 'before' | 'after' | 'inside';
}
