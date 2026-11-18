import {
  formatCount,
  formatPostDate,
  getJournalManifest,
  type PostSummary,
} from '@/services'

import { type PerkIcon, perkIconUrl } from './perks'
import {
  type ChapterPerk,
  entryPath,
  formatSpreadNumber,
  JOURNAL_INDEX,
  type SpreadMeta,
  SPREADS,
} from './spreads'

export { type PerkIcon, perkIconUrl }

/** One stop of the website map: every spread, plus the newest entries. */
export type SiteStop = {
  id: string
  kind: 'root' | 'chapter' | 'entry'
  /** The spread number for chapters, the filing position for entries. */
  number: string
  spread: SpreadMeta
  /** 0 is the Map itself, 1 the chapters it opens, 2 the chapters and entries filed under those. */
  tier: 0 | 1 | 2
  parent: string | null
  icon: PerkIcon
  place: string
}

/** The map shows the newest entry; the Archive chapter opens the whole journal. */
export const LATEST_ON_MAP = 1

const entrySpread = (post: PostSummary): SpreadMeta => ({
  id: `post:${post.slug}`,
  path: entryPath(post.slug),
  label: post.title,
  chapter: 'Journal',
  kind: 'split',
  teaser: post.summary,
  date: post.date,
})

const journalStops = (journal: SpreadMeta): SiteStop[] =>
  getJournalManifest()
    .latest.slice(0, LATEST_ON_MAP)
    .map((post) => ({
      id: `post:${post.slug}`,
      kind: 'entry',
      number: `#${formatCount(post.position)}`,
      spread: entrySpread(post),
      tier: 2,
      parent: journal.id,
      icon: 'entry',
      place: `Filed ${formatPostDate(post.date)}`,
    }))

const chapterStop = (
  spread: SpreadMeta,
  number: string,
  perk: ChapterPerk,
): SiteStop => ({
  id: spread.id,
  kind: 'chapter',
  number,
  spread,
  tier: spread.parent ? 2 : 1,
  parent: spread.parent ?? 'map',
  icon: perk.icon,
  place: perk.place,
})

// Reading order: the Map, then the chapters, with the Archive's entries right after it.
const buildRoute = (): SiteStop[] =>
  SPREADS.flatMap((spread, index): SiteStop[] => {
    const number = formatSpreadNumber(index)
    if (spread.path === '/') {
      return [
        {
          id: spread.id,
          kind: 'root',
          number,
          spread,
          tier: 0,
          parent: null,
          icon: 'map',
          place: 'You are here',
        },
      ]
    }
    if (!spread.perk) return []
    const stop = chapterStop(spread, number, spread.perk)
    return index === JOURNAL_INDEX ? [stop, ...journalStops(spread)] : [stop]
  })

/** Every stop in reading order; the board, the drawer list, the counter and prev/next agree. */
export const SITE_ROUTE: readonly SiteStop[] = buildRoute()
