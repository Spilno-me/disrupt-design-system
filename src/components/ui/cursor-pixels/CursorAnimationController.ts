import gsap from 'gsap'
import { TIMING, PIXELS, PIXEL_OFFSETS } from './animation-config'
import { PixelAnimator, Position } from './PixelAnimator'
import { CursorStateMachine } from './CursorStateMachine'
import { IdleAnimationHandler } from './IdleAnimationHandler'
import { ExcitedAnimationHandler } from './ExcitedAnimationHandler'
import { RepelAnimationHandler } from './RepelAnimationHandler'
import { DisruptAnimationOrchestrator } from './DisruptAnimationOrchestrator'

/**
 * Main controller that coordinates all cursor animation behaviors.
 * Acts as a facade for the animation subsystem, delegating to specialized handlers.
 */
export class CursorAnimationController {
  private animators: PixelAnimator[] = []
  private stateMachine = new CursorStateMachine()
  private idleHandler = new IdleAnimationHandler()
  private excitedHandler = new ExcitedAnimationHandler()
  private repelHandler = new RepelAnimationHandler()
  private disruptOrchestrator = new DisruptAnimationOrchestrator()
  private idleTimeout: ReturnType<typeof setTimeout> | null = null
  private mousePosition: Position = { x: 0, y: 0 }

  initialize(elements: HTMLDivElement[]): void {
    this.animators = elements.map((element, index) => {
      const config = PIXELS[index]
      const animator = new PixelAnimator(element, config.delay)
      animator.setTransform({ x: 0, y: 0, scale: 1, rotation: 0 })
      gsap.set(element, { opacity: 0 })
      return animator
    })
  }

  cleanup(): void {
    this.clearIdleTimeout()
    this.idleHandler.stop()
    this.excitedHandler.stop()
    this.repelHandler.reset()
    this.disruptOrchestrator.kill()
    this.animators.forEach(animator => animator.killAllTweens())
    this.animators = []
  }

  updateMousePosition(position: Position): void {
    this.mousePosition = position

    if (this.stateMachine.isIdle()) {
      this.exitIdle()
    }

    this.resetIdleTimeout()
    this.updatePixelPositions()
  }

  handleInteractiveHover(isInteractive: boolean): void {
    if (this.stateMachine.isDisrupting()) return

    if (isInteractive) {
      this.enterExcited()
    } else {
      this.exitExcited()
    }
  }

  triggerDisrupt(): void {
    if (this.repelHandler.isActive()) return
    if (!this.stateMachine.transitionTo('disrupting')) return

    this.clearIdleTimeout()
    this.idleHandler.stop()
    this.excitedHandler.stop()

    this.disruptOrchestrator.create(
      this.animators,
      this.mousePosition,
      () => this.onDisruptComplete()
    )
  }

  showPixels(): void {
    this.animators.forEach(animator => animator.fadeIn())
  }

  hidePixels(): void {
    this.clearIdleTimeout()
    this.idleHandler.stop()
    this.excitedHandler.stop()
    this.repelHandler.reset()
    this.stateMachine.reset()
    this.animators.forEach(animator => animator.fadeOut())
  }

  isExcited(): boolean {
    return this.excitedHandler.isActive()
  }

  // ============ Repel Handling ============

  handleRepel(shouldRepel: boolean): void {
    if (shouldRepel && !this.repelHandler.isActive()) {
      this.startRepelScatter()
    } else if (shouldRepel && this.repelHandler.isReturning()) {
      // Re-entered repel area while returning - restart scatter
      this.startRepelScatter()
    } else if (!shouldRepel && this.repelHandler.isActive()) {
      this.startRepelReturn()
    }
  }

  private startRepelScatter(): void {
    this.clearIdleTimeout()
    this.idleHandler.stop()
    this.excitedHandler.stop()

    this.repelHandler.startScatter(
      this.animators,
      this.mousePosition,
      () => {
        // Scatter complete - pixels are now invisible but tracked
      }
    )
  }

  private startRepelReturn(): void {
    this.repelHandler.startReturn(
      this.animators,
      this.mousePosition,
      () => {
        // Return complete - reinitialize for normal following
        this.animators.forEach(a => a.reinitializeQuickTo())
        this.stateMachine.transitionTo('following')
        this.resetIdleTimeout()
      }
    )
  }

  // ============ Position Updates ============

  private updatePixelPositions(): void {
    if (this.stateMachine.isDisrupting()) return
    if (this.repelHandler.isScattering()) return
    if (this.repelHandler.isReturning()) return

    this.animators.forEach((animator, index) => {
      const offset = PIXEL_OFFSETS[index]
      const position = {
        x: this.mousePosition.x + offset.x,
        y: this.mousePosition.y + offset.y,
      }
      animator.moveTo(position)
    })
  }

  // ============ Idle State ============

  private enterIdle(): void {
    if (!this.stateMachine.transitionTo('idle')) return
    this.idleHandler.start(this.animators)
  }

  private exitIdle(): void {
    this.idleHandler.stop()

    this.animators.forEach(animator => {
      const current = animator.getCurrentTransform()
      animator.reinitializeQuickTo()
      animator.setTransform({ x: current.x, y: current.y })
      animator.resetTransform()
    })

    this.stateMachine.transitionTo('following')
  }

  // ============ Excited State ============

  private enterExcited(): void {
    if (this.excitedHandler.isActive()) return

    if (this.stateMachine.isIdle()) {
      this.exitIdle()
    }

    this.excitedHandler.start(this.animators)
  }

  private exitExcited(): void {
    this.excitedHandler.stopWithReset(this.animators)
  }

  // ============ Disrupt ============

  private onDisruptComplete(): void {
    this.stateMachine.transitionTo('following')
    this.animators.forEach(animator => animator.reinitializeQuickTo())
    this.updatePixelPositions()
  }

  // ============ Idle Timeout ============

  private resetIdleTimeout(): void {
    this.clearIdleTimeout()

    this.idleTimeout = setTimeout(() => {
      if (this.canEnterIdle()) {
        this.enterIdle()
      }
    }, TIMING.IDLE_TRIGGER_DELAY_MS)
  }

  private canEnterIdle(): boolean {
    return this.stateMachine.isFollowing() &&
           !this.excitedHandler.isActive() &&
           !this.repelHandler.isActive()
  }

  private clearIdleTimeout(): void {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout)
      this.idleTimeout = null
    }
  }
}
