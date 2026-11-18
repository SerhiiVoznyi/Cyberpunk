import {
  CorpName,
  HalftoneOverlay,
  NdaNote,
  Sticker,
  TagChip,
} from '@/components'
import { EMPLOYERS } from '@/content/career'
import { PROFILE } from '@/content/profile'
import { STICKERS } from '@/content/stickers'

const current = EMPLOYERS.at(0)

/** `decorated={false}` drops stickers and overlays, for layouts that spend no space on them. */
type SectionProps = { decorated?: boolean }

export const ProfileSummary = ({ decorated = true }: SectionProps) => (
  <>
    {decorated && (
      <>
        <HalftoneOverlay />
        <Sticker
          src={STICKERS.terminal}
          rotate={7}
        />
      </>
    )}
    <p className="sheet-text sheet-text--lead">{PROFILE.summary}</p>
    <dl className="glance-strip">
      {PROFILE.glance.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
    <p className="sheet-text">{PROFILE.about}</p>
    <h3 className="sheet-subhead">What I focus on</h3>
    <ul className="sheet-list">
      {PROFILE.focus.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <p className="sheet-text">{PROFILE.values}</p>
  </>
)

export const ProfileRole = ({ decorated = true }: SectionProps) => (
  <>
    {decorated && (
      <Sticker
        src={STICKERS.nodes}
        rotate={-6}
      />
    )}
    <dl className="data-rows">
      <dt>Role</dt>
      <dd>{PROFILE.role}</dd>
      {current && (
        <>
          <dt>Company</dt>
          <dd>
            <CorpName corp={current.corp} />
          </dd>
        </>
      )}
      <dt>Discipline</dt>
      <dd>{PROFILE.title}</dd>
      <dt>Base</dt>
      <dd>{PROFILE.location}</dd>
      <dt>Experience</dt>
      <dd>{PROFILE.experience}</dd>
      <dt>Stack</dt>
      <dd>{PROFILE.stack.slice(0, 4).join(' · ')}</dd>
    </dl>
    <NdaNote />
  </>
)

export const ProfileEducation = ({ decorated = true }: SectionProps) => (
  <>
    {decorated && (
      <Sticker
        src={STICKERS.chip}
        rotate={5}
      />
    )}
    <h3 className="sheet-subhead">{PROFILE.education.degree}</h3>
    <p className="sheet-text">
      {PROFILE.education.field}
      <br />
      <strong>{PROFILE.education.school}</strong> · {PROFILE.education.note}
    </p>
    <h3 className="sheet-subhead">Languages</h3>
    <dl className="data-rows profile__languages">
      {PROFILE.languages.map((language) => (
        <div key={language.name}>
          <dt>{language.name}</dt>
          <dd>{language.level}</dd>
        </div>
      ))}
    </dl>
    <h3 className="sheet-subhead">Credentials</h3>
    <ul className="chip-row">
      {PROFILE.credentials.map((item) => (
        <li key={item}>
          <TagChip tag={item} />
        </li>
      ))}
    </ul>
  </>
)
