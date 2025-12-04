import gsap from 'gsap'
import { TIMING, EXCITED } from './animation-config'
import { randomInRange, randomCentered } from './animation-utils'
import type { PixelAnimator } from './PixelAnimator'

/**
 * Manages the excited jitter animation when hovering interactive elements.
 * Only affects scale and rotation - position still follows the mouse.
 */
export class ExcitedAnimationHandler {
  private tweens: gsap.core.Tween[] = []
  private active = false

  start(animators: PixelAnimator[]): void {
    if (this.active) return

    this.stop()
    this.active = true

    animators.forEach(animator => {
      const tween = this.createJitterTween(animator)
      this.tweens.push(tween)
    })
  }

  stop(): void {
    if (!this.active) return

    this.tweens.forEach(tween => tween.kill())
    this.tweens = []
    this.active = false
  }

  stopWithReset(animators: PixelAnimator[]): void {
    this.stop()
    animators.forEach(animator => animator.resetTransform())
  }

  isActive(): boolean {
    return this.active
  }

  private createJitterTween(animator: PixelAnimator): gsap.core.Tween {
    const duration = TIMING.EXCITED_DURATION_BASE +
                     Math.random() * TIMING.EXCITED_DURATION_VARIANCE

    const scale = randomInRange(EXCITED.SCALE_MIN, EXCITED.SCALE_MAX)
    const rotation = randomCentered(EXCITED.MAX_ROTATION)

    return gsap.to(animator.getElement(), {
      scale,
      rotation,
      duration,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      overwrite: 'auto',
    })
  }
}
