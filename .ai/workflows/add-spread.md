# Add a spread

Use when adding a new top-level page to the artbook. Read the [`artbook-spreads`](../skills/artbook-spreads/SKILL.md) skill first. To add an application or a game to an existing collection, skip to [Add an application or a game](#add-an-application-or-a-game).

1. **Pick the archetype.** `art` (full-bleed art plus a small stack), `split` (paper stack on the left, art on the right), `paper` (wide paper stack), or `map`. Pick a thematic label and a conventional URL.
2. **Register it.** Add one `SpreadMeta` entry to `SPREADS` in `src/content/spreads.ts`, at the position it should take in the reading order. Everything else derives from that entry:
   - `perk: { icon, place, sticker }` makes it a chapter: a perk on the Map board, a stop in the phone drawer (`SITE_ROUTE`) and a briefing sheet on the Map (`CHAPTERS`). Add `'<name>'` to `PerkIcon` in `src/content/perks.ts` and the art at `public/assets/art/perks/perk-<name>.webp` (256 px, white line art on black, used as a luminance mask).
   - `board` places the perk: `{ row }` for the chapter column (rows 96 to 408 are taken), or `{ cell: [x, y], lane }` for a free cell beyond the entry column, with `lane` a board `y` above (about 30) or below (about 478) every tile so the wire runs around the other bundles. Locked sockets give way automatically to any perk placed on their cell.
   - `children` files child pages at `<path>/:slug`: `idPrefix` for the visit log, `order` for the turn direction, and `slugs` for prev/next order.

   Perks turn yellow once the reader has visited them (`useVisits`), and hovering or focusing one lights the traces to its parent and children and shows its tooltip. Posts are not spreads and need no map edit.

3. **Create the page.** Every spread has three parts in `src/pages/<name>/`:
   - `<name>-sheets.ts`: the sheet metadata (`SheetMeta`: id, index, title, teaser, treatment, edge) and the initial order;
   - `<name>-sections.tsx`: one component per sheet body, taking `decorated?: boolean` for stickers and other decoration;
   - two layouts that compose them: `<name>.tsx` with `<name>.sass` for the desktop, and `<name>.mobile.tsx` with `<name>.mobile.sass` for the phone.

   Copy lives only in the sections, never in a layout file. Export both layouts from `src/pages/index.ts` (keep the exports alphabetical). A chapter also gets `<name>-briefing.tsx`, its Map briefing body, listed in `BRIEFINGS` (`src/pages/briefings.tsx`).

4. **Compose layers.**
   - **Desktop:** wrap the page in a `SheetScene` with `BackToMap` in `overlay`. Add a back plate, a title layer with one `DisplayTitle spreadHeading`, and a `SheetStack` of two to four `Sheet`s with short teasers.
   - **Mobile:** use a `SheetScene` with class `<name> <name>-m`, a dim full plate, one `MobileHeader` (it holds the `h1`), and a `SheetStack` of the same sheets with `decorated={false}`. There is no `BackToMap`, because the navigation drawer covers it.
   - **Copy:** use profile copy from `src/content/profile.ts` only.
5. **Route it.** Add an entry to `SPREAD_PAGES` in `src/pages/registry.tsx` under the spread's id: `{ desktop: <NamePage />, mobile: <NameMobile /> }`, plus `child: { desktop, mobile }` when it has child pages. The router builds every route from `SPREADS` and `SPREAD_PAGES`; do not hand-write routes in `src/router.tsx`.
6. **Style it.** Scope every rule under the page root class. On the desktop layout, add `&[data-view='single']` overrides and set `--single-stack-top`. Keep `<name>.mobile.sass` under `.<name>-m`, for full-width reflow only, and set `--phone-stack-top` when the title needs two lines.
7. **Verify.** Run the [`verify-ui`](verify-ui.md) workflow, paying particular attention to the counter total, turn direction from both neighbours, and promotion of every sheet, on both the desktop and the phone layout. With more chapters, check that the Map's briefing stack still fits (its peek is tuned in `map.sass`) and that the board's traces do not cross.

## A new collection chapter

A list of items with a page each (like Applications and Games) needs no new pages. Add a `Shelf` (theme, items, nouns, kicker, plate, about copy, empty state) beside its items in `src/content/<name>/index.ts`, register the chapter in `SPREADS` with `children: collectionChildren('<name>', ITEMS)`, then point `SPREAD_PAGES` at `CollectionPage` / `CollectionMobile` and `CollectionItemPage` / `CollectionItemMobile` with that shelf, and `BRIEFINGS` at `CollectionBriefing`. Pick an existing `theme` (`blackwall`, `arcade`), or add one: a folder under `src/pages/collection-themes/<name>/` with a backdrop, a list body, detail bodies and scoped `<name>.sass` / `<name>.mobile.sass`, registered in `COLLECTION_THEMES` (see the design system's Chapter themes).

## Add an application or a game

1. Create `src/content/applications/<slug>.ts` (or `src/content/games/<slug>.ts`) exporting a `CollectionItem`: slug, title, summary, ISO `date`, `status`, `tags`, `stack`, `links`, optional `cover`, and `sections` of paragraphs.
2. Add it to the array in that folder's `index.ts`. The list sorts newest first; the Map perk level, prev/next, the briefing and the routes pick it up automatically.
3. For a playable game, build it in `src/pages/games/<slug>/` with three exports: a `Session` that holds the game state (wrapping the sheet stack), a `Play` body and an optional `Manual`. Register them, lazy-loaded, in `GAME_PLAYERS` (`src/pages/games/game-players.ts`) under the same slug; the page then opens on its Play sheet. Scope phone overrides under `.collection-item-m`.
