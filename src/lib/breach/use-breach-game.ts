import { useContext } from 'react'

import { BreachGameContext } from './breach-game-context'

export const useBreachGame = () => {
  const value = useContext(BreachGameContext)
  if (!value) throw new Error('useBreachGame must be used inside <BreachGameProvider>.')
  return value
}
