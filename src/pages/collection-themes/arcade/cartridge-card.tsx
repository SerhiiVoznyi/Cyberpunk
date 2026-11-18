import { Fragment } from 'react'

import { TagChips } from '@/components'
import { formatPostDate } from '@/services'

import { ItemManual } from '../../collection-item/collection-item-sections'
import type { ThemeItemProps } from '../collection-theme'
import { codenameOf, spreadPosition } from '../theme-helpers'

/** The instruction card glued inside the cabinet: what the game is and how to play it. */
export const Instructions = ({ item, player }: ThemeItemProps) => (
  <div className="cartridge-card">
    <p className="sheet-text sheet-text--lead">{item.summary}</p>
    {player?.Manual && (
      <section className="cartridge-card__section">
        <h3 className="cartridge-card__heading">How to play</h3>
        <ItemManual player={player} />
      </section>
    )}
    {item.sections.map((section) => (
      <section
        key={section.title}
        className="cartridge-card__section">
        <h3 className="cartridge-card__heading">{section.title}</h3>
        {section.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="sheet-text">
            {paragraph}
          </p>
        ))}
      </section>
    ))}
  </div>
)

/** The cartridge label: code, status, release, stack, then the links to continue with. */
export const CartridgeLabel = ({ item, spread }: ThemeItemProps) => (
  <div className="cartridge-card">
    <dl className="cartridge-card__rows">
      <dt>Cartridge</dt>
      <dd className="cartridge-card__mono">{codenameOf(item, 'cart')}</dd>
      <dt>Status</dt>
      <dd>
        <span className="cartridge__badge cartridge__badge--status">{item.status}</span>
      </dd>
      {item.facts?.map((fact) => (
        <Fragment key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </Fragment>
      ))}
      <dt>Release</dt>
      <dd>
        <time dateTime={item.date}>{formatPostDate(item.date)}</time>
      </dd>
      <dt>Spread</dt>
      <dd>{spreadPosition(spread)}</dd>
      {item.stack.length > 0 && (
        <>
          <dt>Built with</dt>
          <dd>
            <TagChips items={item.stack} />
          </dd>
        </>
      )}
      {item.tags.length > 0 && (
        <>
          <dt>Genre</dt>
          <dd>
            <TagChips items={item.tags} />
          </dd>
        </>
      )}
    </dl>
    {item.links.length > 0 && (
      <ul className="cartridge-card__links">
        {item.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="cartridge-card__continue"
              target="_blank"
              rel="noreferrer">
              <i
                className={`las ${link.icon ?? 'la-gamepad'}`}
                aria-hidden="true"
              />
              Continue? <span aria-hidden="true">//</span> {link.label}
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
)
