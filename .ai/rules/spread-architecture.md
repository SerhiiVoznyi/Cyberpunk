# Spread architecture

Invariants of the reader, the sheet stack and the page turn. Breaking one of these usually fails silently (wrong click target, jumpy animation, stale counter), so treat them as hard rules.

## Registry and routing

- Every navigable spread has an entry in `SPREADS` in `src/content/spreads.ts`; that order defines the counter, prev/next, arrow keys, turn direction and the website map route. A chapter is self-describing there: `perk` (icon, tooltip place, briefing sticker) puts it on the Map with a briefing sheet (`CHAPTERS` is derived from it), `board` places its perk (a `row` of the chapter column, or a free `cell` plus an outer `lane` for its wire), and `children` files child pages under it at `<path>/:slug`. Do not add parallel per-chapter tables elsewhere.
- `SPREADS` holds the chapters only. Child pages belong to their chapter and are read between it and the next chapter: `childOf(pathname)` resolves any of them, `children.order` gives the turn direction, and `children.slugs` gives prev/next order for collections. Journal entries (`/blog/:slug`) are read newest first through each entry's `newer`/`older` neighbours. Never put child pages in `SPREADS`: there may be 100k of them.
- The website map is exact: `SITE_ROUTE` (`src/content/site-map.ts`) is derived from `SPREADS`, one stop per spread. The board's `MAP_ROUTE` only adds positions to it, and the phone drawer's `SiteMapList` renders it as is. Connections appear only on hover or focus, between a stop and its reading-order neighbours. Never draw decorative stops or lines that are not pages.
- A bundle's siblings leave their parent in the order of the rows (or lanes) they reach, and every wire bends halfway to the nearest child, so bundles nest instead of crossing. A perk on a free cell beyond the entry column must set a `lane` above or below every tile; a straight wire would cut through the Journal's entry bundle.
- Layouts live in `SPREAD_PAGES` (`src/pages/registry.tsx`), one entry per spread id with optional `child` layouts, and briefing bodies in `BRIEFINGS` (`src/pages/briefings.tsx`). `src/router.tsx` builds its routes from `SPREADS` and `SPREAD_PAGES` and renders them with the `location` passed in by `SpreadTransition`, never the live router location, so the outgoing spread can finish turning.
- Each route element is remounted per pathname by the transition; do not rely on page state surviving navigation.

## Page turn

- The turn runs `exiting` → `breaching` (optional) → `entering` → `idle` in `use-spread-transition.ts`. Zoom resets at the end of `exiting`; the location swaps in at the start of `entering`. Do not add a second transition component: the swap, the remount, the zoom reset and the heading focus must happen in one place.
- `breaching` plays the Breach Protocol overlay only on the first visit to a chapter, never for child pages such as journal entries, applications or games (each is a first visit, and there may be thousands). The decision is made in the render that starts the turn, before `useRecordVisit` records the new path, and is kept in state for the whole turn.
- On the Map, the root perk (and on phones the drawer's Map entry) is a two-press "start over" button built on `useResetVisits`: the first press arms it for four seconds, the second clears the visit log except the Map, so perks relock and every chapter breaches again. Elsewhere that entry stays a link to the Map.
- The breach never mounts under `prefers-reduced-motion: reduce` or `body[data-fx='reduced']`. A tap on it, or Escape, Enter or Space, skips it; the key listener runs in the capture phase so Escape does not also reach the reader's back-to-map hotkey.
- Any phase between `exiting` and `entering` must keep matching the exit animation selectors, or the outgoing page loses its `forwards` fill and snaps back to flat.
- The overlay is decorative (`aria-hidden`, no live region of its own). It renders the riddle's `BreachBoard` without controls (spans, not buttons, inside an `inert` wrapper) from the same `BREACH_GAME` preset as the game, and replays the puzzle's planted `path` with picks spread across `BREACH_MS`. Change `BREACH_MS` or the preset rather than individual delays.

## Protected routes

- `PROTECTED_ROUTES` in `src/content/breach.ts` lists exact paths, `'/prefix/*'` rules (everything under the prefix, not the prefix itself) and `'/prefix/**'` rules (the prefix and everything under it). The Journal is locked with `'/blog/**'`, so one riddle guards `/blog`, every entry and read mode together; listing `'/blog'` and `'/blog/*'` separately would cost two solves. `/` is never protected: start-over lives there.
- Article bodies render only in the article route (gated by the router) and read mode (redirected while locked). Titles and summaries still appear on the Map and in the drawer; a new surface that renders post HTML must sit behind the same gate.
- The gate lives in the transition and the router, never in pages. `useSpreadTransition` holds a `displayedLocked` flag beside `displayed`, and `AppRouter({ location, locked })` renders `BreachPage` / `BreachMobile` in place of the routes while it is set. Every way in (map, links, typed URLs, prev/next) passes through that one check.
- A change of lock state on the same path is a turn: solving the riddle turns it into the real page, and the page key (`pathname:locked`) remounts it and moves focus to its `h1`. No auto-breach overlay plays into a locked route or on the unlock turn.
- Unlocks are stored per rule in `sv:breach` (`useBreachGate`), so one solve opens a whole rule. `useRecordVisit` skips locked paths, so perks light only after a real visit. Start-over relocks every rule.
- Read mode sits outside the shell, so `/blog/:slug/read` redirects to the article (and its riddle) while locked.
- Riddle state lives in `BreachGameProvider` above the sheet stack, because stacked sheets unmount their bodies. The riddle sheet stack sets `scrollDepth={false}` so the wheel never flips sheets mid-run.
- This is a game gate, not access control: every route's content still ships to the client.
- The free-play Breach Protocol game (`/games/breach-protocol`) runs its own `BreachGameProvider` and never calls `useBreachGate`, so playing it unlocks nothing. Keep game sessions away from the gate.

## Collections

- Applications and Games are collection chapters: a `Shelf` (`src/content/collections.ts`) holds the items, the list spread's copy and plate. One generic list spread (`src/pages/collection/`) and one generic item spread (`src/pages/collection-item/`) render every shelf; do not fork them per collection.
- A playable item gets an `ItemPlayer` in `GAME_PLAYERS` (`src/pages/games/game-players.ts`), lazy-loaded. Its `Session` wraps the whole sheet stack (stacked sheets unmount their bodies, so a run must live above them), `Play` is the Play sheet body, and `Manual` closes the Overview sheet. A playable item's stack sets `scrollDepth={false}`.
- Collection item visits are logged as `<chapter>:<slug>`, so a collection perk's level is items opened out of items filed.
- The generic layouts own geometry only. A shelf's `theme` picks a `CollectionTheme` from `COLLECTION_THEMES`, which supplies the scene class, an `aria-hidden` `Backdrop` plate (depth 2.5, between the art and the sheets), the list body (`Index`), the detail bodies (`Overview`, `Details`), an optional `PlayFrame` and each sheet's title, teaser and treatment. A new theme is a folder under `src/pages/collection-themes/`, not a fork of the layouts.

## Layers and geometry

- A spread is `SheetScene` → optional `SheetStackProvider` → `Plate`s, ad-hoc `.layer` elements, and one `SheetStack` of `Sheet`s. Flat UI (such as `BackToMap`) goes in the scene's `overlay` prop.
- Geometry is derived in CSS from a single `--layer-depth` per layer. Never compute layer positions or depth styles in JavaScript.
- Promotion rotates the order (the old front sheet cycles to the back); do not reimplement it as a swap.
- Pointer parallax writes `--parallax-x` / `--parallax-y` on the scene root in `requestAnimationFrame`. Never put pointer position into React state.
- 3D containers (`.sheet-scene__rig`, `.sheet-stack`) have `pointer-events: none` because their plane sits in front of layers pushed back in Z; layers re-enable pointer events. Any new `preserve-3d` wrapper must follow the same rule or it will swallow clicks.
- `.layer` owns `transform`; the entering animation drives the individual `translate` property and `opacity`. Position layers with `top` / `left` / `inset` / `margin`, never with `translate`, and do not end keyframes on hard-coded opacity.
- Map perk tiles and other elements that must stay pinned to artwork are children of that `Plate`, not separate layers.
- Plates carry no zoom or magnify buttons. Do not add a per-artwork zoom control to `Plate` or any page; reader zoom lives only in the reader chrome.

## Sheets

- A sheet's front state renders its full content; stacked sheets render only the spine button (index, title, teaser). Keep teasers short — they are vertical one-liners.
- Promotions that unmount the focused control must call `promote(id, { focus: true })` so focus moves to the new front heading. Hover and scroll promotions must not move focus.
- A stack needs room: each stacked sheet costs one `--sheet-peek` of width. With four or more sheets, reduce the peek for that region rather than shrinking the front sheet's text column.
- Scroll depth advances at most one sheet per wheel gesture, and only once the sheet's own scroll has hit its end.

## Headings and focus

- Each spread has exactly one `h1`, marked as the turn's focus target with `DisplayTitle spreadHeading` (or `tabIndex={-1}` plus `data-spread-heading`).
- Sheet titles are `h2`; markdown inside sheets starts at `h3` (the renderer shifts levels).

## View modes

- `spread` (2.4:1 stage) and `single` (one page) are both first-class. Single mode is forced below 900px wide or under a 5:4 aspect ratio. Every spread must have single-view overrides via `.page-root[data-view='single']` and the `--single-stack-top` variable.
- `phone` is the third mode. It is forced by `(max-width: 500px) and (orientation: portrait)`, which is read synchronously so the first frame mounts the right layout. Phone landscape falls back to `single`. `ReaderProvider` exposes `isPhone` and mirrors the mode on `body[data-view]` for UI mounted outside the reader, such as the disclaimer. Zoom is pinned to 1 in phone mode.

## Phone view

- **Layouts:** every route renders its own `<page>.mobile.tsx`, which the router picks with `pick(isPhone, desktop, mobile)`. Both layouts compose the same `<page>-sections.tsx` bodies and `<page>-sheets.ts` metadata. Never copy sheet content into a layout file.
- **Chrome:** `TopBar`, `BottomToolbar` and `ReaderBleed` are not rendered. Navigation, pagination, the soundtrack and the website map (`SiteMapList` over `SITE_ROUTE`) live in `NavDrawer`, which opens from a fixed button on the left. The disclaimer keeps the right side as a matching fixed button. `BackToMap` is not used.
- **Title row:** each mobile spread has one `MobileHeader`, which holds the `h1` (`spreadHeading`) and sits between the two fixed buttons. Its height and the deck's top inset share `--phone-stack-top` (default `--phone-header-height`), so a two-line title changes one variable.
- **Deck:** under `.sheet-scene[data-view='phone']` the stack is a vertical deck. The front sheet is full width, and each stacked sheet drops one `--sheet-peek` lower, so its bottom edge shows as a full-width, horizontal spine tab. Geometry still comes only from `--layer-depth`. The scene is flattened (no perspective, `transform-style: flat`), so tabs line up and `z-index` orders the deck.
- **Swipe:** `useSwipeDepth` turns a sideways touch swipe into one `advance` step per gesture, with no focus move, and swallows the click that follows. The stack sets `touch-action: pan-y`, so vertical scrolling inside a sheet stays native.
- **Decoration:** mobile layouts pass `decorated={false}` to sections and render no decals, captions, kickers or stickers. Inputs use at least `1rem` type so iOS does not zoom on focus.
