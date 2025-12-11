/**
 * Disrupt Design System - Dashed Borders Plugin
 *
 * Signature dashed borders (4px dash, 4px gap) used across the Disrupt brand.
 * This plugin provides utilities for creating the characteristic "stitched" border effect.
 *
 * Usage:
 *   .border-dashed-disrupt      - All sides
 *   .border-t-dashed-disrupt    - Top only
 *   .border-b-dashed-disrupt    - Bottom only
 *   .border-l-dashed-disrupt    - Left only
 *   .border-r-dashed-disrupt    - Right only
 *   .border-x-dashed-disrupt    - Left and right
 *   .border-y-dashed-disrupt    - Top and bottom
 *
 * Responsive variants:
 *   .sm:border-x-dashed-disrupt - Applies on sm+ breakpoints
 *   .lg:border-r-dashed-disrupt - Applies on lg+ breakpoints
 */

import plugin from 'tailwindcss/plugin'

export const dashedBordersPlugin = plugin(function ({ addUtilities, theme }) {
  // Use design tokens from theme
  const borderColor = theme('colors.teal') || theme('colors.accent-strong')
  const borderWidth = theme('borderWidth.DEFAULT') || theme('borderWidth.1')
  const dashLength = theme('spacing.1')  // 4px
  const gapLength = theme('spacing.2')   // 8px
  const zDropdown = theme('zIndex.10')
  const zero = theme('spacing.0')

  // Calculate pattern size for background positioning
  const patternSize = `${dashLength} ${borderWidth}, ${dashLength} ${borderWidth}, ${borderWidth} ${dashLength}, ${borderWidth} ${dashLength}`

  const utilities = {
    // Base dashed border utilities
    '.border-dashed-disrupt': {
      borderStyle: 'dashed',
      borderImage: `repeating-linear-gradient(
        90deg,
        ${borderColor} ${zero},
        ${borderColor} ${dashLength},
        transparent ${dashLength},
        transparent ${gapLength}
      ) 1`,
    },

    '.border-t-dashed-disrupt': {
      borderTopStyle: 'dashed',
      borderTopWidth: borderWidth,
      borderImage: `repeating-linear-gradient(
        90deg,
        ${borderColor} ${zero},
        ${borderColor} ${dashLength},
        transparent ${dashLength},
        transparent ${gapLength}
      ) 1`,
    },

    '.border-b-dashed-disrupt': {
      borderBottomStyle: 'dashed',
      borderBottomWidth: borderWidth,
      borderImage: `repeating-linear-gradient(
        90deg,
        ${borderColor} ${zero},
        ${borderColor} ${dashLength},
        transparent ${dashLength},
        transparent ${gapLength}
      ) 1`,
    },

    '.border-y-dashed-disrupt': {
      borderTopStyle: 'dashed',
      borderBottomStyle: 'dashed',
      borderTopWidth: borderWidth,
      borderBottomWidth: borderWidth,
      borderImage: `repeating-linear-gradient(
        90deg,
        ${borderColor} ${zero},
        ${borderColor} ${dashLength},
        transparent ${dashLength},
        transparent ${gapLength}
      ) 1`,
    },

    '.border-r-dashed-disrupt': {
      borderRightStyle: 'dashed',
      borderRightWidth: borderWidth,
      borderImage: `repeating-linear-gradient(
        0deg,
        ${borderColor} ${zero},
        ${borderColor} ${dashLength},
        transparent ${dashLength},
        transparent ${gapLength}
      ) 1`,
    },

    // Left border - uses pseudo-element for better control
    '.border-l-dashed-disrupt': {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: zero,
        top: zero,
        bottom: zero,
        width: borderWidth,
        background: `repeating-linear-gradient(
          180deg,
          ${borderColor} ${zero},
          ${borderColor} ${dashLength},
          transparent ${dashLength},
          transparent ${gapLength}
        )`,
      },
    },

    // X-axis borders (left and right) - uses pseudo-elements
    '.border-x-dashed-disrupt': {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: zero,
        top: zero,
        bottom: zero,
        width: borderWidth,
        background: `repeating-linear-gradient(
          180deg,
          ${borderColor} ${zero},
          ${borderColor} ${dashLength},
          transparent ${dashLength},
          transparent ${gapLength}
        )`,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        right: zero,
        top: zero,
        bottom: zero,
        width: borderWidth,
        background: `repeating-linear-gradient(
          180deg,
          ${borderColor} ${zero},
          ${borderColor} ${dashLength},
          transparent ${dashLength},
          transparent ${gapLength}
        )`,
      },
    },

    // Separator utility - horizontal dashed line
    '.separator-dashed': {
      width: '100%',
      height: borderWidth,
      background: `repeating-linear-gradient(
        90deg,
        ${borderColor} ${zero},
        ${borderColor} ${dashLength},
        transparent ${dashLength},
        transparent ${gapLength}
      )`,
    },

    // Legacy utilities for backwards compatibility
    '.border-custom-dash': {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: zero,
        left: zero,
        right: zero,
        bottom: zero,
        border: `${borderWidth} solid transparent`,
        background: `
          linear-gradient(90deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-x top,
          linear-gradient(90deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-x bottom,
          linear-gradient(0deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-y left,
          linear-gradient(0deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-y right
        `,
        backgroundSize: patternSize,
        pointerEvents: 'none',
      },
    },

    '.border-custom-dash-left': {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: zero,
        left: zero,
        bottom: zero,
        width: borderWidth,
        background: `linear-gradient(0deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-y`,
        backgroundSize: `${borderWidth} ${gapLength}`,
        zIndex: zDropdown,
      },
    },

    '.border-custom-dash-right': {
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: zero,
        right: zero,
        bottom: zero,
        width: borderWidth,
        background: `linear-gradient(0deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-y`,
        backgroundSize: `${borderWidth} ${gapLength}`,
        zIndex: zDropdown,
      },
    },

    '.border-custom-dash-t': {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: zero,
        left: zero,
        right: zero,
        height: borderWidth,
        background: `linear-gradient(90deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-x`,
        backgroundSize: `${gapLength} ${borderWidth}`,
      },
    },

    '.border-custom-dash-b': {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        bottom: zero,
        left: zero,
        right: zero,
        height: borderWidth,
        background: `linear-gradient(90deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-x`,
        backgroundSize: `${gapLength} ${borderWidth}`,
      },
    },

    '.border-dashed-sides': {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        insetY: zero,
        left: zero,
        width: borderWidth,
        background: `linear-gradient(0deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-y`,
        backgroundSize: `${borderWidth} ${gapLength}`,
        opacity: '1',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        insetY: zero,
        right: zero,
        width: borderWidth,
        background: `linear-gradient(0deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-y`,
        backgroundSize: `${borderWidth} ${gapLength}`,
        opacity: '1',
      },
    },

    '.border-dashed-bottom': {
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        insetX: zero,
        bottom: zero,
        height: borderWidth,
        background: `linear-gradient(90deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-x`,
        backgroundSize: `${gapLength} ${borderWidth}`,
      },
    },

    '.border-dashed-top': {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        insetX: zero,
        top: zero,
        height: borderWidth,
        background: `linear-gradient(90deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-x`,
        backgroundSize: `${gapLength} ${borderWidth}`,
      },
    },

    // Helper utilities for dashed border gradients
    '.dashed-border-vertical': {
      background: `linear-gradient(0deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-y`,
      backgroundSize: `${borderWidth} ${gapLength}`,
    },

    '.dashed-border-horizontal': {
      background: `linear-gradient(90deg, ${borderColor} ${zero}, ${borderColor} ${dashLength}, transparent ${dashLength}, transparent ${gapLength}) repeat-x`,
      backgroundSize: `${gapLength} ${borderWidth}`,
    },
  }

  addUtilities(utilities, ['responsive', 'hover'])
})

export default dashedBordersPlugin
