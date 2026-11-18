import './breach-protocol-game.sass'

import type { ReactNode } from 'react'

import {
  BreachGameProvider,
  BreachProtocol,
  BreachRules,
  useBreachGame,
} from '@/lib/breach'

const SEED = 'game:breach-protocol'

// Free play never unlocks a route, so a solved run only waits for the next one.
const ignoreSolved = () => undefined

/** Holds the run above the sheet stack, so it survives the Play sheet being stacked. */
export const BreachProtocolSession = ({ children }: { children: ReactNode }) => (
  <BreachGameProvider
    seed={SEED}
    onSolved={ignoreSolved}>
    {children}
  </BreachGameProvider>
)

export const BreachProtocolPlay = () => {
  const { phase, retry } = useBreachGame()

  return (
    <div className="breach-protocol-game">
      <BreachProtocol />
      {phase === 'solved' && (
        <button
          type="button"
          className="breach-game__retry breach-protocol-game__again"
          onClick={retry}>
          Play again <span aria-hidden="true">// new matrix</span>
        </button>
      )}
    </div>
  )
}

export const BreachProtocolManual = () => (
  <>
    <p className="sheet-text sheet-text--lead">
      Land the target sequence in the buffer before it fills or the clock runs out.
    </p>
    <BreachRules />
    <p className="sheet-text">
      Press a sequence code to light its twins in the matrix and plan a route before the
      clock starts. New matrix rolls a fresh one at any time.
    </p>
  </>
)
