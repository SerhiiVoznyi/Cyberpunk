import type { ReactNode } from 'react'

/** The Play sheet's CRT: a bezel and glass around the game, with scanlines and glare on top. */
export const CrtScreen = ({ children }: { children: ReactNode }) => (
  <div className="crt-screen">
    <div className="crt-screen__glass">{children}</div>
    <span
      className="crt-screen__scanlines"
      aria-hidden="true"
    />
    <span
      className="crt-screen__glare"
      aria-hidden="true"
    />
  </div>
)
