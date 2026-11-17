import { useEffect, useRef, useState } from 'react'

import { HazardRule } from '@/components'
import { BreachBoard, matchedCount, useBreachGame } from '@/lib/breach'

/** `decorated={false}` drops rules and other decoration, for layouts that spend no space on them. */
type SectionProps = { decorated?: boolean }

export const BreachProtocol = () => {
  const game = useBreachGame()
  const { puzzle, phase, picked, codes, attempt, canPick, pick, retry } = game
  const matrixRef = useRef<HTMLDivElement>(null)
  const retryRef = useRef<HTMLButtonElement>(null)
  const acted = useRef(false)
  // A pressed sequence code previews its twins until the next pick or a new matrix.
  const [preview, setPreview] = useState<{
    attempt: number
    picks: number
    code: string
  } | null>(null)
  const playing = phase === 'ready' || phase === 'running'
  const previewed =
    playing && preview?.attempt === attempt && preview.picks === picked.length
      ? preview.code
      : null
  // Without a preview, the code the buffer needs next lights its twins in the matrix.
  const target = playing
    ? (previewed ?? puzzle.sequence[matchedCount(codes, puzzle.sequence)])
    : null

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
    <BreachBoard
      {...game}
      target={target}
      previewed={previewed}
      controls={{
        canPick,
        onPick: (cell) => {
          acted.current = true
          pick(cell)
        },
        onPreview: (code) =>
          setPreview(previewed === code ? null : { attempt, picks: picked.length, code }),
        onRetry: () => {
          acted.current = true
          retry()
        },
      }}
      matrixRef={matrixRef}
      retryRef={retryRef}
    />
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
        the buffer&rsquo;s spare slots lining it up.
      </li>
      <li>
        Each pick switches direction: after a row, pick from the column through that code,
        then from the row through the next one, and so on.
      </li>
      <li>
        Picking the same code twice in a row takes no buffer slot, so a repeat lets you
        turn without spending one.
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
      Press a sequence code to light its twins in the matrix and plan a route before the
      clock starts. The clock starts on your first pick. New matrix rolls a fresh one at
      any time, and Retry does the same if the ICE holds.
    </p>
  </>
)
