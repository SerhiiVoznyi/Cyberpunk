import type { ReactNode } from 'react'

import { CyanPill, Sticker } from '@/components'
import type { SpreadMeta } from '@/content/spreads'

type ChapterBriefingProps = {
  chapter: SpreadMeta
  /** `false` drops the sticker, for layouts that spend no space on it. */
  decorated?: boolean
  /** The chapter's own briefing body, from `BRIEFINGS`. */
  children: ReactNode
}

export const ChapterBriefing = ({
  chapter,
  decorated = true,
  children,
}: ChapterBriefingProps) => {
  const sticker = decorated ? chapter.perk?.sticker : undefined

  return (
    <div className="map__briefing">
      {sticker && (
        <Sticker
          src={sticker}
          rotate={7}
        />
      )}
      {children}
      <div className="map__briefing-action">
        <CyanPill
          to={chapter.path}
          icon="la-arrow-right"
          tone="yellow">
          Enter {chapter.label}
        </CyanPill>
      </div>
    </div>
  )
}
