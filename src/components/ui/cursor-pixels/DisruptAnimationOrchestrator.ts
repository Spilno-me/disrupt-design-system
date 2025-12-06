import gsap from 'gsap'
import { TIMING, DISRUPT_PHASES, EXPLOSION, PIXEL_OFFSETS } from './animation-config'
import { randomInRange, randomCentered } from './animation-utils'
import type { PixelAnimator, Position, TransformState } from './PixelAnimator'

interface ExplosionVector {
  x: number
  y: number
  scale: number
  rotation: number
}

/**
 * Orchestrates the disrupt/explosion animation triggered on click.
 * Coordinates all pixels to explode outward and return home smoothly.
 */
export class DisruptAnimationOrchestrator {
  private timeline: gsap.core.Timeline | null = null

  create(
    animators: PixelAnimator[],
    mousePosition: Position,
    onComplete: () => void
  ): gsap.core.Timeline {
    this.kill()

    const masterTimeline = gsap.timeline({ onComplete })

    animators.forEach((animator, index) => {
      const pixelTimeline = this.createPixelTimeline(animator, mousePosition, index)
      masterTimeline.add(pixelTimeline, 0)
    })

    this.timeline = masterTimeline
    return masterTimeline
  }

  kill(): void {
    if (this.timeline) {
      this.timeline.kill()
      this.timeline = null
    }
  }

  isActive(): boolean {
    return this.timeline !== null && this.timeline.isActive()
  }

  private createPixelTimeline(
    animator: PixelAnimator,
    mousePosition: Position,
    index: number
  ): gsap.core.Timeline {
    const timeline = gsap.timeline()
    const currentState = animator.getCurrentTransform()
    const homePosition = this.calculateHomePosition(mousePosition, index)
    const explosion = this.calculateExplosion(currentState)

    this.addExplosionPhase(timeline, animator, explosion)
    this.addSettlePhase(timeline, animator, explosion, homePosition)
    this.addReturnPhase(timeline, animator, homePosition)

    return timeline
  }

  private calculateHomePosition(mousePosition: Position, index: number): Position {
    const offset = PIXEL_OFFSETS[index]
    return {
      x: mousePosition.x + offset.x,
      y: mousePosition.y + offset.y,
    }
  }

  private calculateExplosion(currentState: TransformState): ExplosionVector {
    const angle = Math.random() * Math.PI * 2
    const distance = randomInRange(EXPLOSION.MIN_DISTANCE, EXPLOSION.MAX_DISTANCE)

    return {
      x: currentState.x + Math.cos(angle) * distance,
      y: currentState.y + Math.sin(angle) * distance,
      scale: Math.max(currentState.scale, 1) *
             randomInRange(EXPLOSION.MIN_SCALE, EXPLOSION.MAX_SCALE),
      rotation: currentState.rotation +
                randomCentered(EXPLOSION.MAX_ROTATION_DEGREES),
    }
  }

  private addExplosionPhase(
    timeline: gsap.core.Timeline,
    animator: PixelAnimator,
    explosion: ExplosionVector
  ): void {
    const duration = TIMING.DISRUPT_TOTAL_DURATION * DISRUPT_PHASES.EXPLODE

    timeline.to(animator.getElement(), {
      x: explosion.x,
      y: explosion.y,
      scale: explosion.scale,
      rotation: explosion.rotation,
      duration,
      ease: 'power2.out',
    })
  }

  private addSettlePhase(
    timeline: gsap.core.Timeline,
    animator: PixelAnimator,
    explosion: ExplosionVector,
    homePosition: Position
  ): void {
    const duration = TIMING.DISRUPT_TOTAL_DURATION * DISRUPT_PHASES.SETTLE
    const blend = EXPLOSION.SETTLE_BLEND_RATIO

    timeline.to(animator.getElement(), {
      x: explosion.x * blend + homePosition.x * (1 - blend),
      y: explosion.y * blend + homePosition.y * (1 - blend),
      scale: explosion.scale * 0.95,
      rotation: explosion.rotation * 0.9,
      duration,
      ease: 'power1.inOut',
    })
  }

  private addReturnPhase(
    timeline: gsap.core.Timeline,
    animator: PixelAnimator,
    homePosition: Position
  ): void {
    const duration = TIMING.DISRUPT_TOTAL_DURATION * DISRUPT_PHASES.RETURN

    timeline.to(animator.getElement(), {
      x: homePosition.x,
      y: homePosition.y,
      scale: 1,
      rotation: 0,
      duration,
      ease: 'power2.inOut',
    })
  }
}
