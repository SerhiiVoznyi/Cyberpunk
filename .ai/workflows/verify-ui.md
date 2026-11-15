# Verify UI

Run after any change to spreads, sheets, chrome, styles or effects.

1. **Static checks.** `npm run lint` (zero warnings), `npm run build`, and `npx prettier --check --end-of-line auto "src/**/*.{ts,tsx}"`.
2. **Spread view at 1280×720.** For every affected spread, confirm that:
   - nothing overlaps the back-to-map pill;
   - front sheet content fits or scrolls;
   - spines are legible;
   - text over art has a backing panel.
3. **Interactions.**
   - Clicking each visible spine strip promotes that sheet (check with `elementFromPoint` if a click seems dead).
   - Arrow keys, `+` / `-`, `M` and Escape behave as expected.
   - Page turns run in both directions.
   - Zoom and drag-pan work, and a pan does not trigger a click.
   - Scroll past the end of a long sheet advances one sheet per gesture.
4. **Accessibility.**
   - Exactly one `h1`, and it receives focus after a turn.
   - The live region announces "Spread N of M: Label".
   - Every control has an accessible name.
   - Decorative layers are `aria-hidden`.
5. **Single view.** Check a near-square window (for example 820×760): titles stay clear of the pill, the stack fits, and the toolbar does not overflow.
6. **Phone view.** Emulate an iPhone 12 Pro Max (428×926, DPR 3, `mobile: true`, touch on) and walk every route, then repeat at 360×740.
   - The front sheet body is full width, and nothing overflows sideways (`scrollWidth` equals the viewport width).
   - The title row clears both fixed buttons.
   - Tapping each tab promotes its sheet. Check with `elementFromPoint` at the tab's centre, because the spine button covers the whole sheet, so ref-based clicks aim at the hidden middle.
   - A sideways touch swipe moves exactly one sheet, and a vertical drag moves none.
   - The navigation drawer opens and closes by button, Escape and backdrop. Every website-map link and the counter navigate and close it, and the `h1` takes focus after the turn.
   - The disclaimer button opens its panel.
   - Read mode has no horizontal overflow.
7. **Reduced modes.**
   - With `prefers-reduced-motion: reduce` emulated, the turn collapses to a short fade and parallax is off.
   - With the power (FX) toggle on, grain, glitch, blur and tilt are off.
8. **Clean up.** Clear `sv:*` localStorage keys and any device emulation you set, and remove temporary test files (for example test audio).
