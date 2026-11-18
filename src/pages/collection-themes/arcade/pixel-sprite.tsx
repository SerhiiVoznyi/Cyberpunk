import { cx } from '@/lib/cx'

/** Pixel art as rows of `#` (lit) and `.` (empty); drawn in `currentColor`. */
const SPRITES = {
  invader: [
    '..#.....#..',
    '...#...#...',
    '..#######..',
    '.##.###.##.',
    '###########',
    '#.#######.#',
    '#.#.....#.#',
    '...##.##...',
  ],
  ghost: [
    '...####...',
    '.########.',
    '##..##..##',
    '##..##..##',
    '##########',
    '##########',
    '##########',
    '#.##..##.#',
  ],
  heart: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
  coin: ['..###..', '.#...#.', '#..#..#', '#..#..#', '#..#..#', '.#...#.', '..###..'],
} as const

export type SpriteName = keyof typeof SPRITES

/** A decorative pixel sprite; the caller hides it from assistive tech with its wrapper. */
export const PixelSprite = ({
  name,
  className,
}: {
  name: SpriteName
  className?: string
}) => {
  const rows = SPRITES[name]
  const width = rows[0].length

  return (
    <svg
      className={cx('pixel-sprite', `pixel-sprite--${name}`, className)}
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      focusable="false">
      {rows.flatMap((row, y) =>
        [...row].map((pixel, x) =>
          pixel === '#' ? (
            <rect
              key={`${x}:${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="currentColor"
            />
          ) : null,
        ),
      )}
    </svg>
  )
}
