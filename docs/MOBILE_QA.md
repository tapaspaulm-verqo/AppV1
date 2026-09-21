# Mobile QA log

Manual + scripted verification of the Angular web app on narrow phone
viewports. Uses Playwright with device emulation presets (iPhone SE 320px,
iPhone 14 390px, Pixel 7 412px, Galaxy S9+ 320px), checking
`document.documentElement.scrollWidth` vs `clientWidth` for horizontal
overflow and taking full-page screenshots for a visual pass.

## 2026-09-21 — Hero video banner + site-wide overflow fix

Triggered by: adding the branding video as the home page hero banner and
checking it on mobile.

- Home page hero: video autoplays, loops, and renders translucent
  (`opacity: 0.4`) with the dark scrim overlay on all four tested devices.
- Found and fixed two **pre-existing** bugs, unrelated to the hero video,
  affecting every page on narrow screens:
  1. **Header CSS specificity bug** — the `@media (max-width: 560px)` rule
     hiding `.login-link` / `.btn-client-outline` was losing the cascade to
     the unconditional `.actions .btn` rule (lower source-order priority
     doesn't matter when specificity is lower). The outline "Hire talent"
     button never actually hid, forcing horizontal scroll on the whole
     site below 560px. Fixed by scoping the hiding rule under
     `.site-header` to raise its specificity.
  2. **320px-only overflow** — even after the fix above, the header
     row (wordmark + last CTA) and the home page's `.audience-card`
     `.text-link` elements (`white-space: nowrap`) were both a few pixels
     too wide for a 320px viewport (iPhone SE / Galaxy S9+). Fixed with a
     `@media (max-width: 340px)` wrap fallback on the header row, and
     `@media (max-width: 360px) { .text-link { white-space: normal; } }`
     on the home page.
- Verified after fix: all four devices report `scrollWidth === clientWidth`
  (no overflow) and the video still plays/loops correctly on each.
- Files changed: `shared/header/header.component.ts`,
  `pages/home/home.component.ts` (commit `937baed`).

## 2026-09-21 — Freelancer signup page (`/signup/freelancer`)

Checked after the header/home overflow fix above, to confirm the fix held
site-wide and the signup form itself has no layout issues on phones.

- All four devices: `pageOverflowX: false`, `scrollWidth === clientWidth`,
  zero overflowing elements.
- Visual check at 320px (iPhone SE) and 412px (Pixel 7): all fields
  (Email, Password, Full name, Primary role, PAN number, Aadhaar number,
  EPF UAN) render and wrap correctly; "Create freelancer account" button
  and the Terms of Use / Privacy Policy / Freelancer Agreement legal note
  wrap cleanly with no cutoff.
- No code changes required — page was already clean once the site-wide
  fix landed.

## 2026-09-21 — Client signup page (`/signup/client`)

Same pass as above, for the client-side registration form.

- All four devices: `pageOverflowX: false`, `scrollWidth === clientWidth`,
  zero overflowing elements.
- Visual check at 320px and 412px: Email, Password, Company name, and
  GSTIN fields render correctly (GSTIN placeholder `22AAAAA0000A1Z5` shown
  in full); purple "Create client account" button and the Terms of Use /
  Privacy Policy / Client Agreement legal note wrap cleanly.
- No code changes required.
