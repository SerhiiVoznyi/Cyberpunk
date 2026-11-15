# Add a spread

Use when adding a new top-level page to the artbook. Read the [`artbook-spreads`](../skills/artbook-spreads/SKILL.md) skill first.

1. **Pick the archetype.** `art` (full-bleed art plus a small stack), `split` (paper stack on the left, art on the right), `paper` (wide paper stack), or `map`. Pick a thematic label and a conventional URL.
2. **Register it.** Add a `SpreadMeta` entry to `SPREADS` in `src/content/spreads.ts` at the position it should take in the reading order. The website map's stops come from `SITE_ROUTE` (`src/content/site-map.ts`), in reading order: the Map is the root, then the chapters, with the Journal's newest three entries (from the journal manifest) plus an Archive stop after it. The board (`MAP_ROUTE` in `src/pages/map/map-nodes.ts`) places those stops as a perk tree, and the phone drawer lists the same stops. If it is a chapter with its own briefing sheet, also add its id to `CHAPTERS` in `spreads.ts`, give it an icon and place in `CHAPTER_STOPS` (`site-map.ts`), and give it a board row in `CHAPTER_ROWS` (`map-nodes.ts`). Perk art lives in `public/assets/art/perks/perk-<name>.webp` (white line art on black, used as a luminance mask). Locked sockets give way automatically to any perk placed on their cell. Posts are not spreads and need no map edit. Perks turn yellow once the reader has visited them (`useVisits`), and hovering or focusing one lights the traces to its parent and children and shows its tooltip.
3. **Create the page.** Every spread has three parts in `src/pages/<name>/`:
   - `<name>-sheets.ts`: the sheet metadata (`SheetMeta`: id, index, title, teaser, treatment, edge) and the initial order;
   - `<name>-sections.tsx`: one component per sheet body, taking `decorated?: boolean` for stickers and other decoration;
   - two layouts that compose them: `<name>.tsx` with `<name>.sass` for the desktop, and `<name>.mobile.tsx` with `<name>.mobile.sass` for the phone.

   Copy lives only in the sections, never in a layout file. Export both layouts from `src/pages/index.ts` (keep the exports alphabetical).

4. **Compose layers.**
   - **Desktop:** wrap the page in a `SheetScene` with `BackToMap` in `overlay`. Add a back plate, a title layer with one `DisplayTitle spreadHeading`, and a `SheetStack` of two to four `Sheet`s with short teasers.
   - **Mobile:** use a `SheetScene` with class `<name> <name>-m`, a dim full plate, one `MobileHeader` (it holds the `h1`), and a `SheetStack` of the same sheets with `decorated={false}`. There is no `BackToMap`, because the navigation drawer covers it.
   - **Copy:** use profile copy from `src/content/profile.ts` only.
5. **Route it.** Add a `<Route>` in `src/router.tsx` with `element={pick(isPhone, <NamePage />, <NameMobile />)}`.
6. **Style it.** Scope every rule under the page root class. On the desktop layout, add `&[data-view='single']` overrides and set `--single-stack-top`. Keep `<name>.mobile.sass` under `.<name>-m`, for full-width reflow only, and set `--phone-stack-top` when the title needs two lines.
7. **Verify.** Run the [`verify-ui`](verify-ui.md) workflow, paying particular attention to the counter total, turn direction from both neighbours, and promotion of every sheet, on both the desktop and the phone layout.
