import './map.sass'
import './map.mobile.sass'

import { MobileHeader } from '@/components'
import { PROFILE } from '@/content/profile'
import { CHAPTERS } from '@/content/spreads'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'

import { ChapterBriefing } from './map-sections'

// The website map lives in the navigation drawer on phones, so the board is not drawn here.
export const MapMobile = () => (
  <SheetScene
    kind="map"
    className="map map-m">
    <SheetStackProvider initialOrder={CHAPTERS.map((chapter) => chapter.id)}>
      <Plate
        src="/assets/art/map-netrunner.webp"
        focus="right center"
        depth={3}
        tone="dim"
      />
      <MobileHeader
        lines={[PROFILE.name]}
        kicker={PROFILE.role}
      />
      <SheetStack label="Chapter briefings">
        {CHAPTERS.map((chapter, index) => (
          <Sheet
            key={chapter.id}
            id={chapter.id}
            index={index + 1}
            title={chapter.label}
            teaser={chapter.teaser}
            treatment="ink"
            edge="notched">
            <ChapterBriefing
              chapter={chapter}
              decorated={false}
            />
          </Sheet>
        ))}
      </SheetStack>
    </SheetStackProvider>
  </SheetScene>
)
