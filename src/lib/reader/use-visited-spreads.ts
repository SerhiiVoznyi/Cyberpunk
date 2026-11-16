import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocalStorage } from '@mantine/hooks'

import { entrySlugOf, findSpreadIndex, SPREADS } from '@/content/spreads'

import { useBreachGate } from './use-breach-gate'

/** Entry slugs remembered individually; older ones only survive in the running count. */
const ENTRY_MEMORY = 500

/** How long an armed reset waits for its confirming press, and how long "cleared" shows. */
const RESET_HOLD_MS = 4000

type VisitLog = { spreads: string[]; entries: string[]; entryCount: number }

const EMPTY: VisitLog = { spreads: [], entries: [], entryCount: 0 }

const useVisitStore = () =>
  useLocalStorage<VisitLog>({
    key: 'sv:visits',
    defaultValue: EMPTY,
    getInitialValueInEffect: false,
  })

export const entryVisitId = (slug: string) => `post:${slug}`

const withVisit = (log: VisitLog, pathname: string): VisitLog => {
  const slug = entrySlugOf(pathname)
  if (slug !== null) {
    return log.entries.includes(slug)
      ? log
      : {
          ...log,
          entries: [slug, ...log.entries].slice(0, ENTRY_MEMORY),
          entryCount: log.entryCount + 1,
        }
  }
  const spread = SPREADS[findSpreadIndex(pathname)]
  if (!spread || log.spreads.includes(spread.id)) return log
  return { ...log, spreads: [...log.spreads, spread.id] }
}

/**
 * What this reader has opened, kept across visits: chapter ids and `post:<slug>` ids for the
 * most recent entries, plus how many distinct entries have been read.
 */
export const useVisits = () => {
  const [log] = useVisitStore()
  return useMemo(
    () => ({
      visited: new Set([...log.spreads, ...log.entries.map(entryVisitId)]),
      entryCount: log.entryCount,
    }),
    [log],
  )
}

/** Marks the spread or entry at the current URL as visited, once it is past any breach gate. */
export const useRecordVisit = () => {
  const { pathname } = useLocation()
  const [, setLog] = useVisitStore()
  const locked = useBreachGate().isLocked(pathname)

  useEffect(() => {
    if (locked) return
    setLog((log) => withVisit(log, pathname))
  }, [pathname, locked, setLog])
}

export type ResetVisitsState = 'idle' | 'armed' | 'cleared'

/**
 * A two-press "start over": the first press arms it, a second press within a few seconds forgets
 * every visit except the spread on screen and relocks every protected route, so perks relock and
 * chapters breach again.
 */
export const useResetVisits = () => {
  const { pathname } = useLocation()
  const [, setLog] = useVisitStore()
  const { relockAll } = useBreachGate()
  const [state, setState] = useState<ResetVisitsState>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = window.setTimeout(() => setState('idle'), RESET_HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [state])

  const press = useCallback(() => {
    if (state !== 'armed') {
      setState('armed')
      return
    }
    setLog(withVisit(EMPTY, pathname))
    relockAll()
    setState('cleared')
  }, [state, pathname, setLog, relockAll])

  return { state, press }
}
