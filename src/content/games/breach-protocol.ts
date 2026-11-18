import type { CollectionItem } from '../collections'

export const BREACH_PROTOCOL: CollectionItem = {
  slug: 'breach-protocol',
  title: 'Breach Protocol',
  summary:
    'The code matrix that guards the locked chapters, as a free-play game: land the sequence in the buffer before the clock runs out.',
  date: '2026-11-18',
  status: 'Playable',
  tags: ['puzzle', 'cyberpunk', 'browser'],
  facts: [
    { label: 'Players', value: '1' },
    { label: 'Run', value: '15 s' },
    { label: 'Difficulty', value: 'Medium' },
    { label: 'Controls', value: 'Mouse · touch · keys' },
  ],
  stack: ['React 19', 'TypeScript'],
  links: [
    {
      label: 'Source on GitHub',
      href: 'https://github.com/SerhiiVoznyi/Cyberpunk/tree/main/src/lib/breach',
      icon: 'la-github',
    },
  ],
  sections: [
    {
      title: 'The run',
      paragraphs: [
        'Every matrix is generated from a seed with a solution planted in it. Pick codes row by row and column by column so the buffer ends with the target sequence.',
        'Playing here unlocks nothing: the chapters behind ICE keep their own riddle.',
      ],
    },
  ],
}
