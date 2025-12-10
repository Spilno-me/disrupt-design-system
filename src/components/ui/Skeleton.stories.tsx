import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonImage, SkeletonText } from './Skeleton';

const meta = {
  title: 'Core/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

// Basic Skeleton
export const Default: Story = {
  render: () => <Skeleton className="w-[200px] h-[20px]" />,
};

// Shimmer Animation
export const Shimmer: Story = {
  render: () => <Skeleton className="w-[300px] h-[40px]" variant="shimmer" />,
};

// Wave Animation
export const Wave: Story = {
  render: () => <Skeleton className="w-[300px] h-[40px]" variant="wave" />,
};

// Pulse Animation
export const Pulse: Story = {
  render: () => <Skeleton className="w-[300px] h-[40px]" variant="pulse" />,
};

// Text Skeleton
export const TextSkeleton: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <Skeleton className="w-[200px] h-[32px] mb-4" />
      <SkeletonText lines={4} />
    </div>
  ),
};

// Image Skeleton
export const ImageSkeleton: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <SkeletonImage aspectRatio="16/9" />
    </div>
  ),
};

// Card Skeleton
export const CardSkeleton: Story = {
  render: () => (
    <div style={{
      width: '350px',
      background: '#FFFFFF',
      border: '1px dashed #CBD5E1',
      borderRadius: '8px',
      padding: '24px',
    }}>
      <Skeleton className="w-[150px] h-[24px] mb-4" />
      <Skeleton className="w-full h-[16px] mb-2" />
      <Skeleton className="w-3/4 h-[16px] mb-6" />
      <Skeleton className="w-full h-[40px]" rounded="sm" />
    </div>
  ),
};

// Pricing Card Skeleton
export const PricingCardSkeleton: Story = {
  render: () => (
    <div style={{
      width: '350px',
      background: '#FFFFFF',
      border: '1px dashed #CBD5E1',
      borderRadius: '8px',
      padding: '24px',
    }}>
      <Skeleton className="w-[120px] h-[28px] mb-3" />
      <Skeleton className="w-full h-[14px] mb-2" />
      <Skeleton className="w-3/4 h-[14px] mb-6" />
      <Skeleton className="w-[140px] h-[48px] mb-6" />
      <Skeleton className="w-full h-[40px] mb-4" rounded="sm" />
      <div className="border-t border-default pt-4">
        <Skeleton className="w-[180px] h-[16px] mb-3" />
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Skeleton className="w-5 h-5 shrink-0" rounded="full" />
            <Skeleton className="flex-1 h-[14px]" />
          </div>
          <div className="flex items-start gap-2">
            <Skeleton className="w-5 h-5 shrink-0" rounded="full" />
            <Skeleton className="flex-1 h-[14px]" />
          </div>
        </div>
      </div>
    </div>
  ),
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div style={{ width: '500px', display: 'grid', gap: '32px' }}>
      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Shimmer (Default)</h4>
        <Skeleton className="w-full h-[60px]" variant="shimmer" />
      </div>
      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Wave</h4>
        <Skeleton className="w-full h-[60px]" variant="wave" />
      </div>
      <div>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Pulse</h4>
        <Skeleton className="w-full h-[60px]" variant="pulse" />
      </div>
    </div>
  ),
};
