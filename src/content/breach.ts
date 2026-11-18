/**
 * Routes that open only after the reader cracks the breach. A rule is one of:
 * - an exact path: '/contact';
 * - '/prefix/*', everything under it but not the path itself ('/blog/*' guards every entry,
 *   not the Journal);
 * - '/prefix/**', the path and everything under it ('/experience/**' guards the Journal and every
 *   entry, read mode included).
 * One solve opens a whole rule. This is a game gate, not access control: the content of every
 * route still ships to the client.
 */
export const PROTECTED_ROUTES: readonly string[] = ['/contact', '/experience/**']

const normalize = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

const matches = (rule: string, pathname: string) => {
  if (rule.endsWith('/**')) {
    const base = rule.slice(0, -3)
    return pathname === base || pathname.startsWith(`${base}/`)
  }
  if (rule.endsWith('/*')) {
    const base = rule.slice(0, -2)
    return pathname.startsWith(`${base}/`)
  }
  return pathname === normalize(rule)
}

/** The rule guarding a path, or null. The Map ('/') is never protected: start-over lives there. */
export const protectedRuleFor = (pathname: string): string | null => {
  const path = normalize(pathname)
  if (path === '/') return null
  return PROTECTED_ROUTES.find((rule) => matches(rule, path)) ?? null
}
