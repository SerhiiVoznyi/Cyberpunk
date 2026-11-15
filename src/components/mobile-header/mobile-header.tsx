import './mobile-header.sass'

import type { ReactNode } from 'react'

import { type CSSVars, cx } from '@/lib/cx'

import { DisplayTitle } from '../display-title/display-title'

type MobileHeaderProps = {
  /** Joined into one run of lettering; the row has no room for stacked lines. */
  lines: readonly string[]
  /** A short readout set beside the title, such as an entry count. */
  kicker?: ReactNode
  /** Lines the title may wrap to before it is cut; two needs a taller `--phone-stack-top`. */
  clamp?: 1 | 2
  className?: string
}

/** The phone view's title row: the spread's only h1, between the navigation and disclaimer buttons. */
export const MobileHeader = ({
  lines,
  kicker,
  clamp = 1,
  className,
}: MobileHeaderProps) => (
  <header
    className={cx('mobile-header', 'layer', className)}
    data-clamp={clamp}
    style={{ '--layer-depth': 0 } as CSSVars}>
    <DisplayTitle
      lines={[lines.join(' ')]}
      size="md"
      spreadHeading
      className="mobile-header__title"
    />
    {kicker && <p className="mobile-header__kicker">{kicker}</p>}
  </header>
)
