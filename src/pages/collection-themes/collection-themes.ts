import type { ShelfTheme } from '@/content/collections'

import { CabinetBackdrop } from './arcade/cabinet-backdrop'
import { CartridgeLabel, Instructions } from './arcade/cartridge-card'
import { CartridgeList } from './arcade/cartridge-list'
import { CrtScreen } from './arcade/crt-screen'
import { DaemonReadme, DaemonSignature } from './blackwall/daemon-dossier'
import { DaemonList } from './blackwall/daemon-list'
import { WallBackdrop } from './blackwall/wall-backdrop'
import type { CollectionTheme } from './collection-theme'

/** Every chapter theme by name; a `Shelf` picks one with `theme`. */
export const COLLECTION_THEMES: Record<ShelfTheme, CollectionTheme> = {
  blackwall: {
    className: 'theme-blackwall',
    titleTone: 'red',
    plateTone: 'dim',
    Backdrop: WallBackdrop,
    Index: DaemonList,
    Overview: DaemonReadme,
    Details: DaemonSignature,
    sheets: {
      index: {
        title: 'Daemons',
        teaser: 'Every daemon, newest first',
        treatment: 'ink',
        edge: 'notched',
      },
      about: {
        title: 'Protocol',
        teaser: 'What runs behind the wall',
        treatment: 'ink',
      },
      play: {
        title: 'Run',
        teaser: 'Execute the daemon',
        treatment: 'ink',
        edge: 'notched',
      },
      overview: {
        title: 'Readme',
        teaser: 'What it does',
        treatment: 'ink',
        edge: 'notched',
      },
      details: {
        title: 'Signature',
        teaser: 'State, RAM, stack, links',
        treatment: 'ink',
      },
    },
  },
  arcade: {
    className: 'theme-arcade',
    titleTone: 'yellow',
    plateTone: 'color',
    Backdrop: CabinetBackdrop,
    Index: CartridgeList,
    Overview: Instructions,
    Details: CartridgeLabel,
    PlayFrame: CrtScreen,
    sheets: {
      index: {
        title: 'Select game',
        teaser: 'Press start',
        treatment: 'ink',
        edge: 'notched',
      },
      about: {
        title: 'Attract mode',
        teaser: 'What is in the cabinet',
        treatment: 'ink',
      },
      play: { title: 'Play', teaser: 'Press start', treatment: 'ink', edge: 'notched' },
      overview: {
        title: 'Instructions',
        teaser: 'How to play',
        treatment: 'ink',
      },
      details: {
        title: 'Cartridge',
        teaser: 'Status, release, links',
        treatment: 'ink',
      },
    },
  },
}
