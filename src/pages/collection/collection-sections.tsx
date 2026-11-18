import { Sticker } from '@/components'

import type { ThemeListProps } from '../collection-themes/collection-theme'

export const CollectionAbout = ({ shelf, spread, decorated = true }: ThemeListProps) => (
  <>
    {decorated && spread.perk?.sticker && (
      <Sticker
        src={spread.perk.sticker}
        rotate={6}
        size="lg"
      />
    )}
    {shelf.about.map((paragraph, index) => (
      <p
        key={paragraph}
        className={index === 0 ? 'sheet-text sheet-text--lead' : 'sheet-text'}>
        {paragraph}
      </p>
    ))}
  </>
)
