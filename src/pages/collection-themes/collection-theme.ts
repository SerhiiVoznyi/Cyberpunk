import type { ComponentType, ReactNode } from 'react'

import type { CollectionItem, Shelf } from '@/content/collections'
import type { SpreadMeta } from '@/content/spreads'
import type { SheetMeta } from '@/lib/sheet-stack'

import type { ItemPlayer } from '../collection-item/collection-item-sheets'

/** `decorated={false}` drops heavy decoration, for layouts that spend no space on it. */
export type ThemeListProps = { shelf: Shelf; spread: SpreadMeta; decorated?: boolean }

export type ThemeItemProps = {
  item: CollectionItem
  spread: SpreadMeta
  player: ItemPlayer | null
  decorated?: boolean
}

export type ThemeSheet = 'index' | 'about' | 'play' | 'overview' | 'details'

/** How a theme dresses a sheet: its title and teaser, plus the treatment its styles hook onto. */
export type SheetLook = Pick<SheetMeta, 'title' | 'teaser' | 'treatment' | 'edge'>

/** The visual world of a collection chapter, shared by its list spread and its item spreads. */
export type CollectionTheme = {
  /** Scene root class; every rule of the theme is scoped under it. */
  className: string
  titleTone: 'yellow' | 'red'
  /** How the chapter's art plate is toned: full colour, or dimmed behind busier effects. */
  plateTone: 'color' | 'dim'
  /** An `aria-hidden` effect layer between the plate and the sheets. */
  Backdrop: ComponentType<{ decorated?: boolean }>
  Index: ComponentType<ThemeListProps>
  Overview: ComponentType<ThemeItemProps>
  Details: ComponentType<ThemeItemProps>
  /** Wraps the Play sheet's body. */
  PlayFrame?: ComponentType<{ children: ReactNode }>
  sheets: Record<ThemeSheet, SheetLook>
}
