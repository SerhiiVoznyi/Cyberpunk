export type PerkIcon =
  | 'map'
  | 'profile'
  | 'experience'
  | 'applications'
  | 'games'
  | 'journal'
  | 'contact'
  | 'entry'
  | 'archive'
  | 'locked'

/** Perk art is white line work on black, used as a luminance mask so each state tints it. */
export const perkIconUrl = (icon: PerkIcon) =>
  `url('/assets/art/perks/perk-${icon}.webp')`
