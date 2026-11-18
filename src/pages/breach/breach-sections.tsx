import { HazardRule } from '@/components'
import { BreachRules } from '@/lib/breach'

/** `decorated={false}` drops rules and other decoration, for layouts that spend no space on them. */
type SectionProps = { decorated?: boolean }

export const BreachManual = ({ decorated = true }: SectionProps) => (
  <>
    <p className="sheet-text sheet-text--lead">
      This route sits behind ICE. Land the sequence in the buffer to open it.
    </p>
    <BreachRules />
    {decorated && (
      <HazardRule
        tone="ink"
        className="breach__rule"
      />
    )}
    <p className="sheet-text">
      Press a sequence code to light its twins in the matrix and plan a route before the
      clock starts. The clock starts on your first pick. New matrix rolls a fresh one at
      any time, and Retry does the same if the ICE holds.
    </p>
  </>
)
