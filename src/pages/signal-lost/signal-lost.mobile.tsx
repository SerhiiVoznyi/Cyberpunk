import './signal-lost.sass'
import './signal-lost.mobile.sass'

import { useLocation } from 'react-router-dom'

import { CyanPill, GlitchText, HazardRule } from '@/components'
import type { CSSVars } from '@/lib/cx'
import { Plate, SheetScene } from '@/lib/sheet-stack'

export const SignalLostMobile = () => {
  const { pathname } = useLocation()

  return (
    <SheetScene
      kind="art"
      className="signal-lost signal-lost-m">
      <Plate
        src="/assets/art/city-plate-night.webp"
        depth={3}
        tone="mono"
        className="signal-lost__plate"
      />
      <div
        className="signal-lost__panel layer"
        style={{ '--layer-depth': 0 } as CSSVars}>
        <p className="spread-kicker spread-kicker--red">Error 404 // spread not found</p>
        <h1
          className="signal-lost__title"
          tabIndex={-1}
          data-spread-heading="">
          <GlitchText text="Signal" /> <GlitchText text="lost" />
        </h1>
        <HazardRule tone="red" />
        <p className="signal-lost__detail">
          Nothing is filed at <code>{pathname}</code>. The page may have moved, or the
          link was mistyped.
        </p>
        <CyanPill
          to="/"
          icon="la-map-marked-alt"
          tone="yellow">
          Back to map
        </CyanPill>
      </div>
    </SheetScene>
  )
}
