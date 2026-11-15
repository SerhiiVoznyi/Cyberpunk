import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export type JournalQuery = { q: string; tag: string | null; page: number }

// Search, tag and page live in the URL, so a filtered index deep-links and Back undoes a step.
const readQuery = (params: URLSearchParams): JournalQuery => ({
  q: params.get('q') ?? '',
  tag: params.get('tag'),
  page: Math.max(1, Math.floor(Number(params.get('page'))) || 1),
})

export type UpdateQuery = (next: Partial<JournalQuery>, replace?: boolean) => void

export const useJournalQuery = () => {
  const [params, setParams] = useSearchParams()

  const update = useCallback<UpdateQuery>(
    (next, replace = false) =>
      setParams(
        (current) => {
          const merged = { ...readQuery(current), ...next }
          const result = new URLSearchParams(current)
          if (merged.q.trim()) result.set('q', merged.q)
          else result.delete('q')
          if (merged.tag) result.set('tag', merged.tag)
          else result.delete('tag')
          if (merged.page > 1) result.set('page', String(merged.page))
          else result.delete('page')
          return result
        },
        { replace },
      ),
    [setParams],
  )

  return { query: readQuery(params), update }
}

export const journalIndexTitle = (query: JournalQuery) =>
  query.q.trim()
    ? `Index · “${query.q.trim()}”`
    : query.tag
      ? `Index · #${query.tag}`
      : 'Index'
