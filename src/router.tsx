import type { ReactNode } from 'react'
import { type Location, Navigate, Route, Routes } from 'react-router-dom'

import { protectedRuleFor } from './content/breach'
import { SPREADS } from './content/spreads'
import { useReader } from './lib/reader'
import {
  BreachMobile,
  BreachPage,
  SignalLostMobile,
  SignalLostPage,
  SPREAD_PAGES,
} from './pages'

const REDIRECTS: Record<string, string> = {
  '/home': '/',
  '/identity': '/profile',
  '/dossier': '/experience',
  '/uplink': '/contact',
}

// Phones get their own layout of every spread; both read the same content sections.
const pick = (isPhone: boolean, desktop: ReactNode, mobile: ReactNode) =>
  isPhone ? mobile : desktop

type AppRouterProps = {
  location: Location
  /** The location's protected route is still locked: the riddle stands in for its page. */
  locked: boolean
}

export const AppRouter = ({ location, locked }: AppRouterProps) => {
  const { isPhone } = useReader()
  const rule = protectedRuleFor(location.pathname)

  if (locked && rule) {
    return pick(
      isPhone,
      <BreachPage
        rule={rule}
        pathname={location.pathname}
      />,
      <BreachMobile
        rule={rule}
        pathname={location.pathname}
      />,
    )
  }

  return (
    <Routes location={location}>
      {SPREADS.flatMap((spread) => {
        const pages = SPREAD_PAGES[spread.id]
        if (!pages) return []
        const routes = [
          <Route
            key={spread.id}
            path={spread.path}
            element={pick(isPhone, pages.desktop, pages.mobile)}
          />,
        ]
        if (pages.child) {
          routes.push(
            <Route
              key={`${spread.id}:child`}
              path={`${spread.path}/:slug`}
              element={pick(isPhone, pages.child.desktop, pages.child.mobile)}
            />,
          )
        }
        return routes
      })}
      {Object.entries(REDIRECTS).map(([from, to]) => (
        <Route
          key={from}
          path={from}
          element={
            <Navigate
              to={to}
              replace
            />
          }
        />
      ))}
      <Route
        path="*"
        element={pick(isPhone, <SignalLostPage />, <SignalLostMobile />)}
      />
    </Routes>
  )
}
