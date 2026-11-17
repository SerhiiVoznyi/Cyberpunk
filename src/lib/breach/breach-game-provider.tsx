import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { BREACH_GAME } from '@/content/breach-game'

import { useReader } from '../reader'
import { buildBreachPuzzle } from './breach-code'
import { resolveBreachSettings } from './breach-config'
import {
  BreachGameContext,
  type BreachGameValue,
  type BreachPhase,
} from './breach-game-context'
import {
  BREACH_START,
  bufferCodes,
  hasPickable,
  hasSequence,
  isPickable,
  nextCursor,
} from './breach-rules'

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
  const [settings] = useState(() =>
    resolveBreachSettings(viewMode === 'phone' ? BREACH_GAME.phone : BREACH_GAME.desktop),
  )
  const { difficulty, timeMs, hurryMs, solvedHoldMs } = settings
  const [attempt, setAttempt] = useState(0)
  const [nonce, setNonce] = useState(() => Date.now())
  const [run, setRun] = useState<Run>(FRESH_RUN)

  const puzzle = useMemo(
    () => buildBreachPuzzle(`${seed}:${attempt}:${nonce}`, difficulty),
    [seed, attempt, nonce, difficulty],
  )
  const { size } = puzzle
  const codes = useMemo(() => bufferCodes(puzzle.cells, run.picked), [puzzle, run.picked])

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
        const buffered = bufferCodes(puzzle.cells, picked)
        if (hasSequence(buffered, puzzle.sequence)) {
          return { ...current, picked, cursor, phase: 'solved' }
        }
        if (buffered.length >= puzzle.buffer || !hasPickable(size, cursor, picked)) {
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
        timeMs - hurryMs,
      )
      const expire = window.setTimeout(
        () =>
          setRun((current) =>
            current.phase === 'running'
              ? { ...current, phase: 'failed', failure: 'timeout' }
              : current,
          ),
        timeMs,
      )
      return () => {
        window.clearTimeout(hurry)
        window.clearTimeout(expire)
      }
    }
    if (run.phase === 'solved') {
      const timer = window.setTimeout(onSolved, solvedHoldMs)
      return () => window.clearTimeout(timer)
    }
  }, [run.phase, onSolved, timeMs, hurryMs, solvedHoldMs])

  const value = useMemo<BreachGameValue>(
    () => ({
      puzzle,
      ...run,
      codes,
      attempt,
      timeMs,
      hurryMs,
      canPick,
      pick,
      retry,
    }),
    [puzzle, run, codes, attempt, timeMs, hurryMs, canPick, pick, retry],
  )

  return <BreachGameContext value={value}>{children}</BreachGameContext>
}
