import './site-map-list.sass'

import { Link, useLocation } from 'react-router-dom'
import { VisuallyHidden } from '@mantine/core'

import { perkIconUrl, SITE_ROUTE, type SiteStop } from '@/content/site-map'
import { entrySlugOf, findSpreadIndex, SPREADS } from '@/content/spreads'
import { type CSSVars, cx } from '@/lib/cx'
import {
  type ResetVisitsState,
  useBreachGate,
  useResetVisits,
  useVisits,
} from '@/lib/reader'
import { prefetchPost } from '@/services'

import { RESET_VISITS_LABEL, ResetStatus } from '../reset-status/reset-status'

const RESET_HINT: Record<ResetVisitsState, string> = {
  idle: 'Start over',
  armed: 'Press again',
  cleared: 'Cleared',
}

// Archive shares the Journal's path, so the current stop is matched by id, never by path.
const currentStopId = (pathname: string) => {
  const slug = entrySlugOf(pathname)
  if (slug !== null) return `post:${slug}`
  return SPREADS[findSpreadIndex(pathname)]?.id ?? null
}

const prefetchFor = (stop: SiteStop) => () => {
  if (stop.kind === 'entry') prefetchPost(stop.id.slice('post:'.length))
}

const StopFace = ({ stop, iced = false }: { stop: SiteStop; iced?: boolean }) => (
  <>
    <span
      className="site-map-list__icon"
      style={{ '--perk-icon': perkIconUrl(iced ? 'locked' : stop.icon) } as CSSVars}
      aria-hidden="true"
    />
    <span
      className="site-map-list__number"
      aria-hidden="true">
      {stop.number}
    </span>
    <span className="site-map-list__label">
      {stop.spread.label}
      {iced && <VisuallyHidden>, ICE protected</VisuallyHidden>}
    </span>
  </>
)

/** The website map as a plain list: the same stops as the board, in reading order. */
export const SiteMapList = () => {
  const { pathname } = useLocation()
  const { visited } = useVisits()
  const reset = useResetVisits()
  const { isLocked } = useBreachGate()
  const current = currentStopId(pathname)

  return (
    <nav
      className="site-map-list"
      aria-label="Website map">
      <ol>
        {SITE_ROUTE.map((stop) => (
          <li
            key={stop.id}
            className={cx(
              'site-map-list__stop',
              `site-map-list__stop--tier-${stop.tier}`,
            )}>
            {/* On the Map already, its own entry starts over instead of linking to itself. */}
            {stop.kind === 'root' && stop.id === current ? (
              <>
                <button
                  type="button"
                  className="site-map-list__link site-map-list__link--reset"
                  aria-label={RESET_VISITS_LABEL}
                  data-reset={reset.state}
                  onClick={reset.press}>
                  <StopFace stop={stop} />
                  <span
                    className="site-map-list__action"
                    aria-hidden="true">
                    {RESET_HINT[reset.state]}
                  </span>
                </button>
                <ResetStatus state={reset.state} />
              </>
            ) : (
              <Link
                to={stop.spread.path}
                className="site-map-list__link"
                aria-current={stop.id === current ? 'page' : undefined}
                data-visited={visited.has(stop.id) ? '' : undefined}
                onFocus={prefetchFor(stop)}
                onPointerEnter={prefetchFor(stop)}>
                <StopFace
                  stop={stop}
                  iced={isLocked(stop.spread.path)}
                />
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
