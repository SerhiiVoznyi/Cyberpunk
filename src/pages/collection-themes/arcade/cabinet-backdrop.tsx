import './arcade.sass'
import './arcade.mobile.sass'

import { Plate } from '@/lib/sheet-stack'

import { PixelSprite } from './pixel-sprite'

/**
 * The cabinet around the stage: candy side art, a chasing-light marquee, a credits readout,
 * pixel sprites and CRT scanlines. Decorative.
 */
export const CabinetBackdrop = ({ decorated = true }: { decorated?: boolean }) => (
  <Plate
    depth={2.5}
    className="cabinet-backdrop">
    <div
      className="cabinet-backdrop__fx"
      aria-hidden="true">
      <span className="cabinet-backdrop__glow" />
      <span className="cabinet-backdrop__stars" />
      {decorated && (
        <>
          <span className="cabinet-backdrop__side cabinet-backdrop__side--left" />
          <span className="cabinet-backdrop__side cabinet-backdrop__side--right" />
          <span className="cabinet-backdrop__marquee">
            <span className="cabinet-backdrop__marquee-text">Insert coin</span>
          </span>
          <span className="cabinet-backdrop__credits">
            <span>1UP 000420</span>
            <span>Hi 133700</span>
            <span className="cabinet-backdrop__credit">Credit 99</span>
          </span>
          <span className="cabinet-backdrop__sprites">
            <PixelSprite
              name="invader"
              className="cabinet-backdrop__sprite cabinet-backdrop__sprite--a"
            />
            <PixelSprite
              name="invader"
              className="cabinet-backdrop__sprite cabinet-backdrop__sprite--b"
            />
            <PixelSprite
              name="ghost"
              className="cabinet-backdrop__sprite cabinet-backdrop__sprite--c"
            />
            <PixelSprite
              name="heart"
              className="cabinet-backdrop__sprite cabinet-backdrop__sprite--d"
            />
            <PixelSprite
              name="coin"
              className="cabinet-backdrop__sprite cabinet-backdrop__sprite--e"
            />
          </span>
          <span className="cabinet-backdrop__runner">
            <span className="cabinet-backdrop__chomper" />
            <span className="cabinet-backdrop__dots" />
          </span>
        </>
      )}
      <span className="cabinet-backdrop__scanlines" />
    </div>
  </Plate>
)
