import './collection-item.sass'

import { type ReactNode, Suspense } from 'react'

import { BackToMap, DisplayTitle } from '@/components'
import type { CollectionItem, Shelf } from '@/content/collections'
import { type CSSVars, cx } from '@/lib/cx'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'

import type { CollectionTheme } from '../collection-themes/collection-theme'
import { COLLECTION_THEMES } from '../collection-themes/collection-themes'
import { SignalLostPage } from '../signal-lost/signal-lost'
import { ItemPlay } from './collection-item-sections'
import { type ItemPlayer, itemSheets } from './collection-item-sheets'
import { useShelfItem } from './use-shelf-item'

type CollectionItemPageProps = {
  shelf: Shelf<CollectionItem>
  /** Playable items by slug; their pages open on a Play sheet. */
  players?: Record<string, ItemPlayer>
}

const ItemTitle = ({
  kicker,
  title,
  tone,
}: {
  kicker: string
  title: string
  tone: CollectionTheme['titleTone']
}) => (
  <div
    className="collection-item__title layer"
    style={{ '--layer-depth': 1 } as CSSVars}>
    <p className="spread-kicker collection-item__kicker">{kicker}</p>
    <DisplayTitle
      lines={[title]}
      size="md"
      tone={tone}
      spreadHeading
    />
  </div>
)

const Scene = ({
  plate,
  theme,
  children,
}: {
  plate: string
  theme: CollectionTheme
  children: ReactNode
}) => (
  <SheetScene
    kind="split"
    className={cx('collection-item', theme.className)}
    overlay={<BackToMap className="spread-back" />}>
    <Plate
      src={plate}
      depth={2}
      region="right"
      glitch
    />
    <theme.Backdrop />
    {children}
  </SheetScene>
)

export const CollectionItemPage = ({ shelf, players }: CollectionItemPageProps) => {
  const { spread, item, player } = useShelfItem(shelf, players)
  if (!spread || !item) return <SignalLostPage />

  const theme = COLLECTION_THEMES[shelf.theme]
  const { Overview, Details, PlayFrame } = theme
  const plate = item.cover ?? shelf.plate
  const kicker = `${spread.label} // ${item.status}`
  const sheets = itemSheets(Boolean(player), theme.sheets)
  const itemProps = { item, spread, player }
  const play = player && <ItemPlay player={player} />
  const bodies = {
    play: PlayFrame ? <PlayFrame>{play}</PlayFrame> : play,
    overview: <Overview {...itemProps} />,
    details: <Details {...itemProps} />,
  }

  const stack = (
    <SheetStackProvider initialOrder={sheets.map((sheet) => sheet.id)}>
      <ItemTitle
        kicker={kicker}
        title={item.title}
        tone={theme.titleTone}
      />
      <SheetStack
        label={`${item.title} sheets`}
        region="left"
        scrollDepth={!player}>
        {sheets.map((sheet) => (
          <Sheet
            key={sheet.id}
            {...sheet}>
            {bodies[sheet.id]}
          </Sheet>
        ))}
      </SheetStack>
    </SheetStackProvider>
  )

  if (!player) {
    return (
      <Scene
        plate={plate}
        theme={theme}>
        {stack}
      </Scene>
    )
  }

  return (
    <Scene
      plate={plate}
      theme={theme}>
      <Suspense
        fallback={
          <ItemTitle
            kicker={`${spread.label} // loading`}
            title={item.title}
            tone={theme.titleTone}
          />
        }>
        <player.Session>{stack}</player.Session>
      </Suspense>
    </Scene>
  )
}
