import './collection.sass'

import { MobileHeader } from '@/components'
import { countOf, type Shelf } from '@/content/collections'
import { spreadById } from '@/content/spreads'
import { cx } from '@/lib/cx'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'

import { COLLECTION_THEMES } from '../collection-themes/collection-themes'
import { SignalLostMobile } from '../signal-lost/signal-lost.mobile'
import { CollectionAbout } from './collection-sections'
import { COLLECTION_ORDER, collectionSheets } from './collection-sheets'

export const CollectionMobile = ({ shelf }: { shelf: Shelf }) => {
  const spread = spreadById(shelf.spreadId)
  if (!spread) return <SignalLostMobile />

  const theme = COLLECTION_THEMES[shelf.theme]
  const sheets = collectionSheets(theme.sheets)
  const { Backdrop, Index } = theme

  return (
    <SheetScene
      kind="paper"
      className={cx('collection', 'collection-m', theme.className)}>
      <SheetStackProvider initialOrder={COLLECTION_ORDER}>
        <Plate
          src={shelf.plate}
          depth={3}
          tone={theme.plateTone}
        />
        <Backdrop decorated={false} />
        <MobileHeader
          lines={[spread.label]}
          kicker={countOf(shelf)}
        />
        <SheetStack label={`${spread.label} sheets`}>
          <Sheet {...sheets.index}>
            <Index
              shelf={shelf}
              spread={spread}
              decorated={false}
            />
          </Sheet>
          <Sheet {...sheets.about}>
            <CollectionAbout
              shelf={shelf}
              spread={spread}
              decorated={false}
            />
          </Sheet>
        </SheetStack>
      </SheetStackProvider>
    </SheetScene>
  )
}
