# Publish Hermes Agent workshop resources

## Summary

- Added the standalone, no-JS-readable workshop page for the canonical route `https://singularity-ai-uow.github.io/workshops/build-your-own-ai-agent/` with mobile-first styling, print rules, accessible headings/focus states, workshop artwork, and PDF/DOCX downloads.
- Updated the 4 September 2026 event to `Build Your Own AI Agent` with the approved `6:00 pm - 8:00 pm` time and `MSB.0.01, Hamilton Campus, University of Waikato` location, beginner-friendly audience label, exact logistics in the selected detail card, and an `Open workshop guide` CTA.
- Clarified that the two-hour event window includes arrivals/setup/troubleshooting while the taught route is capped at 90 minutes; separated the three required preflight items from the optional Gmail lane.
- Hardened static publication end to end: the build rejects symlinks under `public/` before Vite can dereference them; the publisher rejects symlinks in the publication root path, rechecks `dist/` and destinations, requires reserved generated directories to be directories and generated file names/extensions to be regular files in both new output and stale-manifest cleanup, stages every output, preserves and reports backup locations after incomplete rollback, and uses a bounded versioned manifest to remove stale generated top-level targets without touching source files.
- Replaced open-ended browser-surface modeling with a fail-closed static document grammar: only the HTML-namespace elements and per-element attributes used by this page are accepted; foreign namespaces, templates, `<base>`, scripts/forms/frames, `<noscript>`, event handlers, refreshes, and unknown navigation metadata such as `ping`, `attributionsrc`, or `ismap` are rejected. Stylesheet/image targets are fixed to their local assets, and every anchor must use an exact approved raw spelling, HTTPS destination, and safe `_blank`/`noreferrer` pair when targeting a new context; URL normalization, encoded bytes, credentials, and extra origins cannot widen the allowlist. Official links are checked through parsed active anchors rather than raw HTML text.
- Kept the workshop guide artifacts byte-for-byte unchanged and corrected the community Discord URL to the approved invite.

## Local verification

All checks were run against the generated static output before public write:

- `npm run test:workshop` — PASS (40 tests, 0 failures), including pre-Vite/source/destination/root/ancestor symlink rejection, generated-file/directory type-confusion rejection for both new output and stale cleanup, staged publication and rollback-backup preservation, stale top-level cleanup, full source/generated-tree corruption detection, fail-closed HTML element/attribute grammar, SVG/xlink/SMIL rejection, navigation-metadata and resource-target checks, exact raw anchor spellings, target/relationship safety, encoded-path and userinfo rejection, official-link enforcement, and checksum-corruption regressions.
- `npm run verify:workshop` — PASS (complete source/generated workshop-tree parity, path-ancestor safety, static document grammar, every active anchor destination, exact download URLs, regular-file/no-symlink checks, manifest byte counts/SHA-256 values, required content, active official links, event data, detail-card logistics, and forbidden-marker checks).
- `npm run build` — PASS (pre-Vite static-source audit; Vite 8.0.10; 1,824 modules transformed; manifest-backed generated root published).
- `git diff --check` and Node syntax checks — PASS.
- Direct HTTP checks — PASS (200 with expected MIME types): root, workshop HTML/CSS, PDF, DOCX, event artwork, and generated assets.
- Headless Firefox/Selenium — PASS at 1440 px and Firefox's 500 px minimum viewport: no horizontal overflow, no blank links, all images loaded, exact event metadata present, September event selection/detail/CTA matched, and direct workshop-route refresh worked.
- Constrained 390 px no-JS document-flow check — PASS: body client/scroll width both 390 px, 23 links present, no broken images, no internal overflow, and required content/links present.
- Print CSS — PASS: valid seven-page Letter PDF; every page visually inspected; community URLs wrap without collisions.
- Guide artifacts — PDF 504,210 bytes, 15 pages, SHA-256 `327f979b2750634661180bd1f25a32030879f74affd0d32832bb9a3de901932a`; DOCX 388,713 bytes, SHA-256 `516299315d18d2e9a795902e3bd7ff5d233d221038105f0dd1d3340ac21bdc5f`.
- Visual review — desktop workshop page, constrained 390 px page, selected September event viewport, and seven-page print contact sheet all received final PASS verdicts.

## Final review evidence

Desktop, constrained 390 px, selected-event, and seven-page print renders were captured and visually reviewed locally before public write. These review-only artifacts are not committed to the website repository.

## Privacy and deployment state

The changed page and source contain no live credentials, tokens, passwords, mailbox data, analytics, credential collection, or dynamic user-input rendering. The page explicitly describes the read-only Gmail/Himalaya boundary, approved/synthetic input, Telegram fallback, installation prerequisite, two-hour window versus 90-minute teaching cap, and no-send/no-move/no-delete/no-re-flag policy.

The implementation was fully verified locally before public write. PR #2 is open from branch `feat/hermes-agent-workshop`; it has not been merged, and the deployed site has not changed. The canonical workshop URL, `https://singularity-ai-uow.github.io/workshops/build-your-own-ai-agent/`, currently returns GitHub Pages 404 and is expected to remain unavailable until this PR is approved, merged, and deployed.

## Known limitations

- The repository has no `lint` or general `test` npm script; the publisher regression test, workshop verifier, production build, syntax checks, and browser/HTTP checks are the available project gates.
- `npm audit --json` remains non-zero with 6 vulnerable packages (3 moderate, 3 high, 0 critical). `npm audit --omit=dev --json` reports 3 moderate production vulnerabilities across `@remix-run/router`, `react-router`, and `react-router-dom`; the high-severity vulnerable packages are existing dev tooling (`nanoid`, `postcss`, and `vite`). The new HTML parser (`parse5`) is development-only and did not add a vulnerability. Dependency upgrades are outside this change.
- The GitHub targeted secret-scanning API could not run because GitHub Advanced Security is not enabled for this repository; local forbidden-marker/privacy checks passed.
- Firefox WebDriver in this environment does not expose Selenium `get_log('browser')`; console health was covered by successful page/image loads, DOM assertions, HTTP checks, and Firefox headless stderr inspection.
