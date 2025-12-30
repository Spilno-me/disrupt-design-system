/**
 * Animated Text Experiment
 *
 * Showcasing bouncy letter animations - each letter jumps like a ball on hover.
 * A showcase of what's possible with Framer Motion.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useState } from 'react'
import { motion, useSpring, useTransform } from 'motion/react'
import { cn } from '../../lib/utils'

// =============================================================================
// META
// =============================================================================

const meta: Meta = {
  title: 'Experiments/Animated Text',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Animated Text Experiments

Interactive text animations showcasing bouncy letter effects.

## Features
- **Bouncy Letters**: Each letter jumps up like a ball on hover
- **Wave Effect**: Letters animate in sequence creating a wave
- **Physics-based**: Uses spring animations for natural feel
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// BOUNCY LETTER COMPONENT
// =============================================================================

interface BouncyLetterProps {
  letter: string
  index: number
  isHovered: boolean
  delay?: number
}

function BouncyLetter({ letter, index, isHovered, delay = 0 }: BouncyLetterProps) {
  const [isLetterHovered, setIsLetterHovered] = useState(false)

  return (
    <motion.span
      className="inline-block cursor-pointer select-none"
      onMouseEnter={() => setIsLetterHovered(true)}
      onMouseLeave={() => setIsLetterHovered(false)}
      animate={{
        y: isLetterHovered ? -30 : 0,
        scale: isLetterHovered ? 1.2 : 1,
        rotate: isLetterHovered ? [0, -10, 10, -5, 5, 0] : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 15,
        mass: 0.8,
        rotate: {
          duration: 0.4,
          ease: 'easeInOut',
        },
      }}
      style={{
        display: letter === ' ' ? 'inline' : 'inline-block',
        width: letter === ' ' ? '0.3em' : 'auto',
      }}
    >
      {letter}
    </motion.span>
  )
}

// =============================================================================
// WAVE LETTER COMPONENT (animates on container hover)
// =============================================================================

interface WaveLetterProps {
  letter: string
  index: number
  isContainerHovered: boolean
  totalLetters: number
}

function WaveLetter({ letter, index, isContainerHovered, totalLetters }: WaveLetterProps) {
  return (
    <motion.span
      className="inline-block"
      animate={{
        y: isContainerHovered ? [0, -40, 0] : 0,
        color: isContainerHovered
          ? ['currentColor', '#FF6B6B', 'currentColor']
          : 'currentColor',
      }}
      transition={{
        y: {
          duration: 0.5,
          delay: index * 0.05,
          ease: [0.34, 1.56, 0.64, 1], // Custom bounce curve
        },
        color: {
          duration: 0.5,
          delay: index * 0.05,
        },
      }}
      style={{
        display: letter === ' ' ? 'inline' : 'inline-block',
        width: letter === ' ' ? '0.3em' : 'auto',
      }}
    >
      {letter}
    </motion.span>
  )
}

// =============================================================================
// RUBBER BAND LETTER (stretchy effect)
// =============================================================================

interface RubberLetterProps {
  letter: string
  index: number
}

function RubberLetter({ letter, index }: RubberLetterProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.span
      className="inline-block cursor-pointer origin-bottom"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scaleY: isHovered ? [1, 1.4, 0.8, 1.2, 1] : 1,
        scaleX: isHovered ? [1, 0.8, 1.1, 0.9, 1] : 1,
        y: isHovered ? [0, -10, 5, -5, 0] : 0,
      }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
      style={{
        display: letter === ' ' ? 'inline' : 'inline-block',
        width: letter === ' ' ? '0.3em' : 'auto',
      }}
    >
      {letter}
    </motion.span>
  )
}

// =============================================================================
// ANIMATED TEXT CONTAINER
// =============================================================================

interface AnimatedTextProps {
  text: string
  variant?: 'bounce' | 'wave' | 'rubber' | 'rainbow'
  className?: string
}

function AnimatedText({ text, variant = 'bounce', className }: AnimatedTextProps) {
  const [isHovered, setIsHovered] = useState(false)
  const letters = text.split('')

  return (
    <motion.div
      className={cn('font-bold tracking-tight', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {letters.map((letter, index) => {
        switch (variant) {
          case 'wave':
            return (
              <WaveLetter
                key={`${letter}-${index}`}
                letter={letter}
                index={index}
                isContainerHovered={isHovered}
                totalLetters={letters.length}
              />
            )
          case 'rubber':
            return (
              <RubberLetter
                key={`${letter}-${index}`}
                letter={letter}
                index={index}
              />
            )
          case 'bounce':
          default:
            return (
              <BouncyLetter
                key={`${letter}-${index}`}
                letter={letter}
                index={index}
                isHovered={isHovered}
              />
            )
        }
      })}
    </motion.div>
  )
}

// =============================================================================
// RAINBOW BOUNCE (special colorful version)
// =============================================================================

const RAINBOW_COLORS = [
  '#FF6B6B', // Red
  '#FF8E53', // Orange
  '#FFD93D', // Yellow
  '#6BCB77', // Green
  '#4D96FF', // Blue
  '#9B72AA', // Purple
]

interface RainbowLetterProps {
  letter: string
  index: number
}

function RainbowLetter({ letter, index }: RainbowLetterProps) {
  const [isHovered, setIsHovered] = useState(false)
  const color = RAINBOW_COLORS[index % RAINBOW_COLORS.length]

  return (
    <motion.span
      className="inline-block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        y: isHovered ? -50 : 0,
        scale: isHovered ? 1.3 : 1,
        rotate: isHovered ? 360 : 0,
        color: isHovered ? color : 'currentColor',
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 10,
        rotate: {
          type: 'spring',
          stiffness: 200,
          damping: 15,
        },
      }}
      style={{
        display: letter === ' ' ? 'inline' : 'inline-block',
        width: letter === ' ' ? '0.3em' : 'auto',
      }}
    >
      {letter}
    </motion.span>
  )
}

function RainbowText({ text, className }: { text: string; className?: string }) {
  const letters = text.split('')

  return (
    <div className={cn('font-bold tracking-tight', className)}>
      {letters.map((letter, index) => (
        <RainbowLetter key={`${letter}-${index}`} letter={letter} index={index} />
      ))}
    </div>
  )
}

// =============================================================================
// STORIES
// =============================================================================

export const IllonaBounce: Story = {
  name: 'Ilona - Bouncy Letters',
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-abyss-900 via-abyss-800 to-abyss-900 flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-4">
        <p className="text-abyss-400 text-sm uppercase tracking-widest">Hover each letter</p>
        <AnimatedText
          text="ILONA IS THE BEST GUIDE!"
          variant="bounce"
          className="text-[72px] text-white"
        />
        <p className="text-abyss-500 text-lg">Each letter bounces independently</p>
      </div>
    </div>
  ),
}

export const IllonaWave: Story = {
  name: 'Ilona - Wave Effect',
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-ember-900 via-ember-800 to-abyss-900 flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-4">
        <p className="text-ember-400 text-sm uppercase tracking-widest">Hover the text</p>
        <AnimatedText
          text="ILONA IS THE BEST GUIDE!"
          variant="wave"
          className="text-[72px] text-white"
        />
        <p className="text-ember-500 text-lg">Letters jump in a wave sequence</p>
      </div>
    </div>
  ),
}

export const IllonaRubber: Story = {
  name: 'Ilona - Rubber Band',
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-abyss-900 flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-4">
        <p className="text-teal-400 text-sm uppercase tracking-widest">Hover each letter</p>
        <AnimatedText
          text="ILONA IS THE BEST GUIDE!"
          variant="rubber"
          className="text-[72px] text-white"
        />
        <p className="text-teal-500 text-lg">Stretchy rubber band effect</p>
      </div>
    </div>
  ),
}

export const IllonaRainbow: Story = {
  name: 'Ilona - Rainbow Spin',
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-900 flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-4">
        <p className="text-pink-300 text-sm uppercase tracking-widest">Hover each letter</p>
        <RainbowText
          text="ILONA IS THE BEST GUIDE!"
          className="text-[72px] text-white"
        />
        <p className="text-pink-400 text-lg">Colorful spinning letters</p>
      </div>
    </div>
  ),
}

export const AllVariants: Story = {
  name: 'All Variants Showcase',
  render: () => (
    <div className="min-h-screen bg-abyss-950 p-12 space-y-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Animated Text Showcase</h1>
        <p className="text-abyss-400">Hover over each text to see the animation</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Bounce */}
        <div className="bg-abyss-900/50 rounded-2xl p-8 border border-abyss-700">
          <p className="text-xs uppercase tracking-wider text-abyss-500 mb-4">Bounce</p>
          <AnimatedText text="Illona" variant="bounce" className="text-7xl text-white" />
        </div>

        {/* Wave */}
        <div className="bg-ember-900/30 rounded-2xl p-8 border border-ember-800">
          <p className="text-xs uppercase tracking-wider text-ember-500 mb-4">Wave</p>
          <AnimatedText text="Illona" variant="wave" className="text-7xl text-white" />
        </div>

        {/* Rubber */}
        <div className="bg-teal-900/30 rounded-2xl p-8 border border-teal-800">
          <p className="text-xs uppercase tracking-wider text-teal-500 mb-4">Rubber</p>
          <AnimatedText text="Illona" variant="rubber" className="text-7xl text-white" />
        </div>

        {/* Rainbow */}
        <div className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-orange-900/30 rounded-2xl p-8 border border-pink-800">
          <p className="text-xs uppercase tracking-wider text-pink-400 mb-4">Rainbow</p>
          <RainbowText text="Illona" className="text-7xl text-white" />
        </div>
      </div>
    </div>
  ),
}

export const CustomText: Story = {
  name: 'Custom Text Input',
  render: () => {
    const [text, setText] = React.useState('Illona')
    const [variant, setVariant] = React.useState<'bounce' | 'wave' | 'rubber'>('bounce')

    return (
      <div className="min-h-screen bg-abyss-950 p-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Controls */}
          <div className="bg-abyss-900 rounded-xl p-6 space-y-4">
            <div>
              <label className="text-sm text-abyss-400 block mb-2">Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-abyss-800 border border-abyss-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter text..."
              />
            </div>
            <div>
              <label className="text-sm text-abyss-400 block mb-2">Animation Style</label>
              <div className="flex gap-2">
                {(['bounce', 'wave', 'rubber'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      variant === v
                        ? 'bg-accent text-white'
                        : 'bg-abyss-800 text-abyss-400 hover:bg-abyss-700'
                    )}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-abyss-900/50 rounded-2xl p-12 border border-abyss-700 flex items-center justify-center min-h-[300px]">
            <AnimatedText text={text || 'Type something...'} variant={variant} className="text-6xl text-white" />
          </div>
        </div>
      </div>
    )
  },
}
