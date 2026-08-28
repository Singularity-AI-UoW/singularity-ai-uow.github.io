# Publish Hermes Agent workshop resources

## Summary

- Added the standalone, no-JS-readable workshop page at `/workshops/build-your-own-ai-agent/` with mobile-first styling, print rules, accessible headings/focus states, the workshop cover, and PDF/DOCX downloads.
- Updated the 4 September 2026 event card to `Build Your Own AI Agent` with the approved `6:00 pm - 8:00 pm` time and `MSB.0.01, Hamilton Campus, University of Waikato` location, plus the `Open workshop guide` resource CTA.
- Fixed the static publisher so generated nested directories (including `workshops/`) are recursively replaced and added a regression test for stale-output removal and source preservation.
- Kept the workshop guide artifacts byte-for-byte unchanged after the existing Task 10 generation.

## Local verification

All checks were run from `/tmp/aemeath-singularity-site` against the local Vite server at `http://127.0.0.1:4173/`:

- `npm run test:publish-root` — PASS (1 test, 0 failures).
- `npm run verify:workshop` — PASS (page, download links/files, required workshop content, official URLs, event data, and forbidden-marker checks).
- `npm run build` — PASS (Vite 8.0.10; 1,824 modules transformed; generated output published).
- `git diff --check` — PASS.
- Headless Firefox/Selenium DOM run — PASS at 1440px and 390px: no horizontal overflow, no blank links, all images loaded, workshop title/date/time/location and semantic headings present, 4 September card selected, CTA points to the workshop route, and mobile detail remains selected after smooth scrolling.
- Direct HTTP checks — PASS (200): workshop HTML, PDF, DOCX, event artwork, and generated JS asset.
- Guide artifacts — PDF 504,210 bytes, 15 pages, SHA-256 `327f979b2750634661180bd1f25a32030879f74affd0d32832bb9a3de901932a`; DOCX 388,713 bytes, SHA-256 `516299315d18d2e9a795902e3bd7ff5d233d221038105f0dd1d3340ac21bdc5f`.
- Visual review — desktop/mobile workshop page and desktop/mobile selected event card screenshots reviewed; no visible clipping, broken artwork, or layout overflow.

## Screenshots

- `/tmp/aemeath-singularity-verification/workshop-desktop-1440x900.png`
- `/tmp/aemeath-singularity-verification/workshop-mobile-390x844.png`
- `/tmp/aemeath-singularity-verification/event-desktop-1440x1200.png`
- `/tmp/aemeath-singularity-verification/event-mobile-390x1200.png`

## Privacy and deployment state

The changed page and source contain no live credentials, tokens, passwords, mailbox data, analytics, or credential collection. The page explicitly describes the read-only Gmail/Himalaya boundary, Telegram fallback, installation prerequisite, 90-minute maximum/demo-first flow, and no-send/no-move/no-delete/no-re-flag policy.

This is a local-only implementation. Nothing was pushed, no PR was opened, and the deployed site was not changed.

## Known limitations

- The repository has no `lint` or general `test` npm script; the publisher regression test and workshop verifier are the available project checks.
- `npm audit --json` remains non-zero on the unchanged dependency tree: 6 advisories (3 moderate, 3 high, 0 critical), including existing React Router, nanoid, PostCSS, and Vite advisories. Dependency upgrades were outside this task.
- Firefox WebDriver in this environment does not expose Selenium `get_log('browser')`; console health was therefore covered by successful page/image loads, DOM assertions, and Firefox headless stderr inspection rather than a browser-log API.
