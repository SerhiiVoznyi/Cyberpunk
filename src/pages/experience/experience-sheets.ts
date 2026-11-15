import { IMPACT_HEADLINE, PROJECTS } from '@/content/career'
import { PROFILE } from '@/content/profile'
import type { SheetMeta } from '@/lib/sheet-stack'

export const EXPERIENCE_SHEETS = {
  career: {
    id: 'career',
    index: 1,
    title: 'Career',
    teaser: `${PROFILE.role} · ${PROFILE.experience}`,
    edge: 'torn',
  },
  projects: {
    id: 'projects',
    index: 2,
    title: 'Projects',
    teaser: `${PROJECTS.length} client projects · fintech, banking, property`,
  },
  impact: {
    id: 'impact',
    index: 3,
    title: 'Impact',
    teaser: IMPACT_HEADLINE,
    treatment: 'ink',
  },
  stack: {
    id: 'stack',
    index: 4,
    title: 'Stack',
    teaser: PROFILE.stack.join(' · '),
    treatment: 'yellow',
    edge: 'notched',
  },
} satisfies Record<string, SheetMeta>

export const EXPERIENCE_ORDER = Object.keys(EXPERIENCE_SHEETS)
