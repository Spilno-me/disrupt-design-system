/**
 * Example Usage - TenantProvisioningChat
 *
 * This file demonstrates how to integrate the TenantProvisioningChat
 * component into your React application.
 */

import React from 'react';
import { TenantProvisioningChat, type TenantChatFormData } from './TenantProvisioningChat';

/**
 * Example 1: Basic Usage
 *
 * Simple integration with just a submit handler.
 */
export function BasicExample() {
  const handleSubmit = async (data: TenantChatFormData) => {
    console.log('Tenant provisioning data:', data);

    // Example: Send to your API
    // await fetch('/api/tenants', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    // Show success message or redirect
    alert('Tenant created successfully!');
  };

  return (
    <div className="min-h-screen bg-page p-4">
      <TenantProvisioningChat onSubmit={handleSubmit} />
    </div>
  );
}

/**
 * Example 2: Resume Flow with Pre-filled Data
 *
 * When user returns to continue a partially completed form.
 */
export function ResumeFlowExample() {
  // Data saved from previous session (e.g., from localStorage or API)
  const savedProgress: Partial<TenantChatFormData> = {
    companyName: 'Acme Corporation',
    industry: 'technology',
    companySize: '51-200',
    contactName: 'John Smith',
    contactEmail: 'john@acme.com',
  };

  const handleSubmit = async (data: TenantChatFormData) => {
    console.log('Completed tenant data:', data);
    // Process the submission
  };

  return (
    <div className="min-h-screen bg-page p-4">
      <TenantProvisioningChat
        initialData={savedProgress}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/**
 * Example 3: With Auto-Save
 *
 * Save progress as user fills in each section.
 */
export function AutoSaveExample() {
  const [savedData, setSavedData] = React.useState<Partial<TenantChatFormData>>({});

  const handleSubmit = async (data: TenantChatFormData) => {
    // Clear saved data on successful submission
    localStorage.removeItem('tenant-progress');
    console.log('Final submission:', data);
  };

  // Note: To implement auto-save, you would need to modify the component
  // to expose an onChange callback or use a form library like react-hook-form

  return (
    <div className="min-h-screen bg-page p-4">
      <TenantProvisioningChat
        initialData={savedData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/**
 * Example 4: In a Dialog/Modal
 *
 * Show the provisioning flow in a modal dialog.
 */
export function ModalExample() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = async (data: TenantChatFormData) => {
    console.log('Tenant created:', data);
    setIsOpen(false);
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-accent text-inverse rounded-md hover:opacity-90"
      >
        Create New Tenant
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-default flex justify-between items-center">
              <h2 className="text-lg font-semibold">Create Tenant</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-primary"
              >
                Close
              </button>
            </div>
            <TenantProvisioningChat onSubmit={handleSubmit} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: With Custom Styling
 *
 * Wrap the component with custom container styles.
 */
export function StyledExample() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Get Started with Your Account
          </h1>
          <p className="text-secondary">
            Complete the setup to provision your new tenant environment.
          </p>
        </div>

        {/* Chat Component */}
        <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
          <TenantProvisioningChat
            onSubmit={(data) => console.log('Submitted:', data)}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted">
          Need help? Contact support@example.com
        </div>
      </div>
    </div>
  );
}
