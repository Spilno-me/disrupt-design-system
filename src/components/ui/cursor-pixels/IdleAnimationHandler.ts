import gsap from 'gsap'
import { IDLE } from './animation-config'
import { randomInRange, randomCentered, randomDirection } from './animation-utils'
import type { PixelAnimator } from './PixelAnimator'

/**
 * Manages the idle floating animation when the mouse stops moving.
 * Each pixel gets a unique organic floating motion.
 */
export class IdleAnimationHandler {
  private tweens: gsap.core.Tween[] = []

  start(animators: PixelAnimator[]): void {
    this.stop()

    animators.forEach((animator, index) => {
      const tween = this.createFloatingTween(animator, index)
      this.tweens.push(tween)
    })
  }

  stop(): void {
    this.tweens.forEach(tween => tween.kill())
    this.tweens = []
  }

  isActive(): boolean {
    return this.tweens.length > 0
  }

  private createFloatingTween(animator: PixelAnimator, index: number): gsap.core.Tween {
    const xRange = randomInRange(IDLE.X_RANGE_MIN, IDLE.X_RANGE_MAX)
    const yRange = randomInRange(IDLE.Y_RANGE_MIN, IDLE.Y_RANGE_MAX)
    const duration = randomInRange(IDLE.DURATION_MIN, IDLE.DURATION_MAX)
    const delay = index * IDLE.STAGGER_DELAY

    const xDirection = randomDirection()
    const yDirection = randomDirection()
    const rotation = randomCentered(IDLE.MAX_ROTATION)

    return gsap.to(animator.getElement(), {
      x: `+=${xRange * xDirection}`,
      y: `+=${yRange * yDirection}`,
      rotation,
      duration,
      delay,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  }
}
