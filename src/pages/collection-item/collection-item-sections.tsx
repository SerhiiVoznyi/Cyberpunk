import { Suspense } from 'react'

import type { ItemPlayer } from './collection-item-sheets'

const Booting = () => (
  <p
    className="sheet-text collection-item__booting"
    role="status">
    Booting the run…
  </p>
)

export const ItemPlay = ({ player }: { player: ItemPlayer }) => (
  <Suspense fallback={<Booting />}>
    <player.Play />
  </Suspense>
)

/** The player's own how-to, for themes that show it; nothing when the item has none. */
export const ItemManual = ({ player }: { player: ItemPlayer | null }) =>
  player?.Manual ? (
    <Suspense fallback={null}>
      <player.Manual />
    </Suspense>
  ) : null
