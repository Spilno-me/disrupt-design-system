"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  WAVE,
  DUSK_REEF,
  PRIMITIVES,
  CORAL,
  SUNRISE,
  DEEP_CURRENT,
  ALIAS,
  RADIUS,
} from "@/constants/designTokens"
import {
  AlertTriangle,
  Send,
  User,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Loader2,
  Shield,
  Zap,
  Info,
  AlertCircle,
  XOctagon,
} from "lucide-react"

// =============================================================================
// AGENT LOGO COMPONENT
// =============================================================================

function AgentLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 219 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Using design tokens: DEEP_CURRENT for teal, WAVE for blue accents */}
      <path d="M57.6791 80.8936C57.6791 79.3474 58.9334 78.0939 60.4807 78.0939H75.2348C76.7821 78.0939 78.0364 79.3474 78.0364 80.8936V95.6665C78.0364 97.2127 76.7821 98.4662 75.2348 98.4662H60.4807C58.9334 98.4662 57.6791 97.2127 57.6791 95.6665V80.8936Z" fill={DEEP_CURRENT[500]}/>
      <path d="M30.536 40.149C30.536 38.6027 31.7904 37.3492 33.3377 37.3492H48.0917C49.639 37.3492 50.8933 38.6027 50.8933 40.1489V54.9219C50.8933 56.4681 49.639 57.7216 48.0917 57.7216H33.3377C31.7903 57.7216 30.536 56.4681 30.536 54.9219V40.149Z" fill={WAVE[400]}/>
      <path d="M67.8578 52.7973C67.8578 51.7664 68.694 50.9308 69.7256 50.9308H79.5616C80.5931 50.9308 81.4293 51.7664 81.4293 52.7973V62.6459C81.4293 63.6767 80.5931 64.5123 79.5616 64.5123H69.7256C68.694 64.5123 67.8578 63.6767 67.8578 62.6459V52.7973Z" fill={DEEP_CURRENT[200]}/>
      <path d="M20.3573 21.7722C20.3573 20.9991 20.9845 20.3723 21.7581 20.3723H29.1351C29.9088 20.3723 30.536 20.9991 30.536 21.7722V29.1586C30.536 29.9317 29.9088 30.5585 29.1351 30.5585H21.7581C20.9845 30.5585 20.3573 29.9317 20.3573 29.1586V21.7722Z" fill={WAVE[100]}/>
      <path d="M40.7147 115.781C40.7147 113.719 42.3871 112.048 44.4502 112.048H64.1222C66.1853 112.048 67.8578 113.719 67.8578 115.781V135.478C67.8578 137.54 66.1853 139.211 64.1222 139.211H44.4502C42.3871 139.211 40.7147 137.54 40.7147 135.478V115.781Z" fill={WAVE[400]}/>
      <path d="M150.343 0C188.261 0 219 31.3401 219 70C219 108.66 188.261 140 150.343 140H79.151C76.536 140 74.4161 137.839 74.4161 135.172V116.828C74.4161 114.161 76.536 112 79.151 112H150.343C173.094 112 191.537 93.196 191.537 70C191.537 46.804 173.094 28 150.343 28H79.151C76.536 28 74.4161 25.8386 74.4161 23.1724V4.82759C74.4161 2.16138 76.536 0 79.151 0H150.343Z" fill={DEEP_CURRENT[500]}/>
      <path d="M20.3573 99.866C20.3573 99.0929 20.9845 98.4662 21.7581 98.4662H29.1351C29.9088 98.4662 30.536 99.0929 30.536 99.866V107.252C30.536 108.026 29.9088 108.652 29.1351 108.652H21.7581C20.9845 108.652 20.3573 108.026 20.3573 107.252V99.866Z" fill={WAVE[100]}/>
      <path d="M33.9289 86.2845C33.9289 85.5114 34.5561 84.8846 35.3297 84.8846H42.7067C43.4804 84.8846 44.1076 85.5114 44.1076 86.2845V93.6709C44.1076 94.4441 43.4804 95.0708 42.7067 95.0708H35.3297C34.5561 95.0708 33.9289 94.4441 33.9289 93.6709V86.2845Z" fill={DEEP_CURRENT[200]}/>
      <path d="M40.7147 3.73295C40.7147 1.6713 42.3871 0 44.4502 0H64.1222C66.1853 0 67.8578 1.6713 67.8578 3.73294V23.4301C67.8578 25.4918 66.1853 27.1631 64.1222 27.1631H44.4502C42.3871 27.1631 40.7147 25.4918 40.7147 23.4301V3.73295Z" fill={WAVE[400]}/>
      <path d="M3.39288 52.7973C3.39288 51.7664 4.22911 50.9308 5.26065 50.9308H15.0967C16.1282 50.9308 16.9644 51.7664 16.9644 52.7973V62.6459C16.9644 63.6767 16.1282 64.5123 15.0967 64.5123H5.26065C4.22911 64.5123 3.39288 63.6767 3.39288 62.6459V52.7973Z" fill={WAVE[100]}/>
      <path d="M23.7502 66.3788C23.7502 65.348 24.5865 64.5123 25.618 64.5123H35.454C36.4856 64.5123 37.3218 65.348 37.3218 66.3788V76.2274C37.3218 77.2582 36.4856 78.0939 35.454 78.0939H25.618C24.5865 78.0939 23.7502 77.2582 23.7502 76.2274V66.3788Z" fill={DEEP_CURRENT[200]}/>
    </svg>
  )
}

// =============================================================================
// TYPES
// =============================================================================

type MessageType = "user" | "agent"
type SeverityLevel = "low" | "medium" | "high" | "critical"
type IncidentCategory = "injury" | "near_miss" | "environmental" | "equipment" | "other"

interface ChatMessage {
  id: string
  type: MessageType
  content: string
  timestamp: Date
  options?: QuickReplyOption[]
}

interface QuickReplyOption {
  id: string
  label: string
  value: string
  icon?: React.ReactNode
}

interface IncidentReport {
  id: string
  category: IncidentCategory
  severity: SeverityLevel
  title: string
  description: string
  location: string
  status: "draft" | "submitted"
}

// =============================================================================
// CHAT BUBBLE
// =============================================================================

interface ChatBubbleProps {
  message: ChatMessage
  onQuickReply?: (option: QuickReplyOption) => void
}

function ChatBubble({ message, onQuickReply }: ChatBubbleProps) {
  const isUser = message.type === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar with dashed ring for agent */}
      <div className="relative flex-shrink-0 w-8 h-8">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: isUser ? CORAL[50] : WAVE[50],
          }}
        >
          {isUser ? (
            <User className="w-4 h-4" style={{ color: DUSK_REEF[500] }} />
          ) : (
            <AgentLogo className="w-6 h-6" />
          )}
        </div>
        {/* Dashed ring for agent */}
        {!isUser && (
          <svg className="absolute -inset-1 w-10 h-10" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke={DEEP_CURRENT[200]}
              strokeWidth="1"
              strokeDasharray="3 2"
            />
          </svg>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {/* Message bubble */}
        <div
          className="px-4 py-3"
          style={{
            backgroundColor: isUser ? CORAL[50] : DUSK_REEF[50],
            color: DUSK_REEF[500],
            borderRadius: isUser ? `${RADIUS.md} ${RADIUS.md} ${RADIUS.xs} ${RADIUS.md}` : `${RADIUS.md} ${RADIUS.md} ${RADIUS.md} ${RADIUS.xs}`,
          }}
        >
          <p className="text-sm whitespace-pre-line">
            {message.content}
          </p>
        </div>

        {/* Quick reply options - no border on container */}
        {message.options && message.options.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                size="sm"
                onClick={() => onQuickReply?.(option)}
                className="text-xs bg-surface text-accent-strong border border-dashed border-accent-subtle rounded-sm"
              >
                {option.icon}
                {option.label}
              </Button>
            ))}
          </div>
        )}

        {/* Timestamp - no border */}
        <span className="text-xs" style={{ color: ALIAS.text.tertiary }}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  )
}

// =============================================================================
// SIMPLE FORM
// =============================================================================

interface SimpleFormProps {
  step: number
  data: Partial<IncidentReport>
  onUpdate: (data: Partial<IncidentReport>) => void
  onSubmit: () => void
}

function SimpleForm({ step, data, onUpdate, onSubmit }: SimpleFormProps) {
  const categories = [
    { value: "injury", label: "Injury", icon: <AlertTriangle className="w-4 h-4" /> },
    { value: "near_miss", label: "Near Miss", icon: <Shield className="w-4 h-4" /> },
    { value: "environmental", label: "Environmental", icon: <MapPin className="w-4 h-4" /> },
    { value: "equipment", label: "Equipment", icon: <Zap className="w-4 h-4" /> },
    { value: "other", label: "Other", icon: <FileText className="w-4 h-4" /> },
  ]

  const severities = [
    { value: "low", label: "Low", color: WAVE[400], icon: <Info className="w-4 h-4" /> },
    { value: "medium", label: "Medium", color: DUSK_REEF[400], icon: <AlertCircle className="w-4 h-4" /> },
    { value: "high", label: "High", color: SUNRISE[400], icon: <AlertTriangle className="w-4 h-4" /> },
    { value: "critical", label: "Critical", color: CORAL[400], icon: <XOctagon className="w-4 h-4" /> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="p-4 bg-surface border border-dashed border-default rounded-md shadow-sm">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <Badge variant="outline" className="text-xs">Step 1: Type</Badge>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => onUpdate({ category: cat.value as IncidentCategory })}
                    className={cn(
                      "flex items-center gap-2 p-3 transition-all text-sm border border-dashed rounded-sm",
                      data.category === cat.value
                        ? "border-accent bg-info-light text-accent-strong"
                        : "border-default bg-surface text-secondary"
                    )}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <Badge variant="outline" className="text-xs">Step 2: Severity & Location</Badge>
              <div className="grid grid-cols-2 gap-2">
                {severities.map((sev) => (
                  <button
                    key={sev.value}
                    onClick={() => onUpdate({ severity: sev.value as SeverityLevel })}
                    className={cn(
                      "flex items-center gap-2 p-2.5 text-sm transition-all border border-dashed rounded-sm",
                      data.severity !== sev.value && "bg-surface text-secondary border-default"
                    )}
                    style={data.severity === sev.value ? {
                      backgroundColor: sev.color,
                      color: PRIMITIVES.white,
                      borderColor: sev.color,
                    } : undefined}
                  >
                    {sev.icon}
                    {sev.label}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Location (e.g., Building A, Floor 2)"
                value={data.location || ""}
                onChange={(e) => onUpdate({ location: e.target.value })}
                className="border-dashed border-default rounded-sm"
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <Badge variant="outline" className="text-xs">Step 3: Details</Badge>
              <Input
                placeholder="Brief title"
                value={data.title || ""}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="border-dashed border-default rounded-sm"
              />
              <Textarea
                placeholder="Describe what happened..."
                value={data.description || ""}
                onChange={(e) => onUpdate({ description: e.target.value })}
                className="min-h-[80px] border-dashed border-default rounded-sm"
              />
              <Button
                onClick={onSubmit}
                className="w-full bg-accent-strong border border-dashed border-accent rounded-sm"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit Report
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface EHSChatSimpleProps {
  className?: string
  greeting?: string
  onReportSubmit?: (report: IncidentReport) => void
}

function EHSChatSimple({
  className,
  greeting = "Hi! I'm your EHS assistant. How can I help?",
  onReportSubmit,
}: EHSChatSimpleProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [formStep, setFormStep] = useState(0)
  const [reportData, setReportData] = useState<Partial<IncidentReport>>({})
  const [showForm, setShowForm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{
      id: "greeting",
      type: "agent",
      content: greeting,
      timestamp: new Date(),
      options: [
        { id: "report", label: "Report Incident", value: "report", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
        { id: "status", label: "Check Status", value: "status", icon: <Clock className="w-3 h-3 mr-1" /> },
      ],
    }])
  }, [greeting])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = (type: MessageType, content: string, options?: QuickReplyOption[]) => {
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      options,
    }])
  }

  const processInput = async (input: string) => {
    addMessage("user", input)
    setInputValue("")
    setIsThinking(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsThinking(false)

    const lower = input.toLowerCase()

    if (lower.includes("report") || lower.includes("incident")) {
      addMessage("agent", "I'll help you report that. What type of incident is this?")
      setShowForm(true)
      setFormStep(1)
    } else if (lower.includes("status")) {
      addMessage("agent", "You have no open reports. Would you like to submit one?", [
        { id: "report", label: "Report Incident", value: "report", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
      ])
    } else if (lower.includes("thank") || lower.includes("bye") || lower.includes("done")) {
      addMessage("agent", "You're welcome! Stay safe!")
    } else {
      addMessage("agent", "I can help you report incidents or check status. What would you like to do?", [
        { id: "report", label: "Report Incident", value: "report", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
        { id: "status", label: "Check Status", value: "status", icon: <Clock className="w-3 h-3 mr-1" /> },
      ])
    }
  }

  const handleFormUpdate = (data: Partial<IncidentReport>) => {
    const newData = { ...reportData, ...data }
    setReportData(newData)

    if (data.category && formStep === 1) {
      setTimeout(() => {
        setFormStep(2)
        addMessage("agent", "Got it. How severe is this, and where did it happen?")
      }, 300)
    }
    if (formStep === 2 && newData.severity && newData.location) {
      setTimeout(() => {
        setFormStep(3)
        addMessage("agent", "Almost done. Please describe what happened.")
      }, 300)
    }
  }

  const handleSubmit = async () => {
    setIsThinking(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsThinking(false)

    const report: IncidentReport = {
      id: `INC-${Date.now()}`,
      category: reportData.category || "other",
      severity: reportData.severity || "low",
      title: reportData.title || "Untitled",
      description: reportData.description || "",
      location: reportData.location || "",
      status: "submitted",
    }

    onReportSubmit?.(report)

    addMessage("agent", `Report submitted! ID: ${report.id}\n\nOur team will review it within 24 hours.`, [
      { id: "another", label: "Report Another", value: "report", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
    ])

    setShowForm(false)
    setFormStep(0)
    setReportData({})
  }

  return (
    <div
      className={cn("flex flex-col h-[500px] overflow-hidden bg-surface border border-dashed border-default rounded-md", className)}
    >
      {/* Header - Clean with dashed bottom border */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-dashed border-default"
      >
        {/* Avatar with dashed ring */}
        <div className="relative w-9 h-9">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: WAVE[50] }}
          >
            <AgentLogo className="w-7 h-7" />
          </div>
          <svg className="absolute -inset-1 w-[44px] h-[44px]" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke={DEEP_CURRENT[300]}
              strokeWidth="1"
              strokeDasharray="3 2"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: ALIAS.text.primary }}>EHS Assistant</h3>
          <p className="text-xs" style={{ color: DEEP_CURRENT[500] }}>Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} onQuickReply={(opt) => processInput(opt.label)} />
        ))}

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="ml-11">
            <SimpleForm step={formStep} data={reportData} onUpdate={handleFormUpdate} onSubmit={handleSubmit} />
          </motion.div>
        )}

        {isThinking && (
          <div className="flex items-center gap-2 ml-11">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: DEEP_CURRENT[500] }} />
            <span className="text-sm" style={{ color: ALIAS.text.secondary }}>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="p-4 bg-surface border-t border-dashed border-default"
      >
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && inputValue.trim() && processInput(inputValue)}
            className="flex-1 border-dashed border-default rounded-sm bg-surface"
          />
          <Button
            onClick={() => inputValue.trim() && processInput(inputValue)}
            disabled={!inputValue.trim()}
            className={cn(
              "border border-dashed rounded-sm shadow-sm",
              inputValue.trim()
                ? "bg-accent-strong text-inverse border-accent"
                : "bg-surface-hover text-disabled border-default"
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export { EHSChatSimple, type IncidentReport as SimpleIncidentReport }
