import './site-map-list.sass'

import { Link, useLocation } from 'react-router-dom'

import { perkIconUrl, SITE_ROUTE, type SiteStop } from '@/content/site-map'
import { entrySlugOf, findSpreadIndex, SPREADS } from '@/content/spreads'
import { type CSSVars, cx } from '@/lib/cx'
import { useVisits } from '@/lib/reader'
import { prefetchPost } from '@/services'

// Archive shares the Journal's path, so the current stop is matched by id, never by path.
const currentStopId = (pathname: string) => {
  const slug = entrySlugOf(pathname)
  if (slug !== null) return `post:${slug}`
  return SPREADS[findSpreadIndex(pathname)]?.id ?? null
}

const prefetchFor = (stop: SiteStop) => () => {
  if (stop.kind === 'entry') prefetchPost(stop.id.slice('post:'.length))
}

/** The website map as a plain list: the same stops as the board, in reading order. */
export const SiteMapList = () => {
  const { pathname } = useLocation()
  const { visited } = useVisits()
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
            <Link
              to={stop.spread.path}
              className="site-map-list__link"
              aria-current={stop.id === current ? 'page' : undefined}
              data-visited={visited.has(stop.id) ? '' : undefined}
              onFocus={prefetchFor(stop)}
              onPointerEnter={prefetchFor(stop)}>
              <span
                className="site-map-list__icon"
                style={{ '--perk-icon': perkIconUrl(stop.icon) } as CSSVars}
                aria-hidden="true"
              />
              <span
                className="site-map-list__number"
                aria-hidden="true">
                {stop.number}
              </span>
              <span className="site-map-list__label">{stop.spread.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
