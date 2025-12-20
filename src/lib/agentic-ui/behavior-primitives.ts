/**
 * Behavior Primitives - The Atoms of Interaction
 *
 * Behavior Primitives are the fundamental interaction patterns
 * that can be combined to form complex UI. They describe
 * WHAT something does, not HOW it looks.
 *
 * Think of these as the "traits" that a UI element can have.
 * Multiple traits combine to form a complete interaction pattern.
 */

// =============================================================================
// BEHAVIOR TRAIT TYPES
// The fundamental capabilities a UI element can have
// =============================================================================

/**
 * Core behavior traits that describe interaction patterns
 */
export type BehaviorTrait =
  // Interaction traits
  | 'clickable'       // Can be clicked/tapped
  | 'selectable'      // Can be selected from a group
  | 'toggleable'      // Can switch between states
  | 'draggable'       // Can be dragged
  | 'droppable'       // Can receive dropped items

  // Input traits
  | 'editable'        // Can receive text input
  | 'focusable'       // Can receive keyboard focus
  | 'scrollable'      // Can scroll content

  // Display traits
  | 'displayable'     // Shows information
  | 'collapsible'     // Can expand/collapse
  | 'dismissable'     // Can be closed/hidden
  | 'hoverable'       // Responds to hover

  // State traits
  | 'loadable'        // Has loading state
  | 'validatable'     // Has validation state
  | 'disableable'     // Can be disabled

// =============================================================================
// BEHAVIOR PRIMITIVES
// Full definitions of each behavior
// =============================================================================

/**
 * A Behavior Primitive defines a complete behavior pattern
 */
export interface BehaviorPrimitive {
  /** Unique identifier */
  id: BehaviorTrait

  /** Human-readable name */
  name: string

  /** Description of what this behavior does */
  description: string

  /** Traits this behavior requires */
  requires: BehaviorTrait[]

  /** Traits this behavior conflicts with */
  conflicts: BehaviorTrait[]

  /** ARIA requirements for this behavior */
  aria: {
    role?: string
    attributes?: string[]
  }

  /** Keyboard interactions */
  keyboard?: {
    key: string
    action: string
  }[]

  /** Events this behavior emits */
  events: string[]
}

/**
 * Registry of all behavior primitives
 */
export const BEHAVIOR_PRIMITIVES: Record<BehaviorTrait, BehaviorPrimitive> = {
  // --- Interaction Traits ---
  clickable: {
    id: 'clickable',
    name: 'Clickable',
    description: 'Element can be clicked or tapped to trigger an action',
    requires: ['focusable'],
    conflicts: [],
    aria: {
      role: 'button',
      attributes: ['aria-pressed'],
    },
    keyboard: [
      { key: 'Enter', action: 'activate' },
      { key: 'Space', action: 'activate' },
    ],
    events: ['onClick', 'onKeyDown'],
  },

  selectable: {
    id: 'selectable',
    name: 'Selectable',
    description: 'Element can be selected from a group of options',
    requires: ['focusable'],
    conflicts: [],
    aria: {
      role: 'option',
      attributes: ['aria-selected'],
    },
    keyboard: [
      { key: 'Enter', action: 'select' },
      { key: 'Space', action: 'select' },
    ],
    events: ['onSelect', 'onChange'],
  },

  toggleable: {
    id: 'toggleable',
    name: 'Toggleable',
    description: 'Element can switch between two states',
    requires: ['focusable', 'clickable'],
    conflicts: [],
    aria: {
      role: 'switch',
      attributes: ['aria-checked'],
    },
    keyboard: [
      { key: 'Space', action: 'toggle' },
    ],
    events: ['onToggle', 'onChange'],
  },

  draggable: {
    id: 'draggable',
    name: 'Draggable',
    description: 'Element can be picked up and moved',
    requires: ['focusable'],
    conflicts: [],
    aria: {
      attributes: ['aria-grabbed', 'aria-dropeffect'],
    },
    keyboard: [
      { key: 'Space', action: 'grab' },
      { key: 'Escape', action: 'cancel' },
    ],
    events: ['onDragStart', 'onDrag', 'onDragEnd'],
  },

  droppable: {
    id: 'droppable',
    name: 'Droppable',
    description: 'Element can receive dropped items',
    requires: [],
    conflicts: [],
    aria: {
      attributes: ['aria-dropeffect'],
    },
    events: ['onDragEnter', 'onDragOver', 'onDrop'],
  },

  // --- Input Traits ---
  editable: {
    id: 'editable',
    name: 'Editable',
    description: 'Element accepts text input',
    requires: ['focusable'],
    conflicts: ['clickable'],
    aria: {
      role: 'textbox',
      attributes: ['aria-multiline', 'aria-placeholder'],
    },
    keyboard: [
      { key: 'Any', action: 'type' },
    ],
    events: ['onChange', 'onInput', 'onBlur'],
  },

  focusable: {
    id: 'focusable',
    name: 'Focusable',
    description: 'Element can receive keyboard focus',
    requires: [],
    conflicts: [],
    aria: {
      attributes: ['tabindex'],
    },
    keyboard: [
      { key: 'Tab', action: 'focus-next' },
      { key: 'Shift+Tab', action: 'focus-prev' },
    ],
    events: ['onFocus', 'onBlur'],
  },

  scrollable: {
    id: 'scrollable',
    name: 'Scrollable',
    description: 'Element can scroll its content',
    requires: [],
    conflicts: [],
    aria: {
      attributes: ['aria-orientation'],
    },
    keyboard: [
      { key: 'ArrowUp', action: 'scroll-up' },
      { key: 'ArrowDown', action: 'scroll-down' },
      { key: 'PageUp', action: 'page-up' },
      { key: 'PageDown', action: 'page-down' },
    ],
    events: ['onScroll'],
  },

  // --- Display Traits ---
  displayable: {
    id: 'displayable',
    name: 'Displayable',
    description: 'Element shows information to the user',
    requires: [],
    conflicts: [],
    aria: {
      role: 'region',
      attributes: ['aria-label', 'aria-live'],
    },
    events: [],
  },

  collapsible: {
    id: 'collapsible',
    name: 'Collapsible',
    description: 'Element can expand and collapse to show/hide content',
    requires: ['focusable', 'clickable'],
    conflicts: [],
    aria: {
      role: 'button',
      attributes: ['aria-expanded', 'aria-controls'],
    },
    keyboard: [
      { key: 'Enter', action: 'toggle' },
      { key: 'Space', action: 'toggle' },
    ],
    events: ['onExpand', 'onCollapse'],
  },

  dismissable: {
    id: 'dismissable',
    name: 'Dismissable',
    description: 'Element can be closed or hidden by the user',
    requires: [],
    conflicts: [],
    aria: {
      attributes: ['aria-hidden'],
    },
    keyboard: [
      { key: 'Escape', action: 'dismiss' },
    ],
    events: ['onDismiss', 'onClose'],
  },

  hoverable: {
    id: 'hoverable',
    name: 'Hoverable',
    description: 'Element responds to mouse hover',
    requires: [],
    conflicts: [],
    aria: {},
    events: ['onMouseEnter', 'onMouseLeave'],
  },

  // --- State Traits ---
  loadable: {
    id: 'loadable',
    name: 'Loadable',
    description: 'Element has loading and loaded states',
    requires: [],
    conflicts: [],
    aria: {
      role: 'status',
      attributes: ['aria-busy', 'aria-live'],
    },
    events: ['onLoadStart', 'onLoadComplete', 'onLoadError'],
  },

  validatable: {
    id: 'validatable',
    name: 'Validatable',
    description: 'Element has validation states (valid/invalid/pending)',
    requires: [],
    conflicts: [],
    aria: {
      attributes: ['aria-invalid', 'aria-errormessage', 'aria-describedby'],
    },
    events: ['onValidate', 'onError'],
  },

  disableable: {
    id: 'disableable',
    name: 'Disableable',
    description: 'Element can be disabled to prevent interaction',
    requires: [],
    conflicts: [],
    aria: {
      attributes: ['aria-disabled'],
    },
    events: [],
  },
}

// =============================================================================
// BEHAVIOR HELPERS
// Utilities for working with behaviors
// =============================================================================

/**
 * Get all traits required by a set of behaviors
 */
export function getAllRequiredTraits(traits: BehaviorTrait[]): BehaviorTrait[] {
  const allTraits = new Set<BehaviorTrait>(traits)

  for (const trait of traits) {
    const primitive = BEHAVIOR_PRIMITIVES[trait]
    for (const required of primitive.requires) {
      allTraits.add(required)
      // Recursively add requirements
      const nested = getAllRequiredTraits([required])
      nested.forEach(t => allTraits.add(t))
    }
  }

  return Array.from(allTraits)
}

/**
 * Check if two trait sets are compatible (no conflicts)
 */
export function areTraitsCompatible(traits: BehaviorTrait[]): boolean {
  for (const trait of traits) {
    const primitive = BEHAVIOR_PRIMITIVES[trait]
    for (const conflict of primitive.conflicts) {
      if (traits.includes(conflict)) {
        return false
      }
    }
  }
  return true
}

/**
 * Get ARIA attributes for a set of traits
 */
export function getAriaForTraits(traits: BehaviorTrait[]): Record<string, string> {
  const aria: Record<string, string> = {}

  // Find the most specific role
  let role: string | undefined
  for (const trait of traits) {
    const primitive = BEHAVIOR_PRIMITIVES[trait]
    if (primitive.aria.role) {
      role = primitive.aria.role
    }
  }
  if (role) {
    aria.role = role
  }

  return aria
}

/**
 * Get keyboard handlers for a set of traits
 */
export function getKeyboardHandlersForTraits(
  traits: BehaviorTrait[]
): { key: string; action: string }[] {
  const handlers: { key: string; action: string }[] = []

  for (const trait of traits) {
    const primitive = BEHAVIOR_PRIMITIVES[trait]
    if (primitive.keyboard) {
      handlers.push(...primitive.keyboard)
    }
  }

  return handlers
}

/**
 * Get events emitted by a set of traits
 */
export function getEventsForTraits(traits: BehaviorTrait[]): string[] {
  const events = new Set<string>()

  for (const trait of traits) {
    const primitive = BEHAVIOR_PRIMITIVES[trait]
    primitive.events.forEach(e => events.add(e))
  }

  return Array.from(events)
}
