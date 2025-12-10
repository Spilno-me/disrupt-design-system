import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Zap,
  ClipboardList,
  FileText,
  Building2,
  Network,
  DollarSign,
  Settings,
  Plus,
  Grid3X3,
  Clock,
  CheckCircle,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import { AppSidebar, NavItem } from '../../components/ui/AppSidebar'
import { AppHeader } from '../../components/ui/AppHeader'
import { AppFooter } from '../../components/ui/AppFooter'
import { BottomNav } from '../../components/ui/BottomNav'
import { GridBlobBackground } from '../../components/ui/GridBlobCanvas'
import { DataTable, ColumnDef } from '../../components/ui/DataTable'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Pagination } from '../../components/ui/Pagination'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../../components/ui/sheet'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { cn } from '../../lib/utils'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta = {
  title: 'Pages/Partner/TenantRequests',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// TYPES
// =============================================================================

type RequestStatus = 'pending_payment' | 'pending_approval' | 'approved' | 'rejected' | 'provisioned'

interface TenantRequest {
  id: string
  requestId: string
  companyName: string
  legalName?: string
  industry?: string
  companySize?: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  contactTitle?: string
  expectedUsers: number
  monthlyRate: number
  annualTotal: number
  status: RequestStatus
  createdAt: Date
  submittedAt?: Date
  paymentMethod?: string
  billingAddress?: {
    country?: string
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  commissionEligible: boolean
  partnerName?: string
  notes?: string
}

// =============================================================================
// MOCK DATA
// =============================================================================

const partnerNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    href: '/dashboard',
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: <Users />,
    href: '/leads',
    badge: 6,
  },
  {
    id: 'tenant-provisioning',
    label: 'Tenant Provisioning',
    icon: <Zap />,
    href: '/tenant-provisioning',
  },
  {
    id: 'tenant-requests',
    label: 'Tenant Requests',
    icon: <ClipboardList />,
    href: '/tenant-requests',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: <FileText />,
    href: '/invoices',
  },
  {
    id: 'partners',
    label: 'Partners',
    icon: <Building2 />,
    href: '/partners',
  },
  {
    id: 'partner-network',
    label: 'Partner Network',
    icon: <Network />,
    href: '/partner-network',
  },
  {
    id: 'pricing-calculator',
    label: 'Pricing Calculator',
    icon: <DollarSign />,
    href: '/pricing-calculator',
  },
]

const mockTenantRequests: TenantRequest[] = [
  {
    id: '1',
    requestId: 'REQ-20251208-5313',
    companyName: 'Acme Manufacturing Inc.',
    legalName: 'Acme Manufacturing Incorporated',
    industry: 'Manufacturing',
    companySize: '100-500',
    contactName: 'John Smith',
    contactEmail: 'john.smith@acme-mfg.com',
    contactPhone: '+1-555-0101',
    contactTitle: 'Operations Director',
    expectedUsers: 1000,
    monthlyRate: 18416.67,
    annualTotal: 221000.04,
    status: 'pending_payment',
    createdAt: new Date('2025-12-08T16:09:00'),
    submittedAt: new Date('2025-12-08T16:09:00'),
    paymentMethod: 'invoice',
    billingAddress: {
      country: 'US',
      street: '123 Industrial Way',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
    },
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '2',
    requestId: 'REQ-20251207-4821',
    companyName: 'TechStart Solutions',
    legalName: 'TechStart Solutions LLC',
    industry: 'Technology',
    companySize: '50-100',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@techstart.io',
    contactPhone: '+1-555-0202',
    contactTitle: 'CEO',
    expectedUsers: 75,
    monthlyRate: 1687.50,
    annualTotal: 20250.00,
    status: 'pending_payment',
    createdAt: new Date('2025-12-07T14:30:00'),
    submittedAt: new Date('2025-12-07T14:35:00'),
    paymentMethod: 'credit_card',
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '3',
    requestId: 'REQ-20251206-3942',
    companyName: 'Green Energy Corp',
    legalName: 'Green Energy Corporation',
    industry: 'Energy',
    companySize: '500-1000',
    contactName: 'Michael Chen',
    contactEmail: 'mchen@greenenergy.com',
    contactPhone: '+1-555-0303',
    contactTitle: 'CTO',
    expectedUsers: 500,
    monthlyRate: 8750.00,
    annualTotal: 105000.00,
    status: 'approved',
    createdAt: new Date('2025-12-06T09:15:00'),
    submittedAt: new Date('2025-12-06T09:20:00'),
    paymentMethod: 'invoice',
    billingAddress: {
      country: 'US',
      street: '456 Renewable Blvd',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '4',
    requestId: 'REQ-20251205-2847',
    companyName: 'Pacific Logistics',
    legalName: 'Pacific Logistics International Inc.',
    industry: 'Logistics',
    companySize: '100-500',
    contactName: 'David Kim',
    contactEmail: 'david.kim@pacificlog.com',
    contactPhone: '+1-555-0404',
    contactTitle: 'VP Operations',
    expectedUsers: 250,
    monthlyRate: 4375.00,
    annualTotal: 52500.00,
    status: 'pending_payment',
    createdAt: new Date('2025-12-05T11:45:00'),
    submittedAt: new Date('2025-12-05T11:50:00'),
    paymentMethod: 'credit_card',
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '5',
    requestId: 'REQ-20251204-1756',
    companyName: 'HealthFirst Medical',
    legalName: 'HealthFirst Medical Group LLC',
    industry: 'Healthcare',
    companySize: '500-1000',
    contactName: 'Amanda Williams',
    contactEmail: 'a.williams@healthfirst.org',
    contactPhone: '+1-555-0505',
    contactTitle: 'Compliance Officer',
    expectedUsers: 800,
    monthlyRate: 14000.00,
    annualTotal: 168000.00,
    status: 'pending_payment',
    createdAt: new Date('2025-12-04T08:30:00'),
    submittedAt: new Date('2025-12-04T08:35:00'),
    paymentMethod: 'invoice',
    billingAddress: {
      country: 'US',
      street: '789 Medical Center Dr',
      city: 'Boston',
      state: 'MA',
      zip: '02108',
    },
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '6',
    requestId: 'REQ-20251203-0965',
    companyName: 'BuildRight Construction',
    legalName: 'BuildRight Construction Co.',
    industry: 'Construction',
    companySize: '50-100',
    contactName: 'Robert Martinez',
    contactEmail: 'rmartinez@buildright.com',
    contactPhone: '+1-555-0606',
    contactTitle: 'Safety Manager',
    expectedUsers: 60,
    monthlyRate: 1350.00,
    annualTotal: 16200.00,
    status: 'pending_payment',
    createdAt: new Date('2025-12-03T13:20:00'),
    submittedAt: new Date('2025-12-03T13:25:00'),
    paymentMethod: 'credit_card',
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '7',
    requestId: 'REQ-20251202-8734',
    companyName: 'Oceanic Shipping',
    legalName: 'Oceanic Shipping International',
    industry: 'Shipping',
    companySize: '1000+',
    contactName: 'Jennifer Lee',
    contactEmail: 'jlee@oceanicship.com',
    contactPhone: '+1-555-0707',
    contactTitle: 'Director of Compliance',
    expectedUsers: 1500,
    monthlyRate: 26250.00,
    annualTotal: 315000.00,
    status: 'pending_payment',
    createdAt: new Date('2025-12-02T10:00:00'),
    submittedAt: new Date('2025-12-02T10:05:00'),
    paymentMethod: 'invoice',
    billingAddress: {
      country: 'US',
      street: '321 Harbor Blvd',
      city: 'Long Beach',
      state: 'CA',
      zip: '90802',
    },
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '8',
    requestId: 'REQ-20251201-7623',
    companyName: 'Apex Chemicals',
    legalName: 'Apex Chemicals Ltd.',
    industry: 'Chemicals',
    companySize: '100-500',
    contactName: 'Thomas Anderson',
    contactEmail: 'tanderson@apexchem.com',
    contactPhone: '+1-555-0808',
    contactTitle: 'EHS Manager',
    expectedUsers: 300,
    monthlyRate: 5250.00,
    annualTotal: 63000.00,
    status: 'pending_payment',
    createdAt: new Date('2025-12-01T15:45:00'),
    submittedAt: new Date('2025-12-01T15:50:00'),
    paymentMethod: 'credit_card',
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '9',
    requestId: 'REQ-20251130-6512',
    companyName: 'Metro Transit Authority',
    legalName: 'Metro Transit Authority',
    industry: 'Government',
    companySize: '1000+',
    contactName: 'Patricia Davis',
    contactEmail: 'pdavis@metrotransit.gov',
    contactPhone: '+1-555-0909',
    contactTitle: 'Safety Director',
    expectedUsers: 2000,
    monthlyRate: 35000.00,
    annualTotal: 420000.00,
    status: 'pending_payment',
    createdAt: new Date('2025-11-30T09:00:00'),
    submittedAt: new Date('2025-11-30T09:10:00'),
    paymentMethod: 'invoice',
    billingAddress: {
      country: 'US',
      street: '100 Transit Plaza',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
    },
    commissionEligible: false,
    partnerName: 'Partner Solutions LLC',
    notes: 'Government contract - special pricing applied',
  },
  {
    id: '10',
    requestId: 'REQ-20251129-5401',
    companyName: 'FreshFarms Agriculture',
    legalName: 'FreshFarms Agricultural Co.',
    industry: 'Agriculture',
    companySize: '50-100',
    contactName: 'Nancy Wilson',
    contactEmail: 'nwilson@freshfarms.com',
    contactPhone: '+1-555-1010',
    contactTitle: 'Operations Manager',
    expectedUsers: 45,
    monthlyRate: 1012.50,
    annualTotal: 12150.00,
    status: 'pending_payment',
    createdAt: new Date('2025-11-29T14:00:00'),
    submittedAt: new Date('2025-11-29T14:05:00'),
    paymentMethod: 'credit_card',
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '11',
    requestId: 'REQ-20251128-4390',
    companyName: 'Sterling Aerospace',
    legalName: 'Sterling Aerospace Inc.',
    industry: 'Aerospace',
    companySize: '500-1000',
    contactName: 'Christopher Brown',
    contactEmail: 'cbrown@sterlingaero.com',
    contactPhone: '+1-555-1111',
    contactTitle: 'Quality Assurance Director',
    expectedUsers: 750,
    monthlyRate: 13125.00,
    annualTotal: 157500.00,
    status: 'pending_payment',
    createdAt: new Date('2025-11-28T11:30:00'),
    submittedAt: new Date('2025-11-28T11:35:00'),
    paymentMethod: 'invoice',
    billingAddress: {
      country: 'US',
      street: '555 Aerospace Way',
      city: 'Wichita',
      state: 'KS',
      zip: '67201',
    },
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '12',
    requestId: 'REQ-20251127-3279',
    companyName: 'Pinnacle Hotels',
    legalName: 'Pinnacle Hotels & Resorts Inc.',
    industry: 'Hospitality',
    companySize: '1000+',
    contactName: 'Lisa Thompson',
    contactEmail: 'lthompson@pinnaclehotels.com',
    contactPhone: '+1-555-1212',
    contactTitle: 'VP of Safety',
    expectedUsers: 1200,
    monthlyRate: 21000.00,
    annualTotal: 252000.00,
    status: 'pending_payment',
    createdAt: new Date('2025-11-27T16:00:00'),
    submittedAt: new Date('2025-11-27T16:05:00'),
    paymentMethod: 'invoice',
    billingAddress: {
      country: 'US',
      street: '888 Hotel Row',
      city: 'Las Vegas',
      state: 'NV',
      zip: '89101',
    },
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '13',
    requestId: 'REQ-20251126-2168',
    companyName: 'DataSecure Inc',
    legalName: 'DataSecure Incorporated',
    industry: 'Technology',
    companySize: '100-500',
    contactName: 'Kevin Scott',
    contactEmail: 'kscott@datasecure.com',
    contactPhone: '+1-555-1313',
    contactTitle: 'CISO',
    expectedUsers: 150,
    monthlyRate: 2625.00,
    annualTotal: 31500.00,
    status: 'pending_payment',
    createdAt: new Date('2025-11-26T10:15:00'),
    submittedAt: new Date('2025-11-26T10:20:00'),
    paymentMethod: 'credit_card',
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '14',
    requestId: 'REQ-20251125-1057',
    companyName: 'BioGen Pharmaceuticals',
    legalName: 'BioGen Pharmaceuticals Corp.',
    industry: 'Pharmaceuticals',
    companySize: '500-1000',
    contactName: 'Laura Mitchell',
    contactEmail: 'lmitchell@biogen.com',
    contactPhone: '+1-555-1414',
    contactTitle: 'Regulatory Affairs Director',
    expectedUsers: 600,
    monthlyRate: 10500.00,
    annualTotal: 126000.00,
    status: 'pending_payment',
    createdAt: new Date('2025-11-25T13:45:00'),
    submittedAt: new Date('2025-11-25T13:50:00'),
    paymentMethod: 'invoice',
    billingAddress: {
      country: 'US',
      street: '200 Biotech Park',
      city: 'San Diego',
      state: 'CA',
      zip: '92121',
    },
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
  {
    id: '15',
    requestId: 'REQ-20251124-0946',
    companyName: 'Mountain Mining Co',
    legalName: 'Mountain Mining Company LLC',
    industry: 'Mining',
    companySize: '100-500',
    contactName: 'Steven Harris',
    contactEmail: 'sharris@mountainmining.com',
    contactPhone: '+1-555-1515',
    contactTitle: 'Safety Coordinator',
    expectedUsers: 200,
    monthlyRate: 3500.00,
    annualTotal: 42000.00,
    status: 'pending_payment',
    createdAt: new Date('2025-11-24T08:00:00'),
    submittedAt: new Date('2025-11-24T08:05:00'),
    paymentMethod: 'credit_card',
    commissionEligible: true,
    partnerName: 'Partner Solutions LLC',
  },
]

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function StatusBadge({ status }: { status: RequestStatus }) {
  const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
    pending_payment: {
      label: 'Pending Payment',
      className: 'bg-warningLight text-warning border border-warning/30',
    },
    pending_approval: {
      label: 'Pending Approval',
      className: 'bg-infoLight text-info border border-info/30',
    },
    approved: {
      label: 'Approved',
      className: 'bg-successLight text-success border border-success/30',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-errorLight text-error border border-error/30',
    },
    provisioned: {
      label: 'Provisioned',
      className: 'bg-accentBg text-teal border border-teal/30',
    },
  }

  const config = statusConfig[status]

  return (
    <span className={cn('inline-flex px-2 py-0.5 text-xs font-semibold rounded', config.className)}>
      {config.label}
    </span>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBgClass: string
}

function StatCard({ title, value, icon, iconBgClass }: StatCardProps) {
  return (
    <Card variant="elevated" className="gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondary font-medium">{title}</span>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconBgClass)}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-semibold text-primary">{value}</div>
    </Card>
  )
}

// =============================================================================
// TENANT REQUEST DETAILS SHEET
// =============================================================================

interface TenantRequestDetailsSheetProps {
  request: TenantRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (request: TenantRequest) => void
}

function TenantRequestDetailsSheet({
  request,
  open,
  onOpenChange,
  onSave,
}: TenantRequestDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [editedRequest, setEditedRequest] = useState<TenantRequest | null>(null)

  // Reset edited request when sheet opens with new request
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && request) {
      setEditedRequest({ ...request })
      setActiveTab('overview')
    }
    onOpenChange(newOpen)
  }

  if (!request || !editedRequest) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleFieldChange = (field: keyof TenantRequest, value: string | number) => {
    setEditedRequest({ ...editedRequest, [field]: value })
  }

  const handleBillingChange = (field: string, value: string) => {
    setEditedRequest({
      ...editedRequest,
      billingAddress: {
        ...editedRequest.billingAddress,
        [field]: value,
      },
    })
  }

  const handleSave = () => {
    if (onSave && editedRequest) {
      onSave(editedRequest)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto" hideCloseButton>
        <SheetHeader className="border-b border-default pb-4">
          <div className="flex items-start justify-between pr-8">
            <div>
              <SheetTitle className="text-lg font-semibold text-primary">
                Tenant Request Details
              </SheetTitle>
              <SheetDescription className="text-sm text-secondary mt-1">
                Created {formatDate(request.createdAt)} - Status: {request.status.replace('_', ' ')}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-mutedBg rounded-md transition-colors"
                onClick={() => console.log('Edit mode')}
              >
                <Pencil className="w-4 h-4 text-secondary" />
              </button>
              <button
                className="p-2 hover:bg-mutedBg rounded-md transition-colors"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4 text-secondary" />
              </button>
            </div>
          </div>
        </SheetHeader>

        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 pt-4">
              {/* Request ID & Status */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">{request.requestId}</span>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="text-sm text-secondary mt-1">{request.companyName}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(request.annualTotal)}/year
                  </p>
                  <p className="text-sm text-secondary">
                    {formatCurrency(request.monthlyRate)}/month
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-mutedBg rounded-lg">
                  <p className="text-xs text-secondary uppercase font-medium">Created</p>
                  <p className="text-sm text-primary font-medium mt-1">
                    {formatDate(request.createdAt)}
                  </p>
                </div>
                {request.submittedAt && (
                  <div className="p-3 bg-mutedBg rounded-lg">
                    <p className="text-xs text-secondary uppercase font-medium">Submitted</p>
                    <p className="text-sm text-primary font-medium mt-1">
                      {formatDate(request.submittedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Partner & Commission */}
              <div className="p-4 border border-teal/30 bg-accentBg rounded-lg">
                <p className="text-sm font-semibold text-primary">Partner & Commission</p>
                <div className="mt-2 space-y-1">
                  {request.partnerName && (
                    <p className="text-sm text-secondary">Partner: {request.partnerName}</p>
                  )}
                  <p className="text-sm text-secondary">
                    Commission Eligible:{' '}
                    <span className={request.commissionEligible ? 'text-success' : 'text-error'}>
                      {request.commissionEligible ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-default">
                <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </TabsContent>

            {/* Company Tab */}
            <TabsContent value="company" className="space-y-6 pt-4">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-4">Company Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={editedRequest.companyName}
                      onChange={(e) => handleFieldChange('companyName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legalName">Legal Name</Label>
                    <Input
                      id="legalName"
                      value={editedRequest.legalName || ''}
                      onChange={(e) => handleFieldChange('legalName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={editedRequest.industry || ''}
                      onChange={(e) => handleFieldChange('industry', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size *</Label>
                    <Select
                      value={editedRequest.companySize || ''}
                      onValueChange={(value) => handleFieldChange('companySize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="50-100">50-100 employees</SelectItem>
                        <SelectItem value="100-500">100-500 employees</SelectItem>
                        <SelectItem value="500-1000">500-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedUsers">Expected Users *</Label>
                    <Input
                      id="expectedUsers"
                      type="number"
                      value={editedRequest.expectedUsers}
                      onChange={(e) => handleFieldChange('expectedUsers', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-default">
                <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button variant="accent" className="flex-1" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6 pt-4">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-4">Primary Contact Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={editedRequest.contactName}
                      onChange={(e) => handleFieldChange('contactName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={editedRequest.contactEmail}
                      onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      value={editedRequest.contactPhone || ''}
                      onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                      placeholder="E.164 format (e.g., +1-555-0100)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactTitle">Title</Label>
                    <Input
                      id="contactTitle"
                      value={editedRequest.contactTitle || ''}
                      onChange={(e) => handleFieldChange('contactTitle', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-default">
                <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button variant="accent" className="flex-1" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-6 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-teal" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-primary">Pricing Details</h3>
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-warningLight text-warning border border-warning/30">
                      Legacy Format
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-mutedBg rounded-lg">
                <p className="text-sm text-secondary">
                  This request uses legacy pricing format. V19 pricing breakdown not available.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-default">
                  <span className="text-sm text-secondary">Monthly Rate</span>
                  <span className="text-lg font-semibold text-primary">
                    {formatCurrency(request.monthlyRate)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-secondary">Annual Total</span>
                  <span className="text-lg font-semibold text-primary">
                    {formatCurrency(request.annualTotal)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-default">
                <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button variant="accent" className="flex-1" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6 pt-4">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method *</Label>
                    <Select
                      value={editedRequest.paymentMethod || ''}
                      onValueChange={(value) => handleFieldChange('paymentMethod', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                        <SelectItem value="ach">ACH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary mb-4">Address (Optional)</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={editedRequest.billingAddress?.country || ''}
                      onValueChange={(value) => handleBillingChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Textarea
                      id="street"
                      value={editedRequest.billingAddress?.street || ''}
                      onChange={(e) => handleBillingChange('street', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={editedRequest.billingAddress?.city || ''}
                        onChange={(e) => handleBillingChange('city', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={editedRequest.billingAddress?.state || ''}
                        onChange={(e) => handleBillingChange('state', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input
                      id="zip"
                      value={editedRequest.billingAddress?.zip || ''}
                      onChange={(e) => handleBillingChange('zip', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-default">
                <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button variant="accent" className="flex-1" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// =============================================================================
// TENANT REQUESTS PAGE CONTENT
// =============================================================================

function TenantRequestsPageContent() {
  const [requests] = useState<TenantRequest[]>(mockTenantRequests)
  const [selectedRequest, setSelectedRequest] = useState<TenantRequest | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Calculate stats
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending_payment' || r.status === 'pending_approval').length,
    approved: requests.filter((r) => r.status === 'approved' || r.status === 'provisioned').length,
    totalValue: requests.reduce((sum, r) => sum + r.monthlyRate, 0),
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  // Define table columns
  const columns: ColumnDef<TenantRequest>[] = [
    {
      id: 'company',
      header: 'Company',
      accessor: (row) => (
        <div>
          <p className="font-medium text-primary">{row.companyName}</p>
          <p className="text-xs text-secondary">{row.requestId}</p>
        </div>
      ),
      sortable: true,
      sortValue: (row) => row.companyName.toLowerCase(),
      minWidth: '200px',
    },
    {
      id: 'contact',
      header: 'Contact',
      accessor: (row) => (
        <div>
          <p className="font-medium text-primary">{row.contactName}</p>
          <p className="text-xs text-teal">{row.contactEmail}</p>
        </div>
      ),
      sortable: true,
      sortValue: (row) => row.contactName.toLowerCase(),
      minWidth: '180px',
    },
    {
      id: 'users',
      header: 'Users',
      accessor: (row) => (
        <span className="font-medium text-primary">{row.expectedUsers.toLocaleString()}</span>
      ),
      sortable: true,
      sortValue: (row) => row.expectedUsers,
      minWidth: '80px',
      align: 'center',
    },
    {
      id: 'monthlyCost',
      header: 'Monthly Cost',
      accessor: (row) => (
        <span className="font-medium text-primary">{formatCurrency(row.monthlyRate)}</span>
      ),
      sortable: true,
      sortValue: (row) => row.monthlyRate,
      minWidth: '120px',
      align: 'right',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
      sortable: true,
      sortValue: (row) => row.status,
      minWidth: '140px',
      align: 'center',
    },
    {
      id: 'created',
      header: 'Created',
      accessor: (row) => (
        <span className="text-secondary text-sm">{formatDate(row.createdAt)}</span>
      ),
      sortable: true,
      sortValue: (row) => row.createdAt,
      minWidth: '100px',
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="text-teal hover:text-teal/80 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedRequest(row)
              setSheetOpen(true)
            }}
          >
            Edit
          </button>
          <button
            className="text-error hover:text-error/80 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation()
              console.log('Delete request:', row.id)
            }}
          >
            Delete
          </button>
        </div>
      ),
      minWidth: '100px',
      align: 'center',
    },
  ]

  // Paginate data
  const paginatedRequests = requests.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="relative min-h-full bg-white">
      <GridBlobBackground scale={2} />

      <div className="relative z-10 flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-primary">Tenant Requests</h1>
            <p className="text-sm text-secondary mt-1">
              View all tenant provisioning requests submitted through the platform
            </p>
          </div>
          <Button
            variant="accent"
            onClick={() => {
              console.log('Navigate to new tenant request')
              alert('Navigate to /tenant-provisioning')
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Tenant Request
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Requests"
            value={stats.total}
            icon={<Grid3X3 className="w-4 h-4 text-secondary" />}
            iconBgClass="bg-mutedBg"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock className="w-4 h-4 text-warning" />}
            iconBgClass="bg-warningLight"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircle className="w-4 h-4 text-success" />}
            iconBgClass="bg-successLight"
          />
          <StatCard
            title="Total Value"
            value={formatCurrency(stats.totalValue)}
            icon={<DollarSign className="w-4 h-4 text-teal" />}
            iconBgClass="bg-accentBg"
          />
        </div>

        {/* Data Table */}
        <DataTable
          data={paginatedRequests}
          columns={columns}
          getRowId={(row) => row.id}
          hoverable
          bordered
          onRowClick={(row) => {
            setSelectedRequest(row)
            setSheetOpen(true)
          }}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={requests.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          showPageSizeSelector
          showResultsText
          showFirstLastButtons
        />
      </div>

      {/* Details Sheet */}
      <TenantRequestDetailsSheet
        request={selectedRequest}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSave={(updated) => {
          console.log('Saving request:', updated)
          alert(`Saved changes for ${updated.companyName}`)
          setSheetOpen(false)
        }}
      />
    </div>
  )
}

// =============================================================================
// FULL PAGE COMPONENT
// =============================================================================

function TenantRequestsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('tenant-requests')

  const handleNavigate = (item: NavItem) => {
    setActiveNavItem(item.id)
    console.log('Navigate to:', item.href)
  }

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      {/* Grid blob background over white */}
      <GridBlobBackground scale={1} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* App Header */}
        <AppHeader
          product="partner"
          showNotifications={false}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={(item) => console.log('Menu item clicked:', item.id)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden md:block">
            <AppSidebar
              product="partner"
              items={partnerNavItems}
              activeItemId={activeNavItem}
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              onNavigate={handleNavigate}
              showHelpItem={true}
              onHelpClick={() => console.log('Help clicked')}
            />
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <TenantRequestsPageContent />
          </main>
        </div>

        {/* Footer - compact on mobile, full on desktop */}
        <AppFooter compactOnMobile />

        {/* Mobile Bottom Navigation */}
        <BottomNav
          items={partnerNavItems}
          activeItemId={activeNavItem}
          onNavigate={handleNavigate}
          maxVisibleItems={3}
          showHelpItem
          onHelpClick={() => console.log('Help clicked')}
        />
      </div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  render: () => <TenantRequestsPage />,
}

// Sidebar expanded by default
function TenantRequestsPageExpanded() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('tenant-requests')

  return (
    <div className="relative flex flex-col h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10 flex flex-col h-full">
        <AppHeader
          product="partner"
          showNotifications={false}
          user={{
            name: 'John Partner',
            email: 'john@partnercompany.com',
          }}
          menuItems={[
            { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            { id: 'logout', label: 'Log out', destructive: true },
          ]}
          onMenuItemClick={(item) => console.log('Menu item clicked:', item.id)}
        />

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar
            product="partner"
            items={partnerNavItems}
            activeItemId={activeNavItem}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            onNavigate={(item) => setActiveNavItem(item.id)}
          />

          <main className="flex-1 overflow-auto">
            <TenantRequestsPageContent />
          </main>
        </div>
      </div>
    </div>
  )
}

export const SidebarExpanded: Story = {
  render: () => <TenantRequestsPageExpanded />,
}

// Content only (no sidebar/header) for embedding
export const ContentOnly: Story = {
  render: () => (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <GridBlobBackground scale={1} />
      <div className="relative z-10">
        <TenantRequestsPageContent />
      </div>
    </div>
  ),
}

// Mobile viewport
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => {
    const [activeNavItem, setActiveNavItem] = useState('tenant-requests')

    return (
      <div className="relative flex flex-col h-screen bg-white overflow-hidden">
        <GridBlobBackground scale={1} />
        <div className="relative z-10 flex flex-col h-full">
          <AppHeader
            product="partner"
            showNotifications={false}
            user={{
              name: 'John Partner',
              email: 'john@partnercompany.com',
            }}
            menuItems={[
              { id: 'profile', label: 'Profile' },
              { id: 'settings', label: 'Settings' },
              { id: 'logout', label: 'Log out', destructive: true },
            ]}
            onMenuItemClick={(item) => console.log('Menu item clicked:', item.id)}
          />

          <main className="flex-1 overflow-auto">
            <TenantRequestsPageContent />
          </main>

          <AppFooter compactOnMobile />

          <BottomNav
            items={partnerNavItems}
            activeItemId={activeNavItem}
            onNavigate={(item) => setActiveNavItem(item.id)}
            maxVisibleItems={3}
            showHelpItem
            onHelpClick={() => console.log('Help clicked')}
          />
        </div>
      </div>
    )
  },
}

// Empty state
export const EmptyRequests: Story = {
  render: () => {
    function EmptyContent() {
      return (
        <div className="relative min-h-full bg-white">
          <GridBlobBackground scale={2} />

          <div className="relative z-10 flex flex-col gap-6 p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-primary">Tenant Requests</h1>
                <p className="text-sm text-secondary mt-1">
                  View all tenant provisioning requests submitted through the platform
                </p>
              </div>
              <Button variant="accent">
                <Plus className="w-4 h-4 mr-2" />
                New Tenant Request
              </Button>
            </div>

            {/* Stats Cards - all zeros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Requests"
                value={0}
                icon={<Grid3X3 className="w-4 h-4 text-secondary" />}
                iconBgClass="bg-mutedBg"
              />
              <StatCard
                title="Pending"
                value={0}
                icon={<Clock className="w-4 h-4 text-warning" />}
                iconBgClass="bg-warningLight"
              />
              <StatCard
                title="Approved"
                value={0}
                icon={<CheckCircle className="w-4 h-4 text-success" />}
                iconBgClass="bg-successLight"
              />
              <StatCard
                title="Total Value"
                value="$0.00"
                icon={<DollarSign className="w-4 h-4 text-teal" />}
                iconBgClass="bg-accentBg"
              />
            </div>

            {/* Empty Table */}
            <DataTable
              data={[]}
              columns={[
                { id: 'company', header: 'Company', accessor: () => '', minWidth: '200px' },
                { id: 'contact', header: 'Contact', accessor: () => '', minWidth: '180px' },
                { id: 'users', header: 'Users', accessor: () => '', minWidth: '80px' },
                { id: 'monthlyCost', header: 'Monthly Cost', accessor: () => '', minWidth: '120px' },
                { id: 'status', header: 'Status', accessor: () => '', minWidth: '140px' },
                { id: 'created', header: 'Created', accessor: () => '', minWidth: '100px' },
                { id: 'actions', header: 'Actions', accessor: () => '', minWidth: '100px' },
              ]}
              getRowId={(row: { id: string }) => row.id}
              emptyState={
                <div className="flex flex-col items-center py-8">
                  <div className="w-16 h-16 mb-4 rounded-full bg-mutedBg flex items-center justify-center">
                    <ClipboardList className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">No tenant requests yet</h3>
                  <p className="text-sm text-secondary text-center max-w-sm mb-4">
                    Get started by creating your first tenant provisioning request.
                  </p>
                  <Button variant="accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Request
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      )
    }

    return (
      <div className="relative min-h-screen bg-white overflow-hidden">
        <GridBlobBackground scale={1} />
        <div className="relative z-10">
          <EmptyContent />
        </div>
      </div>
    )
  },
}

// Tablet viewport
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => <TenantRequestsPage />,
}

// Sheet modal stories
export const DetailsModalOverview: Story = {
  render: () => {
    const [sheetOpen, setSheetOpen] = useState(true)
    const request = mockTenantRequests[0]

    return (
      <div className="relative min-h-screen bg-white overflow-hidden">
        <GridBlobBackground scale={1} />
        <div className="relative z-10 p-6">
          <p className="text-secondary mb-4">
            The details sheet is open by default to show the Overview tab.
          </p>
          <Button variant="accent" onClick={() => setSheetOpen(true)}>
            Open Details
          </Button>
        </div>
        <TenantRequestDetailsSheet
          request={request}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          onSave={(updated) => {
            console.log('Saving:', updated)
            alert(`Saved: ${updated.companyName}`)
          }}
        />
      </div>
    )
  },
}
