/**
 * CompanyTab - Company profile settings
 *
 * Allows users to update their company information including
 * name, address, website, and contact details.
 *
 * @component MOLECULE
 */

import * as React from 'react'
import { useState } from 'react'
import { Building2, MapPin, Globe, Phone, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import type { CompanyTabProps, CompanyProfile } from './types'

export function CompanyTab({
  company: initialCompany,
  loading = false,
  onSaveCompany,
}: CompanyTabProps) {
  const [company, setCompany] = useState<CompanyProfile>(initialCompany)

  const handleSaveCompany = () => {
    onSaveCompany?.(company)
  }

  return (
    <div className="space-y-6 mt-6">
      <Card className="bg-surface border-default">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                id="companyName"
                className="pl-10"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                id="address"
                className="pl-10"
                value={company.address}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
              />
            </div>
          </div>

          {/* City, State, ZIP, Country */}
          <AddressFields company={company} setCompany={setCompany} />

          {/* Website and Phone */}
          <ContactFields company={company} setCompany={setCompany} />

          <div className="flex justify-end pt-4">
            <Button variant="accent" onClick={handleSaveCompany} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface AddressFieldsProps {
  company: CompanyProfile
  setCompany: React.Dispatch<React.SetStateAction<CompanyProfile>>
}

function AddressFields({ company, setCompany }: AddressFieldsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={company.city}
          onChange={(e) => setCompany({ ...company, city: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={company.state}
          onChange={(e) => setCompany({ ...company, state: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="zip">ZIP Code</Label>
        <Input
          id="zip"
          value={company.zip}
          onChange={(e) => setCompany({ ...company, zip: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={company.country}
          onChange={(e) => setCompany({ ...company, country: e.target.value })}
        />
      </div>
    </div>
  )
}

interface ContactFieldsProps {
  company: CompanyProfile
  setCompany: React.Dispatch<React.SetStateAction<CompanyProfile>>
}

function ContactFields({ company, setCompany }: ContactFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            id="website"
            type="url"
            className="pl-10"
            placeholder="https://"
            value={company.website || ''}
            onChange={(e) => setCompany({ ...company, website: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyPhone">Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            id="companyPhone"
            type="tel"
            className="pl-10"
            value={company.phone || ''}
            onChange={(e) => setCompany({ ...company, phone: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

export default CompanyTab
