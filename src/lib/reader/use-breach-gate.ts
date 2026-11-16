import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '@mantine/hooks'

import { protectedRuleFor } from '@/content/breach'

/**
 * Which protected-route rules this reader has cracked, kept across visits until start-over.
 * Every instance shares the stored list, so the turn, the router and the riddle agree.
 */
export const useBreachGate = () => {
  const [unlocked, setUnlocked] = useLocalStorage<string[]>({
    key: 'sv:breach',
    defaultValue: [],
    getInitialValueInEffect: false,
  })

  const isLocked = useCallback(
    (pathname: string) => {
      const rule = protectedRuleFor(pathname)
      return rule !== null && !unlocked.includes(rule)
    },
    [unlocked],
  )

  const unlock = useCallback(
    (rule: string) =>
      setUnlocked((current) => (current.includes(rule) ? current : [...current, rule])),
    [setUnlocked],
  )

  const relockAll = useCallback(() => setUnlocked([]), [setUnlocked])

  return useMemo(() => ({ isLocked, unlock, relockAll }), [isLocked, unlock, relockAll])
}
