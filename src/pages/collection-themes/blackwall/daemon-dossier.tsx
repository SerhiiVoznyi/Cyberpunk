import { TagChips } from '@/components'
import { formatPostDate } from '@/services'

import type { ThemeItemProps } from '../collection-theme'
import { codenameOf, spreadPosition } from '../theme-helpers'
import { daemonState, RAM_SLOTS, ramCost } from './daemon'
import { RamBar } from './daemon-list'

/** The daemon's readme: what it does, one `// SECTION` block per part. */
export const DaemonReadme = ({ item }: ThemeItemProps) => (
  <div className="dossier">
    <p className="dossier__boot">
      <span aria-hidden="true">&gt; </span>cat {codenameOf(item, 'dmn').toLowerCase()}
      /README
    </p>
    <p className="sheet-text sheet-text--lead">{item.summary}</p>
    {item.sections.map((section) => (
      <section
        key={section.title}
        className="dossier__section">
        <h3 className="dossier__heading">
          <span aria-hidden="true">// </span>
          {section.title}
        </h3>
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

/** The daemon's signature: state, cost, build, then the links that execute it. */
export const DaemonSignature = ({ item, spread }: ThemeItemProps) => {
  const cost = ramCost(item)

  return (
    <div className="dossier">
      <dl className="dossier__rows">
        <dt>Daemon</dt>
        <dd className="dossier__mono">{codenameOf(item, 'dmn')}</dd>
        <dt>State</dt>
        <dd>
          <span className="daemon__state">{daemonState(item.status)}</span>
        </dd>
        <dt>RAM</dt>
        <dd className="dossier__ram">
          <RamBar cost={cost} />
          <span aria-hidden="true">
            {cost}/{RAM_SLOTS}
          </span>
        </dd>
        <dt>Compiled</dt>
        <dd>
          <time dateTime={item.date}>{formatPostDate(item.date)}</time>
        </dd>
        <dt>Spread</dt>
        <dd>{spreadPosition(spread)}</dd>
        {item.stack.length > 0 && (
          <>
            <dt>Runtime</dt>
            <dd>
              <TagChips items={item.stack} />
            </dd>
          </>
        )}
        {item.tags.length > 0 && (
          <>
            <dt>Tags</dt>
            <dd>
              <TagChips items={item.tags} />
            </dd>
          </>
        )}
      </dl>
      {item.links.length > 0 && (
        <ul className="dossier__links">
          {item.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="dossier__execute"
                target="_blank"
                rel="noreferrer">
                <i
                  className={`las ${link.icon ?? 'la-terminal'}`}
                  aria-hidden="true"
                />
                Execute <span aria-hidden="true">//</span> {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
