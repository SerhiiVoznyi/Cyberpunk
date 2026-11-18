import './collection.sass'

import { BackToMap, DisplayTitle } from '@/components'
import { countOf, type Shelf } from '@/content/collections'
import { spreadById } from '@/content/spreads'
import { type CSSVars, cx } from '@/lib/cx'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'

import { COLLECTION_THEMES } from '../collection-themes/collection-themes'
import { SignalLostPage } from '../signal-lost/signal-lost'
import { CollectionAbout } from './collection-sections'
import { COLLECTION_ORDER, collectionSheets } from './collection-sheets'

/** The list spread of a collection chapter, dressed in the chapter's theme. */
export const CollectionPage = ({ shelf }: { shelf: Shelf }) => {
  const spread = spreadById(shelf.spreadId)
  if (!spread) return <SignalLostPage />

  const theme = COLLECTION_THEMES[shelf.theme]
  const sheets = collectionSheets(theme.sheets)
  const { Backdrop, Index } = theme

  return (
    <SheetScene
      kind="paper"
      className={cx('collection', theme.className)}
      overlay={<BackToMap className="spread-back" />}>
      <SheetStackProvider initialOrder={COLLECTION_ORDER}>
        <Plate
          src={shelf.plate}
          depth={3}
          tone={theme.plateTone}
        />
        <Backdrop />
        <div
          className="collection__title layer"
          style={{ '--layer-depth': 1 } as CSSVars}>
          <DisplayTitle
            lines={[spread.label]}
            size="lg"
            tone={theme.titleTone}
            spreadHeading
          />
          <p className="spread-kicker collection__kicker">{shelf.kicker}</p>
        </div>
        <SheetStack
          label={`${spread.label} sheets`}
          className="collection__stack">
          <Sheet
            {...sheets.index}
            aside={<>{countOf(shelf)}</>}>
            <Index
              shelf={shelf}
              spread={spread}
            />
          </Sheet>
          <Sheet {...sheets.about}>
            <CollectionAbout
              shelf={shelf}
              spread={spread}
            />
          </Sheet>
        </SheetStack>
      </SheetStackProvider>
    </SheetScene>
  )
}
