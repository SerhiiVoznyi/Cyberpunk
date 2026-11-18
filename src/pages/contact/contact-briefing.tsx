import { TagChips } from '@/components'
import { PROFILE } from '@/content/profile'

export const ContactBriefing = () => (
  <>
    <p className="status-tag">{PROFILE.availability.status}</p>
    <p className="sheet-text">
      {PROFILE.availability.statement} If you have something to propose, I am happy to
      discuss it.
    </p>
    <TagChips items={PROFILE.talkAbout} />
  </>
)
