import './nav-drawer.sass'

import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { Link, useLocation } from 'react-router-dom'

import { PROFILE } from '@/content/profile'
import { useSpreadNavigation } from '@/lib/reader'

import { DisplayTitle } from '../display-title/display-title'
import { FxToggle } from '../fx-toggle/fx-toggle'
import { HudButton } from '../hud-button/hud-button'
import { SiteMapList } from './site-map-list'
import { SoundtrackControls } from './soundtrack-controls'
import { SpreadCounter } from './spread-counter'

/** Phone chrome: the top bar, spread pagination, soundtrack and website map in one left drawer. */
export const NavDrawer = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()
  const { pathname } = useLocation()
  const { spread } = useSpreadNavigation()

  const open = () => {
    dialogRef.current?.showModal()
    setIsOpen(true)
  }

  const close = () => dialogRef.current?.close()

  // Any navigation, from a link, the counter or Back, lands on a new spread with the drawer shut.
  useEffect(() => {
    dialogRef.current?.close()
  }, [pathname])

  // A click on the dialog itself landed on the backdrop; a link to the spread already on screen
  // changes no path, so it closes the drawer here.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target as Element
    if (target === event.currentTarget || target.closest('a[href]')) close()
  }

  // Keeps reader hotkeys (arrows turn pages, Escape opens the map) from firing behind the modal.
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    event.stopPropagation()
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  return (
    <>
      <div className="nav-drawer-trigger">
        <HudButton
          icon="la-bars"
          label="Open navigation"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={open}
        />
      </div>
      <dialog
        ref={dialogRef}
        className="nav-drawer"
        aria-labelledby={titleId}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onClose={() => setIsOpen(false)}>
        <div className="nav-drawer__body">
          <header className="nav-drawer__header">
            <Link
              to="/"
              className="nav-drawer__wordmark"
              aria-label={`${PROFILE.name}, back to the map`}>
              <DisplayTitle
                lines={[PROFILE.name]}
                level="none"
                size="md"
                tone="yellow"
              />
            </Link>
            <FxToggle />
            <HudButton
              icon="la-times"
              label="Close navigation"
              onClick={close}
            />
          </header>
          <h2
            id={titleId}
            className="nav-drawer__kicker">
            Navigation <span aria-hidden="true">//</span>{' '}
            <span className="nav-drawer__chapter">{spread?.chapter ?? 'Unmapped'}</span>
          </h2>
          <SpreadCounter />
          <SiteMapList />
          <div className="nav-drawer__player">
            <SoundtrackControls />
          </div>
        </div>
      </dialog>
    </>
  )
}
