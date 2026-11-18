import { Link } from 'react-router-dom'

import { entryPath } from '@/content/spreads'
import { formatCount, formatPostDate, getJournalManifest, prefetchPost } from '@/services'

export const JournalBriefing = () => {
  const journal = getJournalManifest()

  return (
    <>
      <p className="sheet-text">{formatCount(journal.total)} entries filed. Latest:</p>
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
  )
}
