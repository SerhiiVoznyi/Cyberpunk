import { Link } from 'react-router-dom'

import type { CollectionItem } from '@/content/collections'
import { childPath, type SpreadMeta } from '@/content/spreads'
import { type CSSVars } from '@/lib/cx'
import { formatPostDate } from '@/services'

import type { ThemeListProps } from '../collection-theme'
import { codenameOf, pad2 } from '../theme-helpers'
import { daemonState, RAM_SLOTS, ramCost } from './daemon'

export const RamBar = ({ cost }: { cost: number }) => (
  <span
    className="daemon__ram"
    aria-label={`RAM cost ${cost} of ${RAM_SLOTS}`}>
    {Array.from({ length: RAM_SLOTS }, (_, slot) => (
      <span
        key={slot}
        className="daemon__pip"
        data-used={slot < cost ? '' : undefined}
        aria-hidden="true"
      />
    ))}
  </span>
)

const DaemonRow = ({
  item,
  index,
  spread,
}: {
  item: CollectionItem
  index: number
  spread: SpreadMeta
}) => (
  <li
    className="daemon"
    style={{ '--daemon-delay': `${index * 90}ms` } as CSSVars}>
    <Link
      to={childPath(spread, item.slug)}
      className="daemon__link">
      <span
        className="daemon__index"
        aria-hidden="true">
        DMN_{pad2(index + 1)}
      </span>
      <span className="daemon__head">
        <span className="daemon__name">{item.title}</span>
        <span
          className="daemon__codename"
          aria-hidden="true">
          {codenameOf(item, 'dmn')}
        </span>
      </span>
      <span className="daemon__state">{daemonState(item.status)}</span>
      <RamBar cost={ramCost(item)} />
      <span className="daemon__summary">{item.summary}</span>
      <span className="daemon__meta">
        <time dateTime={item.date}>Compiled {formatPostDate(item.date)}</time>
        {item.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </span>
      <span
        className="daemon__upload"
        aria-hidden="true"
      />
    </Link>
  </li>
)

/** Every application as a network daemon queued against the wall. */
export const DaemonList = ({ shelf, spread }: ThemeListProps) =>
  shelf.items.length === 0 ? (
    <p className="sheet-text">{shelf.empty}</p>
  ) : (
    <>
      <p
        className="daemon-list__head"
        aria-hidden="true">
        <span>ID</span>
        <span>Daemon</span>
        <span>State</span>
        <span>RAM</span>
      </p>
      <ol className="daemon-list">
        {shelf.items.map((item, index) => (
          <DaemonRow
            key={item.slug}
            item={item}
            index={index}
            spread={spread}
          />
        ))}
      </ol>
    </>
  )
