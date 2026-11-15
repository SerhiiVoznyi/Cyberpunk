import './contact.sass'

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

import { ContactChannels, ContactSignal } from './contact-sections'
import { CONTACT_ORDER, CONTACT_SHEETS } from './contact-sheets'

export const ContactPage = () => (
  <SheetScene
    kind="split"
    className="contact"
    overlay={<BackToMap className="spread-back" />}>
    <SheetStackProvider initialOrder={CONTACT_ORDER}>
      <Plate
        src="/assets/art/city-plate-street.webp"
        depth={2}
        region="right"
        glitch
        caption={`Open relay // ${PROFILE.location}`}
      />
      <Decal
        src="/assets/art/logo-serpent-s.webp"
        className="contact__decal"
        rotate={10}
      />
      <div
        className="contact__title layer"
        style={{ '--layer-depth': 1 } as CSSVars}>
        <p className="spread-kicker">Contact // open a channel</p>
        <DisplayTitle
          lines={['Contact']}
          spreadHeading
        />
      </div>
      <SheetStack
        label="Contact sheets"
        region="left">
        <Sheet {...CONTACT_SHEETS.channels}>
          <ContactChannels />
        </Sheet>
        <Sheet {...CONTACT_SHEETS.signal}>
          <ContactSignal />
        </Sheet>
      </SheetStack>
    </SheetStackProvider>
  </SheetScene>
)
