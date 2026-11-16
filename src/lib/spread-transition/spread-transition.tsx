import './spread-transition.sass'

import { type ReactNode, useEffect, useRef } from 'react'
import type { Location } from 'react-router-dom'

import type { CSSVars } from '../cx'
import { BreachOverlay } from './breach-overlay'
import { useSpreadTransition } from './use-spread-transition'

type SpreadTransitionProps = {
  children: (location: Location) => ReactNode
}

export const SpreadTransition = ({ children }: SpreadTransitionProps) => {
  const { displayed, target, phase, direction, exitMs, breachMs, enterMs, skipBreach } =
    useSpreadTransition()
  const ref = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    ref.current
      ?.querySelector<HTMLElement>('[data-spread-heading]')
      ?.focus({ preventScroll: true })
  }, [displayed.pathname])

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
        key={displayed.pathname}
        className="spread-transition__page">
        {children(displayed)}
      </div>
      <div
        className="spread-transition__burst"
        aria-hidden="true"
      />
      {phase === 'breaching' && (
        <BreachOverlay
          target={target}
          onSkip={skipBreach}
        />
      )}
    </div>
  )
}
