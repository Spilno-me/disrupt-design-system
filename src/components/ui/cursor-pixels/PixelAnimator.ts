import gsap from 'gsap'
import { TIMING, calculateQuickToDuration } from './animation-config'

export interface Position {
  x: number
  y: number
}

export interface TransformState {
  x: number
  y: number
  scale: number
  rotation: number
}

/**
 * Encapsulates all GSAP animation logic for a single pixel element.
 * Hides GSAP implementation details behind intention-revealing methods.
 */
export class PixelAnimator {
  private quickX!: gsap.QuickToFunc
  private quickY!: gsap.QuickToFunc

  constructor(
    private readonly element: HTMLDivElement,
    private readonly delay: number
  ) {
    this.initializeQuickTo()
  }

  private initializeQuickTo(): void {
    const duration = calculateQuickToDuration(this.delay)
    this.quickX = gsap.quickTo(this.element, 'x', { duration, ease: 'power3.out' })
    this.quickY = gsap.quickTo(this.element, 'y', { duration, ease: 'power3.out' })
  }

  reinitializeQuickTo(): void {
    this.initializeQuickTo()
  }

  moveTo(position: Position): void {
    this.quickX(position.x)
    this.quickY(position.y)
  }

  getCurrentTransform(): TransformState {
    return {
      x: (gsap.getProperty(this.element, 'x') as number) || 0,
      y: (gsap.getProperty(this.element, 'y') as number) || 0,
      scale: (gsap.getProperty(this.element, 'scale') as number) || 1,
      rotation: (gsap.getProperty(this.element, 'rotation') as number) || 0,
    }
  }

  setTransform(state: Partial<TransformState>): void {
    gsap.set(this.element, state)
  }

  animateTo(
    state: Partial<TransformState>,
    duration: number,
    ease: string,
    overwrite: gsap.TweenVars['overwrite'] = 'auto'
  ): gsap.core.Tween {
    return gsap.to(this.element, {
      ...state,
      duration,
      ease,
      overwrite,
    })
  }

  fadeIn(): gsap.core.Tween {
    return gsap.to(this.element, {
      opacity: 1,
      duration: TIMING.FADE_DURATION,
      ease: 'power2.out',
    })
  }

  fadeOut(): gsap.core.Tween {
    return gsap.to(this.element, {
      opacity: 0,
      duration: TIMING.FADE_DURATION,
      ease: 'power2.out',
    })
  }

  resetTransform(): gsap.core.Tween {
    return gsap.to(this.element, {
      scale: 1,
      rotation: 0,
      duration: TIMING.ROTATION_RESET_DURATION,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  killAllTweens(): void {
    gsap.killTweensOf(this.element)
  }

  getElement(): HTMLDivElement {
    return this.element
  }
}
