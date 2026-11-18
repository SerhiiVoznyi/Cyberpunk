import './map.sass'

import { DisplayTitle, HazardRule } from '@/components'
import { PROFILE } from '@/content/profile'
import { CHAPTERS, formatSpreadNumber, type SpreadMeta, SPREADS } from '@/content/spreads'
import { type CSSVars } from '@/lib/cx'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'

import { BRIEFINGS } from '../briefings'
import { MapBackdrop } from './map-backdrop'
import { ChapterBriefing } from './map-sections'
import { SkillTree } from './skill-tree'

const spreadNumber = (chapter: SpreadMeta) =>
  formatSpreadNumber(SPREADS.findIndex((spread) => spread.id === chapter.id))

export const MapPage = () => (
  <SheetScene
    kind="map"
    className="map">
    <SheetStackProvider initialOrder={CHAPTERS.map((chapter) => chapter.id)}>
      <Plate
        src="/assets/art/map-netrunner.webp"
        focus="right center"
        depth={3}
        glitch
        className="map__plate">
        <MapBackdrop />
        <span
          className="map__shade"
          aria-hidden="true"
        />
        <SkillTree />
      </Plate>
      <div
        className="map__title layer"
        style={{ '--layer-depth': 1 } as CSSVars}>
        <p className="spread-kicker">Night file // {PROFILE.location}</p>
        <DisplayTitle
          lines={[PROFILE.firstName, PROFILE.lastName]}
          size="lg"
          spreadHeading
        />
        <HazardRule className="map__rule" />
        <p className="map__role">
          {PROFILE.role}
          <br />
          {PROFILE.title}
        </p>
      </div>
      <SheetStack
        label="Chapter briefings"
        region="map">
        {CHAPTERS.map((chapter, index) => (
          <Sheet
            key={chapter.id}
            id={chapter.id}
            index={index + 1}
            title={chapter.label}
            teaser={chapter.teaser}
            treatment="ink"
            edge="notched"
            aside={<>Spread {spreadNumber(chapter)}</>}>
            <ChapterBriefing chapter={chapter}>
              {BRIEFINGS[chapter.id]?.()}
            </ChapterBriefing>
          </Sheet>
        ))}
      </SheetStack>
    </SheetStackProvider>
  </SheetScene>
)
