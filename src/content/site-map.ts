import {
  formatCompactCount,
  formatCount,
  formatPostDate,
  getJournalManifest,
  type PostSummary,
} from '@/services'

import { entryPath, formatSpreadNumber, type SpreadMeta, SPREADS } from './spreads'

export type PerkIcon =
  | 'map'
  | 'profile'
  | 'experience'
  | 'journal'
  | 'contact'
  | 'entry'
  | 'archive'
  | 'locked'

/** Perk art is white line work on black, used as a luminance mask so each state tints it. */
export const perkIconUrl = (icon: PerkIcon) =>
  `url('/assets/art/perks/perk-${icon}.webp')`

/** One stop of the website map: every spread, plus the newest entries and the archive. */
export type SiteStop = {
  id: string
  kind: 'root' | 'chapter' | 'entry' | 'archive'
  /** The spread number for chapters, the filing position for entries. */
  number: string
  spread: SpreadMeta
  /** 0 is the Map itself, 1 the chapters, 2 the entries filed under the Journal. */
  tier: 0 | 1 | 2
  parent: string | null
  icon: PerkIcon
  place: string
}

/** The map shows the newest few entries; the Archive stop opens the whole journal. */
export const LATEST_ON_MAP = 3

const CHAPTER_STOPS: Record<string, { icon: PerkIcon; place: string }> = {
  profile: { icon: 'profile', place: 'Identity core' },
  experience: { icon: 'experience', place: 'Combat record' },
  journal: { icon: 'journal', place: 'Memory shards' },
  contact: { icon: 'contact', place: 'Open channel' },
}

const entrySpread = (post: PostSummary): SpreadMeta => ({
  id: `post:${post.slug}`,
  path: entryPath(post.slug),
  label: post.title,
  chapter: 'Journal',
  kind: 'split',
  teaser: post.summary,
  date: post.date,
})

const buildRoute = (): SiteStop[] => {
  const { latest, total } = getJournalManifest()
  const stops: SiteStop[] = []

  // Reading order: chapters, with the Journal's entries right after it.
  SPREADS.forEach((spread, index) => {
    const number = formatSpreadNumber(index)
    if (spread.path === '/') {
      stops.push({
        id: spread.id,
        kind: 'root',
        number,
        spread,
        tier: 0,
        parent: null,
        icon: 'map',
        place: 'You are here',
      })
      return
    }

    const chapter = CHAPTER_STOPS[spread.id]
    if (!chapter) return
    stops.push({
      id: spread.id,
      kind: 'chapter',
      number,
      spread,
      tier: 1,
      parent: 'map',
      icon: chapter.icon,
      place: chapter.place,
    })

    if (spread.id !== 'journal') return
    latest.slice(0, LATEST_ON_MAP).forEach((post) => {
      stops.push({
        id: `post:${post.slug}`,
        kind: 'entry',
        number: `#${formatCount(post.position)}`,
        spread: entrySpread(post),
        tier: 2,
        parent: 'journal',
        icon: 'entry',
        place: `Filed ${formatPostDate(post.date)}`,
      })
    })
    if (total > 0) {
      stops.push({
        id: 'archive',
        kind: 'archive',
        number: formatCompactCount(total),
        spread: {
          id: 'archive',
          path: spread.path,
          label: 'Archive',
          chapter: 'Journal',
          kind: 'paper',
          teaser: `All ${formatCount(total)} entries: search, filter by tag, browse by month.`,
        },
        tier: 2,
        parent: 'journal',
        icon: 'archive',
        place: `${formatCount(total)} entries filed`,
      })
    }
  })

  return stops
}

/** Every stop in reading order; the board, the drawer list, the counter and prev/next agree. */
export const SITE_ROUTE: readonly SiteStop[] = buildRoute()
