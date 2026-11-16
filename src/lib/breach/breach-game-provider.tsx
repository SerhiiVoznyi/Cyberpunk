import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { BREACH_TIME_MS } from '@/content/breach'

import { useReader, type ViewMode } from '../reader'
import { type BreachDifficulty, buildBreachPuzzle } from './breach-code'
import {
  BreachGameContext,
  type BreachGameValue,
  type BreachPhase,
} from './breach-game-context'
import {
  BREACH_START,
  hasPickable,
  hasSequence,
  isPickable,
  nextCursor,
} from './breach-rules'

// One spare pick in the buffer, and the sequence starts after a lead-in pick, so the opener must
// be planned. Phone cells must stay touch-sized, so the phone grid is a size smaller.
const DIFFICULTY: Record<ViewMode, BreachDifficulty> = {
  spread: { size: 7, sequence: 5, buffer: 6, lead: 1, decoys: 8 },
  single: { size: 7, sequence: 5, buffer: 6, lead: 1, decoys: 8 },
  phone: { size: 6, sequence: 4, buffer: 5, lead: 1, decoys: 6 },
}

const HURRY_MS = 5_000
/** How long ACCESS GRANTED holds before the real page turns in. */
const SOLVED_HOLD_MS = 1100

type Run = Pick<BreachGameValue, 'picked' | 'cursor' | 'failure' | 'hurry'> & {
  phase: BreachPhase
}

const FRESH_RUN: Run = {
  picked: [],
  cursor: BREACH_START,
  phase: 'ready',
  failure: null,
  hurry: false,
}

type BreachGameProviderProps = {
  /** Stable per gate, so the puzzle is tied to the route being breached. */
  seed: string
  onSolved: () => void
  children: ReactNode
}

export const BreachGameProvider = ({
  seed,
  onSolved,
  children,
}: BreachGameProviderProps) => {
  const { viewMode } = useReader()
  // Fixed for the life of the screen: a rotation mid-run must not swap the grid under the reader.
  const [difficulty] = useState(() => DIFFICULTY[viewMode])
  const [attempt, setAttempt] = useState(0)
  const [nonce, setNonce] = useState(() => Date.now())
  const [run, setRun] = useState<Run>(FRESH_RUN)

  const puzzle = useMemo(
    () => buildBreachPuzzle(`${seed}:${attempt}:${nonce}`, difficulty),
    [seed, attempt, nonce, difficulty],
  )
  const { size } = puzzle

  const canPick = useCallback(
    (cell: number) =>
      (run.phase === 'ready' || run.phase === 'running') &&
      isPickable(size, run.cursor, run.picked, cell),
    [run, size],
  )

  const pick = useCallback(
    (cell: number) =>
      setRun((current) => {
        if (current.phase !== 'ready' && current.phase !== 'running') return current
        if (!isPickable(size, current.cursor, current.picked, cell)) return current
        const picked = [...current.picked, cell]
        const cursor = nextCursor(size, current.cursor, cell)
        const codes = picked.map((index) => puzzle.cells[index])
        if (hasSequence(codes, puzzle.sequence)) {
          return { ...current, picked, cursor, phase: 'solved' }
        }
        if (picked.length >= puzzle.buffer || !hasPickable(size, cursor, picked)) {
          return { ...current, picked, cursor, phase: 'failed', failure: 'buffer' }
        }
        return { ...current, picked, cursor, phase: 'running' }
      }),
    [puzzle, size],
  )

  const retry = useCallback(() => {
    setAttempt((value) => value + 1)
    setNonce(Date.now())
    setRun(FRESH_RUN)
  }, [])

  useEffect(() => {
    if (run.phase === 'running') {
      const hurry = window.setTimeout(
        () => setRun((current) => ({ ...current, hurry: true })),
        BREACH_TIME_MS - HURRY_MS,
      )
      const expire = window.setTimeout(
        () =>
          setRun((current) =>
            current.phase === 'running'
              ? { ...current, phase: 'failed', failure: 'timeout' }
              : current,
          ),
        BREACH_TIME_MS,
      )
      return () => {
        window.clearTimeout(hurry)
        window.clearTimeout(expire)
      }
    }
    if (run.phase === 'solved') {
      const timer = window.setTimeout(onSolved, SOLVED_HOLD_MS)
      return () => window.clearTimeout(timer)
    }
  }, [run.phase, onSolved])

  const value = useMemo<BreachGameValue>(
    () => ({
      puzzle,
      ...run,
      attempt,
      timeMs: BREACH_TIME_MS,
      hurryMs: HURRY_MS,
      canPick,
      pick,
      retry,
    }),
    [puzzle, run, attempt, canPick, pick, retry],
  )

  return <BreachGameContext value={value}>{children}</BreachGameContext>
}
