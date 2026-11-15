import type { ReactNode } from 'react'
import { type Location, Navigate, Route, Routes } from 'react-router-dom'

import { useReader } from './lib/reader'
import {
  ArticleMobile,
  ArticlePage,
  ContactMobile,
  ContactPage,
  ExperienceMobile,
  ExperiencePage,
  JournalMobile,
  JournalPage,
  MapMobile,
  MapPage,
  ProfileMobile,
  ProfilePage,
  SignalLostMobile,
  SignalLostPage,
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

export const AppRouter = ({ location }: { location: Location }) => {
  const { isPhone } = useReader()

  return (
    <Routes location={location}>
      <Route
        path="/"
        element={pick(isPhone, <MapPage />, <MapMobile />)}
      />
      <Route
        path="/profile"
        element={pick(isPhone, <ProfilePage />, <ProfileMobile />)}
      />
      <Route
        path="/experience"
        element={pick(isPhone, <ExperiencePage />, <ExperienceMobile />)}
      />
      <Route
        path="/blog"
        element={pick(isPhone, <JournalPage />, <JournalMobile />)}
      />
      <Route
        path="/blog/:slug"
        element={pick(isPhone, <ArticlePage />, <ArticleMobile />)}
      />
      <Route
        path="/contact"
        element={pick(isPhone, <ContactPage />, <ContactMobile />)}
      />
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
