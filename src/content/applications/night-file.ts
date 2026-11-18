import type { CollectionItem } from '../collections'

export const NIGHT_FILE: CollectionItem = {
  slug: 'night-file',
  title: 'Night File',
  summary:
    'This site: a Cyberpunk 2077 comic-style artbook reader where every page is a stack of paper sheets that turns like a comic spread.',
  date: '2026-11-18',
  status: 'Live',
  tags: ['web', 'personal site', 'interactive'],
  stack: ['React 19', 'TypeScript', 'Vite', 'Mantine', 'React Router', 'Sass'],
  links: [
    {
      label: 'Source on GitHub',
      href: 'https://github.com/SerhiiVoznyi/Cyberpunk',
      icon: 'la-github',
    },
  ],
  sections: [
    {
      title: 'What it is',
      paragraphs: [
        'A personal site and journal built as an artbook. Each route is a spread of layered sheets inside a persistent HUD frame: sheets drift with the pointer, reorder when clicked, and the whole spread turns like a page on navigation.',
        'Some chapters sit behind ICE. The Breach Protocol riddle stands in for them until it is solved, and the first visit to a chapter plays a short breach cinematic.',
      ],
    },
    {
      title: 'How it is built',
      paragraphs: [
        'No animation library: the page turn is a small hand-rolled phase machine, and every layer derives its geometry in CSS from a single depth variable.',
        'Phones get their own layout of every spread, composed from the same sheet bodies as the desktop.',
      ],
    },
  ],
}
