import type { Meta, StoryObj } from '@storybook/react'
import { FAQSection, FAQItem } from './FAQSection'

const meta: Meta<typeof FAQSection> = {
  title: 'Website/Sections/FAQSection',
  component: FAQSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Section title',
    },
    defaultOpen: {
      control: { type: 'number', min: -1, max: 10 },
      description: 'Index of initially open item (-1 for all closed)',
    },
  },
}

export default meta
type Story = StoryObj<typeof FAQSection>

// Sample FAQ data (matches website)
const defaultFAQItems: FAQItem[] = [
  {
    question: 'How does migration from legacy systems work?',
    answer: 'Our migration team works with you to map your existing data structures, workflows, and configurations. We provide automated migration tools and dedicated support to ensure a smooth transition with minimal disruption to your operations. Most migrations complete within 4-8 weeks depending on complexity.',
  },
  {
    question: 'Is my data secure and resilient? Where is it stored?',
    answer: 'Your data is encrypted at rest and in transit using industry-standard AES-256 encryption. We use geo-redundant cloud infrastructure with automatic failover. Data is stored in SOC 2 Type II certified data centers, and you can choose your preferred region for data residency compliance.',
  },
  {
    question: 'Can I customize workflows without coding?',
    answer: 'Yes. The Creator tier (or Tier 3 Agents) allows for natural language prompts to generate mobile forms, flows, and dashboards instantly. Describe what you need, and the agent builds the form logic for you instantly.',
  },
  {
    question: 'What support is included?',
    answer: 'All tiers include access to our knowledge base, community forums, and email support. Higher tiers unlock priority support channels, dedicated success managers, and 24/7 phone support for critical issues.',
  },
  {
    question: 'How does the AI pricing work?',
    answer: 'Unlike competitors who charge per AI task or API call, our flat-rate model means unlimited AI usage is included in your per-user fee. No surprises, no overage charges—just predictable monthly costs regardless of how much AI you use.',
  },
]

// Default FAQ section (matches website)
export const Default: Story = {
  args: {
    title: 'FAQs',
    items: defaultFAQItems,
    defaultOpen: 2,
  },
}

// All items closed
export const AllClosed: Story = {
  args: {
    title: 'FAQs',
    items: defaultFAQItems,
    defaultOpen: null,
  },
}

// Short FAQ list
const shortFAQItems: FAQItem[] = [
  {
    question: 'What is your refund policy?',
    answer: 'We offer a 30-day money-back guarantee on all plans. If you\'re not satisfied, contact our support team for a full refund.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! All new users get a 14-day free trial with full access to all features. No credit card required.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Absolutely. You can change your plan at any time from your account settings. Changes take effect immediately.',
  },
]

export const ShortList: Story = {
  args: {
    title: 'Quick Answers',
    items: shortFAQItems,
    defaultOpen: 0,
  },
}
