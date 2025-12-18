"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DEEP_CURRENT,
  ABYSS,
  HARBOR,
  WAVE,
  SUNRISE,
  CORAL,
  DUSK_REEF,
  SLATE,
  PRIMITIVES,
  ALIAS,
  RADIUS,
  SHADOWS,
} from "@/constants/designTokens"
import {
  AlertTriangle,
  Send,
  User,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Camera,
  Mic,
  Shield,
  Zap,
  X,
  Info,
  AlertCircle,
  XOctagon,
  Settings,
  Sparkles,
  Wand2,
  MessageSquare,
  Volume2,
  Bell,
  HelpCircle,
  Maximize2,
  Minimize2,
  Check,
  Upload,
  ChevronRight,
  ChevronDown,
  Calendar,
  Building2,
  Edit3,
  UserPlus,
  Mail,
  Eye,
  Flame,
} from "lucide-react"

// =============================================================================
// AGENT LOGO COMPONENT (Animated Copilot Logo)
// =============================================================================

// Position configurations for the 3 shapes
// Position 1: Large (top-right), Position 2: Medium (bottom), Position 3: Small (left)
const logoPositions = {
  large: { x: 52, y: 0, width: 81, height: 81, rx: 11 },
  medium: { x: 46, y: 127, width: 41, height: 41, rx: 4 },
  small: { x: 0, y: 87, width: 23, height: 23, rx: 3 },
}

// Color configurations for dark and light backgrounds
const logoColors = {
  // For dark backgrounds (default)
  dark: {
    large: DEEP_CURRENT[500], // Deep Current - biggest
    medium: PRIMITIVES.cream, // Tide Foam - medium
    small: CORAL[500],        // Coral red - smallest
  },
  // For light backgrounds
  light: {
    large: DEEP_CURRENT[500], // Deep Current - biggest
    medium: ABYSS[500],       // Abyss - medium
    small: CORAL[500],        // Coral red - smallest
  },
}

type LogoState = "idle" | "thinking" | "planning" | "executing" | "listening" | "complete"
type LogoVariant = "dark" | "light"

interface AgentLogoProps {
  className?: string
  state?: LogoState
  /** Use "dark" for dark backgrounds (default), "light" for light backgrounds */
  variant?: LogoVariant
}

function AgentLogo({ className, state = "idle", variant = "dark" }: AgentLogoProps) {
  const colors = logoColors[variant]
  // Animation configurations per state
  const getAnimationConfig = () => {
    switch (state) {
      case "thinking":
        // Fast pulsing - shapes breathe/pulse in place
        return {
          type: "pulse" as const,
          duration: 1.2,
        }
      case "planning":
        // Sequential rotation - shapes swap positions methodically
        return {
          type: "rotate" as const,
          duration: 3.6,
          pauseDuration: 0.8,
        }
      case "executing":
        // Fast rotation - shapes move quickly between positions
        return {
          type: "rotate" as const,
          duration: 1.8,
          pauseDuration: 0.3,
        }
      case "listening":
        // Gentle floating/bobbing
        return {
          type: "float" as const,
          duration: 2,
        }
      case "complete":
        // Quick settle into place with bounce
        return {
          type: "settle" as const,
          duration: 0.6,
        }
      case "idle":
      default:
        // Slow, relaxed rotation with long pauses
        return {
          type: "rotate" as const,
          duration: 5.4,
          pauseDuration: 1.2,
        }
    }
  }

  const config = getAnimationConfig()

  // Complete - snap back to logo with bounce
  if (state === "complete") {
    const centerX = 66.5
    const centerY = 84

    return (
      <svg
        viewBox="-15 -15 163 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Large rectangle - snaps from center to position */}
        <motion.rect
          fill={colors.large}
          initial={{
            x: centerX - 20,
            y: centerY - 20,
            width: 40,
            height: 40,
            rx: 20,
          }}
          animate={{
            x: logoPositions.large.x,
            y: logoPositions.large.y,
            width: logoPositions.large.width,
            height: logoPositions.large.height,
            rx: logoPositions.large.rx,
          }}
          transition={{
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1], // bounce overshoot
          }}
        />
        {/* Medium rectangle - snaps from center to position */}
        <motion.rect
          fill={colors.medium}
          initial={{
            x: centerX - 15,
            y: centerY - 15,
            width: 30,
            height: 30,
            rx: 15,
          }}
          animate={{
            x: logoPositions.medium.x,
            y: logoPositions.medium.y,
            width: logoPositions.medium.width,
            height: logoPositions.medium.height,
            rx: logoPositions.medium.rx,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
        {/* Small rectangle - snaps from center to position */}
        <motion.rect
          fill={colors.small}
          initial={{
            x: centerX - 10,
            y: centerY - 10,
            width: 20,
            height: 20,
            rx: 10,
          }}
          animate={{
            x: logoPositions.small.x,
            y: logoPositions.small.y,
            width: logoPositions.small.width,
            height: logoPositions.small.height,
            rx: logoPositions.small.rx,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      </svg>
    )
  }

  // Thinking - dots orbit around center like electrons
  if (state === "thinking") {
    const centerX = 66.5
    const centerY = 84
    const orbitRadius = 35
    const dotSize = 18
    const cycleDuration = 2.5

    return (
      <svg
        viewBox="-15 -15 163 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Dot 1 - orbits at normal speed */}
        <motion.circle
          fill={colors.large}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX + orbitRadius,
              centerX,
              centerX - orbitRadius,
              centerX,
              centerX + orbitRadius,
            ],
            cy: [
              centerY,
              centerY - orbitRadius,
              centerY,
              centerY + orbitRadius,
              centerY,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Dot 2 - orbits offset by 120° */}
        <motion.circle
          fill={colors.medium}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX - orbitRadius * 0.5,
              centerX + orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
              centerX - orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
            ],
            cy: [
              centerY - orbitRadius * 0.866,
              centerY + orbitRadius * 0.5,
              centerY + orbitRadius * 0.866,
              centerY - orbitRadius * 0.5,
              centerY - orbitRadius * 0.866,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Dot 3 - orbits offset by 240° */}
        <motion.circle
          fill={colors.small}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX - orbitRadius * 0.5,
              centerX - orbitRadius * 0.866,
              centerX + orbitRadius * 0.5,
              centerX + orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
            ],
            cy: [
              centerY + orbitRadius * 0.866,
              centerY - orbitRadius * 0.5,
              centerY - orbitRadius * 0.866,
              centerY + orbitRadius * 0.5,
              centerY + orbitRadius * 0.866,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
    )
  }

  // Listening - sound wave with 3 vertical bars
  if (config.type === "float") {
    const barWidth = 16
    const barSpacing = 28
    const centerX = 66.5
    const centerY = 84
    const barPositions = [
      { x: centerX - barSpacing - barWidth / 2 },
      { x: centerX - barWidth / 2 },
      { x: centerX + barSpacing - barWidth / 2 },
    ]
    const minHeight = 20
    const maxHeight = 70

    return (
      <svg
        viewBox="-15 -15 163 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Bar 1 - from large rect */}
        <motion.rect
          fill={colors.large}
          initial={{
            x: logoPositions.large.x,
            y: logoPositions.large.y,
            width: logoPositions.large.width,
            height: logoPositions.large.height,
            rx: logoPositions.large.rx,
          }}
          animate={{
            x: barPositions[0].x,
            y: [centerY - minHeight / 2, centerY - maxHeight / 2, centerY - minHeight / 2],
            width: barWidth,
            height: [minHeight, maxHeight, minHeight],
            rx: barWidth / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            width: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
            height: { duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
          }}
        />
        {/* Bar 2 - from medium rect (center, tallest) */}
        <motion.rect
          fill={colors.medium}
          initial={{
            x: logoPositions.medium.x,
            y: logoPositions.medium.y,
            width: logoPositions.medium.width,
            height: logoPositions.medium.height,
            rx: logoPositions.medium.rx,
          }}
          animate={{
            x: barPositions[1].x,
            y: [centerY - maxHeight / 2, centerY - minHeight / 2, centerY - maxHeight / 2],
            width: barWidth,
            height: [maxHeight, minHeight, maxHeight],
            rx: barWidth / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            width: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
            height: { duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
          }}
        />
        {/* Bar 3 - from small rect */}
        <motion.rect
          fill={colors.small}
          initial={{
            x: logoPositions.small.x,
            y: logoPositions.small.y,
            width: logoPositions.small.width,
            height: logoPositions.small.height,
            rx: logoPositions.small.rx,
          }}
          animate={{
            x: barPositions[2].x,
            y: [centerY - minHeight / 2, centerY - maxHeight / 2, centerY - minHeight / 2],
            width: barWidth,
            height: [minHeight, maxHeight, minHeight],
            rx: barWidth / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            width: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            height: { duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
        />
      </svg>
    )
  }

  // Planning - dots on left that extend into horizontal lines like a todo list
  if (state === "planning") {
    const dotSize = 14
    const lineHeight = 14
    const leftX = 15
    const lineMaxWidth = 100
    const rowSpacing = 30
    const centerY = 84
    const rows = [
      { y: centerY - rowSpacing },
      { y: centerY },
      { y: centerY + rowSpacing },
    ]
    const cycleDuration = 3

    return (
      <svg
        viewBox="-15 -15 163 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Row 1 - from large rect */}
        <motion.rect
          fill={colors.large}
          initial={{
            x: logoPositions.large.x,
            y: logoPositions.large.y,
            width: logoPositions.large.width,
            height: logoPositions.large.height,
            rx: logoPositions.large.rx,
          }}
          animate={{
            x: leftX,
            y: rows[0].y - lineHeight / 2,
            width: [dotSize, lineMaxWidth, lineMaxWidth, dotSize],
            height: lineHeight,
            rx: lineHeight / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.4, ease: "easeOut" },
            height: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            width: {
              duration: cycleDuration,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.75, 1],
              delay: 0.4,
            },
          }}
        />
        {/* Row 2 - from medium rect */}
        <motion.rect
          fill={colors.medium}
          initial={{
            x: logoPositions.medium.x,
            y: logoPositions.medium.y,
            width: logoPositions.medium.width,
            height: logoPositions.medium.height,
            rx: logoPositions.medium.rx,
          }}
          animate={{
            x: leftX,
            y: rows[1].y - lineHeight / 2,
            width: [dotSize, lineMaxWidth * 0.7, lineMaxWidth * 0.7, dotSize],
            height: lineHeight,
            rx: lineHeight / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.4, ease: "easeOut" },
            height: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            width: {
              duration: cycleDuration,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.75, 1],
              delay: 0.7,
            },
          }}
        />
        {/* Row 3 - from small rect */}
        <motion.rect
          fill={colors.small}
          initial={{
            x: logoPositions.small.x,
            y: logoPositions.small.y,
            width: logoPositions.small.width,
            height: logoPositions.small.height,
            rx: logoPositions.small.rx,
          }}
          animate={{
            x: leftX,
            y: rows[2].y - lineHeight / 2,
            width: [dotSize, lineMaxWidth * 0.85, lineMaxWidth * 0.85, dotSize],
            height: lineHeight,
            rx: lineHeight / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.4, ease: "easeOut" },
            height: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            width: {
              duration: cycleDuration,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.75, 1],
              delay: 1.0,
            },
          }}
        />
      </svg>
    )
  }

  // Executing - fast continuous orbit
  if (state === "executing") {
    const centerX = 66.5
    const centerY = 84
    const orbitRadius = 35
    const dotSize = 18
    const cycleDuration = 0.8  // Much faster than thinking

    return (
      <svg
        viewBox="-15 -15 163 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Dot 1 - orbits fast */}
        <motion.circle
          fill={colors.large}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX + orbitRadius,
              centerX,
              centerX - orbitRadius,
              centerX,
              centerX + orbitRadius,
            ],
            cy: [
              centerY,
              centerY - orbitRadius,
              centerY,
              centerY + orbitRadius,
              centerY,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Dot 2 - offset by 120° */}
        <motion.circle
          fill={colors.medium}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX - orbitRadius * 0.5,
              centerX + orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
              centerX - orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
            ],
            cy: [
              centerY - orbitRadius * 0.866,
              centerY + orbitRadius * 0.5,
              centerY + orbitRadius * 0.866,
              centerY - orbitRadius * 0.5,
              centerY - orbitRadius * 0.866,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Dot 3 - offset by 240° */}
        <motion.circle
          fill={colors.small}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX - orbitRadius * 0.5,
              centerX - orbitRadius * 0.866,
              centerX + orbitRadius * 0.5,
              centerX + orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
            ],
            cy: [
              centerY + orbitRadius * 0.866,
              centerY - orbitRadius * 0.5,
              centerY - orbitRadius * 0.866,
              centerY + orbitRadius * 0.5,
              centerY + orbitRadius * 0.866,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
    )
  }

  // Idle - gentle breathing, logo pulses softly
  return (
    <svg
      viewBox="-15 -15 163 198"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.rect
        x={logoPositions.large.x}
        y={logoPositions.large.y}
        width={logoPositions.large.width}
        height={logoPositions.large.height}
        rx={logoPositions.large.rx}
        fill={colors.large}
        animate={{
          scale: [1, 1.03, 1],
          opacity: [1, 0.85, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      <motion.rect
        x={logoPositions.medium.x}
        y={logoPositions.medium.y}
        width={logoPositions.medium.width}
        height={logoPositions.medium.height}
        rx={logoPositions.medium.rx}
        fill={colors.medium}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      <motion.rect
        x={logoPositions.small.x}
        y={logoPositions.small.y}
        width={logoPositions.small.width}
        height={logoPositions.small.height}
        rx={logoPositions.small.rx}
        fill={colors.small}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [1, 0.75, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
    </svg>
  )
}

// =============================================================================
// TYPES - Agentic UI Fusion Architecture
// =============================================================================

type AgentState = "idle" | "listening" | "thinking" | "planning" | "executing" | "confirming" | "complete"
type MessageType = "user" | "agent" | "system" | "form"
type SeverityLevel = "low" | "medium" | "high" | "critical"
type IncidentCategory = "injury" | "near_miss" | "environmental" | "equipment" | "chemical" | "fire" | "other"
type TeamRole = "approver" | "reviewer" | "witness" | "safety_officer" | "manager"

interface QuickSelectOption {
  id: string
  label: string
  value: string
  icon?: React.ReactNode
  description?: string
}

interface Location {
  id: string
  name: string
  building?: string
  floor?: string
  zone?: string
  code?: string
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  preview?: string
}

interface SummaryItem {
  label: string
  value: string | React.ReactNode
  icon?: React.ReactNode
  editable?: boolean
  onEdit?: () => void
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamRole
  avatar?: string
  department?: string
}

interface Comment {
  id: string
  author: TeamMember
  content: string
  timestamp: string
  isInternal?: boolean
}

interface QuickReplyOption {
  id: string
  label: string
  value: string
  icon?: React.ReactNode
}

interface ChatMessage {
  id: string
  type: MessageType
  content: string
  timestamp: Date
  agentState?: AgentState
  formData?: Partial<IncidentReport>
  options?: QuickReplyOption[]
}

interface IncidentReport {
  id: string
  category: IncidentCategory
  severity: SeverityLevel
  title: string
  description: string
  location: string
  locationCode?: string
  dateTime: string
  witnesses: string[]
  immediateActions: string
  injuryInvolved: boolean
  medicalAttention: boolean
  photos: string[]
  status: "draft" | "submitted" | "under_review" | "resolved"
}

// =============================================================================
// CONFIGURATION OBJECTS
// =============================================================================

const severityConfig: Record<SeverityLevel, {
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  lightBg: string
  description: string
}> = {
  low: {
    label: "Low",
    icon: <Info className="w-4 h-4" />,
    color: WAVE[600],
    bgColor: WAVE[500],
    borderColor: WAVE[500],
    lightBg: WAVE[50],
    description: "Minor issue, no immediate action required",
  },
  medium: {
    label: "Medium",
    icon: <AlertCircle className="w-4 h-4" />,
    color: SUNRISE[600],
    bgColor: SUNRISE[500],
    borderColor: SUNRISE[500],
    lightBg: SUNRISE[50],
    description: "Requires attention within 24-48 hours",
  },
  high: {
    label: "High",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: CORAL[600],
    bgColor: CORAL[500],
    borderColor: CORAL[500],
    lightBg: CORAL[50],
    description: "Urgent, requires immediate attention",
  },
  critical: {
    label: "Critical",
    icon: <XOctagon className="w-4 h-4" />,
    color: CORAL[700],
    bgColor: CORAL[600],
    borderColor: CORAL[700],
    lightBg: CORAL[100],
    description: "Emergency, stop work immediately",
  },
}

const roleConfig: Record<TeamRole, {
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  description: string
}> = {
  approver: {
    label: "Approver",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: HARBOR[600],
    bgColor: HARBOR[50],
    description: "Can approve or reject incident reports",
  },
  reviewer: {
    label: "Reviewer",
    icon: <Eye className="w-4 h-4" />,
    color: WAVE[600],
    bgColor: WAVE[50],
    description: "Can review and add comments",
  },
  witness: {
    label: "Witness",
    icon: <User className="w-4 h-4" />,
    color: DUSK_REEF[600],
    bgColor: DUSK_REEF[50],
    description: "Was present during the incident",
  },
  safety_officer: {
    label: "Safety Officer",
    icon: <Shield className="w-4 h-4" />,
    color: SUNRISE[600],
    bgColor: SUNRISE[50],
    description: "Responsible for safety assessment",
  },
  manager: {
    label: "Manager",
    icon: <Building2 className="w-4 h-4" />,
    color: DEEP_CURRENT[600],
    bgColor: DEEP_CURRENT[50],
    description: "Department or area manager",
  },
}

const incidentStatusConfig = {
  open: { label: "Open", color: CORAL[500], bgColor: CORAL[50], borderColor: CORAL[200] },
  in_progress: { label: "In Progress", color: SUNRISE[600], bgColor: SUNRISE[50], borderColor: SUNRISE[200] },
  resolved: { label: "Resolved", color: HARBOR[600], bgColor: HARBOR[50], borderColor: HARBOR[200] },
  closed: { label: "Closed", color: ABYSS[400], bgColor: ABYSS[50], borderColor: ABYSS[200] },
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const SAMPLE_LOCATIONS: Location[] = [
  { id: "1", name: "Main Assembly Line", building: "Building A", floor: "Ground", zone: "Production", code: "A-G-01" },
  { id: "2", name: "Heavy Press Station", building: "Building A", floor: "Ground", zone: "Production", code: "A-G-02" },
  { id: "3", name: "Welding Bay", building: "Building A", floor: "Ground", zone: "Production", code: "A-G-03" },
  { id: "4", name: "Loading Dock #1", building: "Building B", floor: "Ground", zone: "Warehouse", code: "B-G-01" },
  { id: "5", name: "High Rack Storage", building: "Building B", floor: "Ground", zone: "Warehouse", code: "B-G-02" },
  { id: "6", name: "Conference Room 1A", building: "Building C", floor: "1st", zone: "Office", code: "C-1-01" },
  { id: "7", name: "Break Room", building: "Building C", floor: "1st", zone: "Office", code: "C-1-02" },
  { id: "8", name: "Chemical Lab", building: "Building D", floor: "Ground", zone: "R&D", code: "D-G-01" },
  { id: "9", name: "Main Parking Lot", building: "External", floor: "Ground", zone: "Parking", code: "EXT-01" },
]

// =============================================================================
// AGENTIC UI COMPONENTS
// =============================================================================

// Quick Select Component
interface QuickSelectProps {
  options: QuickSelectOption[]
  value?: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  columns?: 1 | 2 | 3
  size?: "sm" | "md" | "lg"
  className?: string
  /** Maximum number of options to show initially (shows "Show more" for rest) */
  maxVisible?: number
  /** Label for the expand button */
  showMoreLabel?: string
  /** Label for the collapse button */
  showLessLabel?: string
}

function QuickSelect({
  options,
  value,
  onChange,
  multiple = false,
  columns = 2,
  size = "md",
  className,
  maxVisible,
  showMoreLabel = "Show more options",
  showLessLabel = "Show less",
}: QuickSelectProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const selectedValues = multiple
    ? (Array.isArray(value) ? value : [])
    : (typeof value === "string" ? [value] : [])

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue]
      onChange(newValues)
    } else {
      onChange(optionValue)
    }
  }

  const isSelected = (optionValue: string) => selectedValues.includes(optionValue)

  // Determine visible options
  const hasMoreOptions = maxVisible !== undefined && options.length > maxVisible
  const visibleOptions = hasMoreOptions && !isExpanded
    ? options.slice(0, maxVisible)
    : options
  const hiddenCount = hasMoreOptions ? options.length - maxVisible : 0

  const sizeClasses = {
    sm: "py-2.5 px-3 text-xs",
    md: "py-3.5 px-4 text-sm",
    lg: "py-4 px-5 text-base",
  }

  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className={cn("grid gap-3", gridClasses[columns])}>
        {visibleOptions.map((option) => {
          const selected = isSelected(option.value)
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "flex items-center gap-3 transition-all text-left relative overflow-hidden border border-dashed rounded-sm",
                sizeClasses[size],
                selected
                  ? "bg-accent-bg border-accent"
                  : "bg-surface border-default"
              )}
            >
              {selected && (
                <div
                  className="absolute inset-y-0 left-0 w-1"
                  style={{
                    backgroundColor: DEEP_CURRENT[500],
                    borderRadius: `${RADIUS.sm} 0 0 ${RADIUS.sm}`,
                  }}
                />
              )}
              {option.icon && (
                <span
                  className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: selected ? DEEP_CURRENT[100] : WAVE[50],
                    color: selected ? DEEP_CURRENT[600] : WAVE[500],
                  }}
                >
                  {option.icon}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div
                  className={cn("font-semibold", selected ? "text-accent" : "text-foreground")}
                >
                  {option.label}
                </div>
                {option.description && (
                  <div
                    className={cn("text-xs mt-0.5 truncate", selected ? "text-accent/80" : "text-muted-foreground")}
                  >
                    {option.description}
                  </div>
                )}
              </div>
              {selected && (
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: DEEP_CURRENT[500] }}
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Show more/less button */}
      {hasMoreOptions && (
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors"
          style={{
            color: DEEP_CURRENT[600],
            backgroundColor: DEEP_CURRENT[50],
            border: `1px dashed ${DEEP_CURRENT[300]}`,
            borderRadius: RADIUS.sm,
          }}
          whileHover={{ backgroundColor: DEEP_CURRENT[100] }}
          whileTap={{ scale: 0.99 }}
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
          {isExpanded ? showLessLabel : `${showMoreLabel} (${hiddenCount})`}
        </motion.button>
      )}
    </div>
  )
}

// Location Picker Component
interface LocationPickerProps {
  locations: Location[]
  value?: Location
  onChange: (location: Location) => void
  placeholder?: string
  className?: string
}

function LocationPicker({
  locations,
  value,
  onChange,
  placeholder = "Select location...",
  className,
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase()) ||
    loc.building?.toLowerCase().includes(search.toLowerCase()) ||
    loc.code?.toLowerCase().includes(search.toLowerCase())
  )

  const groupedLocations = filteredLocations.reduce((acc, loc) => {
    const building = loc.building || "Other"
    if (!acc[building]) acc[building] = []
    acc[building].push(loc)
    return acc
  }, {} as Record<string, Location[]>)

  return (
    <div className={cn("relative", className)}>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3.5 transition-all text-left border border-dashed rounded-sm",
          value
            ? "bg-success-light border-success"
            : "bg-surface border-default"
        )}
      >
        <span
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: value ? HARBOR[100] : WAVE[50],
            color: value ? HARBOR[600] : WAVE[500],
          }}
        >
          <MapPin className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          {value ? (
            <>
              <div className="font-semibold" style={{ color: HARBOR[700] }}>{value.name}</div>
              <div className="text-xs mt-0.5" style={{ color: HARBOR[500] }}>
                {[value.building, value.floor, value.zone].filter(Boolean).join(" · ")}
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        {value?.code && (
          <span
            className="px-2 py-1 rounded-md font-mono text-xs font-medium"
            style={{ backgroundColor: HARBOR[100], color: HARBOR[700] }}
          >
            {value.code}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute z-20 top-full left-0 right-0 mt-2 overflow-hidden bg-surface border border-dashed border-default rounded-md"
          >
            <div
              className="p-3 bg-surface border-b border-dashed border-default"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search locations..."
                className="w-full px-3 py-2.5 text-sm focus:outline-none bg-surface border border-dashed border-default rounded-sm text-primary"
                autoFocus
              />
            </div>

            <div className="max-h-64 overflow-y-auto">
              {Object.entries(groupedLocations).map(([building, locs]) => (
                <div key={building}>
                  <div
                    className="px-3 py-2 text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: DUSK_REEF[50], color: DUSK_REEF[600] }}
                  >
                    {building}
                  </div>
                  {locs.map((loc) => {
                    const isSelected = value?.id === loc.id
                    return (
                      <button
                        key={loc.id}
                        onClick={() => {
                          onChange(loc)
                          setIsOpen(false)
                          setSearch("")
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                        style={{
                          backgroundColor: isSelected ? HARBOR[50] : "transparent",
                        }}
                      >
                        <span
                          className={cn(
                            "w-8 h-8 rounded-md flex items-center justify-center",
                            isSelected ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                          )}
                        >
                          <MapPin className="w-4 h-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className={cn("text-sm font-medium", isSelected ? "text-accent" : "text-foreground")}>
                            {loc.name}
                          </div>
                          {loc.zone && (
                            <div className={cn("text-xs", isSelected ? "text-accent/80" : "text-muted-foreground")}>
                              {loc.zone}
                            </div>
                          )}
                        </div>
                        {loc.code && (
                          <span
                            className={cn(
                              "text-xs font-mono px-1.5 py-0.5 rounded",
                              isSelected ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {loc.code}
                          </span>
                        )}
                        {isSelected && (
                          <Check className="w-4 h-4 text-accent" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
              {filteredLocations.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No locations found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}
    </div>
  )
}

// Severity Scale Component
interface SeverityScaleProps {
  value?: SeverityLevel
  onChange: (value: SeverityLevel) => void
  showLabels?: boolean
  className?: string
}

function SeverityScale({
  value,
  onChange,
  showLabels = true,
  className,
}: SeverityScaleProps) {
  const levels: SeverityLevel[] = ["low", "medium", "high", "critical"]

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-4 gap-3">
        {levels.map((level) => {
          const config = severityConfig[level]
          const isSelected = value === level

          return (
            <motion.button
              key={level}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(level)}
              className={cn(
                "flex flex-col items-center gap-2 py-4 px-3 transition-all relative overflow-hidden border border-dashed rounded-sm",
                !isSelected && "bg-surface border-default"
              )}
              style={isSelected ? {
                backgroundColor: config.bgColor,
                borderColor: config.bgColor,
                color: "white",
              } : { color: config.color }}
            >
              {isSelected && (
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)`,
                  }}
                />
              )}
              <span
                className="w-10 h-10 rounded-lg flex items-center justify-center relative z-10"
                style={{
                  backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : config.lightBg,
                }}
              >
                {config.icon}
              </span>
              {showLabels && (
                <span className="text-xs font-bold uppercase tracking-wide relative z-10">
                  {config.label}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      {value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 text-sm"
          style={{
            backgroundColor: severityConfig[value].lightBg,
            color: severityConfig[value].color,
            border: `1px dashed ${severityConfig[value].borderColor}`,
            borderRadius: RADIUS.sm,
          }}
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: severityConfig[value].bgColor }}
          >
            <span style={{ color: "white" }}>{severityConfig[value].icon}</span>
          </span>
          <span className="font-medium">{severityConfig[value].description}</span>
        </motion.div>
      )}
    </div>
  )
}

// File Upload Component
interface FileUploadProps {
  files: UploadedFile[]
  onChange: (files: UploadedFile[]) => void
  accept?: string
  maxFiles?: number
  maxSize?: number
  className?: string
}

function FileUpload({
  files,
  onChange,
  accept = "image/*,.pdf,.doc,.docx",
  maxFiles = 5,
  maxSize = 10,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const newFiles: UploadedFile[] = []
    Array.from(fileList).forEach((file) => {
      if (files.length + newFiles.length >= maxFiles) return
      if (file.size > maxSize * 1024 * 1024) return
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
      }
      if (file.type.startsWith("image/")) {
        uploadedFile.preview = URL.createObjectURL(file)
      }
      newFiles.push(uploadedFile)
    })
    onChange([...files, ...newFiles])
  }

  const handleRemove = (id: string) => {
    onChange(files.filter((f) => f.id !== id))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={cn("space-y-4", className)}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 py-10 px-6 border-2 border-dashed rounded-xl cursor-pointer transition-all"
        style={{
          backgroundColor: isDragging ? DUSK_REEF[50] : WAVE[50],
          borderColor: isDragging ? DUSK_REEF[400] : WAVE[200],
          boxShadow: isDragging ? `0 0 0 4px ${DUSK_REEF[100]}` : undefined,
        }}
      >
        <span
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: isDragging ? DUSK_REEF[100] : WAVE[100],
            color: isDragging ? DUSK_REEF[600] : WAVE[600],
          }}
        >
          <Upload className="w-7 h-7" />
        </span>
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: isDragging ? DUSK_REEF[700] : ABYSS[700] }}>
            Drop files here or click to upload
          </p>
          <p className="text-xs mt-1" style={{ color: ABYSS[400] }}>
            Max {maxFiles} files, up to {maxSize}MB each
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </motion.div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl border-2"
              style={{ backgroundColor: HARBOR[50], borderColor: HARBOR[200] }}
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  style={{ border: `2px solid ${HARBOR[200]}` }}
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: DUSK_REEF[100], color: DUSK_REEF[600] }}
                >
                  <FileText className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: ABYSS[700] }}>{file.name}</p>
                <p className="text-xs" style={{ color: HARBOR[600] }}>{formatSize(file.size)}</p>
              </div>
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: HARBOR[500] }}
              >
                <Check className="w-3.5 h-3.5 text-white" />
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(file.id) }}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: CORAL[500] }}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Summary Card Component
interface SummaryCardProps {
  title: string
  items: SummaryItem[]
  severity?: SeverityLevel
  onSubmit: () => void
  onCancel: () => void
  submitLabel?: string
  isSubmitting?: boolean
  className?: string
}

function SummaryCard({
  title,
  items,
  severity,
  onSubmit,
  onCancel,
  submitLabel = "Submit Report",
  isSubmitting = false,
  className,
}: SummaryCardProps) {
  const config = severity ? severityConfig[severity] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-2xl overflow-hidden bg-surface shadow-lg", className)}
      style={{
        border: `2px solid ${config?.borderColor || SLATE[200]}`,
      }}
    >
      <div
        className="px-5 py-4"
        style={{
          background: config
            ? `linear-gradient(135deg, ${config.lightBg} 0%, ${PRIMITIVES.white} 100%)`
            : `linear-gradient(135deg, ${DEEP_CURRENT[50]} 0%, ${PRIMITIVES.white} 100%)`,
          borderBottom: `2px solid ${config?.borderColor || SLATE[200]}`,
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg" style={{ color: ABYSS[800] }}>{title}</h3>
          {severity && config && (
            <span
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
              style={{
                backgroundColor: config.bgColor,
                color: "white",
                boxShadow: `0 2px 8px ${config.bgColor}40`,
              }}
            >
              {config.icon}
              <span>{config.label}</span>
            </span>
          )}
        </div>
      </div>

      <div className="p-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 px-4 py-3 rounded-xl transition-colors"
            style={{ backgroundColor: index % 2 === 0 ? SLATE[50] : "transparent" }}
          >
            {item.icon && (
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: WAVE[100], color: WAVE[600] }}
              >
                {item.icon}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: ABYSS[400] }}>
                {item.label}
              </p>
              <div className="text-sm font-medium mt-0.5" style={{ color: ABYSS[700] }}>{item.value}</div>
            </div>
            {item.editable && item.onEdit && (
              <button
                onClick={item.onEdit}
                className="text-xs font-semibold px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                style={{ color: DEEP_CURRENT[600], backgroundColor: DEEP_CURRENT[50] }}
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>
        ))}
      </div>

      <div
        className="flex gap-3 p-4"
        style={{
          background: `linear-gradient(180deg, ${SLATE[50]} 0%, ${SLATE[100]} 100%)`,
          borderTop: `1px solid ${SLATE[200]}`,
        }}
      >
        <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          className="flex-1 font-semibold"
          style={{ backgroundColor: HARBOR[500], color: "white", boxShadow: `0 4px 12px ${HARBOR[400]}40` }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}

// Data Table Component
interface DataColumn<T> {
  key: keyof T | string
  header: string
  width?: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: DataColumn<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  className?: string
}

function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No data available",
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn("rounded-xl overflow-hidden", className)}
      style={{
        backgroundColor: PRIMITIVES.white,
        border: `2px solid ${SLATE[200]}`,
        boxShadow: SHADOWS.sm,
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: `linear-gradient(135deg, ${DUSK_REEF[50]} 0%, ${WAVE[50]} 100%)`,
          borderBottom: `2px solid ${SLATE[200]}`,
        }}
      >
        {columns.map((col) => (
          <div
            key={String(col.key)}
            className="text-xs font-bold uppercase tracking-wider"
            style={{ width: col.width || "auto", flex: col.width ? "none" : 1, color: DUSK_REEF[600] }}
          >
            {col.header}
          </div>
        ))}
      </div>

      {data.length > 0 ? (
        <div>
          {data.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn("flex items-center gap-2 px-4 py-3 transition-colors", onRowClick && "cursor-pointer")}
              style={{ backgroundColor: index % 2 === 0 ? SLATE[50] : "transparent" }}
            >
              {columns.map((col) => (
                <div
                  key={String(col.key)}
                  className="text-sm font-medium"
                  style={{ width: col.width || "auto", flex: col.width ? "none" : 1, color: ABYSS[700] }}
                >
                  {col.render ? col.render(item) : String(item[col.key as keyof T] || "-")}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-8 text-center text-sm" style={{ color: ABYSS[400] }}>
          {emptyMessage}
        </div>
      )}
    </div>
  )
}

// Action Card Component
interface ActionCardProps {
  title: string
  description: string
  status: "pending" | "approved" | "rejected" | "in_review"
  assignee?: string
  dueDate?: string
  priority?: "low" | "medium" | "high"
  onApprove?: () => void
  onReject?: () => void
  onViewDetails?: () => void
  className?: string
}

const actionStatusConfig = {
  pending: { label: "Pending", bgColor: SUNRISE[100], color: SUNRISE[700], borderColor: SUNRISE[300] },
  approved: { label: "Approved", bgColor: HARBOR[500], color: PRIMITIVES.white, borderColor: HARBOR[500] },
  rejected: { label: "Rejected", bgColor: CORAL[500], color: PRIMITIVES.white, borderColor: CORAL[500] },
  in_review: { label: "In Review", bgColor: DUSK_REEF[100], color: DUSK_REEF[700], borderColor: DUSK_REEF[300] },
}

const priorityConfig = {
  low: { label: "Low", bgColor: HARBOR[50], color: HARBOR[600] },
  medium: { label: "Medium", bgColor: SUNRISE[50], color: SUNRISE[700] },
  high: { label: "High", bgColor: CORAL[50], color: CORAL[600] },
}

function ActionCard({
  title,
  description,
  status,
  assignee,
  dueDate,
  priority,
  onApprove,
  onReject,
  onViewDetails,
  className,
}: ActionCardProps) {
  const statusInfo = actionStatusConfig[status]
  const priorityInfo = priority ? priorityConfig[priority] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn("rounded-xl overflow-hidden", className)}
      style={{
        backgroundColor: PRIMITIVES.white,
        border: `2px solid ${statusInfo.borderColor}`,
        boxShadow: SHADOWS.sm,
      }}
    >
      <div
        className="px-4 py-4"
        style={{ background: `linear-gradient(135deg, ${statusInfo.bgColor}40 0%, ${PRIMITIVES.white} 100%)` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold" style={{ color: ABYSS[800] }}>{title}</h4>
            <p className="text-sm mt-1.5 line-clamp-2" style={{ color: ABYSS[500] }}>{description}</p>
          </div>
          <span
            className="px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      <div
        className="flex items-center gap-4 px-4 py-2.5 text-xs"
        style={{ backgroundColor: SLATE[50], borderTop: `1px solid ${SLATE[200]}`, borderBottom: `1px solid ${SLATE[200]}` }}
      >
        {assignee && (
          <div className="flex items-center gap-1.5" style={{ color: ABYSS[500] }}>
            <User className="w-3.5 h-3.5" />
            <span className="font-medium">{assignee}</span>
          </div>
        )}
        {dueDate && (
          <div className="flex items-center gap-1.5" style={{ color: ABYSS[500] }}>
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-medium">{dueDate}</span>
          </div>
        )}
        {priorityInfo && (
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: priorityInfo.bgColor, color: priorityInfo.color }}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="font-bold">{priorityInfo.label}</span>
          </div>
        )}
      </div>

      {(onApprove || onReject || onViewDetails) && (
        <div className="flex items-center gap-2 px-4 py-3">
          {onViewDetails && (
            <Button variant="ghost" size="sm" onClick={onViewDetails} style={{ color: DEEP_CURRENT[600] }}>
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          <div className="flex-1" />
          {onReject && status === "pending" && (
            <Button variant="outline" size="sm" onClick={onReject} style={{ borderColor: CORAL[300], color: CORAL[600] }}>
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          )}
          {onApprove && status === "pending" && (
            <Button size="sm" onClick={onApprove} style={{ backgroundColor: HARBOR[500], color: PRIMITIVES.white }}>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Approve
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}

// Incident List Item Component
interface IncidentListItemProps {
  id: string
  title: string
  category: string
  severity: SeverityLevel
  location: string
  dateTime: string
  status: "open" | "in_progress" | "resolved" | "closed"
  onClick?: () => void
  className?: string
}

function IncidentListItem({
  id,
  title,
  category,
  severity,
  location,
  dateTime,
  status,
  onClick,
  className,
}: IncidentListItemProps) {
  const severityInfo = severityConfig[severity]
  const statusInfo = incidentStatusConfig[status]

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn("flex items-stretch gap-0 rounded-xl cursor-pointer transition-all overflow-hidden", className)}
      style={{
        backgroundColor: PRIMITIVES.white,
        border: `2px solid ${severityInfo.borderColor}`,
        boxShadow: SHADOWS.sm,
      }}
    >
      <div
        className="w-2 flex-shrink-0"
        style={{ background: `linear-gradient(180deg, ${severityInfo.bgColor} 0%, ${severityInfo.color} 100%)` }}
      />
      <div className="flex-1 min-w-0 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: SLATE[100], color: ABYSS[500] }}>
            {id}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: severityInfo.lightBg, color: severityInfo.color }}
          >
            {category}
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusInfo.color }} />
            {statusInfo.label}
          </span>
        </div>
        <h4 className="font-bold mt-2 truncate" style={{ color: ABYSS[800] }}>{title}</h4>
        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: ABYSS[400] }}>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={{ color: WAVE[500] }} />
            {location}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" style={{ color: DUSK_REEF[400] }} />
            {dateTime}
          </span>
        </div>
      </div>
      <div className="flex items-center px-3" style={{ backgroundColor: SLATE[50] }}>
        <ChevronRight className="w-5 h-5" style={{ color: ABYSS[300] }} />
      </div>
    </motion.div>
  )
}

// Invite People Component
interface InvitePeopleProps {
  members: TeamMember[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  suggestedMembers?: TeamMember[]
  onInviteNew?: () => void
  className?: string
}

function InvitePeople({
  members,
  selectedIds,
  onChange,
  suggestedMembers: _suggestedMembers = [],
  onInviteNew,
  className,
}: InvitePeopleProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.department?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedMembers = members.filter((m) => selectedIds.includes(m.id))
  const unselectedMembers = filteredMembers.filter((m) => !selectedIds.includes(m.id))

  const toggleMember = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {selectedMembers.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: DUSK_REEF[500] }}>
            Invited ({selectedMembers.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map((member) => {
              const roleInfo = roleConfig[member.role]
              return (
                <motion.div
                  key={member.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border-2"
                  style={{
                    backgroundColor: roleInfo.bgColor,
                    borderColor: roleInfo.color,
                    boxShadow: `0 2px 8px ${roleInfo.color}20`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: roleInfo.color }}
                  >
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: ABYSS[800] }}>{member.name}</p>
                    <div className="flex items-center gap-1 text-xs font-medium" style={{ color: roleInfo.color }}>
                      {roleInfo.icon}
                      <span>{roleInfo.label}</span>
                    </div>
                  </div>
                  <button onClick={() => toggleMember(member.id)} className="p-1.5 rounded-lg" style={{ color: CORAL[500] }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {!isExpanded ? (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-3 w-full px-4 py-4 border-2 border-dashed rounded-xl transition-all"
          style={{ borderColor: DEEP_CURRENT[300], backgroundColor: DEEP_CURRENT[50] }}
        >
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: DEEP_CURRENT[100], color: DEEP_CURRENT[600] }}
          >
            <UserPlus className="w-5 h-5" />
          </span>
          <span className="text-sm font-semibold" style={{ color: DEEP_CURRENT[700] }}>
            Add people to this incident
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-2 rounded-xl overflow-hidden"
          style={{ borderColor: SLATE[200], boxShadow: SHADOWS.md }}
        >
          <div
            className="p-4"
            style={{ background: `linear-gradient(135deg, ${DUSK_REEF[50]} 0%, ${WAVE[50]} 100%)`, borderBottom: `2px solid ${SLATE[200]}` }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or department..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2"
              style={{ border: `2px solid ${SLATE[200]}`, backgroundColor: PRIMITIVES.white }}
            />
          </div>

          <div className="max-h-48 overflow-y-auto p-2">
            {unselectedMembers.map((member, index) => {
              const roleInfo = roleConfig[member.role]
              return (
                <button
                  key={member.id}
                  onClick={() => toggleMember(member.id)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors"
                  style={{ backgroundColor: index % 2 === 0 ? SLATE[50] : "transparent" }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: roleInfo.color }}
                  >
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold" style={{ color: ABYSS[800] }}>{member.name}</p>
                    <p className="text-xs" style={{ color: ABYSS[400] }}>{member.email}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-lg"
                    style={{ backgroundColor: roleInfo.bgColor, color: roleInfo.color }}
                  >
                    {roleInfo.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: `linear-gradient(180deg, ${SLATE[50]} 0%, ${SLATE[100]} 100%)`, borderTop: `2px solid ${SLATE[200]}` }}
          >
            {onInviteNew && (
              <button
                onClick={onInviteNew}
                className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg"
                style={{ color: DEEP_CURRENT[600], backgroundColor: DEEP_CURRENT[50] }}
              >
                <Mail className="w-4 h-4" />
                Invite by email
              </button>
            )}
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm font-semibold px-4 py-1.5 rounded-lg"
              style={{ color: ABYSS[600], backgroundColor: SLATE[200] }}
            >
              Done
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Comment Thread Component
interface CommentThreadProps {
  comments: Comment[]
  onAddComment: (content: string, isInternal: boolean) => void
  currentUser: TeamMember
  className?: string
}

function CommentThread({
  comments,
  onAddComment,
  currentUser,
  className,
}: CommentThreadProps) {
  const [newComment, setNewComment] = useState("")
  const [isInternal, setIsInternal] = useState(false)

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim(), isInternal)
      setNewComment("")
    }
  }

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-4">
        {comments.map((comment) => {
          const roleInfo = roleConfig[comment.author.role]
          return (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: roleInfo.color }}
              >
                {getInitials(comment.author.name)}
              </div>
              <div
                className="flex-1 min-w-0 p-3 rounded-xl"
                style={{
                  backgroundColor: comment.isInternal ? SUNRISE[50] : SLATE[50],
                  border: comment.isInternal ? `2px solid ${SUNRISE[200]}` : `2px solid ${SLATE[200]}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold" style={{ color: ABYSS[800] }}>{comment.author.name}</span>
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: roleInfo.bgColor, color: roleInfo.color }}
                  >
                    {roleInfo.label}
                  </span>
                  <span className="text-xs" style={{ color: ABYSS[400] }}>{comment.timestamp}</span>
                  {comment.isInternal && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: SUNRISE[500], color: PRIMITIVES.white }}
                    >
                      Internal
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: ABYSS[700] }}>{comment.content}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div
        className="flex flex-col gap-3 p-4 rounded-xl border-2"
        style={{ backgroundColor: WAVE[50], borderColor: WAVE[200] }}
      >
        <div className="flex gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: roleConfig[currentUser.role].color }}
          >
            {getInitials(currentUser.name)}
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="flex-1 px-3 py-2.5 text-sm rounded-lg resize-none focus:outline-none focus:ring-2"
            style={{ border: `2px solid ${SLATE[200]}`, backgroundColor: PRIMITIVES.white }}
          />
        </div>
        <div className="flex items-center justify-between pl-13">
          <label
            className="flex items-center gap-2 text-xs font-medium cursor-pointer px-3 py-1.5 rounded-lg"
            style={{ color: isInternal ? SUNRISE[700] : ABYSS[500], backgroundColor: isInternal ? SUNRISE[100] : "transparent" }}
          >
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded"
            />
            Internal note (not visible to reporter)
          </label>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            style={{
              backgroundColor: newComment.trim() ? DEEP_CURRENT[500] : SLATE[300],
              color: PRIMITIVES.white,
            }}
          >
            <Send className="w-4 h-4 mr-1" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// CHAT COMPONENTS
// =============================================================================

interface ChatBubbleProps {
  message: ChatMessage
  onQuickReply?: (option: QuickReplyOption) => void
}

function ChatBubble({ message, onQuickReply }: ChatBubbleProps) {
  const isUser = message.type === "user"
  const isAgent = message.type === "agent"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3 max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}
    >
      {/* Avatar with optional dashed ring for agent */}
      <div className="relative flex-shrink-0 w-10 h-10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: isUser ? CORAL[50] : WAVE[50],
          }}
        >
          {isUser ? (
            <User className="w-5 h-5" style={{ color: DUSK_REEF[500] }} />
          ) : isAgent ? (
            <AgentLogo className="w-7 h-7" variant="light" />
          ) : (
            <Shield className="w-5 h-5" style={{ color: SLATE[500] }} />
          )}
        </div>
        {/* Dashed ring for agent avatar */}
        {isAgent && (
          <svg className="absolute -inset-1 w-12 h-12" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke={DEEP_CURRENT[200]}
              strokeWidth="1"
              strokeDasharray="3 2"
            />
          </svg>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div
          className="px-4 py-3"
          style={{
            backgroundColor: isUser ? CORAL[50] : DUSK_REEF[50],
            color: DUSK_REEF[500],
            borderRadius: isUser ? `${RADIUS.md} ${RADIUS.md} ${RADIUS.xs} ${RADIUS.md}` : `${RADIUS.md} ${RADIUS.md} ${RADIUS.md} ${RADIUS.xs}`,
          }}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.options && message.options.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {message.options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onQuickReply?.(option)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
                style={{
                  backgroundColor: PRIMITIVES.white,
                  color: DEEP_CURRENT[600],
                  border: `1px dashed ${DEEP_CURRENT[300]}`,
                  borderRadius: RADIUS.sm,
                }}
              >
                {option.icon}
                {option.label}
              </motion.button>
            ))}
          </div>
        )}

        <span className="text-xs" style={{ color: ALIAS.text.tertiary }}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  )
}

// Incident Form Section
interface IncidentFormSectionProps {
  step: number
  data: Partial<IncidentReport>
  onUpdate: (data: Partial<IncidentReport>) => void
  onSubmit: () => void
}

function IncidentFormSection({ step, data, onUpdate, onSubmit }: IncidentFormSectionProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>()

  const categoryOptions: QuickSelectOption[] = [
    { id: "injury", value: "injury", label: "Injury", description: "Personal injury incident", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "near_miss", value: "near_miss", label: "Near Miss", description: "Close call, no injury", icon: <Shield className="w-4 h-4" /> },
    { id: "environmental", value: "environmental", label: "Environmental", description: "Environmental hazard", icon: <MapPin className="w-4 h-4" /> },
    { id: "equipment", value: "equipment", label: "Equipment Failure", description: "Machine or tool issue", icon: <Zap className="w-4 h-4" /> },
    { id: "chemical", value: "chemical", label: "Chemical Spill", description: "Hazardous material", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "fire", value: "fire", label: "Fire/Smoke", description: "Fire or smoke detected", icon: <Flame className="w-4 h-4" /> },
  ]

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    onUpdate({ location: location.name, locationCode: location.code })
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
      <div
        className="p-5"
        style={{
          backgroundColor: PRIMITIVES.white,
          border: `1px dashed ${SLATE[300]}`,
          borderRadius: RADIUS.md,
        }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: DEEP_CURRENT[100], color: DEEP_CURRENT[700] }}>
                  Step 1 of 4
                </span>
                <span className="text-sm font-bold" style={{ color: ABYSS[800] }}>Incident Type</span>
              </div>
              <QuickSelect
                options={categoryOptions}
                value={data.category || ""}
                onChange={(val) => onUpdate({ category: (typeof val === "string" ? val : val[0]) as IncidentCategory })}
                columns={2}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: DEEP_CURRENT[100], color: DEEP_CURRENT[700] }}>
                  Step 2 of 4
                </span>
                <span className="text-sm font-bold" style={{ color: ABYSS[800] }}>Severity & Location</span>
              </div>
              <div className="space-y-5">
                <div>
                  <Label className="text-sm font-bold mb-3 block" style={{ color: ABYSS[700] }}>Severity Level</Label>
                  <SeverityScale
                    value={data.severity}
                    onChange={(val) => onUpdate({ severity: val })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: ABYSS[700] }}>
                    <MapPin className="w-4 h-4" style={{ color: HARBOR[500] }} />
                    Location
                  </Label>
                  <LocationPicker
                    locations={SAMPLE_LOCATIONS}
                    value={selectedLocation}
                    onChange={handleLocationSelect}
                    placeholder="Search or select location..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: DEEP_CURRENT[100], color: DEEP_CURRENT[700] }}>
                  Step 3 of 4
                </span>
                <span className="text-sm font-bold" style={{ color: ABYSS[800] }}>Description</span>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-bold mb-2 block" style={{ color: ABYSS[700] }}>Brief Title</Label>
                  <Input
                    placeholder="Short description of incident"
                    value={data.title || ""}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    style={{ border: `1px dashed ${SLATE[300]}`, borderRadius: RADIUS.sm }}
                  />
                </div>
                <div>
                  <Label className="text-sm font-bold mb-2 block" style={{ color: ABYSS[700] }}>What happened?</Label>
                  <Textarea
                    placeholder="Describe the incident in detail..."
                    value={data.description || ""}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    className="min-h-[100px]"
                    style={{ border: `1px dashed ${SLATE[300]}`, borderRadius: RADIUS.sm }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: DEEP_CURRENT[100], color: DEEP_CURRENT[700] }}>
                  Step 4 of 4
                </span>
                <span className="text-sm font-bold" style={{ color: ABYSS[800] }}>Additional Details</span>
              </div>
              <div className="space-y-4">
                <div
                  className="flex items-center gap-3 p-3"
                  style={{
                    backgroundColor: data.injuryInvolved ? CORAL[50] : PRIMITIVES.white,
                    border: `1px dashed ${data.injuryInvolved ? CORAL[300] : SLATE[300]}`,
                    borderRadius: RADIUS.sm,
                  }}
                >
                  <Checkbox
                    id="injury"
                    checked={data.injuryInvolved || false}
                    onCheckedChange={(checked) => onUpdate({ injuryInvolved: checked as boolean })}
                  />
                  <Label htmlFor="injury" className="text-sm font-semibold" style={{ color: ABYSS[700] }}>
                    Injury involved
                  </Label>
                </div>
                {data.injuryInvolved && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-3 p-3 ml-4"
                    style={{
                      backgroundColor: data.medicalAttention ? SUNRISE[50] : PRIMITIVES.white,
                      border: `1px dashed ${data.medicalAttention ? SUNRISE[300] : SLATE[300]}`,
                      borderRadius: RADIUS.sm,
                    }}
                  >
                    <Checkbox
                      id="medical"
                      checked={data.medicalAttention || false}
                      onCheckedChange={(checked) => onUpdate({ medicalAttention: checked as boolean })}
                    />
                    <Label htmlFor="medical" className="text-sm font-semibold" style={{ color: ABYSS[700] }}>
                      Medical attention required
                    </Label>
                  </motion.div>
                )}
                <div>
                  <Label className="text-sm font-bold mb-2 block" style={{ color: ABYSS[700] }}>Immediate actions taken</Label>
                  <Textarea
                    placeholder="What actions were taken immediately after the incident?"
                    value={data.immediateActions || ""}
                    onChange={(e) => onUpdate({ immediateActions: e.target.value })}
                    style={{ border: `1px dashed ${SLATE[300]}`, borderRadius: RADIUS.sm }}
                  />
                </div>
                <Button
                  onClick={onSubmit}
                  className="w-full mt-4 font-semibold"
                  style={{
                    backgroundColor: DEEP_CURRENT[500],
                    color: PRIMITIVES.white,
                    border: `1px dashed ${DEEP_CURRENT[400]}`,
                    borderRadius: RADIUS.sm,
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Report
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// =============================================================================
// MAIN EHS CHAT COMPONENT
// =============================================================================

interface EHSChatProps {
  className?: string
  greeting?: string
  onReportSubmit?: (report: IncidentReport) => void
}

function EHSChat({
  className,
  greeting = "Hello! I'm your EHS Assistant. I can help you report safety incidents quickly and accurately. What would you like to report today?",
  onReportSubmit,
}: EHSChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [agentState, setAgentState] = useState<AgentState>("idle")
  const [formStep, setFormStep] = useState(0)
  const [reportData, setReportData] = useState<Partial<IncidentReport>>({})
  const [showForm, setShowForm] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: "greeting",
      type: "agent",
      content: greeting,
      timestamp: new Date(),
      agentState: "idle",
      options: [
        { id: "report", label: "Report Incident", value: "report", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
        { id: "check", label: "Check Status", value: "status", icon: <Clock className="w-3 h-3 mr-1" /> },
        { id: "help", label: "Get Help", value: "help", icon: <FileText className="w-3 h-3 mr-1" /> },
      ],
    }
    setMessages([initialMessage])
  }, [greeting])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const processUserInput = async (input: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    setAgentState("thinking")
    await new Promise((r) => setTimeout(r, 800))
    setAgentState("planning")
    await new Promise((r) => setTimeout(r, 600))
    setAgentState("executing")

    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("report") || lowerInput.includes("incident") || lowerInput.includes("accident")) {
      await new Promise((r) => setTimeout(r, 400))
      let openingMessage = "I'm here to help you report this. Your safety is our top priority.\n\nLet's walk through this together. **What type of incident are you reporting?**"

      if (lowerInput.includes("accident") || lowerInput.includes("hurt") || lowerInput.includes("injured")) {
        openingMessage = "I understand something happened. First, is everyone safe right now? If anyone needs immediate medical attention, please call emergency services first.\n\n**What type of incident are you reporting?**"
      }

      const agentResponse: ChatMessage = {
        id: Date.now().toString(),
        type: "agent",
        content: openingMessage,
        timestamp: new Date(),
        agentState: "confirming",
      }
      setMessages((prev) => [...prev, agentResponse])
      setShowForm(true)
      setFormStep(1)
    } else if (lowerInput.includes("status") || lowerInput.includes("check")) {
      await new Promise((r) => setTimeout(r, 400))
      const agentResponse: ChatMessage = {
        id: Date.now().toString(),
        type: "agent",
        content: "Let me check on that for you...\n\nYou currently have **no open reports** in the system. That's a good sign!\n\nWould you like to submit a new incident report?",
        timestamp: new Date(),
        options: [
          { id: "new", label: "Start New Report", value: "report", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
        ],
      }
      setMessages((prev) => [...prev, agentResponse])
    } else {
      await new Promise((r) => setTimeout(r, 400))
      const agentResponse: ChatMessage = {
        id: Date.now().toString(),
        type: "agent",
        content: "I'm your EHS assistant! I can help with:\n\n• **Reporting incidents** - accidents, near misses, hazards\n• **Checking report status** - tracking your submissions\n• **Safety guidance** - answering EHS questions\n\nWhat would you like to do?",
        timestamp: new Date(),
        options: [
          { id: "report", label: "Report Incident", value: "report", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
          { id: "status", label: "Check Status", value: "status", icon: <Clock className="w-3 h-3 mr-1" /> },
        ],
      }
      setMessages((prev) => [...prev, agentResponse])
    }

    setAgentState("idle")
  }

  const handleQuickReply = (option: QuickReplyOption) => {
    processUserInput(option.label)
  }

  const addAgentMessage = (content: string) => {
    if (!content) return
    const message: ChatMessage = {
      id: `agent-${Date.now()}`,
      type: "agent",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
  }

  const handleFormUpdate = (data: Partial<IncidentReport>) => {
    const newData = { ...reportData, ...data }
    setReportData(newData)

    if (data.category && formStep === 1) {
      setTimeout(() => {
        setFormStep(2)
        addAgentMessage("Got it. Now, how serious is this situation? And where exactly did it happen?")
      }, 300)
    }
    if (formStep === 2 && newData.severity && newData.location) {
      setTimeout(() => {
        setFormStep(3)
        addAgentMessage("Thanks for those details. Can you describe what happened?")
      }, 300)
    }
    if (data.title && data.description && formStep === 3) {
      setTimeout(() => {
        setFormStep(4)
        addAgentMessage("Almost done! Just a few more questions to complete your report.")
      }, 300)
    }
  }

  const handleFormSubmit = async () => {
    setAgentState("executing")
    await new Promise((r) => setTimeout(r, 1000))

    const finalReport: IncidentReport = {
      id: `INC-${Date.now()}`,
      category: reportData.category || "other",
      severity: reportData.severity || "low",
      title: reportData.title || "Untitled Incident",
      description: reportData.description || "",
      location: reportData.location || "",
      locationCode: reportData.locationCode,
      dateTime: new Date().toISOString(),
      witnesses: [],
      immediateActions: reportData.immediateActions || "",
      injuryInvolved: reportData.injuryInvolved || false,
      medicalAttention: reportData.medicalAttention || false,
      photos: [],
      status: "submitted",
    }

    onReportSubmit?.(finalReport)

    const confirmMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "agent",
      content: `**Report Submitted Successfully!**\n\n**Report ID:** ${finalReport.id}\n**Status:** Submitted for Review\n**Location:** ${finalReport.location}\n\nOur EHS team will review this within 24 hours. You'll get notified of any updates.\n\nIs there anything else I can help you with?`,
      timestamp: new Date(),
      options: [
        { id: "another", label: "Report Another Incident", value: "report", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
        { id: "done", label: "That's All, Thanks!", value: "done", icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
      ],
    }

    setMessages((prev) => [...prev, confirmMessage])
    setShowForm(false)
    setFormStep(0)
    setReportData({})
    setAgentState("complete")
    setTimeout(() => setAgentState("idle"), 2000)
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    processUserInput(inputValue)
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen" : "h-[600px] rounded-2xl",
        className
      )}
      style={{
        backgroundColor: PRIMITIVES.white,
        border: `1px dashed ${SLATE[300]}`,
        borderRadius: RADIUS.md,
      }}
    >
      {/* Header - Clean light style with dashed bottom border */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: PRIMITIVES.white, borderBottom: `1px dashed ${SLATE[300]}` }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar with dashed ring */}
          <div className="relative w-11 h-11">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: WAVE[50] }}
            >
              <AgentLogo className="w-8 h-8" state={agentState as LogoState} variant="light" />
            </div>
            {/* Dashed ring around avatar */}
            <svg className="absolute -inset-1 w-[52px] h-[52px]" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke={DEEP_CURRENT[300]}
                strokeWidth="1"
                strokeDasharray="4 3"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: ALIAS.text.primary }}>EHS Assistant</h3>
            <p className="text-xs" style={{ color: DEEP_CURRENT[500] }}>
              {agentState === "idle" && "Ready to help"}
              {agentState === "thinking" && "Analyzing..."}
              {agentState === "planning" && "Planning..."}
              {agentState === "executing" && "Processing..."}
              {agentState === "confirming" && "Awaiting confirmation"}
              {agentState === "complete" && "Task complete"}
              {agentState === "listening" && "Listening..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg transition-colors hover:bg-surface-hover">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem><Wand2 className="w-4 h-4 mr-2" />Auto-fill form</DropdownMenuItem>
              <DropdownMenuItem><MessageSquare className="w-4 h-4 mr-2" />Suggest response</DropdownMenuItem>
              <DropdownMenuItem><FileText className="w-4 h-4 mr-2" />Summarize</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg transition-colors hover:bg-surface-hover">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem><Bell className="w-4 h-4 mr-2" />Notifications</DropdownMenuItem>
              <DropdownMenuItem><Volume2 className="w-4 h-4 mr-2" />Sound</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><HelpCircle className="w-4 h-4 mr-2" />Help</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-lg transition-colors hover:bg-surface-hover">
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-muted-foreground" /> : <Maximize2 className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} onQuickReply={handleQuickReply} />
        ))}

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="ml-11">
            <IncidentFormSection step={formStep} data={reportData} onUpdate={handleFormUpdate} onSubmit={handleFormSubmit} />
          </motion.div>
        )}

        {(agentState === "thinking" || agentState === "planning" || agentState === "executing") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 ml-11">
            <div className="relative w-10 h-10">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: WAVE[50] }}
              >
                <AgentLogo className="w-7 h-7" state={agentState} variant="light" />
              </div>
              {/* Animated dashed ring */}
              <motion.svg
                className="absolute -inset-1 w-12 h-12"
                viewBox="0 0 48 48"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke={DEEP_CURRENT[400]}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              </motion.svg>
            </div>
            <span className="text-sm font-medium" style={{ color: ALIAS.text.secondary }}>
              {agentState === "thinking" && "Analyzing..."}
              {agentState === "planning" && "Planning response..."}
              {agentState === "executing" && "Processing..."}
            </span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4" style={{ backgroundColor: PRIMITIVES.white, borderTop: `1px dashed ${SLATE[300]}` }}>
        <div className="flex items-center gap-2">
          <button
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
            style={{ backgroundColor: WAVE[50], color: WAVE[600], border: `1px dashed ${WAVE[200]}` }}
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
            style={{ backgroundColor: DUSK_REEF[50], color: DUSK_REEF[500], border: `1px dashed ${DUSK_REEF[200]}` }}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
            style={{
              backgroundColor: PRIMITIVES.white,
              border: `1px dashed ${SLATE[300]}`,
              borderRadius: RADIUS.sm,
              color: ALIAS.text.primary,
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              backgroundColor: inputValue.trim() ? DEEP_CURRENT[500] : SLATE[100],
              color: inputValue.trim() ? PRIMITIVES.white : SLATE[400],
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  // Main Chat Component
  EHSChat,

  // Animated Logo Component
  AgentLogo,

  // Agentic UI Components
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

  // Configuration Objects
  severityConfig,
  incidentStatusConfig,
  roleConfig,
  logoPositions,
  logoColors,

  // Sample Data
  SAMPLE_LOCATIONS,

  // Types
  type LogoState,
  type LogoVariant,
  type QuickSelectOption,
  type Location,
  type SeverityLevel,
  type UploadedFile,
  type SummaryItem,
  type TeamMember,
  type TeamRole,
  type Comment,
  type IncidentReport,
  type ChatMessage,
  type AgentState,
  type IncidentCategory,
  type DataColumn,
  type ActionCardProps,
  type IncidentListItemProps,
}
