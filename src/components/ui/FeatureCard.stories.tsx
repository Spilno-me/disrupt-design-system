import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from './FeatureCard';
import { COLORS } from '@/constants/designTokens';

const meta = {
  title: 'Components/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated feature card with rotating dashed circle, electric icon effect, and expandable description. Used in the 4 main features: Automate, Advice, Adapt, Scale.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof FeatureCard>;

// Automate (Blue)
export const Automate: Story = {
  args: {
    iconName: 'automate',
    circleColor: COLORS.feature.blue,
    title: 'Automate',
    description: 'Streamline repetitive tasks with intelligent automation that learns from your workflows.',
    hasCompletedSequence: true,
  },
};

// Advice (Red)
export const Advice: Story = {
  args: {
    iconName: 'advice',
    circleColor: COLORS.feature.red,
    title: 'Advice',
    description: 'Get strategic recommendations powered by AI analysis of your business data.',
    hasCompletedSequence: true,
  },
};

// Adapt (Yellow)
export const Adapt: Story = {
  args: {
    iconName: 'adapt',
    circleColor: COLORS.feature.yellow,
    title: 'Adapt',
    description: 'Flexibly adjust to changing conditions with real-time intelligence and insights.',
    hasCompletedSequence: true,
  },
};

// Scale (Green)
export const Scale: Story = {
  args: {
    iconName: 'scale',
    circleColor: COLORS.feature.green,
    title: 'Scale',
    description: 'Grow your operations seamlessly with systems designed for enterprise expansion.',
    hasCompletedSequence: true,
  },
};

// All 4 Features Together
export const AllFeatures: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl p-8">
      <FeatureCard
        iconName="automate"
        circleColor={COLORS.feature.blue}
        title="Automate"
        description="Streamline repetitive tasks with intelligent automation that learns from your workflows."
        hasCompletedSequence={true}
      />
      <FeatureCard
        iconName="advice"
        circleColor={COLORS.feature.red}
        title="Advice"
        description="Get strategic recommendations powered by AI analysis of your business data."
        hasCompletedSequence={true}
      />
      <FeatureCard
        iconName="adapt"
        circleColor={COLORS.feature.yellow}
        title="Adapt"
        description="Flexibly adjust to changing conditions with real-time intelligence and insights."
        hasCompletedSequence={true}
      />
      <FeatureCard
        iconName="scale"
        circleColor={COLORS.feature.green}
        title="Scale"
        description="Grow your operations seamlessly with systems designed for enterprise expansion."
        hasCompletedSequence={true}
      />
    </div>
  ),
};

// Interactive States
export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-lg font-bold mb-4 text-dark">Hover me (Desktop only)</h3>
        <FeatureCard
          iconName="automate"
          circleColor={COLORS.feature.blue}
          title="Automate"
          description="Hover over this card to see the rotation and electric effect animation."
          hasCompletedSequence={true}
        />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-dark">Sequence Active</h3>
        <FeatureCard
          iconName="advice"
          circleColor={COLORS.feature.red}
          title="Advice"
          description="This card simulates the scroll sequence animation state."
          isSequenceActive={true}
        />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-dark">Before Sequence (Hidden Description)</h3>
        <FeatureCard
          iconName="adapt"
          circleColor={COLORS.feature.yellow}
          title="Adapt"
          description="This description is hidden until the sequence activates or on mobile."
          hasCompletedSequence={false}
        />
      </div>
    </div>
  ),
};
