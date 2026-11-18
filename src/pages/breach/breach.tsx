import './breach.sass'

import { useCallback } from 'react'

import { BackToMap, DisplayTitle } from '@/components'
import { BreachGameProvider, BreachProtocol } from '@/lib/breach'
import type { CSSVars } from '@/lib/cx'
import { useBreachGate } from '@/lib/reader'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'

import { BreachManual } from './breach-sections'
import { BREACH_ORDER, BREACH_SHEETS, breachTargetLabel } from './breach-sheets'

type BreachPageProps = {
  /** The protected-route rule this riddle opens. */
  rule: string
  /** The locked location, which the riddle stands in for. */
  pathname: string
}

export const BreachPage = ({ rule, pathname }: BreachPageProps) => {
  const { unlock } = useBreachGate()
  const onSolved = useCallback(() => unlock(rule), [unlock, rule])

  return (
    <SheetScene
      kind="split"
      className="breach"
      overlay={<BackToMap className="spread-back" />}>
      <BreachGameProvider
        seed={rule}
        onSolved={onSolved}>
        <SheetStackProvider initialOrder={BREACH_ORDER}>
          <Plate
            src="/assets/art/server-hall.webp"
            depth={2}
            region="right"
            tone="mono"
            glitch
            caption="ICE wall // restricted"
          />
          <div
            className="breach__title layer"
            style={{ '--layer-depth': 1 } as CSSVars}>
            <p className="spread-kicker spread-kicker--red">
              ICE <span aria-hidden="true">//</span> {breachTargetLabel(pathname)}
            </p>
            <DisplayTitle
              lines={['Breach']}
              spreadHeading
            />
          </div>
          <SheetStack
            label="Breach sheets"
            region="left"
            scrollDepth={false}>
            <Sheet {...BREACH_SHEETS.protocol}>
              <BreachProtocol />
            </Sheet>
            <Sheet {...BREACH_SHEETS.manual}>
              <BreachManual />
            </Sheet>
          </SheetStack>
        </SheetStackProvider>
      </BreachGameProvider>
    </SheetScene>
  )
}
