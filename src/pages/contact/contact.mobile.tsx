import './contact.sass'
import './contact.mobile.sass'

import { MobileHeader } from '@/components'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'

import { ContactChannels, ContactSignal } from './contact-sections'
import { CONTACT_ORDER, CONTACT_SHEETS } from './contact-sheets'

export const ContactMobile = () => (
  <SheetScene
    kind="split"
    className="contact contact-m">
    <SheetStackProvider initialOrder={CONTACT_ORDER}>
      <Plate
        src="/assets/art/city-plate-street.webp"
        depth={3}
        tone="dim"
      />
      <MobileHeader
        lines={['Contact']}
        kicker="Open a channel"
      />
      <SheetStack label="Contact sheets">
        <Sheet {...CONTACT_SHEETS.channels}>
          <ContactChannels decorated={false} />
        </Sheet>
        <Sheet {...CONTACT_SHEETS.signal}>
          <ContactSignal decorated={false} />
        </Sheet>
      </SheetStack>
    </SheetStackProvider>
  </SheetScene>
)
