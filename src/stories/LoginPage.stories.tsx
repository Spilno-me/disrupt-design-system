import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { useState } from "react"
import { LoginPage } from "../components/auth/LoginPage"
import { GridBlobBackground } from "../components/ui/GridBlobCanvas"
import { ExecutingAnimation } from "../components/ui/ExecutingAnimation"
import { SHADOWS } from "../constants/designTokens"
import heroFrame from "../assets/optimized/auth/hero-frame-desktop.webp"

// =============================================================================
// DEMO WRAPPER COMPONENTS
// =============================================================================

const PRODUCT_CONFIGS = {
  flow: {
    logo: "/logos/flow-logo-full-dark.svg",
    name: "Disrupt Flow",
  },
  market: {
    logo: "/logos/market-logo-full-dark.svg",
    name: "Disrupt Market",
  },
  partner: {
    logo: "/logos/partner-logo-full-dark.svg",
    name: "Disrupt Partner",
  },
}

type ProductType = "flow" | "market" | "partner"

interface WelcomeStateProps {
  product?: ProductType
  message: string
  customLogo?: string
}

function WelcomeStateDemo({ product, message, customLogo }: WelcomeStateProps) {
  const logoSrc = customLogo || (product ? PRODUCT_CONFIGS[product].logo : null)

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-page">
      <div className="absolute inset-0 z-0">
        <GridBlobBackground scale={1.2} />
      </div>
      <div className="grid lg:grid-cols-2 w-full relative z-10">
        <div className="relative flex flex-col items-center justify-center p-8 lg:p-12">
          <div className="relative z-10 w-full max-w-md">
            <div
              className="rounded-xl border border-dashed border-default bg-surface p-6 sm:p-8"
              style={{ boxShadow: SHADOWS.ambient }}
            >
              <div className="flex flex-col items-center justify-center py-8 text-center">
                {logoSrc && (
                  <img src={logoSrc} alt="Logo" className="mb-6 h-8 w-auto" />
                )}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <svg
                    className="h-8 w-8 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-primary">Welcome!</h2>
                <p className="mt-2 text-sm text-muted">{message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LoadingStateProps {
  product?: ProductType
}

function LoadingStateDemo({ product: _product }: LoadingStateProps) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-page">
      <div className="absolute inset-0 z-0">
        <GridBlobBackground scale={1.2} />
      </div>
      <div className="grid lg:grid-cols-2 w-full relative z-10">
        <div className="relative flex flex-col items-center justify-center p-8 lg:p-12">
          <div className="relative z-10 w-full max-w-md">
            <div
              className="rounded-xl border border-dashed border-default bg-surface p-6 sm:p-8"
              style={{ boxShadow: SHADOWS.ambient }}
            >
              <div className="flex flex-col items-center justify-center py-12">
                <ExecutingAnimation className="w-32 h-32" />
                <p className="mt-4 text-sm text-muted">Signing you in...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const meta: Meta<typeof LoginPage> = {
  title: "Auth/LoginPage",
  component: LoginPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-page login component with animated background, hero section, and form. Supports multiple products (Flow, Market, Partner) with customizable positioning and branding.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    product: {
      control: "select",
      options: ["flow", "market", "partner"],
      description: "Product type to display branding for",
    },
    loginPosition: {
      control: "select",
      options: ["left", "right"],
      description: "Position of the login form (left or right side)",
    },
    blobScale: {
      control: { type: "range", min: 0.5, max: 2, step: 0.1 },
      description: "Scale of the animated blob background",
    },
  },
}

export default meta
type Story = StoryObj<typeof LoginPage>

// =============================================================================
// SIGN IN STORIES
// =============================================================================

export const SignInFlow: Story = {
  name: "Sign In - Flow",
  args: {
    product: "flow",
    loginPosition: "left",
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Flow platform interface",
    onLogin: async (values) => {
      console.log("Login attempt:", values)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
    },
    onForgotPassword: async (email) => {
      console.log("Password reset requested for:", email)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onLoginSuccess: () => {
      console.log("Login successful, redirecting...")
    },
  },
}

export const SignInMarket: Story = {
  name: "Sign In - Market",
  args: {
    product: "market",
    loginPosition: "left",
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Market platform interface",
    onLogin: async (values) => {
      console.log("Login attempt:", values)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    },
    onForgotPassword: async (email) => {
      console.log("Password reset requested for:", email)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
  },
}

export const SignInPartner: Story = {
  name: "Sign In - Partner",
  args: {
    product: "partner",
    loginPosition: "left",
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Partner platform interface",
    onLogin: async (values) => {
      console.log("Login attempt:", values)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    },
    onForgotPassword: async (email) => {
      console.log("Password reset requested for:", email)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
  },
}

export const SignInRightPosition: Story = {
  name: "Sign In - Form on Right",
  args: {
    product: "flow",
    loginPosition: "right",
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Flow platform interface",
    onLogin: async (values) => {
      console.log("Login attempt:", values)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    },
  },
}

// =============================================================================
// INTERACTIVE STORIES
// =============================================================================

export const InteractiveSignIn: Story = {
  name: "Interactive - Try Logging In",
  render: (args) => {
    const [key, setKey] = useState(0)

    return (
      <div key={key}>
        <LoginPage
          {...args}
          onLogin={async (values) => {
            console.log("Login attempt:", values)
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))
            // Simulate successful login
          }}
          onLoginSuccess={() => {
            console.log("Login successful!")
            // Reset after 2 seconds to try again
            setTimeout(() => {
              setKey((prev) => prev + 1)
            }, 2000)
          }}
          onForgotPassword={async (email) => {
            console.log("Password reset for:", email)
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }}
        />
      </div>
    )
  },
  args: {
    product: "flow",
    loginPosition: "left",
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Flow platform interface",
  },
}

// =============================================================================
// STATE DEMONSTRATION STORIES
// =============================================================================

// Welcome state stories - shown directly
export const WelcomeFlow: StoryObj<typeof WelcomeStateDemo> = {
  name: "Welcome - Flow Success",
  render: (_args) => (
    <WelcomeStateDemo
      product="flow"
      message="Welcome back! Taking you to your dashboard..."
    />
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Welcome/success state for Flow product. This shows the success animation and message displayed after successful login.",
      },
    },
  },
}

export const WelcomeMarket: StoryObj<typeof WelcomeStateDemo> = {
  name: "Welcome - Market Success",
  render: (_args) => (
    <WelcomeStateDemo
      product="market"
      message="Welcome to Disrupt Market! Loading your marketplace..."
    />
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Welcome/success state for Market product with customized success message.",
      },
    },
  },
}

export const WelcomePartner: StoryObj<typeof WelcomeStateDemo> = {
  name: "Welcome - Partner Success",
  render: (_args) => (
    <WelcomeStateDemo
      product="partner"
      message="Welcome back, Partner! Redirecting to your portal..."
    />
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Welcome/success state for Partner product with custom welcome message.",
      },
    },
  },
}

// Loading state story - shown directly
export const LoadingState: StoryObj<typeof LoadingStateDemo> = {
  name: "State - Loading (Light)",
  render: (_args) => <LoadingStateDemo product="flow" />,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Loading state with animated spinner shown during login process. Uses light theme colors optimized for white backgrounds.",
      },
    },
  },
}

// Dark variant for future dark theme
function LoadingStateDemoDark({ product: _product }: LoadingStateProps) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-inverse-bg">
      <div className="absolute inset-0 z-0">
        <GridBlobBackground scale={1.2} />
      </div>
      <div className="grid lg:grid-cols-2 w-full relative z-10">
        <div className="relative flex flex-col items-center justify-center p-8 lg:p-12">
          <div className="relative z-10 w-full max-w-md">
            <div
              className="rounded-xl border border-dashed border-default bg-inverse-subtle p-6 sm:p-8"
              style={{ boxShadow: SHADOWS.ambient }}
            >
              <div className="flex flex-col items-center justify-center py-12">
                <ExecutingAnimation className="w-32 h-32" variant="dark" />
                <p className="mt-4 text-sm text-inverse">Signing you in...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const LoadingStateDark: StoryObj<typeof LoadingStateDemoDark> = {
  name: "State - Loading (Dark Theme Ready)",
  render: (_args) => <LoadingStateDemoDark product="flow" />,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Loading state prepared for dark theme. Uses cream-colored middle dot that's visible on dark backgrounds. This demonstrates the dark variant ready for future theme implementation.",
      },
    },
  },
}

// =============================================================================
// CUSTOMIZATION STORIES
// =============================================================================

export const CustomAnimation: Story = {
  name: "Custom - Large Blob Animation",
  args: {
    product: "flow",
    loginPosition: "left",
    blobScale: 1.8,
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Flow platform interface",
    onLogin: async (values) => {
      console.log("Login attempt:", values)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    },
  },
}

export const CustomLinks: Story = {
  name: "Custom - Custom Legal Links",
  args: {
    product: "flow",
    loginPosition: "left",
    termsLink: "https://example.com/terms",
    privacyLink: "https://example.com/privacy",
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Flow platform interface",
    onLogin: async (values) => {
      console.log("Login attempt:", values)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    },
  },
}

// =============================================================================
// MOBILE PREVIEW
// =============================================================================

export const MobileView: Story = {
  name: "Mobile - Sign In",
  args: {
    product: "flow",
    loginPosition: "left",
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Flow platform interface",
    onLogin: async (values) => {
      console.log("Login attempt:", values)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile view of the login page. The hero section is hidden on mobile devices, showing only the login form.",
      },
    },
  },
}
