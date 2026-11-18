import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  childOf,
  childPath,
  entryPath,
  entrySlugOf,
  findSpreadIndex,
  JOURNAL_INDEX,
  type SpreadMeta,
  SPREADS,
} from '@/content/spreads'
import { fetchPost, getJournalManifest, peekPost, type PostDetail } from '@/services'

/** Child slugs a chapter knows up front; the Journal reads its entries from the manifest. */
const itemsOf = (spread: SpreadMeta | undefined) => spread?.children?.slugs?.() ?? []

// The entry on screen, from the cache the article page fills; the toolbar never suspends.
const useEntry = (slug: string | null) => {
  const [loaded, setLoaded] = useState<PostDetail | null>(null)

  useEffect(() => {
    if (slug === null) return
    let live = true
    fetchPost(slug)
      .then((post) => {
        if (live) setLoaded(post)
      })
      .catch(() => undefined)
    return () => {
      live = false
    }
  }, [slug])

  if (slug === null) return null
  if (loaded?.slug === slug) return loaded
  return peekPost(slug) ?? null
}

export type EntryPosition = { position: number; total: number; title: string }

export const useSpreadNavigation = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const index = findSpreadIndex(pathname)
  const total = SPREADS.length
  const slug = entrySlugOf(pathname)
  const child = slug === null ? childOf(pathname) : null
  const entry = useEntry(slug)
  const journal = getJournalManifest()

  const goTo = useCallback(
    (target: number) => {
      const spread = SPREADS[target]
      if (spread) navigate(spread.path)
    },
    [navigate],
  )

  // Reading order runs a chapter, then its child pages in order (Journal entries newest to
  // oldest), then the next chapter.
  const goPrevious = useCallback(() => {
    if (slug !== null) {
      navigate(entry?.newer ? entryPath(entry.newer) : SPREADS[JOURNAL_INDEX].path)
    } else if (child) {
      const siblings = itemsOf(child.spread)
      const at = siblings.indexOf(child.slug)
      navigate(at > 0 ? childPath(child.spread, siblings[at - 1]) : child.spread.path)
    } else if (index === JOURNAL_INDEX + 1 && journal.oldest) {
      navigate(entryPath(journal.oldest))
    } else if (index > 0) {
      const previous = SPREADS[index - 1]
      const last = itemsOf(previous).at(-1)
      if (last) navigate(childPath(previous, last))
      else goTo(index - 1)
    }
  }, [slug, entry, child, index, journal.oldest, navigate, goTo])

  const goNext = useCallback(() => {
    if (slug !== null) {
      if (entry?.older) navigate(entryPath(entry.older))
      else goTo(JOURNAL_INDEX + 1)
    } else if (child) {
      const siblings = itemsOf(child.spread)
      const at = siblings.indexOf(child.slug)
      if (at >= 0 && at < siblings.length - 1) {
        navigate(childPath(child.spread, siblings[at + 1]))
      } else goTo(child.spreadIndex + 1)
    } else if (index === JOURNAL_INDEX && journal.latest[0]) {
      navigate(entryPath(journal.latest[0].slug))
    } else {
      const first = index >= 0 ? itemsOf(SPREADS[index])[0] : undefined
      if (first) navigate(childPath(SPREADS[index], first))
      else goTo(index < 0 ? 0 : index + 1)
    }
  }, [slug, entry, child, index, journal.latest, navigate, goTo])

  const goMap = useCallback(() => goTo(0), [goTo])

  return {
    index,
    total,
    spread: index >= 0 ? SPREADS[index] : undefined,
    entry:
      slug !== null && entry
        ? ({
            position: entry.position,
            total: journal.total,
            title: entry.title,
          } as EntryPosition)
        : null,
    hasPrevious: index > 0,
    hasNext:
      slug !== null
        ? Boolean(entry?.older) || JOURNAL_INDEX < total - 1
        : child !== null || index < total - 1,
    goPrevious,
    goNext,
    goMap,
  }
}
