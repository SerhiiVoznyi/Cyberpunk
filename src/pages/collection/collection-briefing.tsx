import { Link } from 'react-router-dom'

import { countOf, type Shelf } from '@/content/collections'
import { childPath, spreadById } from '@/content/spreads'
import { formatPostDate } from '@/services'

export const CollectionBriefing = ({ shelf }: { shelf: Shelf }) => {
  const spread = spreadById(shelf.spreadId)
  if (!spread) return null
  if (shelf.items.length === 0) return <p className="sheet-text">{shelf.empty}</p>

  return (
    <>
      <p className="sheet-text">{countOf(shelf)} filed. Latest:</p>
      <ul className="map__briefing-posts">
        {shelf.items.slice(0, 2).map((item) => (
          <li key={item.slug}>
            <time dateTime={item.date}>{formatPostDate(item.date)}</time>
            <Link to={childPath(spread, item.slug)}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
