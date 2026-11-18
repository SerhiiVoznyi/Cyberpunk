import type { ComponentType, LazyExoticComponent, ReactNode } from 'react'

import type { SheetMeta } from '@/lib/sheet-stack'

import type { SheetLook } from '../collection-themes/collection-theme'

/** The playable part of an item, loaded on demand. */
export type ItemPlayer = {
  /** Wraps the whole sheet stack, so a run survives its Play sheet being stacked. */
  Session: LazyExoticComponent<ComponentType<{ children: ReactNode }>>
  Play: LazyExoticComponent<ComponentType>
  /** How to play, shown in the Overview sheet. */
  Manual?: LazyExoticComponent<ComponentType>
}

export type ItemSheetId = 'play' | 'overview' | 'details'

/** The item's sheets in their initial order; a playable item opens on its Play sheet. */
export const itemSheets = (
  playable: boolean,
  looks: Record<ItemSheetId, SheetLook>,
): (SheetMeta & { id: ItemSheetId })[] =>
  (playable
    ? (['play', 'overview', 'details'] as const)
    : (['overview', 'details'] as const)
  ).map((id, index) => ({ ...looks[id], id, index: index + 1 }))
