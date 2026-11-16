import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from '@mantine/hooks'

import { entrySlugOf, findSpreadIndex, spreadOrder, SPREADS } from '@/content/spreads'

import { useBreachGate, useReader, useVisits } from '../reader'

export type SpreadPhase = 'idle' | 'exiting' | 'breaching' | 'entering'
export type TurnDirection = 'forward' | 'backward'

export const TURN_EXIT_MS = 280
export const BREACH_MS = 1800
export const TURN_ENTER_MS = 420
const REDUCED_ENTER_MS = 160

// Escape is also the reader's zoom-out / back-to-map hotkey, so a skip must not leak to it.
const SKIP_KEYS = new Set(['Escape', 'Enter', ' '])

/**
 * Holds the rendered location back while the current spread turns away, then swaps it in.
 * Direction follows the registry order so paging back turns the page the other way.
 * The first visit to a chapter plays a breach between the two halves of the turn.
 */
export const useSpreadTransition = () => {
  const location = useLocation()
  const reducedMotion = useReducedMotion()
  const { resetZoom, fx } = useReader()
  const { visited } = useVisits()
  const lockedNow = useBreachGate().isLocked(location.pathname)

  const [displayed, setDisplayed] = useState(location)
  const [displayedLocked, setDisplayedLocked] = useState(lockedNow)
  const [target, setTarget] = useState(location.pathname)
  const [targetLocked, setTargetLocked] = useState(lockedNow)
  const [phase, setPhase] = useState<SpreadPhase>('idle')
  const [direction, setDirection] = useState<TurnDirection>('forward')
  const [breach, setBreach] = useState(false)

  // Journal entries never breach: there may be thousands, and each one is a first visit.
  // A locked route already shows the playable riddle, so it gets no cinematic on top.
  const shouldBreach = (pathname: string, locked: boolean) => {
    if (locked || reducedMotion || fx === 'reduced') return false
    if (entrySlugOf(pathname) !== null) return false
    const spread = SPREADS[findSpreadIndex(pathname)]
    return Boolean(spread) && !visited.has(spread.id)
  }

  // Decided here, before the shell records the visit, and kept for the whole turn.
  if (location.pathname !== target) {
    const from = spreadOrder(displayed.pathname)
    const to = spreadOrder(location.pathname)
    setTarget(location.pathname)
    setTargetLocked(lockedNow)
    setDirection(from >= 0 && to >= 0 && to < from ? 'backward' : 'forward')
    setBreach(shouldBreach(location.pathname, lockedNow))
    setPhase('exiting')
  } else if (lockedNow !== targetLocked) {
    // Cracking (or relocking) the route on screen turns the riddle into the page, or back.
    setTargetLocked(lockedNow)
    setDirection('forward')
    setBreach(false)
    setPhase('exiting')
  } else if (
    location.pathname === displayed.pathname &&
    (location.search !== displayed.search || location.hash !== displayed.hash)
  ) {
    // Query changes (Journal search, filters, pages) stay on the same spread without a turn.
    setDisplayed(location)
  }

  const exitMs = reducedMotion ? 0 : TURN_EXIT_MS
  const enterMs = reducedMotion ? REDUCED_ENTER_MS : TURN_ENTER_MS

  const commitTurn = useCallback(() => {
    setDisplayed(location)
    setDisplayedLocked(targetLocked)
    setPhase('entering')
  }, [location, targetLocked])

  useEffect(() => {
    if (phase === 'exiting') {
      const timer = window.setTimeout(() => {
        // Before the breach mounts: it lives inside the zoomed, panned stage canvas.
        resetZoom()
        if (breach) setPhase('breaching')
        else commitTurn()
      }, exitMs)
      return () => window.clearTimeout(timer)
    }
    if (phase === 'breaching') {
      const timer = window.setTimeout(commitTurn, BREACH_MS)
      const onKeyDown = (event: KeyboardEvent) => {
        if (!SKIP_KEYS.has(event.key)) return
        event.preventDefault()
        event.stopPropagation()
        commitTurn()
      }
      window.addEventListener('keydown', onKeyDown, true)
      return () => {
        window.clearTimeout(timer)
        window.removeEventListener('keydown', onKeyDown, true)
      }
    }
    if (phase === 'entering') {
      const timer = window.setTimeout(() => setPhase('idle'), enterMs)
      return () => window.clearTimeout(timer)
    }
  }, [phase, breach, exitMs, enterMs, resetZoom, commitTurn])

  return {
    displayed,
    displayedLocked,
    target,
    phase,
    direction,
    exitMs,
    breachMs: BREACH_MS,
    enterMs,
    skipBreach: commitTurn,
  }
}
