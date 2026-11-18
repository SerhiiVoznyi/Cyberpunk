import './collection-item.sass'

import { type ReactNode, Suspense } from 'react'

import { MobileHeader } from '@/components'
import type { CollectionItem, Shelf } from '@/content/collections'
import { cx } from '@/lib/cx'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'

import type { CollectionTheme } from '../collection-themes/collection-theme'
import { COLLECTION_THEMES } from '../collection-themes/collection-themes'
import { SignalLostMobile } from '../signal-lost/signal-lost.mobile'
import { ItemPlay } from './collection-item-sections'
import { type ItemPlayer, itemSheets } from './collection-item-sheets'
import { useShelfItem } from './use-shelf-item'

type CollectionItemMobileProps = {
  shelf: Shelf<CollectionItem>
  players?: Record<string, ItemPlayer>
}

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
    className={cx('collection-item', 'collection-item-m', theme.className)}>
    <Plate
      src={plate}
      depth={3}
      tone={theme.plateTone}
    />
    <theme.Backdrop decorated={false} />
    {children}
  </SheetScene>
)

export const CollectionItemMobile = ({ shelf, players }: CollectionItemMobileProps) => {
  const { spread, item, player } = useShelfItem(shelf, players)
  if (!spread || !item) return <SignalLostMobile />

  const theme = COLLECTION_THEMES[shelf.theme]
  const { Overview, Details, PlayFrame } = theme
  const plate = item.cover ?? shelf.plate
  const header = (
    <MobileHeader
      lines={[item.title]}
      kicker={`${spread.label} // ${item.status}`}
      clamp={2}
    />
  )
  const sheets = itemSheets(Boolean(player), theme.sheets)
  const itemProps = { item, spread, player, decorated: false }
  const play = player && <ItemPlay player={player} />
  const bodies = {
    play: PlayFrame ? <PlayFrame>{play}</PlayFrame> : play,
    overview: <Overview {...itemProps} />,
    details: <Details {...itemProps} />,
  }

  const stack = (
    <SheetStackProvider initialOrder={sheets.map((sheet) => sheet.id)}>
      {header}
      <SheetStack
        label={`${item.title} sheets`}
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
      <Suspense fallback={header}>
        <player.Session>{stack}</player.Session>
      </Suspense>
    </Scene>
  )
}
