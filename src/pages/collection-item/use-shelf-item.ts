import { useParams } from 'react-router-dom'

import { type CollectionItem, findItem, type Shelf } from '@/content/collections'
import { spreadById } from '@/content/spreads'

import type { ItemPlayer } from './collection-item-sheets'

/** The item at the current `/:slug`, its chapter and its player, or nulls for an unknown slug. */
export const useShelfItem = <T extends CollectionItem>(
  shelf: Shelf<T>,
  players?: Record<string, ItemPlayer>,
) => {
  const { slug = '' } = useParams()
  const spread = spreadById(shelf.spreadId) ?? null
  const item = findItem(shelf.items, slug) ?? null
  const player = (item && players?.[item.slug]) || null
  return { spread, item, player }
}
