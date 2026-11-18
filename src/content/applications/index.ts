import { byNewest, type Shelf } from '../collections'
import { REGISTRY_PENDING } from './registry-pending'

/** Every application, newest first. Add one file per application and list it here. */
export const APPLICATIONS = byNewest([REGISTRY_PENDING])

export const APPLICATIONS_SHELF: Shelf = {
  spreadId: 'applications',
  theme: 'blackwall',
  items: APPLICATIONS,
  noun: ['daemon', 'daemons'],
  kicker: 'Blackwall // daemon registry',
  plate: '/assets/art/blackwall-wall.webp',
  about: [
    'Behind the Blackwall every application I built runs as a daemon: designed, written and shipped end to end, outside the day job.',
    'Open a daemon to read its readme, its signature and the stack it runs on, then execute it from its links.',
  ],
  empty: 'No daemons uploaded yet.',
}
