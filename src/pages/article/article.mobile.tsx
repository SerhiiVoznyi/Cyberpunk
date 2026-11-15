import './article.sass'
import './article.mobile.sass'

import { Suspense, use } from 'react'
import { useParams } from 'react-router-dom'

import { CyanPill, MobileHeader } from '@/components'
import { readModePath } from '@/content/spreads'
import {
  Plate,
  Sheet,
  SheetScene,
  SheetStack,
  SheetStackProvider,
} from '@/lib/sheet-stack'
import { fetchPost, formatPostDate, getJournalManifest } from '@/services'

import { SignalLostMobile } from '../signal-lost/signal-lost.mobile'
import { ArticleEntry, ArticleMetadata, ArticleRelated } from './article-sections'
import { ARTICLE_ORDER, ARTICLE_SHEETS } from './article-sheets'

const ArticleLoadingMobile = () => (
  <SheetScene
    kind="split"
    className="article article-m">
    <Plate
      src="/assets/art/city-plate-night.webp"
      depth={3}
      tone="dim"
    />
    <MobileHeader
      lines={['Loading entry']}
      clamp={2}
    />
  </SheetScene>
)

const ArticleContentMobile = ({ slug }: { slug: string }) => {
  const post = use(fetchPost(slug))
  if (!post) return <SignalLostMobile />

  const { total } = getJournalManifest()

  return (
    <SheetScene
      kind="split"
      className="article article-m">
      <SheetStackProvider initialOrder={ARTICLE_ORDER}>
        <Plate
          src={post.cover ?? '/assets/art/city-plate-night.webp'}
          depth={3}
          tone="dim"
        />
        <MobileHeader
          lines={[post.title]}
          clamp={2}
        />
        <SheetStack label="Article sheets">
          <Sheet
            {...ARTICLE_SHEETS.entry}
            teaser={post.summary}>
            <div className="article-m__actions">
              <p className="article-m__filed">
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span aria-hidden="true"> // </span>
                {post.readingMinutes} min read
              </p>
              <CyanPill
                href={readModePath(slug)}
                newTab
                icon="la-book-open">
                Read mode
              </CyanPill>
            </div>
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

export const ArticleMobile = () => {
  const { slug = '' } = useParams()

  return (
    <Suspense fallback={<ArticleLoadingMobile />}>
      <ArticleContentMobile
        key={slug}
        slug={slug}
      />
    </Suspense>
  )
}
