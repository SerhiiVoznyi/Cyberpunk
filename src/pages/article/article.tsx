import './article.sass'

import { Suspense, use } from 'react'
import { useParams } from 'react-router-dom'

import { BackToMap, CyanPill, DisplayTitle } from '@/components'
import { readModePath } from '@/content/spreads'
import type { CSSVars } from '@/lib/cx'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'
import { fetchPost, formatPostDate, getJournalManifest } from '@/services'

import { SignalLostPage } from '../signal-lost/signal-lost'
import { ArticleEntry, ArticleMetadata, ArticleRelated } from './article-sections'
import { ARTICLE_ORDER, ARTICLE_SHEETS } from './article-sheets'

const ArticleLoading = () => (
  <SheetScene
    kind="split"
    className="article"
    overlay={<BackToMap className="spread-back" />}>
    <Plate
      src="/assets/art/city-plate-night.webp"
      depth={2}
      region="right"
      tone="dim"
    />
    <div
      className="article__title layer"
      style={{ '--layer-depth': 1 } as CSSVars}>
      <p className="spread-kicker">Journal entry // decrypting shard</p>
      <DisplayTitle
        lines={['Loading entry']}
        size="md"
        spreadHeading
      />
    </div>
  </SheetScene>
)

const ArticleContent = ({ slug }: { slug: string }) => {
  const post = use(fetchPost(slug))
  if (!post) return <SignalLostPage />

  const { total } = getJournalManifest()

  return (
    <SheetScene
      kind="split"
      className="article"
      overlay={<BackToMap className="spread-back" />}>
      <SheetStackProvider initialOrder={ARTICLE_ORDER}>
        <Plate
          src={post.cover ?? '/assets/art/city-plate-night.webp'}
          depth={2}
          region="right"
          glitch
        />
        <div
          className="article__title layer"
          style={{ '--layer-depth': 1 } as CSSVars}>
          <p className="spread-kicker">
            Journal entry // <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          </p>
          <DisplayTitle
            lines={[post.title]}
            size="md"
            spreadHeading
          />
          <span className="article__read">
            <CyanPill
              href={readModePath(slug)}
              newTab
              icon="la-book-open">
              Read mode
            </CyanPill>
          </span>
        </div>
        <SheetStack
          label="Article sheets"
          region="left">
          <Sheet
            {...ARTICLE_SHEETS.entry}
            teaser={post.summary}
            aside={<>{post.readingMinutes} min read</>}>
            <ArticleEntry post={post} />
          </Sheet>
          <Sheet {...ARTICLE_SHEETS.metadata}>
            <ArticleMetadata
              post={post}
              total={total}
            />
          </Sheet>
          <Sheet {...ARTICLE_SHEETS.related}>
            <ArticleRelated post={post} />
          </Sheet>
        </SheetStack>
      </SheetStackProvider>
    </SheetScene>
  )
}

export const ArticlePage = () => {
  const { slug = '' } = useParams()

  return (
    <Suspense fallback={<ArticleLoading />}>
      <ArticleContent
        key={slug}
        slug={slug}
      />
    </Suspense>
  )
}
