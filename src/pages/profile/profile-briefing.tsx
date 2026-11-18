import { PROFILE } from '@/content/profile'

export const ProfileBriefing = () => (
  <>
    <p className="sheet-text">{PROFILE.summary}</p>
    <dl className="glance-strip">
      {PROFILE.glance.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  </>
)
