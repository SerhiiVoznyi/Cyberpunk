import { PROFILE } from '@/content/profile'
import type { SheetMeta } from '@/lib/sheet-stack'

export const CONTACT_SHEETS = {
  channels: {
    id: 'channels',
    index: 1,
    title: 'Channels',
    teaser: PROFILE.availability.status,
    treatment: 'yellow',
    edge: 'notched',
  },
  signal: {
    id: 'signal',
    index: 2,
    title: 'Signal',
    teaser: 'Status, base, time zone, languages',
    treatment: 'ink',
  },
} satisfies Record<string, SheetMeta>

export const CONTACT_ORDER = Object.keys(CONTACT_SHEETS)
