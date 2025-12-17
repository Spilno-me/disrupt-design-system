/**
 * Example Usage - Pricing Calculator Ultimate
 *
 * This file shows how to integrate the PricingCalculator
 * component into your React application.
 */

import React from "react";
import { PricingCalculator } from "./PricingCalculator";

// Import CSS tokens in your main entry file (main.tsx or App.tsx)
// import "./pricing-calculator-ultimate/tokens.css";

/**
 * Basic Usage
 * Simply render the component - it's self-contained
 */
export function BasicExample() {
  return (
    <div className="min-h-screen bg-page">
      <PricingCalculator />
    </div>
  );
}

/**
 * Constrained Width
 * Wrap in a container to limit the width
 */
export function ConstrainedExample() {
  return (
    <div className="min-h-screen bg-page py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">
          Get Your Custom Quote
        </h1>
        <PricingCalculator />
      </div>
    </div>
  );
}

/**
 * With Custom Wrapper Styling
 * Add your own container styling
 */
export function StyledExample() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-page to-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero section */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-accent-bg text-accent-strong text-sm font-medium rounded-full mb-4">
            Pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Configure your plan based on your team size and usage needs.
            Get an instant estimate below.
          </p>
        </div>

        {/* Calculator */}
        <PricingCalculator />

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-tertiary mb-4">Trusted by leading companies</p>
          <div className="flex justify-center gap-8 opacity-50">
            {/* Add your trust badges/logos here */}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Full Page Layout
 * Complete page with header and footer
 */
export function FullPageExample() {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-default">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-primary">Your Logo</div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-secondary hover:text-primary">Features</a>
            <a href="#" className="text-secondary hover:text-primary">Pricing</a>
            <a href="#" className="text-secondary hover:text-primary">About</a>
          </nav>
          <button className="px-4 py-2 bg-accent-strong text-inverse rounded-md hover:bg-accent-strong/90">
            Get Started
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <PricingCalculator />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-bg text-inverse py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-sm opacity-60">
            &copy; 2024 Your Company. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Default Export
 * Use this in your application
 */
export default function PricingPage() {
  return <ConstrainedExample />;
}
