import { TenantProvisioningChat, type TenantChatFormData } from '../tenant-provisioning-chat/TenantProvisioningChat'

function App() {
  const handleSubmit = (data: TenantChatFormData) => {
    console.log('Form submitted:', data)
    alert('Tenant provisioning complete!\\n\\nCheck console for submitted data.')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TenantProvisioningChat onSubmit={handleSubmit} />
    </div>
  )
}

export default App
