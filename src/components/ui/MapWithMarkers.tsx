import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useAnimation, useMotionValue, useMotionValueEvent, animate, PanInfo } from 'motion/react'
import mapBackground from '@/assets/figma/map-background.svg'
import { useIsMobile } from '@/hooks'

interface MarkerLocation {
  id: string
  country: string
  x: number // percentage from left (0-100)
  y: number // percentage from top (0-100)
  isMain?: boolean
}

// Country coordinates on the world map (percentages based on 882x420 map)
// Map projection: Standard world map with Americas on left, Asia/Australia on right
// To add a new country: add entry with approximate x% (0=far left/Pacific, 50=Europe, 100=far right/Pacific)
// and y% (0=top/Arctic, 50=equator area, 100=bottom/Antarctic)
const COUNTRY_COORDINATES: Record<string, { x: number; y: number }> = {
  // North America
  'usa': { x: 20, y: 44 }, // Houston, Texas
  'usa-west': { x: 12, y: 40 },
  'usa-east': { x: 22, y: 42 },
  'canada': { x: 18, y: 28 },
  'mexico': { x: 16, y: 52 },

  // South America
  'brazil': { x: 30, y: 68 },
  'argentina': { x: 27, y: 82 },
  'colombia': { x: 24, y: 58 },

  // Western Europe
  'uk': { x: 46, y: 32 },
  'ireland': { x: 44, y: 32 },
  'france': { x: 48, y: 40 },
  'spain': { x: 46, y: 45 },
  'portugal': { x: 44, y: 44 },

  // Central Europe
  'germany': { x: 50, y: 36 },
  'netherlands': { x: 49, y: 34 },
  'belgium': { x: 48, y: 36 },
  'switzerland': { x: 50, y: 40 },
  'austria': { x: 52, y: 40 },
  'poland': { x: 53, y: 35 },
  'czech': { x: 52, y: 37 },

  // Southern Europe
  'italy': { x: 51, y: 44 },
  'greece': { x: 54, y: 46 },

  // Northern Europe
  'sweden': { x: 52, y: 24 },
  'norway': { x: 50, y: 22 },
  'finland': { x: 55, y: 22 },
  'denmark': { x: 50, y: 30 },

  // Eastern Europe
  'ukraine': { x: 57, y: 36 },
  'romania': { x: 55, y: 42 },
  'hungary': { x: 53, y: 40 },

  // Middle East
  'uae': { x: 64, y: 52 },
  'saudi': { x: 61, y: 52 },
  'israel': { x: 58, y: 48 },
  'turkey': { x: 57, y: 44 },

  // Asia
  'india': { x: 70, y: 52 },
  'china': { x: 78, y: 42 },
  'japan': { x: 87, y: 42 },
  'singapore': { x: 78, y: 62 },
  'thailand': { x: 76, y: 56 },
  'vietnam': { x: 78, y: 56 },
  'korea': { x: 84, y: 42 },

  // Africa
  'south-africa': { x: 55, y: 78 },
  'nigeria': { x: 50, y: 58 },
  'egypt': { x: 57, y: 50 },
  'kenya': { x: 58, y: 62 },

  // Oceania
  'australia': { x: 85, y: 74 },
  'new-zealand': { x: 94, y: 82 },
}

// Country display names for tooltips
const COUNTRY_NAMES: Record<string, string> = {
  'usa': 'United States',
  'ireland': 'Ireland',
  'uk': 'United Kingdom',
  'portugal': 'Portugal',
  'switzerland': 'Switzerland',
  'ukraine': 'Ukraine',
  'uae': 'UAE',
  'canada': 'Canada',
  'mexico': 'Mexico',
  'brazil': 'Brazil',
  'argentina': 'Argentina',
  'france': 'France',
  'spain': 'Spain',
  'germany': 'Germany',
  'italy': 'Italy',
  'netherlands': 'Netherlands',
  'belgium': 'Belgium',
  'austria': 'Austria',
  'poland': 'Poland',
  'sweden': 'Sweden',
  'norway': 'Norway',
  'finland': 'Finland',
  'denmark': 'Denmark',
  'greece': 'Greece',
  'turkey': 'Turkey',
  'israel': 'Israel',
  'saudi': 'Saudi Arabia',
  'india': 'India',
  'china': 'China',
  'japan': 'Japan',
  'singapore': 'Singapore',
  'australia': 'Australia',
  'south-africa': 'South Africa',
}

// Active markers - edit this array to change which countries have markers
// Set isMain: true for the headquarters/primary location
const markers: MarkerLocation[] = [
  { id: 'usa', country: 'usa', ...COUNTRY_COORDINATES['usa'] },
  { id: 'ireland', country: 'ireland', ...COUNTRY_COORDINATES['ireland'] },
  { id: 'uk', country: 'uk', ...COUNTRY_COORDINATES['uk'] },
  { id: 'portugal', country: 'portugal', ...COUNTRY_COORDINATES['portugal'] },
  { id: 'switzerland', country: 'switzerland', ...COUNTRY_COORDINATES['switzerland'], isMain: true },
  { id: 'ukraine', country: 'ukraine', ...COUNTRY_COORDINATES['ukraine'] },
  { id: 'uae', country: 'uae', ...COUNTRY_COORDINATES['uae'] },
]

// =============================================================================
// MARKER PIXEL ANIMATION CONFIG
// =============================================================================

interface MarkerPixelConfig {
  id: string
  type: 'rect' | 'path'
  colorType: 'accent' | 'main'
  x?: number
  y?: number
  width?: number
  height?: number
  rx?: number
  d?: string
  animation: {
    x: number
    y: number
    rotate?: number
    scale?: number
  }
}

// Pixel configurations for marker - scaled down from header logo animations
const MARKER_PIXEL_CONFIGS: MarkerPixelConfig[] = [
  // Accent color pixels (3)
  {
    id: 'm-p1',
    type: 'rect',
    colorType: 'accent',
    x: 11.19,
    y: 23.14,
    width: 3.95,
    height: 3.86,
    rx: 0.53,
    animation: { x: -6, y: 4, rotate: -15, scale: 1.15 },
  },
  {
    id: 'm-p2',
    type: 'path',
    colorType: 'accent',
    d: 'M5.92 15.96c0-.29.24-.53.54-.53h2.87c.3 0 .54.24.54.53v2.8c0 .29-.24.53-.54.53H6.46c-.3 0-.54-.24-.54-.53v-2.8z',
    animation: { x: -8, y: -6, rotate: 20, scale: 1.2 },
  },
  {
    id: 'm-p3',
    type: 'path',
    colorType: 'accent',
    d: 'M7.9 30.28c0-.39.32-.71.72-.71h3.82c.42 0 .74.32.74.71v3.73c0 .39-.32.71-.74.71H8.62c-.4 0-.72-.32-.72-.71v-3.73z',
    animation: { x: -4, y: 8, rotate: -25, scale: 1.18 },
  },
  // Main color pixels (7)
  {
    id: 'm-p4',
    type: 'path',
    colorType: 'main',
    d: 'M13.17 18.35c0-.2.16-.35.36-.35h1.91c.2 0 .36.16.36.35v1.86c0 .2-.16.36-.36.36h-1.91c-.2 0-.36-.16-.36-.36v-1.86z',
    animation: { x: -10, y: -3, rotate: 30 },
  },
  {
    id: 'm-p5',
    type: 'path',
    colorType: 'main',
    d: 'M3.95 12.48c0-.15.12-.27.27-.27h1.43c.15 0 .27.12.27.27v1.4c0 .15-.12.26-.27.26H4.22c-.15 0-.27-.11-.27-.26v-1.4z',
    animation: { x: -12, y: -8, rotate: -35 },
  },
  {
    id: 'm-p6',
    type: 'path',
    colorType: 'main',
    d: 'M3.95 27.27c0-.15.12-.27.27-.27h1.43c.15 0 .27.12.27.27v1.4c0 .14-.12.26-.27.26H4.22c-.15 0-.27-.12-.27-.26v-1.4z',
    animation: { x: -8, y: 10, rotate: 25 },
  },
  {
    id: 'm-p7',
    type: 'path',
    colorType: 'main',
    d: 'M6.58 24.69c0-.15.12-.26.27-.26h1.43c.15 0 .27.11.27.26v1.4c0 .15-.12.26-.27.26H6.85c-.15 0-.27-.11-.27-.26v-1.4z',
    animation: { x: -9, y: 6, rotate: -20, scale: 1.2 },
  },
  {
    id: 'm-p8',
    type: 'path',
    colorType: 'main',
    d: 'M7.9 9.06c0-.39.32-.71.72-.71h3.82c.42 0 .74.32.74.71v3.73c0 .39-.32.71-.74.71H8.62c-.4 0-.72-.32-.72-.71V9.06z',
    animation: { x: -6, y: -12, rotate: 40 },
  },
  {
    id: 'm-p9',
    type: 'path',
    colorType: 'main',
    d: 'M.66 18.35c0-.19.16-.35.36-.35h1.91c.2 0 .36.16.36.35v1.86c0 .2-.16.36-.36.36H1.02c-.2 0-.36-.16-.36-.36v-1.86z',
    animation: { x: -14, y: -4, rotate: -30, scale: 1.15 },
  },
  {
    id: 'm-p10',
    type: 'path',
    colorType: 'main',
    d: 'M4.61 20.92c0-.19.16-.35.36-.35h1.91c.2 0 .36.16.36.36v1.86c0 .2-.16.36-.36.36H4.97c-.2 0-.36-.16-.36-.36v-1.86z',
    animation: { x: -11, y: -7, rotate: 15 },
  },
]

// =============================================================================
// ANIMATED MARKER PIXEL COMPONENT
// =============================================================================

interface AnimatedMarkerPixelProps {
  config: MarkerPixelConfig
  isAnimating: boolean
  mainColor: string
  accentColor: string
}

function AnimatedMarkerPixel({ config, isAnimating, mainColor, accentColor }: AnimatedMarkerPixelProps) {
  const controls = useAnimation()
  const fill = config.colorType === 'accent' ? accentColor : mainColor
  const wasAnimatingRef = useRef(false)

  useEffect(() => {
    if (isAnimating && !wasAnimatingRef.current) {
      const { x, y, rotate = 0, scale = 1 } = config.animation

      const runAnimation = async () => {
        // Phase 1: BURST OUT
        await controls.start({
          x,
          y,
          rotate,
          scale,
          transition: {
            type: 'tween',
            duration: 0.12,
            ease: [0.33, 1, 0.68, 1],
          },
        })

        // Phase 2: HOLD
        await new Promise(resolve => setTimeout(resolve, 40))

        // Phase 3: SPRING BACK
        await controls.start({
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 350,
            damping: 15,
            mass: 0.6,
          },
        })
      }

      runAnimation()
    }
    wasAnimatingRef.current = isAnimating
  }, [isAnimating, controls, config.animation])

  const motionProps = {
    initial: { x: 0, y: 0, rotate: 0, scale: 1 },
    animate: controls,
    style: { transformOrigin: 'center' },
  }

  if (config.type === 'rect') {
    return (
      <motion.rect
        {...motionProps}
        x={config.x}
        y={config.y}
        width={config.width}
        height={config.height}
        rx={config.rx}
        fill={fill}
      />
    )
  }

  return <motion.path {...motionProps} d={config.d} fill={fill} />
}

// =============================================================================
// DISRUPT ICON COMPONENT
// =============================================================================

// Disrupt "D" icon with explosive animated pixels - using Motion library
function DisruptIcon({ isMain = false, isHovered = false }: { isMain?: boolean; isHovered?: boolean }) {
  const mainColor = isMain ? '#F70D1A' : '#2D3142'
  const accentColor = isMain ? '#2D3142' : '#F70D1A'

  return (
    <svg
      viewBox="-1 7 45 28"
      fill="none"
      className="w-full h-full overflow-visible"
    >
      {/* Main D shape */}
      <path
        d="M29.17 8.36c7.36 0 13.32 5.93 13.32 13.25s-5.96 13.25-13.32 13.25H15.36c-.51 0-.92-.41-.92-.91v-3.47c0-.5.41-.91.92-.91h13.81c4.41 0 7.99-3.56 7.99-7.95 0-4.39-3.58-7.95-7.99-7.95H15.36c-.51 0-.92-.41-.92-.91V9.28c0-.5.41-.92.92-.92h13.81z"
        fill={mainColor}
      />

      {/* Animated pixel rectangles */}
      {MARKER_PIXEL_CONFIGS.map((config) => (
        <AnimatedMarkerPixel
          key={config.id}
          config={config}
          isAnimating={isHovered}
          mainColor={mainColor}
          accentColor={accentColor}
        />
      ))}
    </svg>
  )
}

interface LocationMarkerProps {
  x: number
  y: number
  country: string
  isMain?: boolean
  mapOffset: number
  mapWidth: number
  markerId: string
  activeMarkerId: string | null
  onMarkerClick: (markerId: string) => void
  isMobile: boolean
}

function LocationMarker({ x, y, country, isMain = false, mapOffset, mapWidth, markerId, activeMarkerId, onMarkerClick, isMobile }: LocationMarkerProps) {
  const size = isMain ? 64 : 44
  const [isHovered, setIsHovered] = useState(false)
  const countryName = COUNTRY_NAMES[country] || country

  // Calculate actual pixel position within the infinite map
  const pixelX = (x / 100) * mapWidth + mapOffset

  const isTouched = activeMarkerId === markerId
  // On mobile, only use touch state (not hover) so timer can close tooltip
  const showTooltip = isMobile ? isTouched : (isHovered || isTouched)

  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        left: pixelX,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${showTooltip ? 1.15 : 1})`,
        width: size,
        height: size,
        zIndex: showTooltip ? 50 : (isMain ? 10 : 1),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        onMarkerClick(isTouched ? '' : markerId)
      }}
      data-cursor-repel="true"
    >
      {/* Tooltip */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-white text-xs font-medium px-2 py-1 rounded transition-all duration-300 ${
          showTooltip
            ? 'opacity-100 -top-8 scale-100'
            : 'opacity-0 top-0 scale-75 pointer-events-none'
        }`}
      >
        {countryName}
        {isMain && <span className="text-accent ml-1">(HQ)</span>}
        {/* Tooltip arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-primary rotate-45" />
      </div>

      {/* Circle background with stroke */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        className="absolute inset-0"
      >
        <defs>
          <filter id={`marker-shadow-${x}-${y}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>
        {/* White fill with shadow */}
        <circle cx="32" cy="32" r="29" fill="white" filter={`url(#marker-shadow-${x}-${y})`} />
        {/* Stroke - animated for HQ using Motion */}
        {isMain ? (
          <motion.circle
            cx="32"
            cy="32"
            r="27.5"
            strokeWidth="3"
            fill="none"
            animate={{
              stroke: ['#08A4BD', '#F70D1A', '#08A4BD'],
            }}
            transition={{
              duration: 3,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
        ) : (
          <circle
            cx="32"
            cy="32"
            r="27.5"
            stroke="#08A4BD"
            strokeWidth="3"
            fill="none"
          />
        )}
      </svg>
      {/* Icon - precisely centered */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          width: size * 0.6,
          height: size * 0.6,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DisruptIcon isMain={isMain} isHovered={isHovered} />
      </div>
    </div>
  )
}

// =============================================================================
// MAP WITH MARKERS - MOTION-POWERED INFINITE SCROLL
// =============================================================================

export function MapWithMarkers() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mapWidth, setMapWidth] = useState(882)
  const [isInitialized, setIsInitialized] = useState(false)
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null)
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useIsMobile()

  // Auto-hide tooltip after 10 seconds
  useEffect(() => {
    // Clear any existing timer
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current)
      tooltipTimerRef.current = null
    }

    if (activeMarkerId) {
      tooltipTimerRef.current = setTimeout(() => {
        setActiveMarkerId(null)
      }, 10000)
    }

    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current)
      }
    }
  }, [activeMarkerId])

  // Motion value for smooth, GPU-accelerated transforms
  const x = useMotionValue(0)
  const mapWidthRef = useRef(882)
  const animationRef = useRef<ReturnType<typeof animate> | null>(null)

  // Find the main (HQ) marker
  const mainMarker = markers.find(m => m.isMain) || markers[0]

  // Normalize offset for infinite scroll (wrap within one map width)
  const normalizeOffset = useCallback((offset: number): number => {
    const width = mapWidthRef.current
    let normalized = offset % width
    if (normalized > 0) normalized -= width
    return normalized
  }, [])

  // Handle image load to get actual dimensions and center on HQ
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const width = e.currentTarget.naturalWidth
    setMapWidth(width)
    mapWidthRef.current = width

    // Center the map on HQ marker on initial load
    if (!isInitialized && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const hqPixelX = (mainMarker.x / 100) * width
      const centerOffset = (containerWidth / 2) - hqPixelX + 80
      x.set(centerOffset)
      setIsInitialized(true)
    }
  }

  // Handle drag start - stop any ongoing inertia animation
  const handleDragStart = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop()
      animationRef.current = null
    }
  }, [])

  // Handle drag - normalize position for infinite scroll
  const handleDrag = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentX = x.get()
    const normalized = normalizeOffset(currentX)

    // Only jump if we've wrapped around significantly
    if (Math.abs(currentX - normalized) > mapWidthRef.current * 0.5) {
      x.set(normalized)
    }
  }, [x, normalizeOffset])

  // Handle drag end - apply inertia with normalization
  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.x
    const currentX = x.get()

    // Calculate target position based on velocity (with decay)
    // Using a power-based decay for natural feel
    const decayFactor = 0.4 // How much velocity affects final position
    const targetOffset = currentX + (velocity * decayFactor)
    const normalizedTarget = normalizeOffset(targetOffset)

    // Animate to target with spring physics
    animationRef.current = animate(x, normalizedTarget, {
      type: 'spring',
      velocity: velocity * 0.5,
      stiffness: 100,
      damping: 30,
      mass: 1,
      onUpdate: (latest) => {
        // Normalize during animation for seamless looping
        const normalized = normalizeOffset(latest)
        if (Math.abs(latest - normalized) > mapWidthRef.current * 0.5) {
          x.jump(normalized)
        }
      },
    })
  }, [x, normalizeOffset])

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop()
      }
    }
  }, [])

  // We render 3 copies of the map for seamless infinite scrolling
  const mapCopies = [-1, 0, 1]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] rounded-none sm:rounded-lg overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'pan-y' }}
      data-element="contact-map"
      onClick={() => setActiveMarkerId(null)}
    >
      {/* Map copies for infinite scroll - Motion powered */}
      <motion.div
        className="absolute inset-0 flex"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -Infinity, right: Infinity }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {mapCopies.map((copyIndex) => (
          <div
            key={copyIndex}
            className="relative flex-shrink-0 h-full"
            style={{ width: mapWidth }}
          >
            <img
              src={mapBackground}
              alt=""
              className="h-full w-auto object-cover"
              onLoad={copyIndex === 0 ? handleImageLoad : undefined}
              draggable={false}
            />
          </div>
        ))}
      </motion.div>

      {/* Markers - rendered for each map copy */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x }}
      >
        {mapCopies.map((copyIndex) =>
          markers.map((marker) => (
            <div key={`${copyIndex}-${marker.id}`} className="pointer-events-auto">
              <LocationMarker
                x={marker.x}
                y={marker.y}
                country={marker.country}
                isMain={marker.isMain}
                mapOffset={copyIndex * mapWidth}
                mapWidth={mapWidth}
                markerId={`${copyIndex}-${marker.id}`}
                activeMarkerId={activeMarkerId}
                onMarkerClick={setActiveMarkerId}
                isMobile={isMobile}
              />
            </div>
          ))
        )}
      </motion.div>

    </div>
  )
}
