import type { CollectionItem } from '../collections'

/** Stands in for the registry until the first real application ships; replace it then. */
export const REGISTRY_PENDING: CollectionItem = {
  slug: 'registry-pending',
  codename: 'REGISTRY_PENDING.dmn',
  title: 'Under development',
  summary:
    'This section is under development. Real applications will appear here once their release period is scheduled.',
  date: '2026-11-18',
  status: 'In development',
  tags: ['in development', 'release pending'],
  stack: [],
  links: [],
  sections: [
    {
      title: 'Status',
      paragraphs: [
        'The daemon registry is being prepared. No applications are published yet.',
      ],
    },
    {
      title: 'What to expect',
      paragraphs: [
        'Real applications will be listed here, each with a readme, its runtime stack and links to run it, once their release period is scheduled.',
      ],
    },
    {
      title: 'Release',
      paragraphs: [
        'Release dates are not scheduled yet. This entry is replaced as soon as the first application ships.',
      ],
    },
  ],
}
