import type { SheetMeta } from '@/lib/sheet-stack'

/** The index sheet's title follows the query; see `journalIndexTitle`. */
export const JOURNAL_SHEETS = {
  index: {
    id: 'index',
    index: 1,
    title: 'Index',
    teaser: 'Search every entry, newest first',
  },
  frequencies: {
    id: 'frequencies',
    index: 2,
    title: 'Frequencies',
    teaser: 'Filter the index by tag',
    treatment: 'yellow',
    edge: 'notched',
  },
  archive: {
    id: 'archive',
    index: 3,
    title: 'Archive',
    teaser: 'Browse by year and month',
    treatment: 'ink',
  },
} satisfies Record<string, SheetMeta>

export const JOURNAL_ORDER = Object.keys(JOURNAL_SHEETS)
