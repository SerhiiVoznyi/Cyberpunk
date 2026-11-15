import './experience.sass'

import { BackToMap, Decal, DisplayTitle } from '@/components'
import { PROFILE } from '@/content/profile'
import type { CSSVars } from '@/lib/cx'
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

export const ExperiencePage = () => (
  <SheetScene
    kind="split"
    className="experience"
    overlay={<BackToMap className="spread-back" />}>
    <SheetStackProvider initialOrder={EXPERIENCE_ORDER}>
      <Plate
        src="/assets/art/server-hall.webp"
        depth={2}
        region="right"
        glitch
        caption="Plate // Where the systems live"
      />
      <Decal
        src="/assets/art/logo-serpent-s.webp"
        className="experience__decal"
      />
      <div
        className="experience__title layer"
        style={{ '--layer-depth': 1 } as CSSVars}>
        <p className="spread-kicker">Experience // {PROFILE.experience} in the field</p>
        <DisplayTitle
          lines={['Experience']}
          size="lg"
          spreadHeading
        />
      </div>
      <SheetStack
        label="Experience sheets"
        region="left">
        <Sheet {...EXPERIENCE_SHEETS.career}>
          <ExperienceCareer />
        </Sheet>
        <Sheet {...EXPERIENCE_SHEETS.projects}>
          <ExperienceProjects />
        </Sheet>
        <Sheet {...EXPERIENCE_SHEETS.impact}>
          <ExperienceImpact />
        </Sheet>
        <Sheet {...EXPERIENCE_SHEETS.stack}>
          <ExperienceStack />
        </Sheet>
      </SheetStack>
    </SheetStackProvider>
  </SheetScene>
)
