import './breach-overlay.sass'

import { useEffect, useMemo, useState } from 'react'

import { BREACH_GAME } from '@/content/breach-game'
import { findSpreadIndex, SPREADS } from '@/content/spreads'

import {
  BreachBoard,
  bufferCodes,
  buildBreachPuzzle,
  cursorAfter,
  hasSequence,
  matchedCount,
  resolveBreachSettings,
} from '../breach'
import { useReader } from '../reader'

// Share of the window before the first pick and by the last one; the rest holds ACCESS GRANTED.
const FIRST_PICK = 0.15
const LAST_PICK = 0.72

type BreachOverlayProps = {
  /** The pathname being breached; seeds the matrix and names the target. */
  target: string
  /** How long the breach holds before the turn completes. */
  breachMs: number
  onSkip: () => void
}

/** The riddle board, replaying its own planted solution. Display only: a tap skips it. */
export const BreachOverlay = ({ target, breachMs, onSkip }: BreachOverlayProps) => {
  const { viewMode } = useReader()
  const [settings] = useState(() =>
    resolveBreachSettings(viewMode === 'phone' ? BREACH_GAME.phone : BREACH_GAME.desktop),
  )
  const puzzle = useMemo(
    () => buildBreachPuzzle(target, settings.difficulty),
    [target, settings],
  )
  const [step, setStep] = useState(0)
  const label = SPREADS[findSpreadIndex(target)]?.label ?? 'Unknown'

  useEffect(() => {
    const picks = puzzle.path.length
    const gap = (breachMs * (LAST_PICK - FIRST_PICK)) / Math.max(picks - 1, 1)
    const timers = puzzle.path.map((_, index) =>
      window.setTimeout(() => setStep(index + 1), breachMs * FIRST_PICK + index * gap),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [puzzle, breachMs])

  const picked = puzzle.path.slice(0, step)
  const codes = bufferCodes(puzzle.cells, picked)
  const solved = hasSequence(codes, puzzle.sequence)
  const phase = solved ? 'solved' : step === 0 ? 'ready' : 'running'

  return (
    <div
      className="breach-overlay"
      data-view={viewMode}
      aria-hidden="true"
      onPointerDown={onSkip}>
      <div className="breach-overlay__console">
        <div className="breach-overlay__header">
          <span className="breach-overlay__title">Breach protocol</span>
          <span className="breach-overlay__target">
            ICE // <strong>{label}</strong>
          </span>
        </div>
        <div
          className="breach-overlay__board"
          inert>
          <BreachBoard
            puzzle={puzzle}
            phase={phase}
            picked={picked}
            codes={codes}
            cursor={cursorAfter(puzzle.size, picked)}
            failure={null}
            hurry={false}
            attempt={0}
            timeMs={settings.timeMs}
            hurryMs={settings.hurryMs}
            clockMs={breachMs * (1 - FIRST_PICK)}
            target={solved ? null : puzzle.sequence[matchedCount(codes, puzzle.sequence)]}
            previewed={null}
          />
        </div>
      </div>
    </div>
  )
}
