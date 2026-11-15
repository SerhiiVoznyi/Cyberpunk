import { HazardRule, SocialLinks, Sticker, TagChip } from '@/components'
import { PROFILE } from '@/content/profile'
import { STICKERS } from '@/content/stickers'

/** `decorated={false}` drops stickers and rules, for layouts that spend no space on them. */
type SectionProps = { decorated?: boolean }

export const ContactChannels = ({ decorated = true }: SectionProps) => (
  <>
    <p className="status-tag">{PROFILE.availability.status}</p>
    <p className="sheet-text sheet-text--lead">{PROFILE.availability.statement}</p>
    <p className="sheet-text">{PROFILE.availability.invitation}</p>
    <h3 className="sheet-subhead">Topics</h3>
    <p className="sheet-text">{PROFILE.topics}</p>
    <ul
      className="chip-row"
      aria-label="Topics">
      {PROFILE.talkAbout.map((item) => (
        <li key={item}>
          <TagChip tag={item} />
        </li>
      ))}
    </ul>
    {decorated ? (
      <HazardRule
        tone="ink"
        className="contact__rule"
      />
    ) : (
      <h3 className="sheet-subhead contact__links-head">Open a channel</h3>
    )}
    <SocialLinks />
  </>
)

export const ContactSignal = ({ decorated = true }: SectionProps) => (
  <>
    {decorated && (
      <Sticker
        src={STICKERS.antenna}
        rotate={6}
        size="lg"
      />
    )}
    <dl className="data-rows">
      <dt>Status</dt>
      <dd>{PROFILE.availability.status}</dd>
      <dt>Role</dt>
      <dd>{PROFILE.role}</dd>
      <dt>Base</dt>
      <dd>{PROFILE.location}</dd>
      <dt>Time zone</dt>
      <dd>CET · UTC+1</dd>
      <dt>Handle</dt>
      <dd>{PROFILE.handle}</dd>
      <dt>Languages</dt>
      <dd>{PROFILE.languages.map((language) => language.name).join(' · ')}</dd>
    </dl>
  </>
)
