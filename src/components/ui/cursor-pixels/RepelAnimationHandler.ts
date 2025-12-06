import gsap from 'gsap'
import { PIXELS, PIXEL_OFFSETS, REPEL } from './animation-config'
import { randomInRange, randomCentered } from './animation-utils'
import type { PixelAnimator, Position } from './PixelAnimator'

type RepelState = 'none' | 'scattering' | 'scattered' | 'returning'

/**
 * Manages the repel animation when hovering interactive elements.
 * Pixels scatter outward and fade, then return smoothly when leaving.
 */
export class RepelAnimationHandler {
  private state: RepelState = 'none'
  private scatterOffsets: Position[] = []

  isActive(): boolean {
    return this.state !== 'none'
  }

  isScattering(): boolean {
    return this.state === 'scattering'
  }

  isReturning(): boolean {
    return this.state === 'returning'
  }

  getState(): RepelState {
    return this.state
  }

  /**
   * Start scatter animation - pixels explode outward and fade.
   */
  startScatter(
    animators: PixelAnimator[],
    mousePosition: Position,
    onComplete: () => void
  ): void {
    this.state = 'scattering'
    this.killAllTweens(animators)
    this.scatterOffsets = this.calculateScatterOffsets(animators.length)
    this.animateScatter(animators, mousePosition, onComplete)
  }

  /**
   * Start return animation - pixels animate back to mouse position.
   */
  startReturn(
    animators: PixelAnimator[],
    mousePosition: Position,
    onComplete: () => void
  ): void {
    this.state = 'returning'
    this.killAllTweens(animators)
    this.animateReturn(animators, mousePosition, onComplete)
  }

  /**
   * Reset state without animation.
   */
  reset(): void {
    this.state = 'none'
    this.scatterOffsets = []
  }

  // ============ Scatter Animation ============

  private calculateScatterOffsets(count: number): Position[] {
    return Array.from({ length: count }, (_, index) => {
      const baseAngle = (index / count) * Math.PI * 2
      const angleVariance = randomCentered(REPEL.ANGLE_VARIANCE * 2)
      const angle = baseAngle + angleVariance
      const distance = randomInRange(REPEL.MIN_DISTANCE, REPEL.MAX_DISTANCE)

      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      }
    })
  }

  private animateScatter(
    animators: PixelAnimator[],
    mousePosition: Position,
    onComplete: () => void
  ): void {
    const tracker = this.createCompletionTracker(animators.length, () => {
      this.state = 'scattered'
      onComplete()
    })

    animators.forEach((animator, index) => {
      const target = this.calculateScatterTarget(mousePosition, index)

      gsap.to(animator.getElement(), {
        x: target.x,
        y: target.y,
        scale: REPEL.FINAL_SCALE,
        rotation: randomCentered(REPEL.MAX_ROTATION),
        opacity: 0,
        duration: REPEL.EXPLODE_DURATION,
        ease: 'power2.out',
        onComplete: () => {
          animator.reinitializeQuickTo()
          tracker.increment()
        },
      })
    })
  }

  private calculateScatterTarget(mousePosition: Position, index: number): Position {
    const offset = PIXEL_OFFSETS[index]
    const scatter = this.scatterOffsets[index] ?? { x: 0, y: 0 }

    return {
      x: mousePosition.x + offset.x + scatter.x,
      y: mousePosition.y + offset.y + scatter.y,
    }
  }

  // ============ Return Animation ============

  private animateReturn(
    animators: PixelAnimator[],
    mousePosition: Position,
    onComplete: () => void
  ): void {
    const tracker = this.createCompletionTracker(animators.length, () => {
      this.state = 'none'
      this.scatterOffsets = []
      onComplete()
    })

    animators.forEach((animator, index) => {
      const pixelConfig = PIXELS[index]
      const offset = PIXEL_OFFSETS[index]
      const duration = REPEL.FADE_IN_DURATION + pixelConfig.delay * REPEL.STAGGER_MULTIPLIER

      const targetX = mousePosition.x + offset.x
      const targetY = mousePosition.y + offset.y

      gsap.to(animator.getElement(), {
        x: targetX,
        y: targetY,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration,
        ease: 'power2.out',
        onComplete: () => tracker.increment(),
      })
    })
  }

  // ============ Utilities ============

  private createCompletionTracker(total: number, onAllComplete: () => void) {
    let count = 0
    return {
      increment: () => {
        count++
        if (count === total) {
          onAllComplete()
        }
      },
    }
  }

  private killAllTweens(animators: PixelAnimator[]): void {
    animators.forEach(animator => animator.killAllTweens())
  }
}
