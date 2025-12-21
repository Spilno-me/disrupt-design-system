/**
 * Warm Linen Color Experiment
 *
 * Testing different warm color variations for the depth layering system.
 * This is for visual exploration only - no tokens are affected.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  Sun,
  Layers,
  LayoutDashboard,
  TriangleAlert,
  Settings,
  Users,
  Waypoints,
  Bell,
  ChevronRight,
  Shield,
  TrendingUp,
  HelpCircle,
} from 'lucide-react'

// =============================================================================
// EXPERIMENTAL COLOR PALETTES (not tokens - just for testing)
// =============================================================================

// Current cold palette (for comparison)
const CURRENT_COLD = {
  name: 'Current (Cold)',
  elevated: '#EBF9FF',  // softLinen - blue tint
  surface: '#EBF9FF',   // softLinen - blue tint
  page: '#DFDFD5',      // winterWhite - warm gray (mismatched!)
  description: 'Current palette - cold blue elevated/surface with warm gray page',
}

// Proposed Warm Linen - Option A (Cream family)
const WARM_LINEN_A = {
  name: 'Warm Linen A (Cream)',
  elevated: '#FFFBF5',  // Warm white cream
  surface: '#F5F1EA',   // Light warm linen
  page: '#E8E4DB',      // Cozy linen
  description: 'Warm cream family - very cozy, subtle yellow undertone',
}

// Proposed Warm Linen - Option B (Beige family)
const WARM_LINEN_B = {
  name: 'Warm Linen B (Beige)',
  elevated: '#FDFCFA',  // Almost white with warmth
  surface: '#F7F5F0',   // Light beige
  page: '#ECEAE3',      // Warm beige
  description: 'Subtle beige family - neutral warm, less yellow',
}

// Proposed Warm Linen - Option C (Sand family)
const WARM_LINEN_C = {
  name: 'Warm Linen C (Sand)',
  elevated: '#FDF9F3',  // Warm off-white
  surface: '#F3EEE5',   // Sandy linen
  page: '#E5E0D5',      // Warm sand
  description: 'Sand family - earthy, natural feel',
}

// Proposed Warm Linen - Option D (Ivory family)
const WARM_LINEN_D = {
  name: 'Warm Linen D (Ivory)',
  elevated: '#FFFEF9',  // Ivory white
  surface: '#FAF8F3',   // Light ivory
  page: '#F0EDE6',      // Warm ivory
  description: 'Ivory family - elegant, very light warmth',
}

// All palettes for iteration
const PALETTES = [CURRENT_COLD, WARM_LINEN_A, WARM_LINEN_B, WARM_LINEN_C, WARM_LINEN_D]

// =============================================================================
// COMPONENTS
// =============================================================================

interface PaletteCardProps {
  palette: typeof CURRENT_COLD
}

function PaletteCard({ palette }: PaletteCardProps) {
  return (
    <div style={{
      background: palette.page,
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #CBD5E1',
      minWidth: '320px',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <Layers size={20} color="#2D3142" />
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 600,
          color: '#2D3142',
        }}>{palette.name}</h3>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '12px',
        color: '#6B7280',
        marginBottom: '20px',
        lineHeight: 1.4,
      }}>{palette.description}</p>

      {/* Surface layer */}
      <div style={{
        background: palette.surface,
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          fontSize: '10px',
          color: '#9CA3AF',
          marginBottom: '12px',
          fontFamily: 'monospace',
        }}>Surface: {palette.surface}</div>

        {/* Card/Elevated layer */}
        <div style={{
          background: palette.elevated,
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        }}>
          <div style={{
            fontSize: '10px',
            color: '#9CA3AF',
            marginBottom: '8px',
            fontFamily: 'monospace',
          }}>Elevated/Card: {palette.elevated}</div>

          {/* Mock content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{
              height: '12px',
              width: '70%',
              background: '#2D3142',
              borderRadius: '4px',
              opacity: 0.8,
            }} />
            <div style={{
              height: '10px',
              width: '90%',
              background: '#6B7280',
              borderRadius: '4px',
              opacity: 0.5,
            }} />
            <div style={{
              height: '10px',
              width: '60%',
              background: '#6B7280',
              borderRadius: '4px',
              opacity: 0.5,
            }} />
          </div>
        </div>

        {/* Second card for comparison */}
        <div style={{
          background: palette.elevated,
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: '#0D9488',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sun size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#2D3142' }}>Sample Card</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>With accent color</div>
          </div>
        </div>
      </div>

      {/* Page label */}
      <div style={{
        fontSize: '10px',
        color: '#9CA3AF',
        marginTop: '12px',
        fontFamily: 'monospace',
        textAlign: 'center',
      }}>Page: {palette.page}</div>
    </div>
  )
}

// Grid Blob Background SVG (mimics the real component)
function GridBlobBackground({ pageColor: _pageColor }: { pageColor: string }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* Grid pattern */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Blob 1 - top right */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />

      {/* Blob 2 - bottom left */}
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(107, 114, 128, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
      }} />

      {/* Blob 3 - center */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '30%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
      }} />
    </div>
  )
}

// Full realistic app layout with blob background
function FullAppLayout({ palette }: PaletteCardProps) {
  const [activeNav, setActiveNav] = React.useState('dashboard')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workflows', label: 'Workflow Steps', icon: Waypoints },
    { id: 'incidents', label: 'Report Incident', icon: TriangleAlert, badge: 3 },
    { id: 'settings', label: 'Configuration', icon: Settings },
  ]

  return (
    <div style={{
      position: 'relative',
      background: palette.page,
      borderRadius: '16px',
      overflow: 'hidden',
      height: '700px',
      border: '1px solid #CBD5E1',
    }}>
      {/* Grid blob background */}
      <GridBlobBackground pageColor={palette.page} />

      {/* Content layer */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <header style={{
          background: palette.elevated,
          padding: '12px 24px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={18} color="white" />
            </div>
            <span style={{ fontWeight: 600, fontSize: '16px', color: '#2D3142' }}>Flow EHS</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Bell size={20} color="#6B7280" />
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#EF4444',
                color: 'white',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
              }}>4</div>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
            }}>SC</div>
          </div>
        </header>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <aside style={{
            width: '240px',
            background: palette.surface,
            borderRight: '1px solid rgba(0,0,0,0.06)',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '1px 0 3px rgba(0,0,0,0.03)',
          }}>
            <nav style={{ flex: 1 }}>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeNav === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      marginBottom: '4px',
                      background: isActive ? palette.elevated : 'transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={20} color={isActive ? '#0D9488' : '#6B7280'} />
                    <span style={{
                      flex: 1,
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? '#2D3142' : '#6B7280',
                    }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        background: '#FEF3C7',
                        color: '#D97706',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}>{item.badge}</span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Help button at bottom */}
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              width: '100%',
            }}>
              <HelpCircle size={20} color="#6B7280" />
              <span style={{ fontSize: '14px', color: '#6B7280' }}>Help & Support</span>
            </button>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            {/* Page header */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#2D3142' }}>Safety Dashboard</h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6B7280' }}>Welcome back! Here's your safety overview.</p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Days Without Incident', value: '47', trend: '+47', color: '#0D9488', icon: Shield },
                { label: 'Open Incidents', value: '3', trend: '-2', color: '#F59E0B', icon: TriangleAlert },
                { label: 'Active Workflows', value: '12', trend: '+3', color: '#3B82F6', icon: Waypoints },
                { label: 'Training Compliance', value: '94%', trend: '+5%', color: '#22C55E', icon: Users },
              ].map((kpi) => {
                const Icon = kpi.icon
                return (
                  <div key={kpi.label} style={{
                    background: palette.elevated,
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>{kpi.label}</p>
                        <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 700, color: '#2D3142' }}>{kpi.value}</p>
                      </div>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${kpi.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon size={20} color={kpi.color} />
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '12px',
                      fontSize: '12px',
                      color: kpi.trend.startsWith('+') ? '#22C55E' : '#EF4444',
                    }}>
                      <TrendingUp size={14} />
                      {kpi.trend}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Two column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Activity card */}
              <div style={{
                background: palette.elevated,
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2D3142' }}>Recent Safety Events</h3>
                </div>
                <div style={{ padding: '12px' }}>
                  {[
                    { title: 'Slip hazard reported', desc: 'Wet floor in Building A lobby', time: '10 min ago', type: 'warning' },
                    { title: 'Fire drill completed', desc: 'Evacuation time: 3:42', time: '1 hour ago', type: 'success' },
                    { title: 'PPE inspection scheduled', desc: 'Warehouse team - due tomorrow', time: '2 hours ago', type: 'info' },
                    { title: 'Safety training completed', desc: 'Forklift certification - 12 employees', time: '3 hours ago', type: 'success' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      background: palette.surface,
                      marginBottom: '8px',
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: item.type === 'success' ? '#22C55E' : item.type === 'warning' ? '#F59E0B' : '#3B82F6',
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#2D3142' }}>{item.title}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7280' }}>{item.desc}</p>
                      </div>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions card */}
              <div style={{
                background: palette.elevated,
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2D3142' }}>Quick Actions</h3>
                </div>
                <div style={{ padding: '12px' }}>
                  {[
                    { label: 'Report Incident', desc: 'Log a new safety incident', primary: true },
                    { label: 'Start Workflow', desc: 'Begin a new workflow' },
                    { label: 'Capture Observation', desc: 'Document a safety observation' },
                  ].map((action, i) => (
                    <button key={i} style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      background: action.primary ? '#0D9488' : palette.surface,
                      color: action.primary ? 'white' : '#2D3142',
                    }}>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{action.label}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', opacity: 0.8 }}>{action.desc}</p>
                      </div>
                      <ChevronRight size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer style={{
          background: palette.surface,
          padding: '12px 24px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          fontSize: '12px',
          color: '#6B7280',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>{palette.name}</span>
          <span>Page: {palette.page} | Surface: {palette.surface} | Elevated: {palette.elevated}</span>
        </footer>
      </div>
    </div>
  )
}

// Simple app mockup (kept for comparison view)
function AppMockup({ palette }: PaletteCardProps) {
  return (
    <div style={{
      background: palette.page,
      borderRadius: '16px',
      padding: '0',
      border: '1px solid #CBD5E1',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '800px',
    }}>
      {/* Header */}
      <div style={{
        background: palette.elevated,
        padding: '12px 20px',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontWeight: 600, color: '#2D3142' }}>Flow EHS</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E5E7EB' }} />
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: '400px' }}>
        {/* Sidebar */}
        <div style={{
          background: palette.surface,
          width: '200px',
          padding: '16px',
          borderRight: '1px solid #E5E7EB',
        }}>
          {['Dashboard', 'Incidents', 'Workflows', 'Settings'].map((item, i) => (
            <div key={item} style={{
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '4px',
              background: i === 0 ? palette.elevated : 'transparent',
              boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
              fontSize: '14px',
              color: i === 0 ? '#2D3142' : '#6B7280',
              fontWeight: i === 0 ? 500 : 400,
            }}>{item}</div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '20px', color: '#2D3142' }}>Dashboard</h2>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {[
              { label: 'Days Safe', value: '47', color: '#0D9488' },
              { label: 'Open Incidents', value: '3', color: '#F59E0B' },
              { label: 'Compliance', value: '94%', color: '#22C55E' },
            ].map((kpi) => (
              <div key={kpi.label} style={{
                background: palette.elevated,
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>{kpi.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Activity card */}
          <div style={{
            background: palette.elevated,
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#2D3142', marginBottom: '12px' }}>Recent Activity</div>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                padding: '10px',
                background: palette.surface,
                borderRadius: '8px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0D9488' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: '10px', width: '60%', background: '#CBD5E1', borderRadius: '4px' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>2h ago</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Palette label */}
      <div style={{
        background: palette.surface,
        padding: '8px 20px',
        borderTop: '1px solid #E5E7EB',
        fontSize: '12px',
        color: '#6B7280',
        textAlign: 'center',
      }}>
        <strong>{palette.name}</strong> — Page: {palette.page} | Surface: {palette.surface} | Elevated: {palette.elevated}
      </div>
    </div>
  )
}

// Color swatch row
function ColorSwatches({ palette }: PaletteCardProps) {
  const colors = [
    { label: 'Page (Deepest)', hex: palette.page },
    { label: 'Surface', hex: palette.surface },
    { label: 'Elevated (Closest)', hex: palette.elevated },
  ]

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#2D3142', marginBottom: '12px' }}>
        {palette.name}
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
        {colors.map((color, i) => (
          <div key={color.label} style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: `${60 + i * 20}px`,
              background: color.hex,
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              marginBottom: '8px',
            }} />
            <div style={{ fontSize: '10px', color: '#6B7280' }}>{color.label}</div>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#2D3142' }}>{color.hex}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>{palette.description}</div>
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

const meta: Meta = {
  title: 'Experiments/Warm Linen Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Warm Linen Color Experiment

Testing different warm color variations for a cozy depth layering system.

**Goal:** Replace the current cold blue palette with warm, cozy linen tones.

**Current Problem:**
- softLinen (#EBF9FF) has a cold blue tint
- winterWhite (#DFDFD5) is warm gray but doesn't match

**We want:** A cohesive warm family where:
- Page = darkest warm tone (furthest)
- Surface = medium warm tone
- Elevated = lightest warm tone (closest)
        `,
      },
    },
  },
}

export default meta

/**
 * Compare all palette options side by side as swatches
 */
export const ColorSwatchComparison: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px', color: '#2D3142' }}>Color Swatch Comparison</h2>
      <p style={{ color: '#6B7280', marginBottom: '32px' }}>
        Compare the depth progression of each palette. Taller bars = closer to viewer = lighter.
      </p>
      {PALETTES.map((palette) => (
        <ColorSwatches key={palette.name} palette={palette} />
      ))}
    </div>
  ),
}

/**
 * Compare all palette options as depth cards
 */
export const DepthCardComparison: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Depth Card Comparison</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        See how each palette looks with nested layers (page → surface → card).
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
      }}>
        {PALETTES.map((palette) => (
          <PaletteCard key={palette.name} palette={palette} />
        ))}
      </div>
    </div>
  ),
}

/**
 * Current cold palette - for reference
 */
export const CurrentColdPalette: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Current Palette (Cold)</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        The current palette has cold blue tones. Notice the mismatch with winterWhite page.
      </p>
      <AppMockup palette={CURRENT_COLD} />
    </div>
  ),
}

/**
 * Warm Linen Option A - Cream family
 */
export const WarmLinenA_Cream: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Option A: Warm Cream</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Warm cream family with subtle yellow undertone. Very cozy feel.
      </p>
      <AppMockup palette={WARM_LINEN_A} />
    </div>
  ),
}

/**
 * Warm Linen Option B - Beige family
 */
export const WarmLinenB_Beige: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Option B: Neutral Beige</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Subtle beige family - neutral warm without yellow. Professional warmth.
      </p>
      <AppMockup palette={WARM_LINEN_B} />
    </div>
  ),
}

/**
 * Warm Linen Option C - Sand family
 */
export const WarmLinenC_Sand: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Option C: Earthy Sand</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Sand family - earthy, natural feel. Grounded and organic.
      </p>
      <AppMockup palette={WARM_LINEN_C} />
    </div>
  ),
}

/**
 * Warm Linen Option D - Ivory family
 */
export const WarmLinenD_Ivory: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Option D: Elegant Ivory</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Ivory family - elegant, very light warmth. Refined and subtle.
      </p>
      <AppMockup palette={WARM_LINEN_D} />
    </div>
  ),
}

/**
 * Full comparison - all app mockups
 */
export const FullAppComparison: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Full App Comparison</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Compare all options as full app layouts. Scroll down to see each.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {PALETTES.map((palette) => (
          <AppMockup key={palette.name} palette={palette} />
        ))}
      </div>
    </div>
  ),
}

// =============================================================================
// FULL REALISTIC LAYOUTS WITH BLOB BACKGROUND
// =============================================================================

/**
 * Current cold palette - Full realistic layout with grid blob
 */
export const RealisticLayout_Current: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Current Palette (Cold) - Full Layout</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Current cold blue palette with grid blob background. Notice the mismatch.
      </p>
      <FullAppLayout palette={CURRENT_COLD} />
    </div>
  ),
}

/**
 * Warm Cream - Full realistic layout with grid blob
 */
export const RealisticLayout_WarmCream: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Option A: Warm Cream - Full Layout</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Warm cream family with yellow undertone. Very cozy feel.
      </p>
      <FullAppLayout palette={WARM_LINEN_A} />
    </div>
  ),
}

/**
 * Neutral Beige - Full realistic layout with grid blob
 */
export const RealisticLayout_NeutralBeige: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Option B: Neutral Beige - Full Layout</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Subtle beige family - neutral warm without yellow. Professional warmth.
      </p>
      <FullAppLayout palette={WARM_LINEN_B} />
    </div>
  ),
}

/**
 * Earthy Sand - Full realistic layout with grid blob
 */
export const RealisticLayout_EarthySand: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Option C: Earthy Sand - Full Layout</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Sand family - earthy, natural feel. Grounded and organic.
      </p>
      <FullAppLayout palette={WARM_LINEN_C} />
    </div>
  ),
}

/**
 * Elegant Ivory - Full realistic layout with grid blob
 */
export const RealisticLayout_ElegantIvory: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>Option D: Elegant Ivory - Full Layout</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Ivory family - elegant, very light warmth. Refined and subtle.
      </p>
      <FullAppLayout palette={WARM_LINEN_D} />
    </div>
  ),
}

/**
 * Side by side - All realistic layouts
 */
export const RealisticLayout_AllOptions: StoryObj = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', color: '#2D3142' }}>All Options - Full Realistic Layouts</h2>
      <p style={{ color: '#6B7280', marginBottom: '24px' }}>
        Full app layouts with grid blob background, sidebar, and cards with shadows.
        Scroll down to compare all options.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {PALETTES.map((palette) => (
          <div key={palette.name}>
            <h3 style={{ marginBottom: '16px', color: '#2D3142' }}>{palette.name}</h3>
            <FullAppLayout palette={palette} />
          </div>
        ))}
      </div>
    </div>
  ),
}
