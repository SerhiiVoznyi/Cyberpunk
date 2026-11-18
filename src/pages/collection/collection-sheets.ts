import type { SheetMeta } from '@/lib/sheet-stack'

import type { SheetLook } from '../collection-themes/collection-theme'

type ListSheetId = 'index' | 'about'

/** The list spread's sheets, dressed by the chapter's theme. */
export const collectionSheets = (
  looks: Record<ListSheetId, SheetLook>,
): Record<ListSheetId, SheetMeta> => ({
  index: { ...looks.index, id: 'index', index: 1 },
  about: { ...looks.about, id: 'about', index: 2 },
})

export const COLLECTION_ORDER: ListSheetId[] = ['index', 'about']
