import { CorpName, NdaNote, TagChips } from '@/components'
import { EMPLOYERS, IMPACT_HEADLINE } from '@/content/career'
import { PROFILE } from '@/content/profile'

export const ExperienceBriefing = () => {
  const current = EMPLOYERS.at(0)

  return (
    <>
      <p className="map__briefing-role">
        {PROFILE.role}
        {current && (
          <>
            {' '}
            at <CorpName corp={current.corp} />
          </>
        )}
      </p>
      <p className="sheet-text">{IMPACT_HEADLINE}</p>
      <TagChips items={PROFILE.stack} />
      <NdaNote />
    </>
  )
}
