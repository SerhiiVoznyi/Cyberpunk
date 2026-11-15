import './reader-shell.sass'

import type { ReactNode } from 'react'
import type { Location } from 'react-router-dom'

import { useReader, useRecordVisit } from '@/lib/reader'
import { SpreadTransition } from '@/lib/spread-transition'

import { BottomToolbar } from './bottom-toolbar'
import { NavDrawer } from './nav-drawer'
import { ReaderBleed } from './reader-bleed'
import { ReaderHotkeys } from './reader-hotkeys'
import { SpreadAnnouncer } from './spread-announcer'
import { SpreadStage } from './spread-stage'
import { TopBar } from './top-bar'

type ReaderShellProps = {
  renderSpread: (location: Location) => ReactNode
}

export const ReaderShell = ({ renderSpread }: ReaderShellProps) => {
  useRecordVisit()
  const { viewMode, isPhone } = useReader()

  return (
    <div
      className="reader"
      data-view={viewMode}>
      <a
        href="#main"
        className="reader__skip">
        Skip to spread
      </a>
      {isPhone ? <NavDrawer /> : <TopBar />}
      <main
        id="main"
        tabIndex={-1}
        className="reader__main">
        <SpreadStage>
          <SpreadTransition>{renderSpread}</SpreadTransition>
        </SpreadStage>
      </main>
      {!isPhone && (
        <>
          <ReaderBleed />
          <BottomToolbar />
        </>
      )}
      <SpreadAnnouncer />
      <ReaderHotkeys />
    </div>
  )
}
