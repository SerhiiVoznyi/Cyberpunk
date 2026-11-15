import './journal.sass'
import './journal.mobile.sass'

import { MobileHeader } from '@/components'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'
import { formatCount, getJournalManifest } from '@/services'

import { journalIndexTitle, useJournalQuery } from './journal-query'
import { ArchiveTree, FrequencyTuner, IndexSheet } from './journal-sections'
import { JOURNAL_ORDER, JOURNAL_SHEETS } from './journal-sheets'

export const JournalMobile = () => {
  const manifest = getJournalManifest()
  const { query, update } = useJournalQuery()

  return (
    <SheetScene
      kind="paper"
      className="journal journal-m">
      <SheetStackProvider initialOrder={JOURNAL_ORDER}>
        <Plate
          src="/assets/art/city-plate-night.webp"
          depth={3}
          tone="dim"
        />
        <MobileHeader
          lines={['Journal']}
          kicker={`${formatCount(manifest.total)} filed`}
        />
        <SheetStack label="Journal sheets">
          <Sheet
            {...JOURNAL_SHEETS.index}
            title={journalIndexTitle(query)}>
            <IndexSheet
              query={query}
              update={update}
            />
          </Sheet>
          <Sheet {...JOURNAL_SHEETS.frequencies}>
            <FrequencyTuner
              active={query.tag}
              onSelect={(tag) => update({ tag, page: 1 })}
            />
          </Sheet>
          <Sheet {...JOURNAL_SHEETS.archive}>
            <ArchiveTree />
          </Sheet>
        </SheetStack>
      </SheetStackProvider>
    </SheetScene>
  )
}
