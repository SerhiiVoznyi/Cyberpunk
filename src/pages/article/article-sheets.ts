import type { SheetMeta } from '@/lib/sheet-stack'

/** The entry sheet's teaser is the post summary, supplied by the page. */
export const ARTICLE_SHEETS = {
  entry: { id: 'entry', index: 1, title: 'Entry' },
  metadata: {
    id: 'metadata',
    index: 2,
    title: 'Metadata',
    teaser: 'Filed, read time, frequencies',
    treatment: 'ink',
  },
  related: {
    id: 'related',
    index: 3,
    title: 'Related',
    teaser: 'More journal entries',
    treatment: 'yellow',
    edge: 'notched',
  },
} satisfies Record<string, SheetMeta>

export const ARTICLE_ORDER = Object.keys(ARTICLE_SHEETS)
