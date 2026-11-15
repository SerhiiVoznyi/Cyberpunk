import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalStorage, useMediaQuery } from '@mantine/hooks'

import {
  type FxMode,
  ReaderContext,
  type ViewMode,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
} from './reader-context'

const clampZoom = (zoom: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom))

export const ReaderProvider = ({ children }: { children: ReactNode }) => {
  // A 2.4:1 spread letterboxes into a sliver on narrow or tall viewports, so those read one page.
  const isNarrow = useMediaQuery('(max-width: 900px), (max-aspect-ratio: 5/4)')
  // Read synchronously: phone and desktop render different page components, so a first-frame
  // guess would mount the wrong spread and turn it away immediately.
  const isPhone = useMediaQuery(
    '(max-width: 500px) and (orientation: portrait)',
    undefined,
    {
      getInitialValueInEffect: false,
    },
  )
  const [preferredView, setPreferredView] = useLocalStorage<ViewMode>({
    key: 'sv:view-mode',
    defaultValue: 'spread',
  })
  const [fx, setFx] = useLocalStorage<FxMode>({ key: 'sv:fx', defaultValue: 'full' })
  const [zoom, setZoom] = useState(ZOOM_MIN)

  const viewMode: ViewMode = isPhone ? 'phone' : isNarrow ? 'single' : preferredView

  useEffect(() => {
    document.body.dataset.fx = fx
  }, [fx])

  // The disclaimer is mounted outside the reader, so it reads the view from the body.
  useEffect(() => {
    document.body.dataset.view = viewMode
    return () => {
      delete document.body.dataset.view
    }
  }, [viewMode])

  const toggleViewMode = useCallback(
    () => setPreferredView((mode) => (mode === 'spread' ? 'single' : 'spread')),
    [setPreferredView],
  )
  const toggleFx = useCallback(
    () => setFx((mode) => (mode === 'full' ? 'reduced' : 'full')),
    [setFx],
  )
  const zoomIn = useCallback(() => setZoom((value) => clampZoom(value + ZOOM_STEP)), [])
  const zoomOut = useCallback(() => setZoom((value) => clampZoom(value - ZOOM_STEP)), [])
  const zoomTo = useCallback((value: number) => setZoom(clampZoom(value)), [])
  const resetZoom = useCallback(() => setZoom(ZOOM_MIN), [])

  const value = useMemo(
    () => ({
      viewMode,
      isPhone,
      canToggleView: !isNarrow && !isPhone,
      toggleViewMode,
      // Zoom and pan are desktop reading aids; the phone view always reads at 1x.
      zoom: isPhone ? ZOOM_MIN : zoom,
      zoomIn,
      zoomOut,
      zoomTo,
      resetZoom,
      fx,
      toggleFx,
    }),
    [
      viewMode,
      isPhone,
      isNarrow,
      toggleViewMode,
      zoom,
      zoomIn,
      zoomOut,
      zoomTo,
      resetZoom,
      fx,
      toggleFx,
    ],
  )

  return <ReaderContext value={value}>{children}</ReaderContext>
}
