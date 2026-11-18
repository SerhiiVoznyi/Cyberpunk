import type { CollectionItem } from '@/content/collections'
import { formatSpreadNumber, type SpreadMeta, SPREADS } from '@/content/spreads'

/** `registry-pending` becomes `REGISTRY_PENDING.dmn`, unless the item sets its own codename. */
export const codenameOf = (item: CollectionItem, extension: string) =>
  item.codename ?? `${item.slug.toUpperCase().replace(/-/g, '_')}.${extension}`

export const spreadPosition = (spread: SpreadMeta) =>
  `${formatSpreadNumber(SPREADS.indexOf(spread))} of ${String(SPREADS.length).padStart(2, '0')}`

export const pad2 = (value: number) => String(value).padStart(2, '0')
