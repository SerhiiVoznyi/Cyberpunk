import type { ReactNode } from 'react'

import { APPLICATIONS_SHELF } from '@/content/applications'
import { GAMES_SHELF } from '@/content/games'

import { ArticlePage } from './article/article'
import { ArticleMobile } from './article/article.mobile'
import { CollectionPage } from './collection/collection'
import { CollectionMobile } from './collection/collection.mobile'
import { CollectionItemPage } from './collection-item/collection-item'
import { CollectionItemMobile } from './collection-item/collection-item.mobile'
import { ContactPage } from './contact/contact'
import { ContactMobile } from './contact/contact.mobile'
import { ExperiencePage } from './experience/experience'
import { ExperienceMobile } from './experience/experience.mobile'
import { GAME_PLAYERS } from './games/game-players'
import { JournalPage } from './journal/journal'
import { JournalMobile } from './journal/journal.mobile'
import { MapPage } from './map/map'
import { MapMobile } from './map/map.mobile'
import { ProfilePage } from './profile/profile'
import { ProfileMobile } from './profile/profile.mobile'

type Layouts = { desktop: ReactNode; mobile: ReactNode }

/** A spread's layouts, plus the layouts of its child pages (`<path>/:slug`) when it has them. */
export type SpreadPages = Layouts & { child?: Layouts }

/** Every spread in `SPREADS` by id; the router mounts each one at its path. */
export const SPREAD_PAGES: Record<string, SpreadPages> = {
  map: { desktop: <MapPage />, mobile: <MapMobile /> },
  profile: { desktop: <ProfilePage />, mobile: <ProfileMobile /> },
  experience: { desktop: <ExperiencePage />, mobile: <ExperienceMobile /> },
  applications: {
    desktop: <CollectionPage shelf={APPLICATIONS_SHELF} />,
    mobile: <CollectionMobile shelf={APPLICATIONS_SHELF} />,
    child: {
      desktop: <CollectionItemPage shelf={APPLICATIONS_SHELF} />,
      mobile: <CollectionItemMobile shelf={APPLICATIONS_SHELF} />,
    },
  },
  games: {
    desktop: <CollectionPage shelf={GAMES_SHELF} />,
    mobile: <CollectionMobile shelf={GAMES_SHELF} />,
    child: {
      desktop: (
        <CollectionItemPage
          shelf={GAMES_SHELF}
          players={GAME_PLAYERS}
        />
      ),
      mobile: (
        <CollectionItemMobile
          shelf={GAMES_SHELF}
          players={GAME_PLAYERS}
        />
      ),
    },
  },
  journal: {
    desktop: <JournalPage />,
    mobile: <JournalMobile />,
    child: { desktop: <ArticlePage />, mobile: <ArticleMobile /> },
  },
  contact: { desktop: <ContactPage />, mobile: <ContactMobile /> },
}
