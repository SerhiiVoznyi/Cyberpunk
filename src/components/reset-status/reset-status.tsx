import { VisuallyHidden } from '@mantine/core'

import type { ResetVisitsState } from '@/lib/reader'

export const RESET_VISITS_LABEL = 'Start over: clear reading progress'

const MESSAGE: Record<ResetVisitsState, string> = {
  idle: '',
  armed: 'Press again to clear your reading progress.',
  cleared: 'Reading progress cleared.',
}

/** Announces the arm and clear steps of a start-over control, whose label stays constant. */
export const ResetStatus = ({ state }: { state: ResetVisitsState }) => (
  <VisuallyHidden
    role="status"
    aria-live="polite">
    {MESSAGE[state]}
  </VisuallyHidden>
)
