import './breach-board.sass'

import type { RefObject } from 'react'
import { VisuallyHidden } from '@mantine/core'

import type { CSSVars } from '../cx'
import type { BreachPuzzle } from './breach-code'
import type { BreachFailure, BreachPhase } from './breach-game-context'
import { type BreachCursor, colOf, matchedCount, rowOf } from './breach-rules'

const seconds = (ms: number) => Math.round(ms / 1000)

const lineName = ({ axis, line }: BreachCursor) =>
  `${axis === 'row' ? 'row' : 'column'} ${line + 1}`

type Status = {
  phase: BreachPhase
  failure: BreachFailure | null
  hurry: boolean
  codes: string[]
  buffer: number
  cursor: BreachCursor
  timeMs: number
  hurryMs: number
}

const statusFor = ({
  phase,
  failure,
  hurry,
  codes,
  buffer,
  cursor,
  timeMs,
  hurryMs,
}: Status) => {
  if (phase === 'solved') return 'Sequence landed. Access granted.'
  if (phase === 'failed') {
    return failure === 'timeout'
      ? 'Time ran out. The ICE held.'
      : 'Buffer full without the sequence. The ICE held.'
  }
  if (phase === 'ready') {
    return `Pick a code in the top row. The ${seconds(timeMs)} second clock starts on your first pick.`
  }
  const left = hurry ? ` ${seconds(hurryMs)} seconds left.` : ''
  return `Buffer ${codes.length} of ${buffer}: ${codes.join(' ')}. Next, a code in ${lineName(cursor)}.${left}`
}

export type BreachBoardControls = {
  canPick: (cell: number) => boolean
  onPick: (cell: number) => void
  onPreview: (code: string) => void
  onRetry: () => void
}

type BreachBoardProps = {
  puzzle: BreachPuzzle
  phase: BreachPhase
  picked: readonly number[]
  codes: string[]
  cursor: BreachCursor
  failure: BreachFailure | null
  hurry: boolean
  attempt: number
  timeMs: number
  hurryMs: number
  /** Duration the timer bar drains over; defaults to timeMs. */
  clockMs?: number
  /** Matrix code lit in ice: a preview, or the next code to land. */
  target: string | null
  previewed: string | null
  /** Omit for a display-only board: cells and codes render as spans, with no buttons. */
  controls?: BreachBoardControls
  matrixRef?: RefObject<HTMLDivElement | null>
  retryRef?: RefObject<HTMLButtonElement | null>
}

/** The riddle's matrix and readouts. The game drives it with controls; the page-turn breach replays it. */
export const BreachBoard = ({
  puzzle,
  phase,
  picked,
  codes,
  cursor,
  failure,
  hurry,
  attempt,
  timeMs,
  hurryMs,
  clockMs = timeMs,
  target,
  previewed,
  controls,
  matrixRef,
  retryRef,
}: BreachBoardProps) => {
  const playing = phase === 'ready' || phase === 'running'
  const matched =
    phase === 'solved' ? puzzle.sequence.length : matchedCount(codes, puzzle.sequence)

  return (
    <div
      className="breach-game"
      data-phase={phase}
      data-hurry={hurry ? '' : undefined}
      style={
        { '--breach-size': puzzle.size, '--breach-time': `${clockMs}ms` } as CSSVars
      }>
      <div
        ref={matrixRef}
        className="breach-game__matrix"
        role={controls ? 'group' : undefined}
        aria-label={controls ? 'Code matrix' : undefined}>
        {puzzle.cells.map((code, cell) => {
          const row = rowOf(puzzle.size, cell)
          const col = colOf(puzzle.size, cell)
          const isPicked = picked.includes(cell)
          const isMarked = !isPicked && code === target
          const onLine = playing && (cursor.axis === 'row' ? row : col) === cursor.line
          const state = {
            className: 'breach-game__cell',
            'data-line': onLine ? '' : undefined,
            'data-picked': isPicked ? '' : undefined,
            'data-marked': isMarked ? '' : undefined,
          }
          if (!controls) {
            return (
              <span
                key={`${attempt}:${cell}`}
                {...state}>
                {code}
              </span>
            )
          }
          return (
            <button
              key={`${attempt}:${cell}`}
              type="button"
              {...state}
              disabled={!controls.canPick(cell)}
              aria-label={`Row ${row + 1}, column ${col + 1}, code ${code}${isPicked ? ', picked' : isMarked ? ', highlighted' : ''}`}
              onClick={() => controls.onPick(cell)}>
              {code}
            </button>
          )
        })}
      </div>
      <div className="breach-game__panel">
        <div className="breach-game__readout">
          <span
            className="breach-game__label"
            aria-hidden="true">
            Sequence
          </span>
          <ol
            className="breach-game__codes"
            aria-label="Sequence to land">
            {puzzle.sequence.map((code, index) => {
              const isCurrent = playing && index === matched
              const state = {
                className: 'breach-game__code',
                'data-matched': index < matched ? '' : undefined,
                'data-current': isCurrent ? '' : undefined,
              }
              return (
                <li key={index}>
                  {controls ? (
                    <button
                      type="button"
                      {...state}
                      disabled={!playing}
                      aria-pressed={previewed === code}
                      onClick={() => controls.onPreview(code)}>
                      {code}
                      {index < matched && <VisuallyHidden>, landed</VisuallyHidden>}
                      {isCurrent && <VisuallyHidden>, next to land</VisuallyHidden>}
                      <VisuallyHidden>, highlight it in the matrix</VisuallyHidden>
                    </button>
                  ) : (
                    <span {...state}>{code}</span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
        <div className="breach-game__readout">
          <span
            className="breach-game__label"
            aria-hidden="true">
            Buffer
          </span>
          <ol
            className="breach-game__codes"
            aria-label={`Buffer, ${codes.length} of ${puzzle.buffer} filled`}>
            {Array.from({ length: puzzle.buffer }, (_, index) => (
              <li
                key={index}
                className="breach-game__slot"
                data-filled={index < codes.length ? '' : undefined}>
                {codes[index] ?? ''}
              </li>
            ))}
          </ol>
        </div>
        <div className="breach-game__timer">
          <span className="breach-game__label">
            Breach time <span aria-hidden="true">//</span> {seconds(timeMs)} s
          </span>
          <span
            className="breach-game__track"
            aria-hidden="true">
            <span
              key={attempt}
              className="breach-game__bar"
            />
          </span>
        </div>
        <p
          className="breach-game__status"
          role={controls ? 'status' : undefined}>
          {statusFor({
            phase,
            failure,
            hurry,
            codes,
            buffer: puzzle.buffer,
            cursor,
            timeMs,
            hurryMs,
          })}
        </p>
        {controls && phase === 'failed' && (
          <button
            ref={retryRef}
            type="button"
            className="breach-game__retry"
            onClick={controls.onRetry}>
            Retry <span aria-hidden="true">// new matrix</span>
          </button>
        )}
        {controls && playing && (
          <button
            type="button"
            className="breach-game__regen"
            onClick={controls.onRetry}>
            New matrix
          </button>
        )}
        {phase === 'solved' && (
          <p
            className="breach-game__stamp"
            aria-hidden="true">
            Access granted
          </p>
        )}
      </div>
    </div>
  )
}
