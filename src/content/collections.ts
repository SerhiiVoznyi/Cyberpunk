export type CollectionLink = {
  label: string
  href: string
  /** A Line Awesome class, such as `la-github`. */
  icon?: string
}

export type CollectionFact = {
  label: string
  value: string
}

export type CollectionSection = {
  title: string
  paragraphs: readonly string[]
}

/** One item of a collection chapter (an application, a game), with its own page at `/<chapter>/<slug>`. */
export type CollectionItem = {
  slug: string
  title: string
  summary: string
  /** ISO date the item shipped or was last updated; the list sorts newest first. */
  date: string
  /** A short state readout, such as `Live`, `Beta` or `Archived`. */
  status: string
  tags: readonly string[]
  stack: readonly string[]
  links: readonly CollectionLink[]
  /** Art plate for the detail spread; falls back to the chapter's plate. */
  cover?: string
  /** Display codename in themed lists, such as `NIGHT_FILE.dmn`; derived from the slug if unset. */
  codename?: string
  /** Short at-a-glance facts for list cards and the detail spread, such as players or length. */
  facts?: readonly CollectionFact[]
  sections: readonly CollectionSection[]
}

/** The visual world of a collection chapter's spreads; each has its own scoped styles. */
export type ShelfTheme = 'blackwall' | 'arcade'

/** A collection chapter: its items plus the copy and art of its list spread. */
export type Shelf<T extends CollectionItem = CollectionItem> = {
  /** The id of the chapter in `SPREADS`. */
  spreadId: string
  theme: ShelfTheme
  items: readonly T[]
  /** Singular and plural nouns for counts: `1 application`, `3 applications`. */
  noun: readonly [string, string]
  kicker: string
  plate: string
  /** The list spread's "about" sheet. */
  about: readonly string[]
  /** Shown when the collection has no items yet. */
  empty: string
}

export const countOf = (shelf: Shelf, count = shelf.items.length) =>
  `${count} ${shelf.noun[count === 1 ? 0 : 1]}`

export const byNewest = <T extends CollectionItem>(items: readonly T[]): readonly T[] =>
  [...items].sort((a, b) => b.date.localeCompare(a.date))

/** The item with this slug, or `undefined`. */
export const findItem = <T extends CollectionItem>(items: readonly T[], slug: string) =>
  items.find((item) => item.slug === slug)
