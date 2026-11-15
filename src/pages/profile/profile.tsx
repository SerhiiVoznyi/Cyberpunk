import './profile.sass'

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
  ProfileChannels,
  ProfileEducation,
  ProfileRole,
  ProfileSummary,
} from './profile-sections'
import { PROFILE_ORDER, PROFILE_SHEETS } from './profile-sheets'

export const ProfilePage = () => (
  <SheetScene
    kind="art"
    className="profile"
    overlay={<BackToMap className="spread-back" />}>
    <SheetStackProvider initialOrder={PROFILE_ORDER}>
      <Plate
        src="/assets/art/city-plate-street.webp"
        depth={3}
        tone="dim"
      />
      <Plate
        src="/assets/art/profile-figure.webp"
        depth={1}
        region="figure"
        glitch
        caption={`Subject // ${PROFILE.name}`}
        className="profile__figure"
      />
      <Decal
        src="/assets/art/logo-serpent-s.webp"
        className="profile__decal"
        rotate={14}
      />
      <div
        className="profile__title layer"
        style={{ '--layer-depth': 1 } as CSSVars}>
        <p className="spread-kicker">Subject file // {PROFILE.handle}</p>
        <DisplayTitle
          lines={['Profile']}
          size="lg"
          spreadHeading
        />
      </div>
      <SheetStack
        label="Profile sheets"
        className="profile__stack">
        <Sheet {...PROFILE_SHEETS.summary}>
          <ProfileSummary />
        </Sheet>
        <Sheet {...PROFILE_SHEETS.role}>
          <ProfileRole />
        </Sheet>
        <Sheet {...PROFILE_SHEETS.education}>
          <ProfileEducation />
        </Sheet>
        <Sheet {...PROFILE_SHEETS.channels}>
          <ProfileChannels />
        </Sheet>
      </SheetStack>
    </SheetStackProvider>
  </SheetScene>
)
