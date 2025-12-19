import type { Meta, StoryObj } from '@storybook/react';
import { ColorPalette } from './ColorPalette';
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  CORAL,
  WAVE,
  SUNRISE,
  HARBOR,
  SLATE,
  PRIMITIVES,
} from '@/constants/designTokens';

/**
 * Color Palette Stories
 *
 * NOTE: This documentation story intentionally imports PRIMITIVES (Tier 1)
 * to display the raw color values. This is the ONE exception where primitives
 * are used - to document the palette itself. Components should use ALIAS tokens.
 */

const meta = {
  title: 'Foundation/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AbyssScale: Story = {
  args: {
    colors: [
      { name: 'Abyss 50', hex: ABYSS[50], usage: 'Lightest' },
      { name: 'Abyss 100', hex: ABYSS[100], usage: '' },
      { name: 'Abyss 200', hex: ABYSS[200], usage: '' },
      { name: 'Abyss 300', hex: ABYSS[300], usage: '' },
      { name: 'Abyss 400', hex: ABYSS[400], usage: '' },
      { name: 'Abyss 500', hex: ABYSS[500], usage: 'Base' },
      { name: 'Abyss 600', hex: ABYSS[600], usage: '' },
      { name: 'Abyss 700', hex: ABYSS[700], usage: '' },
      { name: 'Abyss 800', hex: ABYSS[800], usage: '' },
      { name: 'Abyss 900', hex: ABYSS[900], usage: 'Darkest' },
    ],
    variant: 'scale',
  },
};

export const DeepCurrentScale: Story = {
  args: {
    colors: [
      { name: 'Deep Current 50', hex: DEEP_CURRENT[50], usage: 'Lightest' },
      { name: 'Deep Current 100', hex: DEEP_CURRENT[100], usage: '' },
      { name: 'Deep Current 200', hex: DEEP_CURRENT[200], usage: '' },
      { name: 'Deep Current 300', hex: DEEP_CURRENT[300], usage: '' },
      { name: 'Deep Current 400', hex: DEEP_CURRENT[400], usage: '' },
      { name: 'Deep Current 500', hex: DEEP_CURRENT[500], usage: 'Base' },
      { name: 'Deep Current 600', hex: DEEP_CURRENT[600], usage: '' },
      { name: 'Deep Current 700', hex: DEEP_CURRENT[700], usage: '' },
      { name: 'Deep Current 800', hex: DEEP_CURRENT[800], usage: '' },
      { name: 'Deep Current 900', hex: DEEP_CURRENT[900], usage: 'Darkest' },
    ],
    variant: 'scale',
  },
};

export const DuskReefScale: Story = {
  args: {
    colors: [
      { name: 'Dusk Reef 50', hex: DUSK_REEF[50], usage: 'Lightest' },
      { name: 'Dusk Reef 100', hex: DUSK_REEF[100], usage: '' },
      { name: 'Dusk Reef 200', hex: DUSK_REEF[200], usage: '' },
      { name: 'Dusk Reef 300', hex: DUSK_REEF[300], usage: '' },
      { name: 'Dusk Reef 400', hex: DUSK_REEF[400], usage: '' },
      { name: 'Dusk Reef 500', hex: DUSK_REEF[500], usage: 'Base' },
      { name: 'Dusk Reef 600', hex: DUSK_REEF[600], usage: '' },
      { name: 'Dusk Reef 700', hex: DUSK_REEF[700], usage: '' },
      { name: 'Dusk Reef 800', hex: DUSK_REEF[800], usage: '' },
      { name: 'Dusk Reef 900', hex: DUSK_REEF[900], usage: 'Darkest' },
    ],
    variant: 'scale',
  },
};

export const BrandPrimitives: Story = {
  args: {
    colors: [
      { name: 'Red Coral', hex: CORAL[500], usage: 'Brand red, CTAs' },
      { name: 'Tide Foam', hex: PRIMITIVES.cream, usage: 'Cream background' },
      { name: 'Slate', hex: SLATE[300], usage: 'Borders' },
      { name: 'White', hex: PRIMITIVES.white, usage: 'Surface' },
      { name: 'Black', hex: PRIMITIVES.black, usage: 'Absolute dark' },
    ],
    variant: 'neutral',
  },
};

export const StatusColors: Story = {
  args: {
    colors: [
      { name: 'Wave', hex: WAVE[500], usage: 'Info blue' },
      { name: 'Tide Alert', hex: CORAL[500], usage: 'Error red' },
      { name: 'Sunrise', hex: SUNRISE[500], usage: 'Warning yellow' },
      { name: 'Harbor', hex: HARBOR[500], usage: 'Success green' },
    ],
    variant: 'semantic',
  },
};
