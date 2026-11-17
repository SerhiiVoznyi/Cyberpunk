import './spread-transition.sass'

import { type ReactNode, useEffect, useRef } from 'react'
import type { Location } from 'react-router-dom'

import type { CSSVars } from '../cx'
import { BreachOverlay } from './breach-overlay'
import { useSpreadTransition } from './use-spread-transition'

type SpreadTransitionProps = {
  /** `locked` is true while the location's protected route still shows the breach riddle. */
  children: (location: Location, locked: boolean) => ReactNode
}

export const SpreadTransition = ({ children }: SpreadTransitionProps) => {
  const {
    displayed,
    displayedLocked,
    target,
    phase,
    direction,
    exitMs,
    breachMs,
    enterMs,
    skipBreach,
  } = useSpreadTransition()
  const ref = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const pageKey = `${displayed.pathname}:${displayedLocked ? 'locked' : 'open'}`

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    ref.current
      ?.querySelector<HTMLElement>('[data-spread-heading]')
      ?.focus({ preventScroll: true })
  }, [pageKey])

  return (
    <div
      ref={ref}
      className="spread-transition"
      data-phase={phase}
      data-direction={direction}
      style={
        {
          '--spread-turn-exit': `${exitMs}ms`,
          '--spread-breach': `${breachMs}ms`,
          '--spread-turn-enter': `${enterMs}ms`,
        } as CSSVars
      }>
      <div
        key={pageKey}
        className="spread-transition__page">
        {children(displayed, displayedLocked)}
      </div>
      <div
        className="spread-transition__burst"
        aria-hidden="true"
      />
      {phase === 'breaching' && (
        <BreachOverlay
          target={target}
          breachMs={breachMs}
          onSkip={skipBreach}
        />
      )}
    </div>
  )
}
