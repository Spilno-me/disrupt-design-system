/**
 * Device Frames Stories
 *
 * Simple device frame components for previewing mobile & tablet components in Storybook.
 */

import type { Meta, StoryObj } from '@storybook/react'
import {
  IPhoneFrame,
  IPadFrame,
  IPHONE_SPECS,
  IPAD_SPECS,
  type IPhoneModel,
  type IPadModel,
} from './device-frames'

// =============================================================================
// DEMO CONTENT
// =============================================================================

const DemoContent = ({ label = 'Content' }: { label?: string }) => (
  <div className="flex-1 flex items-center justify-center p-4 bg-neutral-100">
    <div className="text-center space-y-2">
      <div className="w-12 h-12 mx-auto rounded-xl bg-teal-500/20 flex items-center justify-center">
        <span className="text-2xl">📱</span>
      </div>
      <p className="text-sm font-medium text-neutral-900">{label}</p>
      <p className="text-xs text-neutral-500">Your content goes here</p>
    </div>
  </div>
)

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof IPhoneFrame> = {
  title: 'Infrastructure/Device Frames',
  component: IPhoneFrame,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

// =============================================================================
// SHOWCASE
// =============================================================================

const iPhoneModels: IPhoneModel[] = ['iphone16pro', 'iphone16promax', 'iphone17promax']
const iPadModels: IPadModel[] = ['ipadMini', 'ipad', 'ipadPro11']

/**
 * Device frames for previewing mobile components.
 * iPhones shown in portrait, iPads in landscape.
 */
export const Showcase: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-neutral-200 p-8 space-y-16">
      {/* iPhone Section */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">iPhone Models</h2>
        <p className="text-neutral-500 mb-8">iPhone 16 & 17 series</p>
        <div className="flex flex-wrap items-end gap-6">
          {iPhoneModels.map((model) => (
            <div key={model} className="text-center">
              <IPhoneFrame model={model} scale={0.45}>
                <DemoContent label={IPHONE_SPECS[model].name.split('/')[0]} />
              </IPhoneFrame>
              <p className="mt-3 text-sm font-medium text-neutral-900">
                {IPHONE_SPECS[model].name.split('/')[0]}
              </p>
              <p className="text-xs text-neutral-500">
                {IPHONE_SPECS[model].width}×{IPHONE_SPECS[model].height}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* iPad Section */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">iPad Models</h2>
        <p className="text-neutral-500 mb-8">Landscape orientation</p>
        <div className="flex flex-wrap items-start gap-8">
          {iPadModels.map((model) => (
            <div key={model} className="text-center">
              <IPadFrame model={model} scale={0.28}>
                <DemoContent label={IPAD_SPECS[model].name} />
              </IPadFrame>
              <p className="mt-3 text-sm font-medium text-neutral-900">
                {IPAD_SPECS[model].name}
              </p>
              <p className="text-xs text-neutral-500">
                {IPAD_SPECS[model].height}×{IPAD_SPECS[model].width}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}
