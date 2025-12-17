/**
 * Consumer Test Story
 *
 * This story tests the delivery package as if we're a consumer
 * who just unzipped the component and is integrating it.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { TenantProvisioningChat, type TenantChatFormData } from './TenantProvisioningChat';

const meta: Meta<typeof TenantProvisioningChat> = {
  title: 'Delivery Test/TenantProvisioningChat',
  component: TenantProvisioningChat,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Consumer Test

This story tests the delivery package as it would be used by a consumer.
The component was extracted from the main DDS project and packaged as a standalone delivery.

### Package Contents
- TenantProvisioningChat.tsx (main component)
- tokens.css (design tokens)
- ui/ (Button, Input, Label, Select, Dialog)
- lib/utils.ts (cn utility)
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-slate-50">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TenantProvisioningChat>;

/**
 * Default - Fresh Start
 * User starting the provisioning flow from scratch.
 */
export const Default: Story = {
  args: {
    onSubmit: (data: TenantChatFormData) => {
      console.log('Form submitted:', data);
      alert('Tenant provisioning complete!\n\nCheck console for data.');
    },
  },
};

/**
 * Resume Flow - With Pre-filled Data
 * User returning to continue a partially completed flow.
 */
export const ResumeFlow: Story = {
  args: {
    initialData: {
      companyName: 'Acme Corporation',
      industry: 'technology',
      companySize: '51-200',
      contactName: 'John Smith',
      contactEmail: 'john.smith@acme.com',
    },
    onSubmit: (data: TenantChatFormData) => {
      console.log('Form submitted:', data);
      alert('Tenant provisioning complete!\n\nCheck console for data.');
    },
  },
};

/**
 * Styled Container
 * Component with custom container styling.
 */
export const StyledContainer: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome to Your Setup
            </h1>
            <p className="text-slate-600">
              Complete the steps below to provision your tenant.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  args: {
    onSubmit: (data: TenantChatFormData) => {
      console.log('Form submitted:', data);
    },
  },
};
