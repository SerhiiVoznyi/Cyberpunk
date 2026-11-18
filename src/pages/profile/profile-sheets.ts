import { PROFILE } from '@/content/profile'
import type { SheetMeta } from '@/lib/sheet-stack'

export const PROFILE_SHEETS = {
  summary: {
    id: 'summary',
    index: 1,
    title: 'Summary',
    teaser: PROFILE.role,
    edge: 'torn',
  },
  role: {
    id: 'role',
    index: 2,
    title: 'Role',
    teaser: `${PROFILE.title} · ${PROFILE.location}`,
    treatment: 'ink',
  },
  education: {
    id: 'education',
    index: 3,
    title: 'Education',
    teaser: `${PROFILE.education.degree} · languages · credentials`,
    treatment: 'yellow',
  },
} satisfies Record<string, SheetMeta>

export const PROFILE_ORDER = Object.keys(PROFILE_SHEETS)
