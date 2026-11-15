import { Link } from 'react-router-dom'

import { CorpName, CyanPill, NdaNote, Sticker, TagChip } from '@/components'
import { EMPLOYERS, IMPACT_HEADLINE } from '@/content/career'
import { PROFILE } from '@/content/profile'
import { entryPath, type SpreadMeta } from '@/content/spreads'
import { STICKERS } from '@/content/stickers'
import { formatCount, formatPostDate, getJournalManifest, prefetchPost } from '@/services'

const BRIEFING_STICKERS: Record<string, string> = {
  profile: STICKERS.terminal,
  experience: STICKERS.server,
  journal: STICKERS.nodes,
  contact: STICKERS.antenna,
}

export const Chips = ({ items }: { items: readonly string[] }) => (
  <ul className="chip-row">
    {items.map((item) => (
      <li key={item}>
        <TagChip tag={item} />
      </li>
    ))}
  </ul>
)

type ChapterBriefingProps = {
  chapter: SpreadMeta
  /** `false` drops the sticker, for layouts that spend no space on it. */
  decorated?: boolean
}

export const ChapterBriefing = ({ chapter, decorated = true }: ChapterBriefingProps) => {
  const journal = getJournalManifest()
  const current = EMPLOYERS.at(0)
  const sticker = decorated ? BRIEFING_STICKERS[chapter.id] : undefined

  return (
    <div className="map__briefing">
      {sticker && (
        <Sticker
          src={sticker}
          rotate={7}
        />
      )}
      {chapter.id === 'profile' && (
        <>
          <p className="sheet-text">{PROFILE.summary}</p>
          <dl className="glance-strip">
            {PROFILE.glance.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
      {chapter.id === 'experience' && (
        <>
          <p className="map__briefing-role">
            {PROFILE.role}
            {current && (
              <>
                {' '}
                at <CorpName corp={current.corp} />
              </>
            )}
          </p>
          <p className="sheet-text">{IMPACT_HEADLINE}</p>
          <Chips items={PROFILE.stack} />
          <NdaNote />
        </>
      )}
      {chapter.id === 'journal' && (
        <>
          <p className="sheet-text">
            {formatCount(journal.total)} entries filed. Latest:
          </p>
          <ul className="map__briefing-posts">
            {journal.latest.slice(0, 2).map((post) => (
              <li key={post.slug}>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <Link
                  to={entryPath(post.slug)}
                  onPointerEnter={() => prefetchPost(post.slug)}
                  onFocus={() => prefetchPost(post.slug)}>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      {chapter.id === 'contact' && (
        <>
          <p className="status-tag">{PROFILE.availability.status}</p>
          <p className="sheet-text">
            {PROFILE.availability.statement} If you have something to propose, I am happy
            to discuss it.
          </p>
          <Chips items={PROFILE.talkAbout} />
        </>
      )}
      <div className="map__briefing-action">
        <CyanPill
          to={chapter.path}
          icon="la-arrow-right"
          tone="yellow">
          Enter {chapter.label}
        </CyanPill>
      </div>
    </div>
  )
}
