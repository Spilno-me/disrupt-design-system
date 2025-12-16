import type { Meta, StoryObj } from "@storybook/react"
import { LoginPage } from "./LoginPage"
import heroFrame from "../../assets/optimized/auth/hero-frame-desktop.webp"

const meta: Meta<typeof LoginPage> = {
  title: "Shared/Auth/LoginPage",
  component: LoginPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof LoginPage>

// Simulate API delay
const simulateApi = (ms = 1500) => new Promise((r) => setTimeout(r, ms))

// Base handlers for all stories
const baseHandlers = {
  onLogin: async (values: { email: string; password: string }) => {
    console.log("Login submitted:", values)
    await simulateApi()
  },
  onForgotPassword: async (email: string) => {
    console.log("Password reset requested for:", email)
    await simulateApi(1000)
  },
  onLoginSuccess: () => {
    console.log("Login success - redirect!")
    alert("Redirecting to dashboard...")
  },
}

// =============================================================================
// PRODUCT VARIANTS
// =============================================================================

export const DisruptFlow: Story = {
  name: "Disrupt Flow",
  args: {
    product: "flow",
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Flow platform interface",
    ...baseHandlers,
  },
}

export const DisruptMarket: Story = {
  name: "Disrupt Market",
  args: {
    product: "market",
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Market platform interface",
    ...baseHandlers,
  },
}

export const DisruptPartner: Story = {
  name: "Disrupt Partner",
  args: {
    product: "partner",
    heroImage: heroFrame,
    heroImageAlt: "Disrupt Partner platform interface",
    ...baseHandlers,
  },
}
