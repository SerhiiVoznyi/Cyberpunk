import './experience.sass'
import './experience.mobile.sass'

import { MobileHeader } from '@/components'
import { PROFILE } from '@/content/profile'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'

import {
  ExperienceCareer,
  ExperienceImpact,
  ExperienceProjects,
  ExperienceStack,
} from './experience-sections'
import { EXPERIENCE_ORDER, EXPERIENCE_SHEETS } from './experience-sheets'

export const ExperienceMobile = () => (
  <SheetScene
    kind="split"
    className="experience experience-m">
    <SheetStackProvider initialOrder={EXPERIENCE_ORDER}>
      <Plate
        src="/assets/art/server-hall.webp"
        depth={3}
        tone="dim"
      />
      <MobileHeader
        lines={['Experience']}
        kicker={PROFILE.experience}
      />
      <SheetStack label="Experience sheets">
        <Sheet {...EXPERIENCE_SHEETS.career}>
          <ExperienceCareer decorated={false} />
        </Sheet>
        <Sheet {...EXPERIENCE_SHEETS.projects}>
          <ExperienceProjects />
        </Sheet>
        <Sheet {...EXPERIENCE_SHEETS.impact}>
          <ExperienceImpact decorated={false} />
        </Sheet>
        <Sheet {...EXPERIENCE_SHEETS.stack}>
          <ExperienceStack decorated={false} />
        </Sheet>
      </SheetStack>
    </SheetStackProvider>
  </SheetScene>
)
