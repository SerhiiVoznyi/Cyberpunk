import './journal.sass'

import { BackToMap, DisplayTitle } from '@/components'
import type { CSSVars } from '@/lib/cx'
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

export const JournalPage = () => {
  const manifest = getJournalManifest()
  const { query, update } = useJournalQuery()

  return (
    <SheetScene
      kind="paper"
      className="journal"
      overlay={<BackToMap className="spread-back" />}>
      <SheetStackProvider initialOrder={JOURNAL_ORDER}>
        <Plate
          src="/assets/art/city-plate-night.webp"
          depth={3}
          tone="dim"
        />
        <div
          className="journal__title layer"
          style={{ '--layer-depth': 1 } as CSSVars}>
          <DisplayTitle
            lines={['Journal']}
            size="lg"
            spreadHeading
          />
          <p className="spread-kicker">
            {formatCount(manifest.total)} filed // architecture · cloud · leadership
          </p>
        </div>
        <SheetStack
          label="Journal sheets"
          className="journal__stack">
          <Sheet
            {...JOURNAL_SHEETS.index}
            title={journalIndexTitle(query)}
            aside={<>{formatCount(manifest.total)} plates</>}>
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
