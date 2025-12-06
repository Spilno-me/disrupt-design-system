import type { Meta, StoryObj } from '@storybook/react'
import { optimizedImages } from '../assets/optimized'
import { aboutImages } from '../assets/optimized/about'
import { Zap, Globe, Shield, Image, FileImage, Layers } from 'lucide-react'

const meta: Meta = {
  title: 'Assets/Hero Images',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Hero images used across the Disrupt website. All images are optimized with:
- **AVIF**: Best compression, modern browsers
- **WebP**: Good compression, wide support
- **PNG**: Fallback for older browsers

Each image has responsive variants:
- **Mobile**: 640px width
- **Tablet**: 1024px width
- **Desktop**: 1440px width
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Home Hero Image
export const HomeHero: Story = {
  render: () => (
    <div className="bg-cream p-8">
      <h2 className="text-2xl font-display font-bold text-dark mb-6">Home Page Hero</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-dark mb-2">Desktop (1440px)</h3>
          <img
            src={optimizedImages.heroFrame.desktop.webp}
            alt="Home hero desktop"
            className="w-full max-w-4xl rounded-lg shadow-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-dark mb-2">Tablet (1024px)</h3>
            <img
              src={optimizedImages.heroFrame.tablet.webp}
              alt="Home hero tablet"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-dark mb-2">Mobile (640px)</h3>
            <img
              src={optimizedImages.heroFrame.mobile.webp}
              alt="Home hero mobile"
              className="w-full max-w-xs rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  ),
}

// About Hero Image
export const AboutHero: Story = {
  render: () => (
    <div className="bg-cream p-8">
      <h2 className="text-2xl font-display font-bold text-dark mb-6">About Page Hero</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-dark mb-2">Desktop (1440px)</h3>
          <img
            src={aboutImages.aboutHero.desktop.webp}
            alt="About hero desktop"
            className="w-full max-w-4xl rounded-lg shadow-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-dark mb-2">Tablet (1024px)</h3>
            <img
              src={aboutImages.aboutHero.tablet.webp}
              alt="About hero tablet"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-dark mb-2">Mobile (640px)</h3>
            <img
              src={aboutImages.aboutHero.mobile.webp}
              alt="About hero mobile"
              className="w-full max-w-xs rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  ),
}

// All Hero Images Grid
export const AllHeroImages: Story = {
  render: () => (
    <div className="bg-cream p-8">
      <h2 className="text-2xl font-display font-bold text-dark mb-8">All Hero Images</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-display font-semibold text-darkPurple mb-4">Home Page Hero</h3>
          <img
            src={optimizedImages.heroFrame.desktop.webp}
            alt="Home hero"
            className="w-full rounded-lg"
          />
          <p className="text-muted text-sm mt-3">Used on the main landing page</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-display font-semibold text-darkPurple mb-4">About Page Hero</h3>
          <img
            src={aboutImages.aboutHero.desktop.webp}
            alt="About hero"
            className="w-full rounded-lg"
          />
          <p className="text-muted text-sm mt-3">Used on the about page</p>
        </div>
      </div>
    </div>
  ),
}

// Image Formats Comparison
export const ImageFormats: Story = {
  render: () => (
    <div className="bg-cream p-8">
      <h2 className="text-2xl font-display font-bold text-dark mb-6">Image Format Comparison</h2>
      <p className="text-muted mb-8">Same image in different formats - WebP shown as example</p>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-dark mb-4">Home Hero - Desktop Formats</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-lightPurple rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-teal rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-teal text-white px-3 py-1 rounded font-semibold">AVIF</span>
              <span className="text-dark">Best compression, modern browsers</span>
            </div>
            <code className="ml-auto text-xs text-muted bg-cream px-2 py-1 rounded">optimizedImages.heroFrame.desktop.avif</code>
          </div>

          <div className="flex items-center gap-4 p-4 bg-lightPurple rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-circleBlue rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-circleBlue text-white px-3 py-1 rounded font-semibold">WebP</span>
              <span className="text-dark">Good compression, wide support</span>
            </div>
            <code className="ml-auto text-xs text-muted bg-cream px-2 py-1 rounded">optimizedImages.heroFrame.desktop.webp</code>
          </div>

          <div className="flex items-center gap-4 p-4 bg-lightPurple rounded-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-circleGreen rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-circleGreen text-white px-3 py-1 rounded font-semibold">PNG</span>
              <span className="text-dark">Fallback for older browsers</span>
            </div>
            <code className="ml-auto text-xs text-muted bg-cream px-2 py-1 rounded">optimizedImages.heroFrame.desktop.fallback</code>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate">
          <h4 className="text-md font-semibold text-dark mb-4">Responsive Variants</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-darkPurple rounded">
                <FileImage className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-dark text-sm">Mobile</span>
                <p className="text-xs text-muted">640px width</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-darkPurple rounded">
                <Image className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-dark text-sm">Tablet</span>
                <p className="text-xs text-muted">1024px width</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-darkPurple rounded">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-dark text-sm">Desktop</span>
                <p className="text-xs text-muted">1440px width</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Usage Example
export const UsageExample: Story = {
  render: () => (
    <div className="bg-cream p-8">
      <h2 className="text-2xl font-display font-bold text-dark mb-6">Usage Example</h2>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-dark mb-4">Import and Use</h3>

        <pre className="bg-dark text-cream p-4 rounded-lg text-sm overflow-x-auto mb-6">
{`import { optimizedImages, aboutImages } from '@adrozdenko/design-system'

// Access home hero images
const homeHero = optimizedImages.heroFrame
// homeHero.desktop.webp, homeHero.desktop.avif, homeHero.desktop.fallback
// homeHero.tablet.webp, homeHero.tablet.avif, homeHero.tablet.fallback
// homeHero.mobile.webp, homeHero.mobile.avif, homeHero.mobile.fallback
// homeHero.placeholder (tiny blur-up image)

// Access about hero images
const aboutHero = aboutImages.aboutHero
// Same structure as above

// Use in a picture element for responsive images
<picture>
  <source
    media="(min-width: 1024px)"
    srcSet={homeHero.desktop.avif}
    type="image/avif"
  />
  <source
    media="(min-width: 1024px)"
    srcSet={homeHero.desktop.webp}
    type="image/webp"
  />
  <source
    media="(min-width: 640px)"
    srcSet={homeHero.tablet.webp}
    type="image/webp"
  />
  <img
    src={homeHero.mobile.fallback}
    alt="Hero"
  />
</picture>`}
        </pre>

        <h3 className="text-lg font-semibold text-dark mb-4">Live Preview</h3>
        <img
          src={optimizedImages.heroFrame.desktop.webp}
          alt="Hero preview"
          className="w-full max-w-2xl rounded-lg shadow-lg"
        />
      </div>
    </div>
  ),
}
