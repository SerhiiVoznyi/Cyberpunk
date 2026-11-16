import './breach-overlay.sass'

import { useMemo } from 'react'

import { findSpreadIndex, SPREADS } from '@/content/spreads'

import type { CSSVars } from '../cx'
import { useReader, type ViewMode } from '../reader'
import { buildBreachCode } from './breach-code'

// Single view is a narrow portrait stage and phones are narrower still, so each carries less.
const MATRIX = {
  spread: { size: 8, steps: 7 },
  single: { size: 7, steps: 6 },
  phone: { size: 6, steps: 5 },
} as const satisfies Record<ViewMode, { size: number; steps: number }>

type BreachOverlayProps = {
  /** The pathname being breached; seeds the matrix and names the target. */
  target: string
  onSkip: () => void
}

export const BreachOverlay = ({ target, onSkip }: BreachOverlayProps) => {
  const { viewMode } = useReader()
  const { size, steps } = MATRIX[viewMode]
  const { cells, path } = useMemo(
    () => buildBreachCode(target, size, steps),
    [target, size, steps],
  )
  const stepOf = new Map(path.map((cell, step) => [cell, step]))
  const label = SPREADS[findSpreadIndex(target)]?.label ?? 'Unknown'

  return (
    <div
      className="breach-overlay"
      data-view={viewMode}
      aria-hidden="true"
      onPointerDown={onSkip}
      style={
        {
          '--breach-size': size,
          '--breach-cells': size * size,
          '--breach-steps': path.length,
        } as CSSVars
      }>
      <div className="breach-overlay__console">
        <div className="breach-overlay__header">
          <span className="breach-overlay__title">Breach protocol</span>
          <span className="breach-overlay__target">
            ICE // <strong>{label}</strong>
          </span>
        </div>
        <div className="breach-overlay__buffer">
          {path.map((cell, step) => (
            <span
              key={cell}
              className="breach-overlay__slot"
              style={{ '--step': step } as CSSVars}>
              {cells[cell]}
            </span>
          ))}
        </div>
        <div className="breach-overlay__matrix">
          <div className="breach-overlay__scans">
            {path.map((cell, step) => {
              const alongRow = step % 2 === 0
              return (
                <span
                  key={cell}
                  className="breach-overlay__scan"
                  style={
                    {
                      '--step': step,
                      gridRow: alongRow ? Math.floor(cell / size) + 1 : '1 / -1',
                      gridColumn: alongRow ? '1 / -1' : (cell % size) + 1,
                    } as CSSVars
                  }
                />
              )
            })}
          </div>
          <div className="breach-overlay__cells">
            {cells.map((code, index) => (
              <span
                key={index}
                className="breach-overlay__cell"
                data-solved={stepOf.has(index) ? '' : undefined}
                style={{ '--cell-index': index, '--step': stepOf.get(index) } as CSSVars}>
                {code}
              </span>
            ))}
          </div>
        </div>
        <div className="breach-overlay__timer">
          <span className="breach-overlay__timer-label">Breach time</span>
          <span className="breach-overlay__timer-track">
            <span className="breach-overlay__timer-bar" />
          </span>
        </div>
        <div className="breach-overlay__stamp">ICE broken // access granted</div>
      </div>
    </div>
  )
}
