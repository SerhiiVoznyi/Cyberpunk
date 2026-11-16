import { entrySlugOf, findSpreadIndex, SPREADS } from '@/content/spreads'
import type { SheetMeta } from '@/lib/sheet-stack'

/** What the riddle stands in front of, for the kicker: a chapter, or an entry of the Journal. */
export const breachTargetLabel = (pathname: string) =>
  entrySlugOf(pathname) !== null
    ? 'Journal entry'
    : (SPREADS[findSpreadIndex(pathname)]?.label ?? 'Restricted file')

export const BREACH_SHEETS = {
  protocol: {
    id: 'protocol',
    index: 1,
    title: 'Breach protocol',
    teaser: 'Land the sequence to get in',
    treatment: 'ink',
    edge: 'notched',
  },
  manual: {
    id: 'manual',
    index: 2,
    title: 'How it works',
    teaser: 'Rows, columns, buffer',
    treatment: 'paper',
  },
} satisfies Record<string, SheetMeta>

export const BREACH_ORDER = Object.keys(BREACH_SHEETS)
