import type { Meta, StoryObj } from '@storybook/react'
import { BlurImage } from './BlurImage'

const meta: Meta<typeof BlurImage> = {
  title: 'Website/Components/BlurImage',
  component: BlurImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    alt: {
      control: 'text',
      description: 'Alt text for the image',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof BlurImage>

// Sample image URLs (using placeholder images)
const sampleImages = {
  mobile: {
    avif: 'https://picsum.photos/400/300.webp',
    webp: 'https://picsum.photos/400/300.webp',
    fallback: 'https://picsum.photos/400/300',
  },
  tablet: {
    avif: 'https://picsum.photos/800/600.webp',
    webp: 'https://picsum.photos/800/600.webp',
    fallback: 'https://picsum.photos/800/600',
  },
  desktop: {
    avif: 'https://picsum.photos/1200/800.webp',
    webp: 'https://picsum.photos/1200/800.webp',
    fallback: 'https://picsum.photos/1200/800',
  },
}

// Tiny placeholder for blur effect (base64 encoded small image or URL to tiny image)
const tinyPlaceholder = 'https://picsum.photos/20/15'

// Default blur image
export const Default: Story = {
  args: {
    images: sampleImages,
    placeholder: tinyPlaceholder,
    alt: 'Sample image with blur loading effect',
  },
  render: (args) => (
    <div className="w-[600px] h-[400px]">
      <BlurImage {...args} />
    </div>
  ),
}

// Square aspect ratio
export const Square: Story = {
  render: () => (
    <div className="w-[400px] h-[400px]">
      <BlurImage
        images={{
          mobile: {
            avif: 'https://picsum.photos/400/400.webp',
            webp: 'https://picsum.photos/400/400.webp',
            fallback: 'https://picsum.photos/400/400',
          },
          tablet: {
            avif: 'https://picsum.photos/600/600.webp',
            webp: 'https://picsum.photos/600/600.webp',
            fallback: 'https://picsum.photos/600/600',
          },
          desktop: {
            avif: 'https://picsum.photos/800/800.webp',
            webp: 'https://picsum.photos/800/800.webp',
            fallback: 'https://picsum.photos/800/800',
          },
        }}
        placeholder="https://picsum.photos/20/20"
        alt="Square image"
      />
    </div>
  ),
}

// Wide aspect ratio (16:9)
export const Wide: Story = {
  render: () => (
    <div className="w-[640px] h-[360px]">
      <BlurImage
        images={{
          mobile: {
            avif: 'https://picsum.photos/640/360.webp',
            webp: 'https://picsum.photos/640/360.webp',
            fallback: 'https://picsum.photos/640/360',
          },
          tablet: {
            avif: 'https://picsum.photos/960/540.webp',
            webp: 'https://picsum.photos/960/540.webp',
            fallback: 'https://picsum.photos/960/540',
          },
          desktop: {
            avif: 'https://picsum.photos/1280/720.webp',
            webp: 'https://picsum.photos/1280/720.webp',
            fallback: 'https://picsum.photos/1280/720',
          },
        }}
        placeholder="https://picsum.photos/32/18"
        alt="Wide 16:9 image"
      />
    </div>
  ),
}

// With rounded corners
export const Rounded: Story = {
  render: () => (
    <div className="w-[400px] h-[300px] rounded-lg overflow-hidden">
      <BlurImage
        images={sampleImages}
        placeholder={tinyPlaceholder}
        alt="Rounded image"
      />
    </div>
  ),
}

// Multiple images in a grid
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[600px]">
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <div key={id} className="aspect-square rounded-lg overflow-hidden">
          <BlurImage
            images={{
              mobile: {
                avif: `https://picsum.photos/seed/${id}/200/200.webp`,
                webp: `https://picsum.photos/seed/${id}/200/200.webp`,
                fallback: `https://picsum.photos/seed/${id}/200/200`,
              },
              tablet: {
                avif: `https://picsum.photos/seed/${id}/300/300.webp`,
                webp: `https://picsum.photos/seed/${id}/300/300.webp`,
                fallback: `https://picsum.photos/seed/${id}/300/300`,
              },
              desktop: {
                avif: `https://picsum.photos/seed/${id}/400/400.webp`,
                webp: `https://picsum.photos/seed/${id}/400/400.webp`,
                fallback: `https://picsum.photos/seed/${id}/400/400`,
              },
            }}
            placeholder={`https://picsum.photos/seed/${id}/20/20`}
            alt={`Grid image ${id}`}
          />
        </div>
      ))}
    </div>
  ),
}

// In card context
export const InCard: Story = {
  render: () => (
    <div className="w-[350px] bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-[200px]">
        <BlurImage
          images={sampleImages}
          placeholder={tinyPlaceholder}
          alt="Card image"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-dark">Card Title</h3>
        <p className="text-muted-foreground text-sm mt-1">
          This card uses BlurImage for progressive loading.
        </p>
      </div>
    </div>
  ),
}

// Hero section style
export const HeroStyle: Story = {
  render: () => (
    <div className="w-[800px] h-[400px] relative rounded-lg overflow-hidden">
      <BlurImage
        images={sampleImages}
        placeholder={tinyPlaceholder}
        alt="Hero background"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-2">Hero Section</h1>
          <p className="text-white/80">With blur-up image loading effect</p>
        </div>
      </div>
    </div>
  ),
}

// Loading state demonstration
export const LoadingDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        The image below shows the blur-up loading effect. The tiny placeholder
        is blurred and displayed while the full resolution image loads.
      </p>
      <div className="w-[500px] h-[300px] rounded-lg overflow-hidden mx-auto">
        <BlurImage
          images={{
            mobile: {
              avif: 'https://picsum.photos/seed/demo/500/300.webp',
              webp: 'https://picsum.photos/seed/demo/500/300.webp',
              fallback: 'https://picsum.photos/seed/demo/500/300',
            },
            tablet: {
              avif: 'https://picsum.photos/seed/demo/800/480.webp',
              webp: 'https://picsum.photos/seed/demo/800/480.webp',
              fallback: 'https://picsum.photos/seed/demo/800/480',
            },
            desktop: {
              avif: 'https://picsum.photos/seed/demo/1200/720.webp',
              webp: 'https://picsum.photos/seed/demo/1200/720.webp',
              fallback: 'https://picsum.photos/seed/demo/1200/720',
            },
          }}
          placeholder="https://picsum.photos/seed/demo/20/12"
          alt="Loading demonstration"
        />
      </div>
    </div>
  ),
}
