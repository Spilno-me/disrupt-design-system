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

// Default Animation (shimmer - only variant)
export const DefaultAnimation: Story = {
  render: () => <Skeleton className="w-[300px] h-[40px]" />,
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
    <div className="w-[350px] bg-surface border border-dashed border-default rounded-lg p-6">
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
    <div className="w-[350px] bg-surface border border-dashed border-default rounded-lg p-6">
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

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="w-[600px] space-y-6 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Default (Shimmer Animation)</h4>
        <Skeleton className="w-full h-[60px]" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Rounded Variants</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary w-24">SM:</span>
            <Skeleton className="flex-1 h-[20px]" rounded="sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary w-24">MD:</span>
            <Skeleton className="flex-1 h-[40px]" rounded="md" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary w-24">LG (default):</span>
            <Skeleton className="flex-1 h-[60px]" rounded="lg" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary w-24">Full (avatar):</span>
            <Skeleton className="size-16" rounded="full" />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">SkeletonImage (Aspect Ratios)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-secondary mb-2">Square</p>
            <SkeletonImage aspectRatio="square" className="w-32" />
          </div>
          <div>
            <p className="text-xs text-secondary mb-2">4/3</p>
            <SkeletonImage aspectRatio="4/3" className="w-32" />
          </div>
          <div>
            <p className="text-xs text-secondary mb-2">16/9</p>
            <SkeletonImage aspectRatio="16/9" className="w-48" />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">SkeletonText (Line Counts)</h4>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-secondary mb-2">2 lines</p>
            <SkeletonText lines={2} />
          </div>
          <div>
            <p className="text-xs text-secondary mb-2">4 lines</p>
            <SkeletonText lines={4} />
          </div>
        </div>
      </div>
    </div>
  ),
};

