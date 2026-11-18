import './blackwall.sass'
import './blackwall.mobile.sass'

import { Plate } from '@/lib/sheet-stack'

/** The wall itself: code streams, a scan band and glitch slices over the plate. Decorative. */
export const WallBackdrop = ({ decorated = true }: { decorated?: boolean }) => (
  <Plate
    depth={2.5}
    className="wall-backdrop">
    <div
      className="wall-backdrop__fx"
      aria-hidden="true">
      <span className="wall-backdrop__streams" />
      {decorated && (
        <>
          <span className="wall-backdrop__scan" />
          <span className="wall-backdrop__slice" />
          <span className="wall-backdrop__slice wall-backdrop__slice--late" />
        </>
      )}
      <span className="wall-backdrop__vignette" />
    </div>
  </Plate>
)
