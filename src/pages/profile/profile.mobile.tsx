import './profile.sass'
import './profile.mobile.sass'

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
  ProfileChannels,
  ProfileEducation,
  ProfileRole,
  ProfileSummary,
} from './profile-sections'
import { PROFILE_ORDER, PROFILE_SHEETS } from './profile-sheets'

export const ProfileMobile = () => (
  <SheetScene
    kind="art"
    className="profile profile-m">
    <SheetStackProvider initialOrder={PROFILE_ORDER}>
      <Plate
        src="/assets/art/city-plate-street.webp"
        depth={3}
        tone="dim"
      />
      <MobileHeader
        lines={['Profile']}
        kicker={PROFILE.handle}
      />
      <SheetStack label="Profile sheets">
        <Sheet {...PROFILE_SHEETS.summary}>
          <ProfileSummary decorated={false} />
        </Sheet>
        <Sheet {...PROFILE_SHEETS.role}>
          <ProfileRole decorated={false} />
        </Sheet>
        <Sheet {...PROFILE_SHEETS.education}>
          <ProfileEducation decorated={false} />
        </Sheet>
        <Sheet {...PROFILE_SHEETS.channels}>
          <ProfileChannels />
        </Sheet>
      </SheetStack>
    </SheetStackProvider>
  </SheetScene>
)
