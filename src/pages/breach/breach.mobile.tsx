import './breach.sass'
import './breach.mobile.sass'

import { useCallback } from 'react'

import { MobileHeader } from '@/components'
import { BreachGameProvider } from '@/lib/breach'
import { useBreachGate } from '@/lib/reader'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'

import { BreachManual, BreachProtocol } from './breach-sections'
import { BREACH_ORDER, BREACH_SHEETS, breachTargetLabel } from './breach-sheets'

type BreachMobileProps = {
  rule: string
  pathname: string
}

export const BreachMobile = ({ rule, pathname }: BreachMobileProps) => {
  const { unlock } = useBreachGate()
  const onSolved = useCallback(() => unlock(rule), [unlock, rule])

  return (
    <SheetScene
      kind="split"
      className="breach breach-m">
      <BreachGameProvider
        seed={rule}
        onSolved={onSolved}>
        <SheetStackProvider initialOrder={BREACH_ORDER}>
          <Plate
            src="/assets/art/server-hall.webp"
            depth={3}
            tone="dim"
          />
          <MobileHeader
            lines={['Breach']}
            kicker={`ICE // ${breachTargetLabel(pathname)}`}
          />
          <SheetStack
            label="Breach sheets"
            scrollDepth={false}>
            <Sheet {...BREACH_SHEETS.protocol}>
              <BreachProtocol />
            </Sheet>
            <Sheet {...BREACH_SHEETS.manual}>
              <BreachManual decorated={false} />
            </Sheet>
          </SheetStack>
        </SheetStackProvider>
      </BreachGameProvider>
    </SheetScene>
  )
}
