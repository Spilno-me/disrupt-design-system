import type { Meta, StoryObj } from '@storybook/react';
import { ColorPalette } from './ColorPalette';

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
      { name: 'Abyss 50', hex: '#E8E9EB', usage: 'Lightest' },
      { name: 'Abyss 100', hex: '#D1D3D7', usage: '' },
      { name: 'Abyss 200', hex: '#A3A7AF', usage: '' },
      { name: 'Abyss 300', hex: '#757B87', usage: '' },
      { name: 'Abyss 400', hex: '#474F5F', usage: '' },
      { name: 'Abyss 500', hex: '#2D3142', usage: 'Base' },
      { name: 'Abyss 600', hex: '#252836', usage: '' },
      { name: 'Abyss 700', hex: '#1D1F2A', usage: '' },
      { name: 'Abyss 800', hex: '#14161E', usage: '' },
      { name: 'Abyss 900', hex: '#0C0D12', usage: 'Darkest' },
    ],
    variant: 'scale',
  },
};

export const DeepCurrentScale: Story = {
  args: {
    colors: [
      { name: 'Deep Current 50', hex: '#E6F7FA', usage: 'Lightest' },
      { name: 'Deep Current 100', hex: '#CCEFF5', usage: '' },
      { name: 'Deep Current 200', hex: '#99DFEB', usage: '' },
      { name: 'Deep Current 300', hex: '#66CFE1', usage: '' },
      { name: 'Deep Current 400', hex: '#33BFD7', usage: '' },
      { name: 'Deep Current 500', hex: '#08A4BD', usage: 'Base' },
      { name: 'Deep Current 600', hex: '#068397', usage: '' },
      { name: 'Deep Current 700', hex: '#056271', usage: '' },
      { name: 'Deep Current 800', hex: '#03424B', usage: '' },
      { name: 'Deep Current 900', hex: '#022125', usage: 'Darkest' },
    ],
    variant: 'scale',
  },
};

export const DuskReefScale: Story = {
  args: {
    colors: [
      { name: 'Dusk Reef 50', hex: '#EFEDF3', usage: 'Lightest' },
      { name: 'Dusk Reef 100', hex: '#DFDBE7', usage: '' },
      { name: 'Dusk Reef 200', hex: '#BFB7CF', usage: '' },
      { name: 'Dusk Reef 300', hex: '#9F93B7', usage: '' },
      { name: 'Dusk Reef 400', hex: '#7F6F9F', usage: '' },
      { name: 'Dusk Reef 500', hex: '#5E4F7E', usage: 'Base' },
      { name: 'Dusk Reef 600', hex: '#4B3F65', usage: '' },
      { name: 'Dusk Reef 700', hex: '#382F4C', usage: '' },
      { name: 'Dusk Reef 800', hex: '#262033', usage: '' },
      { name: 'Dusk Reef 900', hex: '#13101A', usage: 'Darkest' },
    ],
    variant: 'scale',
  },
};

export const BrandPrimitives: Story = {
  args: {
    colors: [
      { name: 'Red Coral', hex: '#F70D1A', usage: 'Brand red, CTAs' },
      { name: 'Tide Foam', hex: '#FBFBF3', usage: 'Cream background' },
      { name: 'Slate', hex: '#CBD5E1', usage: 'Borders' },
      { name: 'White', hex: '#FFFFFF', usage: 'Surface' },
      { name: 'Black', hex: '#000000', usage: 'Absolute dark' },
    ],
    variant: 'neutral',
  },
};

export const StatusColors: Story = {
  args: {
    colors: [
      { name: 'Wave', hex: '#3B82F6', usage: 'Info blue' },
      { name: 'Tide Alert', hex: '#F70D1A', usage: 'Error red' },
      { name: 'Sunrise', hex: '#EAB308', usage: 'Warning yellow' },
      { name: 'Harbor', hex: '#22C55E', usage: 'Success green' },
    ],
    variant: 'semantic',
  },
};
