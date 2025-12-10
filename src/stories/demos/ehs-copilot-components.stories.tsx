import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import {
  EHSChat,
  QuickSelect,
  LocationPicker,
  SeverityScale,
  FileUpload,
  SummaryCard,
  DataTable,
  ActionCard,
  IncidentListItem,
  InvitePeople,
  CommentThread,
  severityConfig,
  SAMPLE_LOCATIONS,
  type QuickSelectOption,
  type Location,
  type SeverityLevel,
  type UploadedFile,
  type TeamMember,
  type Comment,
} from "./EHSChat"
import {
  AlertTriangle,
  AlertCircle,
  Shield,
  Zap,
  MapPin,
  Flame,
  FileText,
  User,
  Calendar,
} from "lucide-react"
import { ALIAS, WAVE, SUNRISE, CORAL, HARBOR, ABYSS, DEEP_CURRENT } from "../../constants/designTokens"

const meta: Meta = {
  title: "Flow/EHSCopilot/Components",
  parameters: {
    layout: "padded",
  },
}

export default meta

// =============================================================================
// QUICK SELECT
// =============================================================================

const incidentTypeOptions: QuickSelectOption[] = [
  { id: "1", label: "Injury", value: "injury", icon: <AlertTriangle className="w-4 h-4" />, description: "Physical injury to person" },
  { id: "2", label: "Near Miss", value: "near_miss", icon: <Shield className="w-4 h-4" />, description: "Close call, no injury" },
  { id: "3", label: "Environmental", value: "environmental", icon: <MapPin className="w-4 h-4" />, description: "Spill or release" },
  { id: "4", label: "Equipment Failure", value: "equipment", icon: <Zap className="w-4 h-4" />, description: "Machinery breakdown" },
  { id: "5", label: "Fire/Smoke", value: "fire", icon: <Flame className="w-4 h-4" />, description: "Fire or smoke detected" },
  { id: "6", label: "Other", value: "other", icon: <FileText className="w-4 h-4" />, description: "Other incident type" },
]

export const QuickSelectStory: StoryObj = {
  name: "Quick Select",
  render: () => {
    const [selected, setSelected] = useState<string>("")

    return (
      <div className="max-w-lg space-y-4">
        <h3 className="font-semibold text-dark">Incident Type</h3>
        <QuickSelect
          options={incidentTypeOptions}
          value={selected}
          onChange={(v) => setSelected(v as string)}
          columns={2}
        />
        <p className="text-sm text-muted">Selected: {selected || "None"}</p>
      </div>
    )
  },
}

export const QuickSelectMultiple: StoryObj = {
  name: "Quick Select (Multiple)",
  render: () => {
    const [selected, setSelected] = useState<string[]>([])

    const bodyPartOptions: QuickSelectOption[] = [
      { id: "1", label: "Head", value: "head" },
      { id: "2", label: "Arms", value: "arms" },
      { id: "3", label: "Hands", value: "hands" },
      { id: "4", label: "Back", value: "back" },
      { id: "5", label: "Legs", value: "legs" },
      { id: "6", label: "Feet", value: "feet" },
    ]

    return (
      <div className="max-w-lg space-y-4">
        <h3 className="font-semibold text-dark">Affected Body Parts (select all that apply)</h3>
        <QuickSelect
          options={bodyPartOptions}
          value={selected}
          onChange={(v) => setSelected(v as string[])}
          multiple
          columns={3}
          size="sm"
        />
        <p className="text-sm text-muted">Selected: {selected.join(", ") || "None"}</p>
      </div>
    )
  },
}

export const QuickSelectManyOptions: StoryObj = {
  name: "Quick Select (Many Options)",
  render: () => {
    const [selected, setSelected] = useState<string>("")

    const manyOptions: QuickSelectOption[] = [
      { id: "1", label: "Injury", value: "injury", icon: <AlertTriangle className="w-4 h-4" />, description: "Physical injury to person" },
      { id: "2", label: "Near Miss", value: "near_miss", icon: <Shield className="w-4 h-4" />, description: "Close call, no injury" },
      { id: "3", label: "Environmental", value: "environmental", icon: <MapPin className="w-4 h-4" />, description: "Spill or release" },
      { id: "4", label: "Equipment Failure", value: "equipment", icon: <Zap className="w-4 h-4" />, description: "Machinery breakdown" },
      { id: "5", label: "Fire/Smoke", value: "fire", icon: <Flame className="w-4 h-4" />, description: "Fire or smoke detected" },
      { id: "6", label: "Chemical Exposure", value: "chemical", icon: <AlertCircle className="w-4 h-4" />, description: "Hazardous substance contact" },
      { id: "7", label: "Slip/Trip/Fall", value: "slip", icon: <AlertTriangle className="w-4 h-4" />, description: "Fall-related incident" },
      { id: "8", label: "Vehicle Incident", value: "vehicle", icon: <Zap className="w-4 h-4" />, description: "Vehicle-related accident" },
      { id: "9", label: "Electrical", value: "electrical", icon: <Zap className="w-4 h-4" />, description: "Electrical hazard" },
      { id: "10", label: "Other", value: "other", icon: <FileText className="w-4 h-4" />, description: "Other incident type" },
    ]

    return (
      <div className="max-w-lg space-y-4">
        <h3 className="font-semibold text-dark">Incident Type (10 options, 4 visible)</h3>
        <QuickSelect
          options={manyOptions}
          value={selected}
          onChange={(v) => setSelected(v as string)}
          columns={2}
          maxVisible={4}
          showMoreLabel="Show more types"
        />
        <p className="text-sm text-muted">Selected: {selected || "None"}</p>
      </div>
    )
  },
}

// =============================================================================
// LOCATION PICKER
// =============================================================================

export const LocationPickerStory: StoryObj = {
  name: "Location Picker",
  render: () => {
    const [location, setLocation] = useState<Location | undefined>()

    return (
      <div className="max-w-md space-y-4">
        <h3 className="font-semibold text-dark">Incident Location</h3>
        <LocationPicker
          locations={SAMPLE_LOCATIONS}
          value={location}
          onChange={setLocation}
        />
        <p className="text-sm text-muted">
          Selected: {location ? `${location.name} (${location.code})` : "None"}
        </p>
      </div>
    )
  },
}

// =============================================================================
// SEVERITY SCALE
// =============================================================================

export const SeverityScaleStory: StoryObj = {
  name: "Severity Scale",
  render: () => {
    const [severity, setSeverity] = useState<SeverityLevel | undefined>()

    return (
      <div className="max-w-md space-y-4">
        <h3 className="font-semibold text-dark">Severity Level</h3>
        <SeverityScale
          value={severity}
          onChange={setSeverity}
        />
      </div>
    )
  },
}

export const SeverityScaleCompact: StoryObj = {
  name: "Severity Scale (No Labels)",
  render: () => {
    const [severity, setSeverity] = useState<SeverityLevel>("medium")

    return (
      <div className="max-w-xs space-y-4">
        <h3 className="font-semibold text-dark">Quick Severity</h3>
        <SeverityScale
          value={severity}
          onChange={setSeverity}
          showLabels={false}
        />
      </div>
    )
  },
}

// =============================================================================
// FILE UPLOAD
// =============================================================================

export const FileUploadStory: StoryObj = {
  name: "File Upload",
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([])

    return (
      <div className="max-w-md space-y-4">
        <h3 className="font-semibold text-dark">Attach Photos/Documents</h3>
        <FileUpload
          files={files}
          onChange={setFiles}
          maxFiles={5}
          maxSize={10}
        />
      </div>
    )
  },
}

// =============================================================================
// SUMMARY CARD
// =============================================================================

export const SummaryCardStory: StoryObj = {
  name: "Summary Card",
  render: () => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = () => {
      setIsSubmitting(true)
      setTimeout(() => setIsSubmitting(false), 2000)
    }

    return (
      <div className="max-w-md">
        <SummaryCard
          title="Incident Report Summary"
          severity="high"
          items={[
            { label: "Incident Type", value: "Equipment Failure", icon: <Zap className="w-4 h-4" />, editable: true, onEdit: () => {} },
            { label: "Location", value: "Building A - Heavy Press Station", icon: <MapPin className="w-4 h-4" />, editable: true, onEdit: () => {} },
            { label: "Date & Time", value: "Dec 7, 2025 at 2:30 PM", icon: <Calendar className="w-4 h-4" /> },
            { label: "Description", value: "Hydraulic press #3 experienced sudden pressure loss during operation. Emergency stop activated. No injuries reported.", icon: <FileText className="w-4 h-4" />, editable: true, onEdit: () => {} },
            { label: "Reported By", value: "John Smith", icon: <User className="w-4 h-4" /> },
          ]}
          onSubmit={handleSubmit}
          onCancel={() => {}}
          isSubmitting={isSubmitting}
        />
      </div>
    )
  },
}

// =============================================================================
// DATA TABLE
// =============================================================================

interface IncidentRecord {
  id: string
  title: string
  severity: string
  status: string
  date: string
}

const sampleIncidents: IncidentRecord[] = [
  { id: "INC-001", title: "Slip and fall near loading dock", severity: "Medium", status: "Open", date: "Dec 7, 2025" },
  { id: "INC-002", title: "Chemical spill in Lab D", severity: "High", status: "In Progress", date: "Dec 6, 2025" },
  { id: "INC-003", title: "Near miss - forklift", severity: "Low", status: "Resolved", date: "Dec 5, 2025" },
  { id: "INC-004", title: "Equipment malfunction", severity: "Critical", status: "Open", date: "Dec 5, 2025" },
]

export const DataTableStory: StoryObj = {
  name: "Data Table",
  render: () => {
    return (
      <div className="max-w-2xl">
        <h3 className="font-semibold text-dark mb-4">Recent Incidents</h3>
        <DataTable
          columns={[
            { key: "id", header: "ID", width: "100px" },
            { key: "title", header: "Title" },
            { key: "severity", header: "Severity", width: "100px" },
            { key: "status", header: "Status", width: "100px" },
            { key: "date", header: "Date", width: "120px" },
          ]}
          data={sampleIncidents}
          onRowClick={(item) => console.log("Clicked:", item)}
        />
      </div>
    )
  },
}

// =============================================================================
// ACTION CARD
// =============================================================================

export const ActionCardStory: StoryObj = {
  name: "Action Card",
  render: () => {
    return (
      <div className="max-w-md space-y-4">
        <ActionCard
          title="Safety Inspection Required"
          description="Quarterly safety inspection for Building A production floor is due. Please complete the inspection checklist and submit findings."
          status="pending"
          assignee="John Smith"
          dueDate="Dec 15, 2025"
          priority="high"
          onApprove={() => console.log("Approved")}
          onReject={() => console.log("Rejected")}
          onViewDetails={() => console.log("View Details")}
        />

        <ActionCard
          title="PPE Training Completed"
          description="Annual PPE training for warehouse team has been completed successfully."
          status="approved"
          assignee="Safety Team"
          dueDate="Dec 1, 2025"
          onViewDetails={() => console.log("View Details")}
        />

        <ActionCard
          title="Incident Investigation"
          description="Investigation ongoing for chemical spill incident INC-002."
          status="in_review"
          assignee="EHS Manager"
          priority="medium"
          onViewDetails={() => console.log("View Details")}
        />
      </div>
    )
  },
}

// =============================================================================
// INCIDENT LIST ITEM
// =============================================================================

export const IncidentListItemStory: StoryObj = {
  name: "Incident List Item",
  render: () => {
    return (
      <div className="max-w-xl space-y-3">
        <IncidentListItem
          id="INC-2025-001"
          title="Hydraulic press emergency stop activated"
          category="Equipment"
          severity="high"
          location="Building A - Press Station"
          dateTime="Dec 7, 2025 at 2:30 PM"
          status="open"
          onClick={() => console.log("Clicked")}
        />

        <IncidentListItem
          id="INC-2025-002"
          title="Chemical spill in laboratory D"
          category="Environmental"
          severity="critical"
          location="Building D - Chemical Lab"
          dateTime="Dec 6, 2025 at 10:15 AM"
          status="in_progress"
          onClick={() => console.log("Clicked")}
        />

        <IncidentListItem
          id="INC-2025-003"
          title="Near miss - forklift in pedestrian zone"
          category="Near Miss"
          severity="medium"
          location="Building B - Warehouse"
          dateTime="Dec 5, 2025 at 3:45 PM"
          status="resolved"
          onClick={() => console.log("Clicked")}
        />

        <IncidentListItem
          id="INC-2025-004"
          title="Minor slip on wet floor"
          category="Injury"
          severity="low"
          location="Building C - Break Room"
          dateTime="Dec 4, 2025 at 12:30 PM"
          status="closed"
          onClick={() => console.log("Clicked")}
        />
      </div>
    )
  },
}

// =============================================================================
// FULL WORKFLOW DEMO
// =============================================================================

export const FullWorkflowDemo: StoryObj = {
  name: "Full Workflow Demo",
  render: () => {
    const [step, setStep] = useState(1)
    const [incidentType, setIncidentType] = useState<string>("")
    const [severity, setSeverity] = useState<SeverityLevel | undefined>()
    const [location, setLocation] = useState<Location | undefined>()
    const [files, setFiles] = useState<UploadedFile[]>([])

    return (
      <div className="max-w-lg space-y-6">
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${s <= step ? "bg-teal" : "bg-slate"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-dark">Step 1: What type of incident?</h3>
            <QuickSelect
              options={incidentTypeOptions}
              value={incidentType}
              onChange={(v) => {
                setIncidentType(v as string)
                setTimeout(() => setStep(2), 300)
              }}
              columns={2}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-dark">Step 2: How severe is it?</h3>
            <SeverityScale
              value={severity}
              onChange={(v) => {
                setSeverity(v)
                setTimeout(() => setStep(3), 500)
              }}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-dark">Step 3: Where did it happen?</h3>
            <LocationPicker
              locations={SAMPLE_LOCATIONS}
              value={location}
              onChange={(v) => {
                setLocation(v)
                setTimeout(() => setStep(4), 300)
              }}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-dark">Step 4: Add photos (optional)</h3>
            <FileUpload
              files={files}
              onChange={setFiles}
            />
            <button
              onClick={() => setStep(5)}
              className="w-full py-3 bg-teal text-white rounded-lg font-medium hover:bg-teal/90 transition-colors"
            >
              Continue to Review
            </button>
          </div>
        )}

        {step === 5 && (
          <SummaryCard
            title="Review Your Report"
            severity={severity}
            items={[
              { label: "Type", value: incidentType, editable: true, onEdit: () => setStep(1) },
              { label: "Location", value: location?.name || "-", editable: true, onEdit: () => setStep(3) },
              { label: "Attachments", value: `${files.length} file(s)` },
            ]}
            onSubmit={() => alert("Submitted!")}
            onCancel={() => setStep(1)}
          />
        )}
      </div>
    )
  },
}

// =============================================================================
// INVITE PEOPLE
// =============================================================================

const teamMembers: TeamMember[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@company.com", role: "manager", department: "Production" },
  { id: "2", name: "Michael Rodriguez", email: "m.rodriguez@company.com", role: "safety_officer", department: "EHS" },
  { id: "3", name: "James Wilson", email: "j.wilson@company.com", role: "approver", department: "Operations" },
  { id: "4", name: "Emily Thompson", email: "e.thompson@company.com", role: "reviewer", department: "Quality" },
  { id: "5", name: "David Kim", email: "d.kim@company.com", role: "witness", department: "Production" },
  { id: "6", name: "Lisa Patel", email: "l.patel@company.com", role: "witness", department: "Production" },
  { id: "7", name: "Robert Brown", email: "r.brown@company.com", role: "manager", department: "Warehouse" },
  { id: "8", name: "Jennifer Martinez", email: "j.martinez@company.com", role: "safety_officer", department: "EHS" },
]

export const InvitePeopleStory: StoryObj = {
  name: "Invite People",
  render: () => {
    const [selectedIds, setSelectedIds] = useState<string[]>(["2", "3"])

    const suggestedMembers = teamMembers.filter((m) => ["2", "3", "5"].includes(m.id))

    return (
      <div className="max-w-lg space-y-4">
        <h3 className="font-semibold text-dark">Add Team Members</h3>
        <InvitePeople
          members={teamMembers}
          selectedIds={selectedIds}
          onChange={setSelectedIds}
          suggestedMembers={suggestedMembers}
          onInviteNew={() => console.log("Invite new")}
        />
      </div>
    )
  },
}

// =============================================================================
// COMMENT THREAD
// =============================================================================

export const CommentThreadStory: StoryObj = {
  name: "Comment Thread",
  render: () => {
    const [comments, setComments] = useState<Comment[]>([
      {
        id: "1",
        author: teamMembers[0],
        content: "I've reviewed the incident details. The hydraulic system needs to be checked by maintenance before we can clear the area.",
        timestamp: "2 hours ago",
      },
      {
        id: "2",
        author: teamMembers[1],
        content: "Agreed. I've scheduled maintenance for tomorrow morning. In the meantime, the area is cordoned off.",
        timestamp: "1 hour ago",
      },
      {
        id: "3",
        author: teamMembers[3],
        content: "Root cause analysis needed. Let's discuss in the weekly safety meeting.",
        timestamp: "30 min ago",
        isInternal: true,
      },
    ])

    const currentUser = teamMembers[1]

    const handleAddComment = (content: string, isInternal: boolean) => {
      const newComment: Comment = {
        id: `${Date.now()}`,
        author: currentUser,
        content,
        timestamp: "Just now",
        isInternal,
      }
      setComments([...comments, newComment])
    }

    return (
      <div className="max-w-lg">
        <h3 className="font-semibold text-dark mb-4">Discussion</h3>
        <CommentThread
          comments={comments}
          onAddComment={handleAddComment}
          currentUser={currentUser}
        />
      </div>
    )
  },
}

// =============================================================================
// REPORTER WORKFLOW
// =============================================================================

export const ReporterWorkflow: StoryObj = {
  name: "Reporter Workflow (Complete)",
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const reporter: TeamMember = {
      id: "reporter-1",
      name: "Alex Martinez",
      email: "a.martinez@company.com",
      role: "witness",
      department: "Production",
    }

    const [step, setStep] = useState(1)
    const [incidentType, setIncidentType] = useState<string>("")
    const [severity, setSeverity] = useState<SeverityLevel | undefined>()
    const [location, setLocation] = useState<Location | undefined>()
    const [description, setDescription] = useState("")
    const [bodyParts, setBodyParts] = useState<string[]>([])
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [invitedIds, setInvitedIds] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const bodyPartOptions: QuickSelectOption[] = [
      { id: "1", label: "Head", value: "head", icon: <User className="w-4 h-4" /> },
      { id: "2", label: "Arms", value: "arms" },
      { id: "3", label: "Hands", value: "hands" },
      { id: "4", label: "Back", value: "back" },
      { id: "5", label: "Legs", value: "legs" },
      { id: "6", label: "Feet", value: "feet" },
    ]

    const suggestedTeam = teamMembers.filter((m) =>
      ["safety_officer", "manager"].includes(m.role) && m.department === "Production" || m.department === "EHS"
    )

    const handleSubmit = () => {
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSubmitted(true)
      }, 2000)
    }

    const totalSteps = incidentType === "injury" ? 7 : 6

    if (isSubmitted) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: ALIAS.background.page }}>
          <div className="max-w-md text-center space-y-4">
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
              style={{ backgroundColor: HARBOR[100] }}
            >
              <Shield className="w-8 h-8" style={{ color: HARBOR[600] }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: ABYSS[800] }}>Report Submitted Successfully</h2>
            <p style={{ color: ABYSS[600] }}>
              Your incident report has been submitted. You'll receive updates as the team reviews and investigates.
            </p>
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: WAVE[50], border: `1px solid ${WAVE[200]}` }}
            >
              <p className="text-sm font-medium" style={{ color: WAVE[700] }}>
                Incident ID: INC-2025-042
              </p>
              <p className="text-xs mt-1" style={{ color: WAVE[600] }}>
                Assigned to: Michael Rodriguez (Safety Officer)
              </p>
            </div>
            <button
              onClick={() => {
                setStep(1)
                setIncidentType("")
                setSeverity(undefined)
                setLocation(undefined)
                setDescription("")
                setBodyParts([])
                setFiles([])
                setInvitedIds([])
                setIsSubmitted(false)
              }}
              className="text-sm font-medium"
              style={{ color: DEEP_CURRENT[500] }}
            >
              Report Another Incident
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen" style={{ backgroundColor: ALIAS.background.page }}>
        {/* Header */}
        <div className="px-6 py-4 border-b" style={{ backgroundColor: "white", borderColor: ALIAS.border.default }}>
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: DEEP_CURRENT[500] }}
              >
                AM
              </div>
              <div>
                <p className="font-medium" style={{ color: ABYSS[800] }}>{reporter.name}</p>
                <p className="text-xs" style={{ color: ABYSS[500] }}>Reporting an incident</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: SUNRISE[100], color: SUNRISE[700] }}>
              Reporter View
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 py-3" style={{ backgroundColor: "white" }}>
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: i < step ? DEEP_CURRENT[500] : ABYSS[200],
                  }}
                />
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: ABYSS[500] }}>
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="max-w-lg mx-auto space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: ABYSS[800] }}>What happened?</h2>
                  <p className="text-sm" style={{ color: ABYSS[500] }}>Select the type of incident</p>
                </div>
                <QuickSelect
                  options={incidentTypeOptions}
                  value={incidentType}
                  onChange={(v) => {
                    setIncidentType(v as string)
                    setTimeout(() => setStep(2), 300)
                  }}
                  columns={2}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: ABYSS[800] }}>How serious is this?</h2>
                  <p className="text-sm" style={{ color: ABYSS[500] }}>Assess the severity level</p>
                </div>
                <SeverityScale
                  value={severity}
                  onChange={(v) => {
                    setSeverity(v)
                    setTimeout(() => setStep(3), 500)
                  }}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: ABYSS[800] }}>Where did it happen?</h2>
                  <p className="text-sm" style={{ color: ABYSS[500] }}>Select the incident location</p>
                </div>
                <LocationPicker
                  locations={SAMPLE_LOCATIONS}
                  value={location}
                  onChange={(v) => {
                    setLocation(v)
                    setTimeout(() => setStep(incidentType === "injury" ? 4 : 5), 300)
                  }}
                />
              </div>
            )}

            {step === 4 && incidentType === "injury" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: ABYSS[800] }}>Which body parts are affected?</h2>
                  <p className="text-sm" style={{ color: ABYSS[500] }}>Select all that apply</p>
                </div>
                <QuickSelect
                  options={bodyPartOptions}
                  value={bodyParts}
                  onChange={(v) => setBodyParts(v as string[])}
                  multiple
                  columns={3}
                  size="sm"
                />
                <button
                  onClick={() => setStep(5)}
                  disabled={bodyParts.length === 0}
                  className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: bodyParts.length > 0 ? DEEP_CURRENT[500] : ABYSS[200],
                    color: "white",
                  }}
                >
                  Continue
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: ABYSS[800] }}>Describe what happened</h2>
                  <p className="text-sm" style={{ color: ABYSS[500] }}>Provide details about the incident</p>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What were you doing when the incident occurred? What did you see or hear? Who else was present?"
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: ALIAS.border.default }}
                />
                <FileUpload
                  files={files}
                  onChange={setFiles}
                  maxFiles={5}
                />
                <button
                  onClick={() => setStep(6)}
                  disabled={!description.trim()}
                  className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: description.trim() ? DEEP_CURRENT[500] : ABYSS[200],
                    color: "white",
                  }}
                >
                  Continue
                </button>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: ABYSS[800] }}>Add relevant team members</h2>
                  <p className="text-sm" style={{ color: ABYSS[500] }}>Invite witnesses, supervisors, or safety officers</p>
                </div>
                <InvitePeople
                  members={teamMembers}
                  selectedIds={invitedIds}
                  onChange={setInvitedIds}
                  suggestedMembers={suggestedTeam}
                />
                <button
                  onClick={() => setStep(7)}
                  className="w-full py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: DEEP_CURRENT[500], color: "white" }}
                >
                  Continue to Review
                </button>
              </div>
            )}

            {step === 7 && (
              <SummaryCard
                title="Review Your Report"
                severity={severity}
                items={[
                  {
                    label: "Incident Type",
                    value: incidentTypeOptions.find((o) => o.value === incidentType)?.label || incidentType,
                    icon: incidentTypeOptions.find((o) => o.value === incidentType)?.icon,
                    editable: true,
                    onEdit: () => setStep(1),
                  },
                  {
                    label: "Location",
                    value: location ? `${location.building} - ${location.name}` : "-",
                    icon: <MapPin className="w-4 h-4" />,
                    editable: true,
                    onEdit: () => setStep(3),
                  },
                  ...(incidentType === "injury" ? [{
                    label: "Affected Body Parts",
                    value: bodyParts.join(", ") || "-",
                    editable: true,
                    onEdit: () => setStep(4),
                  }] : []),
                  {
                    label: "Description",
                    value: description || "-",
                    icon: <FileText className="w-4 h-4" />,
                    editable: true,
                    onEdit: () => setStep(5),
                  },
                  {
                    label: "Attachments",
                    value: `${files.length} file(s)`,
                  },
                  {
                    label: "Team Members",
                    value: invitedIds.length > 0
                      ? teamMembers.filter((m) => invitedIds.includes(m.id)).map((m) => m.name).join(", ")
                      : "None added",
                    editable: true,
                    onEdit: () => setStep(6),
                  },
                  {
                    label: "Reported By",
                    value: reporter.name,
                    icon: <User className="w-4 h-4" />,
                  },
                ]}
                onSubmit={handleSubmit}
                onCancel={() => setStep(1)}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    )
  },
}

// =============================================================================
// CHAT STORIES
// =============================================================================

export const ChatFull: StoryObj = {
  name: "Chat (Full Features)",
  parameters: {
    layout: "centered",
  },
  render: () => {
    return (
      <div className="w-[480px]">
        <EHSChat
          greeting="Hey there! I'm your EHS Copilot. I can help you report safety incidents, track hazards, or answer safety questions. What can I help you with?"
          onReportSubmit={(report) => console.log("Report submitted:", report)}
        />
      </div>
    )
  },
}

// =============================================================================
// MANAGER DASHBOARD
// =============================================================================

export const ManagerDashboard: StoryObj = {
  name: "Manager Dashboard",
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const manager = teamMembers[1]

    const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
    const [viewTab, setViewTab] = useState<"details" | "comments" | "team">("details")
    const [comments, setComments] = useState<Comment[]>([
      {
        id: "1",
        author: teamMembers[0],
        content: "I was nearby when this happened. The hydraulic line burst suddenly without warning.",
        timestamp: "3 hours ago",
      },
      {
        id: "2",
        author: teamMembers[4],
        content: "I've cordoned off the area and notified maintenance. We need to check all presses in the line.",
        timestamp: "2 hours ago",
      },
    ])
    const [invitedIds, setInvitedIds] = useState<string[]>(["1", "3", "4"])
    const [incidentSeverity, setIncidentSeverity] = useState<SeverityLevel>("high")

    const incidents = [
      {
        id: "INC-2025-042",
        title: "Hydraulic press emergency stop activated",
        category: "Equipment",
        severity: "high" as SeverityLevel,
        location: "Building A - Heavy Press Station",
        dateTime: "Today at 2:30 PM",
        status: "open" as const,
        reporter: "Alex Martinez",
        description: "Hydraulic press #3 experienced sudden pressure loss during operation. Emergency stop activated automatically. Hydraulic fluid sprayed onto the floor. No injuries reported but area is unsafe.",
      },
      {
        id: "INC-2025-041",
        title: "Chemical storage temperature alert",
        category: "Environmental",
        severity: "medium" as SeverityLevel,
        location: "Building D - Chemical Lab",
        dateTime: "Yesterday at 4:15 PM",
        status: "in_progress" as const,
        reporter: "Emily Thompson",
        description: "Chemical storage cabinet temperature exceeded 25°C for 2 hours. Cooling system malfunction detected.",
      },
      {
        id: "INC-2025-040",
        title: "Near miss - forklift in pedestrian zone",
        category: "Near Miss",
        severity: "medium" as SeverityLevel,
        location: "Building B - Warehouse",
        dateTime: "Dec 5, 2025 at 3:45 PM",
        status: "resolved" as const,
        reporter: "David Kim",
        description: "Forklift operator entered pedestrian zone without checking. No collision occurred.",
      },
      {
        id: "INC-2025-039",
        title: "Slip hazard identified near entrance",
        category: "Hazard",
        severity: "low" as SeverityLevel,
        location: "Building C - Main Entrance",
        dateTime: "Dec 4, 2025 at 10:00 AM",
        status: "closed" as const,
        reporter: "Lisa Patel",
        description: "Water pooling near entrance due to weather. Floor mats repositioned and wet floor signs placed.",
      },
    ]

    const currentIncident = incidents.find((i) => i.id === selectedIncident)

    const handleAddComment = (content: string, isInternal: boolean) => {
      const newComment: Comment = {
        id: `${Date.now()}`,
        author: manager,
        content,
        timestamp: "Just now",
        isInternal,
      }
      setComments([...comments, newComment])
    }

    return (
      <div className="min-h-screen" style={{ backgroundColor: ALIAS.background.page }}>
        {/* Header */}
        <div className="px-6 py-4 border-b" style={{ backgroundColor: ABYSS[800], borderColor: ABYSS[700] }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: SUNRISE[500] }}
              >
                MR
              </div>
              <div>
                <p className="font-medium text-white">{manager.name}</p>
                <p className="text-xs" style={{ color: ABYSS[300] }}>EHS Safety Officer</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: HARBOR[500], color: "white" }}>
              Manager View
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Incident List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: ABYSS[800] }}>Open Incidents</h2>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ backgroundColor: CORAL[100], color: CORAL[700] }}
                >
                  {incidents.filter((i) => i.status === "open").length} pending
                </span>
              </div>

              <div className="space-y-3">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident.id)}
                    className="cursor-pointer"
                  >
                    <IncidentListItem
                      {...incident}
                      onClick={() => setSelectedIncident(incident.id)}
                      className={selectedIncident === incident.id ? "ring-2 ring-offset-2" : ""}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Incident Details */}
            <div className="lg:col-span-2">
              {currentIncident ? (
                <div
                  className="rounded-xl overflow-hidden border"
                  style={{ backgroundColor: "white", borderColor: ALIAS.border.default }}
                >
                  {/* Incident Header */}
                  <div className="px-6 py-4 border-b" style={{ borderColor: ALIAS.border.default }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono" style={{ color: ABYSS[500] }}>
                            {currentIncident.id}
                          </span>
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: severityConfig[currentIncident.severity].lightBg,
                              color: severityConfig[currentIncident.severity].color,
                            }}
                          >
                            {severityConfig[currentIncident.severity].label}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold" style={{ color: ABYSS[800] }}>
                          {currentIncident.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: ABYSS[500] }}>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {currentIncident.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {currentIncident.dateTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {currentIncident.reporter}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b" style={{ borderColor: ALIAS.border.default }}>
                    {(["details", "comments", "team"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setViewTab(tab)}
                        className="flex-1 py-3 text-sm font-medium transition-colors"
                        style={{
                          color: viewTab === tab ? DEEP_CURRENT[600] : ABYSS[500],
                          borderBottom: viewTab === tab ? `2px solid ${DEEP_CURRENT[500]}` : "2px solid transparent",
                        }}
                      >
                        {tab === "details" && "Details"}
                        {tab === "comments" && `Comments (${comments.length})`}
                        {tab === "team" && `Team (${invitedIds.length})`}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {viewTab === "details" && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2" style={{ color: ABYSS[600] }}>Description</h4>
                          <p className="text-sm" style={{ color: ABYSS[700] }}>{currentIncident.description}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-3" style={{ color: ABYSS[600] }}>Update Severity</h4>
                          <SeverityScale
                            value={incidentSeverity}
                            onChange={setIncidentSeverity}
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            className="flex-1 py-2 px-4 rounded-lg font-medium text-white"
                            style={{ backgroundColor: HARBOR[500] }}
                          >
                            Mark as Resolved
                          </button>
                          <button
                            className="flex-1 py-2 px-4 rounded-lg font-medium border"
                            style={{ borderColor: CORAL[300], color: CORAL[600] }}
                          >
                            Escalate
                          </button>
                        </div>
                      </div>
                    )}

                    {viewTab === "comments" && (
                      <CommentThread
                        comments={comments}
                        onAddComment={handleAddComment}
                        currentUser={manager}
                      />
                    )}

                    {viewTab === "team" && (
                      <div className="space-y-4">
                        <InvitePeople
                          members={teamMembers}
                          selectedIds={invitedIds}
                          onChange={setInvitedIds}
                          suggestedMembers={teamMembers.filter((m) => m.department === "Production")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-xl border h-full flex items-center justify-center p-8"
                  style={{ backgroundColor: "white", borderColor: ALIAS.border.default }}
                >
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: ABYSS[100] }}
                    >
                      <FileText className="w-8 h-8" style={{ color: ABYSS[400] }} />
                    </div>
                    <p style={{ color: ABYSS[600] }}>Select an incident to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Cards Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: ABYSS[800] }}>Pending Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ActionCard
                title="Review INC-2025-042"
                description="New incident reported. Hydraulic press emergency stop. Initial assessment required."
                status="pending"
                assignee={manager.name}
                dueDate="Today"
                priority="high"
                onApprove={() => console.log("Start Review")}
                onViewDetails={() => setSelectedIncident("INC-2025-042")}
              />
              <ActionCard
                title="Schedule Maintenance Audit"
                description="Monthly safety audit for Building A production equipment is overdue."
                status="pending"
                assignee={manager.name}
                dueDate="Dec 10, 2025"
                priority="medium"
                onApprove={() => console.log("Schedule")}
                onViewDetails={() => console.log("View")}
              />
              <ActionCard
                title="Training Certificate Expiring"
                description="5 team members have PPE training certificates expiring this month."
                status="in_review"
                assignee="HR Department"
                onViewDetails={() => console.log("View")}
              />
            </div>
          </div>
        </div>
      </div>
    )
  },
}
