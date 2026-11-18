import type { CollectionItem } from '@/content/collections'

/** RAM slots in a daemon's cost readout. */
export const RAM_SLOTS = 8

const DAEMON_STATES: Record<string, string> = {
  live: 'Installed',
  beta: 'Uploading',
  archived: 'Dormant',
}

/** The daemon state for an item's status: Live installs, Beta uploads, Archived sleeps. */
export const daemonState = (status: string) =>
  DAEMON_STATES[status.toLowerCase()] ?? status

/** A daemon costs one RAM slot per technology in its stack. */
export const ramCost = (item: CollectionItem) =>
  Math.min(RAM_SLOTS, Math.max(1, item.stack.length))
