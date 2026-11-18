import { getJournalManifest, peekPost } from '@/services'

import { APPLICATIONS } from './applications'
import type { CollectionItem } from './collections'
import { GAMES } from './games'
import type { PerkIcon } from './perks'
import { STICKERS } from './stickers'

export type SpreadKind = 'map' | 'art' | 'paper' | 'split'

/** How a chapter shows on the Map: its perk, the place in its tooltip and its briefing sticker. */
export type ChapterPerk = {
  icon: PerkIcon
  place: string
  sticker?: string
}

/**
 * Where a chapter's perk sits on the board (500 units tall): a row of the chapter column, or a
 * free cell (`[x, y]`) beside its parent. A cell's wire may run along an outer `lane` (a board
 * `y` above or below every tile) so it never crosses another bundle.
 */
export type BoardSpot =
  { row: number } | { cell: readonly [number, number]; lane?: number }

/** Pages filed under a chapter at `<path>/:slug`, read between it and the next chapter. */
export type SpreadChildren = {
  /** Visits are logged as `<idPrefix>:<slug>`. */
  idPrefix: string
  /** Where a child sorts between its chapter (0) and the next chapter (1). */
  order: (slug: string) => number
  /** Child slugs in reading order, when they are known up front. */
  slugs?: () => readonly string[]
}

export type SpreadMeta = {
  id: string
  path: string
  label: string
  chapter: string
  kind: SpreadKind
  teaser: string
  /** Filing date, for journal entries shown alongside the chapters. */
  date?: string
  /** Set on chapters: a perk on the Map and a briefing sheet beside it. */
  perk?: ChapterPerk
  /** The chapter it opens from on the Map; the Map itself when unset. */
  parent?: string
  board?: BoardSpot
  children?: SpreadChildren
}

const collectionChildren = (
  idPrefix: string,
  items: readonly CollectionItem[],
): SpreadChildren => ({
  idPrefix,
  order: (slug) => {
    const index = items.findIndex((item) => item.slug === slug)
    return index < 0 ? 0.5 : (index + 1) / (items.length + 1)
  },
  slugs: () => items.map((item) => item.slug),
})

/** The chapters, in reading order. Child pages are read between their chapter and the next. */
export const SPREADS: readonly SpreadMeta[] = [
  {
    id: 'map',
    path: '/',
    label: 'Map',
    chapter: 'Map',
    kind: 'map',
    teaser: 'Every chapter of the file, one jump away.',
  },
  {
    id: 'profile',
    path: '/profile',
    label: 'Profile',
    chapter: 'Profile',
    kind: 'art',
    teaser: 'Who is behind the visor.',
    perk: { icon: 'profile', place: 'Identity core', sticker: STICKERS.terminal },
    board: { row: 96 },
  },
  {
    id: 'contact',
    path: '/contact',
    label: 'Contact',
    chapter: 'Contact',
    kind: 'split',
    teaser: 'Open a channel.',
    perk: { icon: 'contact', place: 'Open channel', sticker: STICKERS.antenna },
    parent: 'profile',
    board: { cell: [472, 96] },
  },
  {
    id: 'experience',
    path: '/experience',
    label: 'Experience',
    chapter: 'Experience',
    kind: 'split',
    teaser: 'What I build, and the stack I build it with.',
    perk: { icon: 'experience', place: 'Combat record', sticker: STICKERS.server },
    board: { row: 252 },
  },
  {
    id: 'applications',
    path: '/experience/applications',
    label: 'Applications',
    chapter: 'Applications',
    kind: 'paper',
    teaser: 'Software I designed, built and shipped.',
    perk: { icon: 'applications', place: 'Software foundry', sticker: STICKERS.cloud },
    parent: 'experience',
    board: { cell: [472, 200] },
    children: collectionChildren('applications', APPLICATIONS),
  },
  {
    id: 'games',
    path: '/experience/games',
    label: 'Games',
    chapter: 'Games',
    kind: 'paper',
    teaser: 'Small games you can play right here.',
    perk: { icon: 'games', place: 'Braindance arcade', sticker: STICKERS.chip },
    parent: 'experience',
    board: { cell: [472, 304] },
    children: collectionChildren('games', GAMES),
  },
  {
    id: 'journal',
    path: '/blog',
    label: 'Archive',
    chapter: 'Archive',
    kind: 'paper',
    teaser: 'Field notes on architecture, cloud and leadership.',
    perk: { icon: 'archive', place: 'Memory shards', sticker: STICKERS.nodes },
    board: { row: 408 },
    children: {
      idPrefix: 'post',
      // Entries sort newest first, so turning from one entry to an older one turns forward.
      order: (slug) => {
        const position = peekPost(slug)?.position
        return position ? position / (getJournalManifest().total + 1) : 0.5
      },
    },
  },
]

/** The chapters with a perk and a briefing on the Map, in reading order. */
export const CHAPTERS = SPREADS.filter((spread) => spread.perk)

export const spreadById = (id: string) => SPREADS.find((spread) => spread.id === id)

export const JOURNAL_INDEX = SPREADS.findIndex((spread) => spread.id === 'journal')

const normalize = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

export type SpreadChild = {
  spreadIndex: number
  spread: SpreadMeta & { children: SpreadChildren }
  slug: string
}

const hasChildren = (spread: SpreadMeta): spread is SpreadChild['spread'] =>
  Boolean(spread.children)

// The one path segment after a chapter's own path, or `null`.
const slugUnder = (spread: SpreadMeta, path: string) => {
  const rest = path.startsWith(`${spread.path}/`)
    ? path.slice(spread.path.length + 1)
    : ''
  return rest && !rest.includes('/') ? rest : null
}

/** The chapter and slug of a child page (`/blog/:slug`, `/experience/games/:slug`, …), or `null`. */
export const childOf = (pathname: string): SpreadChild | null => {
  const path = normalize(pathname)
  for (const [spreadIndex, spread] of SPREADS.entries()) {
    if (!hasChildren(spread)) continue
    const slug = slugUnder(spread, path)
    if (slug !== null) return { spreadIndex, spread, slug: decodeURIComponent(slug) }
  }
  return null
}

export const childPath = (spread: SpreadMeta, slug: string) =>
  `${spread.path}/${encodeURIComponent(slug)}`

/** The visit-log id of a child page. */
export const childVisitId = (spread: SpreadMeta, slug: string) =>
  `${spread.children?.idPrefix ?? spread.id}:${slug}`

/** The slug of a journal entry route, or `null` for any other path. */
export const entrySlugOf = (pathname: string) => {
  const child = childOf(pathname)
  return child?.spreadIndex === JOURNAL_INDEX ? child.slug : null
}

export const entryPath = (slug: string) => childPath(SPREADS[JOURNAL_INDEX], slug)

/** A plain reading view of an entry, outside the artbook and its reading order. */
export const READ_MODE_ROUTE = '/blog/:slug/read'

export const readModePath = (slug: string) => `${entryPath(slug)}/read`

/** Child pages belong to their chapter; the counter shows the chapter's number. */
export const findSpreadIndex = (pathname: string) =>
  childOf(pathname)?.spreadIndex ??
  SPREADS.findIndex((spread) => spread.path === normalize(pathname))

/**
 * A sortable reading position: child pages sit between their chapter and the next one, so
 * turning from one to the next turns the page forward.
 */
export const spreadOrder = (pathname: string) => {
  const child = childOf(pathname)
  if (child) return child.spreadIndex + child.spread.children.order(child.slug)
  return findSpreadIndex(pathname)
}

export const formatSpreadNumber = (index: number) =>
  index < 0 ? '--' : String(index + 1).padStart(2, '0')
