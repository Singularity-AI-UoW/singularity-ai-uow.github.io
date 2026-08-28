# Publish Hermes Agent workshop resources

## Summary

- Added the standalone, no-JS-readable workshop page at `/workshops/build-your-own-ai-agent/` with mobile-first styling, print rules, accessible headings/focus states, workshop artwork, and PDF/DOCX downloads.
- Updated the 4 September 2026 event to `Build Your Own AI Agent` with the approved `6:00 pm - 8:00 pm` time and `MSB.0.01, Hamilton Campus, University of Waikato` location, beginner-friendly audience label, exact logistics in the selected detail card, and an `Open workshop guide` CTA.
- Clarified that the two-hour event window includes arrivals/setup/troubleshooting while the taught route is capped at 90 minutes; separated the three required preflight items from the optional Gmail lane.
- Fixed the static publisher so generated nested directories (including `workshops/`) are recursively replaced, with a regression test for stale-output removal and source preservation.
- Kept the workshop guide artifacts byte-for-byte unchanged and corrected the community Discord URL to the approved invite.

## Local verification

All checks were run from `/tmp/aemeath-singularity-site` against the generated static root served at `http://127.0.0.1:4174/`:

- `npm run test:publish-root` — PASS (1 test, 0 failures).
- `npm run verify:workshop` — PASS (page, downloads, required content, exact links, event data, detail-card logistics, and forbidden-marker checks).
- `npm run build` — PASS (Vite 8.0.10; 1,824 modules transformed; generated root published).
- `git diff --check` and Node syntax checks — PASS.
- Direct HTTP checks — PASS (200 with expected MIME types): root, workshop HTML/CSS, PDF, DOCX, event artwork, and generated assets.
- Headless Firefox/Selenium — PASS at 1440 px and Firefox's 500 px minimum viewport: no horizontal overflow, no blank links, all images loaded, exact event metadata present, September event selection/detail/CTA matched, and direct workshop-route refresh worked.
- Constrained 390 px no-JS document-flow check — PASS: body client/scroll width both 390 px, 23 links present, no broken images, no internal overflow, and required content/links present.
- Print CSS — PASS: valid seven-page Letter PDF; every page visually inspected; community URLs wrap without collisions.
- Guide artifacts — PDF 504,210 bytes, 15 pages, SHA-256 `327f979b2750634661180bd1f25a32030879f74affd0d32832bb9a3de901932a`; DOCX 388,713 bytes, SHA-256 `516299315d18d2e9a795902e3bd7ff5d233d221038105f0dd1d3340ac21bdc5f`.
- Visual review — desktop workshop page, constrained 390 px page, selected September event viewport, and seven-page print contact sheet all received final PASS verdicts.

## Final review evidence

- `/tmp/aemeath-final-site-review/workshop-desktop-final.png`
- `/tmp/aemeath-final-site-review/workshop-390-flow-final.png`
- `/tmp/aemeath-final-site-review/event-viewport-desktop-final2.png`
- `/tmp/aemeath-final-site-review/print-contact-sheet-final-fixed.png`
- `/tmp/aemeath-final-site-review/workshop-print-final.pdf`

## Privacy and deployment state

The changed page and source contain no live credentials, tokens, passwords, mailbox data, analytics, credential collection, or dynamic user-input rendering. The page explicitly describes the read-only Gmail/Himalaya boundary, approved/synthetic input, Telegram fallback, installation prerequisite, two-hour window versus 90-minute teaching cap, and no-send/no-move/no-delete/no-re-flag policy.

This is a local-only implementation. Nothing was pushed, no PR was opened, and the deployed site was not changed. The canonical workshop URL currently returns GitHub Pages 404 and is expected to remain unavailable until this branch is approved, pushed, and deployed.

## Known limitations

- The repository has no `lint` or general `test` npm script; the publisher regression test, workshop verifier, production build, syntax checks, and browser/HTTP checks are the available project gates.
- `npm audit --json` remains non-zero on the unchanged dependency tree: 6 advisories (3 moderate, 3 high, 0 critical). `npm audit --omit=dev --json` reports 3 moderate production advisories in React Router; the high advisories are in existing dev tooling (`nanoid`, `postcss`, and `vite`). Dependency upgrades are outside this change.
- The GitHub targeted secret-scanning API could not run because GitHub Advanced Security is not enabled for this repository; local forbidden-marker/privacy checks passed.
- Firefox WebDriver in this environment does not expose Selenium `get_log('browser')`; console health was covered by successful page/image loads, DOM assertions, HTTP checks, and Firefox headless stderr inspection.
