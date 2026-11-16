import { useEffect, useRef, useState } from 'react'

import { HazardRule } from '@/components'
import {
  type BreachCursor,
  type BreachFailure,
  type BreachPhase,
  colOf,
  rowOf,
  useBreachGame,
} from '@/lib/breach'
import type { CSSVars } from '@/lib/cx'

/** `decorated={false}` drops rules and other decoration, for layouts that spend no space on them. */
type SectionProps = { decorated?: boolean }

const seconds = (ms: number) => Math.round(ms / 1000)

// How many codes at the end of the buffer already begin the sequence.
const matchedCount = (codes: readonly string[], sequence: readonly string[]) => {
  for (let k = Math.min(codes.length, sequence.length); k > 0; k--) {
    const tail = codes.slice(codes.length - k)
    if (tail.every((code, index) => code === sequence[index])) return k
  }
  return 0
}

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

export const BreachProtocol = () => {
  const {
    puzzle,
    phase,
    picked,
    cursor,
    failure,
    hurry,
    attempt,
    timeMs,
    hurryMs,
    canPick,
    pick,
    retry,
  } = useBreachGame()
  const matrixRef = useRef<HTMLDivElement>(null)
  const retryRef = useRef<HTMLButtonElement>(null)
  const acted = useRef(false)
  // Tied to its run, so a retry's fresh sequence starts with nothing highlighted.
  const [mark, setMark] = useState<{ attempt: number; code: string } | null>(null)
  const marked = mark?.attempt === attempt ? mark.code : null
  const playing = phase === 'ready' || phase === 'running'
  const codes = picked.map((cell) => puzzle.cells[cell])
  const matched =
    phase === 'solved' ? puzzle.sequence.length : matchedCount(codes, puzzle.sequence)

  // A pick disables the button it was made with, so focus follows to the next legal line.
  useEffect(() => {
    if (!acted.current) return
    if (phase === 'failed') retryRef.current?.focus()
    else if (phase !== 'solved') {
      matrixRef.current
        ?.querySelector<HTMLButtonElement>('button:not(:disabled)')
        ?.focus()
    }
  }, [picked.length, phase, attempt])

  return (
    <div
      className="breach-game"
      data-phase={phase}
      data-hurry={hurry ? '' : undefined}
      style={{ '--breach-size': puzzle.size, '--breach-time': `${timeMs}ms` } as CSSVars}>
      <div
        ref={matrixRef}
        className="breach-game__matrix"
        role="group"
        aria-label="Code matrix">
        {puzzle.cells.map((code, cell) => {
          const row = rowOf(puzzle.size, cell)
          const col = colOf(puzzle.size, cell)
          const isPicked = picked.includes(cell)
          const isMarked = code === marked
          const onLine = playing && (cursor.axis === 'row' ? row : col) === cursor.line
          return (
            <button
              key={`${attempt}:${cell}`}
              type="button"
              className="breach-game__cell"
              data-line={onLine ? '' : undefined}
              data-picked={isPicked ? '' : undefined}
              data-marked={isMarked ? '' : undefined}
              disabled={!canPick(cell)}
              aria-label={`Row ${row + 1}, column ${col + 1}, code ${code}${isPicked ? ', picked' : isMarked ? ', highlighted' : ''}`}
              onClick={() => {
                acted.current = true
                pick(cell)
              }}>
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
            {puzzle.sequence.map((code, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="breach-game__code"
                  data-matched={index < matched ? '' : undefined}
                  aria-pressed={marked === code}
                  aria-label={`${code}: highlight it in the matrix`}
                  onClick={() => setMark(marked === code ? null : { attempt, code })}>
                  {code}
                </button>
              </li>
            ))}
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
          role="status">
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
        {phase === 'failed' && (
          <button
            ref={retryRef}
            type="button"
            className="breach-game__retry"
            onClick={() => {
              acted.current = true
              retry()
            }}>
            Retry <span aria-hidden="true">// new matrix</span>
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

export const BreachManual = ({ decorated = true }: SectionProps) => (
  <>
    <p className="sheet-text sheet-text--lead">
      This route sits behind ICE. Land the sequence in the buffer to open it.
    </p>
    <ol className="sheet-list">
      <li>
        Your first pick comes from the top row. The sequence rarely starts there, so spend
        your one spare pick lining it up.
      </li>
      <li>
        Each pick switches direction: after a row, pick from the column through that code,
        then from the row through the next one, and so on.
      </li>
      <li>
        Land the whole sequence, in order and in one unbroken run, before the buffer fills
        or the clock runs out.
      </li>
    </ol>
    {decorated && (
      <HazardRule
        tone="ink"
        className="breach__rule"
      />
    )}
    <p className="sheet-text">
      The clock starts on your first pick. If the ICE holds, Retry builds a fresh matrix.
    </p>
  </>
)
