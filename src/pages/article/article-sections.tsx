import { PlateCard, TagChip } from '@/components'
import { formatSpreadNumber, JOURNAL_INDEX, SPREADS } from '@/content/spreads'
import { formatCount, formatPostDate, type PostDetail } from '@/services'

type PostProps = { post: PostDetail }

export const ArticleEntry = ({ post }: PostProps) => (
  <>
    <p className="sheet-text sheet-text--lead">{post.summary}</p>
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: post.html }}
    />
  </>
)

export const ArticleMetadata = ({ post, total }: PostProps & { total: number }) => (
  <dl className="data-rows">
    <dt>Filed</dt>
    <dd>
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
    </dd>
    <dt>Read time</dt>
    <dd>{post.readingMinutes} min</dd>
    <dt>Spread</dt>
    <dd>
      {formatSpreadNumber(JOURNAL_INDEX)} of {String(SPREADS.length).padStart(2, '0')}
    </dd>
    <dt>Plate</dt>
    <dd>
      {formatCount(post.position)} of {formatCount(total)}
    </dd>
    {post.tags.length > 0 && (
      <>
        <dt>Tags</dt>
        <dd>
          <ul className="chip-row">
            {post.tags.map((tag) => (
              <li key={tag}>
                <TagChip tag={tag} />
              </li>
            ))}
          </ul>
        </dd>
      </>
    )}
  </dl>
)

export const ArticleRelated = ({ post }: PostProps) =>
  post.related.length === 0 ? (
    <p className="sheet-text">No related entries yet.</p>
  ) : (
    <div className="article__related">
      {post.related.map((item) => (
        <PlateCard
          key={item.slug}
          post={item}
          compact
        />
      ))}
    </div>
  )
