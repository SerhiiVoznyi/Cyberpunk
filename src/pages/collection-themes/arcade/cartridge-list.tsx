import { Link } from 'react-router-dom'

import type { CollectionItem } from '@/content/collections'
import { childPath, type SpreadMeta } from '@/content/spreads'
import { formatPostDate } from '@/services'

import type { ThemeListProps } from '../collection-theme'
import { codenameOf, pad2 } from '../theme-helpers'
import { PixelSprite, type SpriteName } from './pixel-sprite'

const SCREEN_SPRITES: readonly SpriteName[] = ['invader', 'ghost', 'heart', 'coin']

// A stable, silly hi-score per cartridge, so every card has a number to beat.
const hiScoreOf = (slug: string) => {
  let hash = 7
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) % 1_000_000
  return String(hash).padStart(6, '0')
}

const CartridgeCard = ({
  item,
  index,
  spread,
}: {
  item: CollectionItem
  index: number
  spread: SpreadMeta
}) => (
  <li className="cartridge">
    <article className="cartridge__card">
      <div
        className="cartridge__screen"
        aria-hidden="true">
        <span className="cartridge__slot">Slot {pad2(index + 1)}</span>
        <PixelSprite
          name={SCREEN_SPRITES[index % SCREEN_SPRITES.length]}
          className="cartridge__sprite"
        />
        <span className="cartridge__ribbon">{item.status}</span>
        <span className="cartridge__code">{codenameOf(item, 'cart')}</span>
      </div>
      <div className="cartridge__body">
        <h3 className="cartridge__title">
          <Link
            to={childPath(spread, item.slug)}
            className="cartridge__link">
            {item.title}
          </Link>
        </h3>
        {item.tags.length > 0 && (
          <ul
            className="cartridge__tags"
            aria-label="Genre">
            {item.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <p className="cartridge__summary">{item.summary}</p>
        <dl className="cartridge__facts">
          {item.facts?.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
          <div>
            <dt>Released</dt>
            <dd>
              <time dateTime={item.date}>{formatPostDate(item.date)}</time>
            </dd>
          </div>
          <div>
            <dt>Hi-score</dt>
            <dd>{hiScoreOf(item.slug)} · SV</dd>
          </div>
        </dl>
      </div>
      <span
        className="cartridge__start"
        aria-hidden="true">
        Press start
      </span>
    </article>
  </li>
)

// The next free slot on the shelf, so a short list still reads as a cabinet with room to grow.
const EmptySlot = ({ index }: { index: number }) => (
  <li className="cartridge cartridge--empty">
    <div className="cartridge__card">
      <div
        className="cartridge__screen"
        aria-hidden="true">
        <span className="cartridge__slot">Slot {pad2(index + 1)}</span>
        <span className="cartridge__insert">Insert cartridge</span>
      </div>
      <div className="cartridge__body">
        <p className="cartridge__title">Coming soon</p>
        <p className="cartridge__summary">
          The next game is still in the workshop. Check back for a new cartridge.
        </p>
      </div>
    </div>
  </li>
)

/** Attract mode: every game as a cartridge card on the shelf, plus the next empty slot. */
export const CartridgeList = ({ shelf, spread }: ThemeListProps) =>
  shelf.items.length === 0 ? (
    <p className="sheet-text">{shelf.empty}</p>
  ) : (
    <ol className="cartridge-list">
      {shelf.items.map((item, index) => (
        <CartridgeCard
          key={item.slug}
          item={item}
          index={index}
          spread={spread}
        />
      ))}
      <EmptySlot index={shelf.items.length} />
    </ol>
  )
