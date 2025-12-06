export type CursorState = 'following' | 'idle' | 'disrupting'

/**
 * Manages cursor animation state transitions.
 * Ensures valid state transitions and provides query methods.
 */
export class CursorStateMachine {
  private state: CursorState = 'following'

  getCurrentState(): CursorState {
    return this.state
  }

  transitionTo(newState: CursorState): boolean {
    if (!this.canTransitionTo(newState)) {
      return false
    }
    this.state = newState
    return true
  }

  private canTransitionTo(newState: CursorState): boolean {
    // Can always transition to following (reset state)
    if (newState === 'following') return true

    // Cannot transition away from disrupting until it completes
    if (this.state === 'disrupting') return false

    // Can transition from following to idle or disrupting
    if (this.state === 'following') return true

    // Can transition from idle to following or disrupting
    if (this.state === 'idle') return true

    return false
  }

  isFollowing(): boolean {
    return this.state === 'following'
  }

  isIdle(): boolean {
    return this.state === 'idle'
  }

  isDisrupting(): boolean {
    return this.state === 'disrupting'
  }

  reset(): void {
    this.state = 'following'
  }
}
