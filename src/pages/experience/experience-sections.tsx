import { HazardRule, NdaNote, Sticker, TagChip } from '@/components'
import {
  EMPLOYERS,
  IMPACT,
  IMPACT_INTRO,
  IMPACT_RECORD,
  PROJECTS,
} from '@/content/career'
import { PROFILE } from '@/content/profile'
import { STICKERS } from '@/content/stickers'

import { CareerTimeline } from './career-timeline'
import { ProjectList } from './project-list'

/** `decorated={false}` drops stickers and rules, for layouts that spend no space on them. */
type SectionProps = { decorated?: boolean }

export const ExperienceCareer = ({ decorated = true }: SectionProps) => (
  <>
    {decorated && (
      <Sticker
        src={STICKERS.server}
        rotate={8}
      />
    )}
    <p className="sheet-text">{PROFILE.careerSummary}</p>
    <CareerTimeline
      entries={EMPLOYERS}
      origin={`${PROFILE.experience} in fintech, banking and enterprise`}
    />
    <NdaNote />
  </>
)

export const ExperienceProjects = () => (
  <>
    <ProjectList projects={PROJECTS} />
    <NdaNote />
  </>
)

export const ExperienceImpact = ({ decorated = true }: SectionProps) => (
  <>
    {decorated && (
      <Sticker
        src={STICKERS.nodes}
        rotate={6}
      />
    )}
    <p className="sheet-text">{IMPACT_INTRO}</p>
    <dl className="impact-grid">
      {IMPACT.map((metric) => (
        <div
          key={metric.label}
          className="impact-grid__tile">
          <dt>{metric.label}</dt>
          <dd className="impact-grid__value">{metric.value}</dd>
          <dd className="impact-grid__detail">{metric.detail}</dd>
        </div>
      ))}
    </dl>
    {IMPACT_RECORD.map((group) => (
      <section
        key={group.title}
        aria-label={group.title}>
        <h3 className="sheet-subhead">{group.title}</h3>
        <ul className="sheet-list">
          {group.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    ))}
  </>
)

export const ExperienceStack = ({ decorated = true }: SectionProps) => (
  <>
    {decorated && (
      <>
        <HazardRule
          tone="ink"
          className="experience__rule"
        />
        <Sticker
          src={STICKERS.chip}
          rotate={-7}
        />
      </>
    )}
    <dl className="experience__stack">
      {PROFILE.stackGroups.map((group) => (
        <div key={group.area}>
          <dt>{group.area}</dt>
          <dd>
            <ul className="chip-row">
              {group.items.map((item) => (
                <li key={item}>
                  <TagChip tag={item} />
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  </>
)
