import type { ReactNode } from 'react'

import { APPLICATIONS_SHELF } from '@/content/applications'
import { GAMES_SHELF } from '@/content/games'

import { CollectionBriefing } from './collection/collection-briefing'
import { ContactBriefing } from './contact/contact-briefing'
import { ExperienceBriefing } from './experience/experience-briefing'
import { JournalBriefing } from './journal/journal-briefing'
import { ProfileBriefing } from './profile/profile-briefing'

/** The body of each chapter's briefing sheet on the Map, by spread id. */
export const BRIEFINGS: Record<string, () => ReactNode> = {
  profile: () => <ProfileBriefing />,
  experience: () => <ExperienceBriefing />,
  applications: () => <CollectionBriefing shelf={APPLICATIONS_SHELF} />,
  games: () => <CollectionBriefing shelf={GAMES_SHELF} />,
  journal: () => <JournalBriefing />,
  contact: () => <ContactBriefing />,
}
