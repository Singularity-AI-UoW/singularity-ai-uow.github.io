import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { lstat, readFile, readdir } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parse } from 'parse5'
import {
  assertPathHasNoSymlinkSegments,
  assertTreeHasNoSymlinks,
} from './static-tree-safety.mjs'

const repoDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(repoDir, 'public')
const workshopDir = join(publicDir, 'workshops/build-your-own-ai-agent')
const publishedWorkshopDir = join(repoDir, 'workshops/build-your-own-ai-agent')
const pagePath = join(workshopDir, 'index.html')
const publishedPagePath = join(publishedWorkshopDir, 'index.html')
const requiredDownloads = [
  'Build-Your-Own-AI-Agent-Workshop-Guide.pdf',
  'Build-Your-Own-AI-Agent-Workshop-Guide.docx',
]
const officialLinks = [
  'https://hermes-agent.nousresearch.com/docs/getting-started/installation',
  'https://hermes-agent.nousresearch.com/docs/user-guide/messaging',
  'https://hermes-agent.nousresearch.com/docs/user-guide/features/cron',
  'https://hermes-agent.nousresearch.com/docs/user-guide/features/skills',
  'https://hermes-agent.nousresearch.com/docs/user-guide/features/memory',
  'https://hermes-agent.nousresearch.com/docs/user-guide/configuring-models',
  'https://hermes-agent.nousresearch.com/docs/user-guide/security',
  'https://singularity-ai-uow.github.io/',
  'https://discord.gg/XZk7hgprR',
  'https://www.instagram.com/singularity_uow/?utm_source=ig_web_button_share_sheet',
]
const workshopSummary =
  'Build a working AI agent workflow with Hermes Agent: connect Telegram, validate a read-only Gmail lane through Himalaya, then schedule and verify a daily briefing—plus a safe Telegram-only fallback.'
const canonicalRoute = new URL(
  'https://singularity-ai-uow.github.io/workshops/build-your-own-ai-agent/',
)
const htmlNamespace = 'http://www.w3.org/1999/xhtml'
const approvedExternalLinks = new Set(
  officialLinks
    .map((link) => new URL(link))
    .filter((url) => url.origin !== canonicalRoute.origin)
    .map((url) => url.href),
)
const unsupportedActiveNavigationElements = new Set([
  'embed',
  'fencedframe',
  'form',
  'frame',
  'frameset',
  'iframe',
  'object',
  'portal',
  'script',
])
const allowedHtmlAttributes = new Map(
  Object.entries({
    a: ['aria-label', 'class', 'download', 'href', 'rel', 'target'],
    b: ['aria-hidden'],
    body: ['class'],
    br: [],
    code: [],
    dd: [],
    div: ['aria-label', 'class'],
    dl: ['aria-label', 'class'],
    dt: [],
    figcaption: [],
    figure: ['class'],
    footer: ['class'],
    h1: ['id'],
    h2: ['id'],
    h3: [],
    head: [],
    header: ['class'],
    html: ['lang'],
    img: ['alt', 'height', 'src', 'width'],
    li: ['class'],
    link: ['href', 'rel'],
    main: ['id'],
    meta: ['charset', 'content', 'name'],
    nav: ['aria-label', 'class'],
    ol: ['class'],
    p: ['class'],
    section: ['aria-labelledby', 'class', 'id'],
    small: [],
    span: ['aria-hidden', 'class'],
    strong: [],
    title: [],
  }).map(([tagName, attributes]) => [tagName, new Set(attributes)]),
)

async function assertRegularFile(path, label) {
  const stats = await lstat(path)
  assert.equal(stats.isSymbolicLink(), false, `${label} must not be a symbolic link`)
  assert.equal(stats.isFile(), true, `${label} should be a regular file`)
}

async function collectTreeFiles(directory, relativeDirectory = '') {
  const entries = await readdir(join(directory, relativeDirectory), {
    withFileTypes: true,
  })
  const files = []
  for (const entry of entries) {
    const relativePath = join(relativeDirectory, entry.name)
    if (entry.isSymbolicLink()) {
      throw new Error(`tree contains a symbolic link: ${relativePath}`)
    }
    if (entry.isDirectory()) {
      files.push(...(await collectTreeFiles(directory, relativePath)))
      continue
    }
    if (!entry.isFile()) {
      throw new Error(`tree contains an unsupported entry: ${relativePath}`)
    }
    files.push(relativePath)
  }
  return files.sort()
}

export async function assertTreeParity(
  sourceDir,
  generatedDir,
  { sourceRoot = sourceDir, generatedRoot = generatedDir } = {},
) {
  await assertPathHasNoSymlinkSegments(
    sourceRoot,
    sourceDir,
    'workshop source tree',
  )
  await assertPathHasNoSymlinkSegments(
    generatedRoot,
    generatedDir,
    'generated workshop tree',
  )
  await assertTreeHasNoSymlinks(sourceDir, 'workshop source tree')
  await assertTreeHasNoSymlinks(generatedDir, 'generated workshop tree')
  const sourceFiles = await collectTreeFiles(sourceDir)
  const generatedFiles = await collectTreeFiles(generatedDir)
  assert.deepEqual(
    generatedFiles,
    sourceFiles,
    'generated workshop file set should match the source tree',
  )

  for (const relativePath of sourceFiles) {
    const sourceContent = await readFile(join(sourceDir, relativePath))
    const generatedContent = await readFile(join(generatedDir, relativePath))
    assert.equal(
      generatedContent.equals(sourceContent),
      true,
      `generated workshop content mismatch: ${relativePath}`,
    )
  }
}

function inspectActiveDocument(html) {
  const hrefs = []
  const ids = new Set()

  const visit = (node) => {
    if (node.tagName) {
      assert.equal(
        node.namespaceURI,
        htmlNamespace,
        `workshop page contains an unsupported foreign namespace: <${node.tagName}>`,
      )
    }
    const rawAttributes = node.attrs ?? []
    const attributes = new Map(
      rawAttributes.map((attribute) => [
        attribute.name.toLowerCase(),
        attribute.value,
      ]),
    )
    assert.equal(
      unsupportedActiveNavigationElements.has(node.tagName),
      false,
      `unsupported active navigation element: <${node.tagName}>`,
    )
    assert.equal(
      [...attributes.keys()].some((name) => name.startsWith('on')),
      false,
      `unsupported active navigation event handler on <${node.tagName}>`,
    )
    if (
      node.tagName === 'meta' &&
      attributes.get('http-equiv')?.trim().toLowerCase() === 'refresh'
    ) {
      assert.fail('unsupported active navigation meta refresh')
    }
    if (
      node.tagName === 'template' &&
      node.namespaceURI === htmlNamespace
    ) {
      assert.equal(
        attributes.has('shadowrootmode'),
        false,
        'workshop page must not contain declarative shadow DOM',
      )
    }
    assert.notEqual(
      node.tagName,
      'noscript',
      'workshop page must not contain mode-dependent noscript content',
    )

    if (node.tagName) {
      const allowedAttributes = allowedHtmlAttributes.get(node.tagName)
      assert.ok(
        allowedAttributes,
        `workshop page contains an unsupported HTML element: <${node.tagName}>`,
      )
      const seenAttributes = new Set()
      for (const attribute of rawAttributes) {
        const name = attribute.name.toLowerCase()
        assert.equal(
          attribute.namespace ?? null,
          null,
          `unsupported attribute on <${node.tagName}>: ${attribute.name}`,
        )
        assert.equal(
          attribute.prefix ?? null,
          null,
          `unsupported attribute on <${node.tagName}>: ${attribute.name}`,
        )
        assert.ok(
          allowedAttributes.has(name),
          `unsupported attribute on <${node.tagName}>: ${attribute.name}`,
        )
        assert.equal(
          seenAttributes.has(name),
          false,
          `duplicate attribute on <${node.tagName}>: ${attribute.name}`,
        )
        seenAttributes.add(name)
      }
    }

    if (node.tagName === 'link') {
      assert.equal(
        attributes.get('rel'),
        'stylesheet',
        'workshop link resource must be the local stylesheet',
      )
      assert.equal(
        attributes.get('href'),
        'workshop.css',
        'workshop stylesheet resource must be workshop.css',
      )
    }
    if (node.tagName === 'img') {
      assert.equal(
        attributes.get('src'),
        'workshop-cover.png',
        'workshop image resource must be workshop-cover.png',
      )
    }

    if (attributes.has('id')) ids.add(attributes.get('id'))
    if (node.tagName === 'a') {
      const hasTargetingMetadata =
        attributes.has('target') || attributes.has('rel')
      if (hasTargetingMetadata) {
        assert.equal(
          attributes.get('target'),
          '_blank',
          'targeted workshop anchors must use target="_blank"',
        )
        assert.equal(
          attributes.get('rel'),
          'noreferrer',
          'targeted workshop anchors must use rel="noreferrer"',
        )
      }
      hrefs.push(attributes.get('href') ?? null)
    }
    for (const child of node.childNodes ?? []) visit(child)
  }

  visit(parse(html))
  return { hrefs, ids }
}

function decodeUrlPart(value, label) {
  try {
    return decodeURIComponent(value)
  } catch {
    throw new Error(`anchor contains malformed ${label}: ${value}`)
  }
}

function hasRawAuthorityUserinfo(href) {
  const authorityMatch = href.match(
    /^(?:[a-z][a-z\d+.-]*:[\\/]+|[\\/]{2,})([^\\/?#]*)/i,
  )
  return authorityMatch?.[1].includes('@') ?? false
}

function isApprovedCanonicalHref(href, ids) {
  if (officialLinks.includes(href)) return true
  if (href === '/' || href === '/#events' || href === canonicalRoute.href) {
    return true
  }
  if (href.startsWith('#')) return ids.has(href.slice(1))
  return requiredDownloads.some(
    (filename) =>
      href === filename ||
      href === `./${filename}` ||
      href === `${canonicalRoute.href}${filename}`,
  )
}

function validateAnchorHrefs(html) {
  const { hrefs, ids } = inspectActiveDocument(html)
  assert.ok(hrefs.length > 0, 'workshop page should contain anchor links')

  return hrefs.map((href, index) => {
    assert.equal(
      typeof href,
      'string',
      `workshop anchor ${index + 1} should contain an href`,
    )
    assert.equal(href, href.trim(), `anchor href contains outer whitespace: ${href}`)
    assert.notEqual(href, '', 'workshop page contains an empty anchor href')
    assert.doesNotMatch(
      href,
      /[\u0000-\u001f\u007f]/,
      `anchor href contains a control character: ${href}`,
    )
    assert.doesNotMatch(
      href,
      /%[\da-f]{2}/i,
      `anchor href contains percent-encoded bytes instead of canonical literal form: ${href}`,
    )
    assert.equal(
      hasRawAuthorityUserinfo(href),
      false,
      `anchor credential/userinfo syntax is not allowed: ${href}`,
    )

    let url
    try {
      url = new URL(href, canonicalRoute)
    } catch {
      throw new Error(`workshop page contains an invalid anchor URL: ${href}`)
    }

    assert.equal(
      url.protocol,
      'https:',
      `unsafe anchor scheme is not allowed: ${href}`,
    )
    assert.equal(url.username, '', `anchor credentials are not allowed: ${href}`)
    assert.equal(url.password, '', `anchor credentials are not allowed: ${href}`)
    assert.ok(
      isApprovedCanonicalHref(href, ids),
      `unapproved anchor canonical literal: ${href}`,
    )

    const path = decodeUrlPart(url.pathname, 'pathname')
    if (url.origin !== canonicalRoute.origin) {
      assert.ok(
        approvedExternalLinks.has(url.href),
        `unapproved external anchor URL: ${url.href}`,
      )
      return { href, path, url }
    }
    assert.equal(
      url.pathname,
      path,
      `canonical path must not contain percent-encoded bytes: ${url.pathname}`,
    )

    const isHomepageLink =
      path === '/' &&
      !url.search &&
      (url.hash === '' || url.hash === '#events')
    const isWorkshopPageLink =
      path === canonicalRoute.pathname && !url.search && url.hash === ''
    const isWorkshopFragment =
      path === canonicalRoute.pathname &&
      !url.search &&
      url.hash !== '' &&
      ids.has(decodeUrlPart(url.hash.slice(1), 'fragment'))
    const isRequiredDownload =
      requiredDownloads.some(
        (filename) => path === `${canonicalRoute.pathname}${filename}`,
      ) &&
      !url.search &&
      !url.hash

    assert.ok(
      isHomepageLink ||
        isWorkshopPageLink ||
        isWorkshopFragment ||
        isRequiredDownload,
      `unapproved anchor URL: ${url.href}`,
    )
    return { href, path, url }
  })
}

export function assertOfficialLinks(links, requiredLinks = officialLinks) {
  const activeUrls = new Set(links.map(({ url }) => url.href))
  for (const link of requiredLinks) {
    const normalizedLink = new URL(link).href
    assert.ok(activeUrls.has(normalizedLink), `official link missing: ${link}`)
  }
}

function resolveRequiredDownload(links, filename, directory) {
  const expectedPath = `${canonicalRoute.pathname}${filename}`
  const resolvedLink = links.find(
    ({ path, url }) =>
      url.origin === canonicalRoute.origin &&
      !url.search &&
      !url.hash &&
      path === expectedPath,
  )

  assert.ok(
    resolvedLink,
    `${filename} link must resolve on the canonical workshop route`,
  )

  const routeRelativePath = resolvedLink.path.slice(canonicalRoute.pathname.length)
  const target = resolve(directory, routeRelativePath)
  const targetRelativePath = relative(directory, target)
  assert.equal(
    targetRelativePath === '..' ||
      targetRelativePath.startsWith(`..${sep}`) ||
      isAbsolute(targetRelativePath),
    false,
    `${filename} link must resolve inside the workshop directory`,
  )
  return target
}

export async function verifyDownloads({
  html,
  workshopDir: directory,
  manifestPath = join(directory, 'downloads.json'),
}) {
  const links = validateAnchorHrefs(html)

  await assertRegularFile(manifestPath, 'downloads.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  assert.ok(Array.isArray(manifest.files), 'downloads.json should contain a files array')

  for (const filename of requiredDownloads) {
    const target = resolveRequiredDownload(links, filename, directory)
    await assertRegularFile(target, filename)
    const artifact = await readFile(target)

    const matchingEntries = manifest.files.filter((entry) => entry.name === filename)
    assert.equal(
      matchingEntries.length,
      1,
      `downloads.json should contain exactly one entry for ${filename}`,
    )
    const [manifestEntry] = matchingEntries
    assert.equal(
      manifestEntry.bytes,
      artifact.length,
      `byte count mismatch for ${filename}`,
    )
    const artifactSha256 = createHash('sha256').update(artifact).digest('hex')
    assert.equal(
      manifestEntry.sha256,
      artifactSha256,
      `SHA-256 mismatch for ${filename}`,
    )
  }
  return links
}

export async function verifyWorkshopPage() {
  await assertTreeHasNoSymlinks(publicDir, 'public static source')
  await assertRegularFile(pagePath, 'workshop source page')
  await assertRegularFile(publishedPagePath, 'published workshop page')
  await assertTreeParity(workshopDir, publishedWorkshopDir, {
    sourceRoot: publicDir,
    generatedRoot: repoDir,
  })

  const html = await readFile(pagePath, 'utf8')
  const publishedHtml = await readFile(publishedPagePath, 'utf8')
  const source = await readFile(join(repoDir, 'src/App.jsx'), 'utf8')
  const styles = await readFile(join(repoDir, 'src/index.css'), 'utf8')

  assert.match(html, /<title>[^<]*Build Your Own AI Agent[^<]*<\/title>/i)
  assert.match(html, /4 September 2026/)
  assert.match(html, /Singularity\s*[—-]\s*University of Waikato AI Club/)
  assert.match(html, /From prompt to persistent workflow with Hermes Agent/)
  const sourceLinks = await verifyDownloads({ html, workshopDir })
  await verifyDownloads({ html: publishedHtml, workshopDir: publishedWorkshopDir })

  for (const phrase of [
    'WSL2/Linux',
    'hermes --version',
    'Telegram',
    'optional full-email lane',
    'Gmail',
    'Preflight',
    'Telegram',
    'Mailbox',
    'Scheduled briefing',
    '90 minutes',
    'read-only',
    'no mail was sent',
    'daily briefing',
    'safe Telegram-only fallback',
    'approved/configured input',
    'Two-hour event window; teaching capped at 90 minutes',
    'Three essentials, plus one optional email lane',
  ]) {
    assert.match(
      html,
      new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `${phrase} missing from workshop page`,
    )
  }

  assertOfficialLinks(sourceLinks)

  for (const forbidden of [
    'http://localhost',
    'https://localhost',
    'BEGIN PRIVATE KEY',
    'BEGIN OPENSSH PRIVATE KEY',
    'ghp_',
    'sk-proj-',
    'xoxb-',
    'api_key=',
    'pass' + 'word=',
    'to' + 'ken=',
  ]) {
    assert.equal(html.includes(forbidden), false, `forbidden marker found: ${forbidden}`)
  }

  assert.match(source, /dateLabel:\s*["']4 September 2026["']/)
  const workshopEventStart = source.indexOf('dateLabel: "4 September 2026"')
  const workshopEventEnd = source.indexOf('\n  },', workshopEventStart)
  const workshopEvent = source.slice(workshopEventStart, workshopEventEnd)
  assert.ok(workshopEventStart >= 0 && workshopEventEnd > workshopEventStart)
  assert.doesNotMatch(workshopEvent, /TBA/)
  assert.doesNotMatch(workshopEvent, /audience\s*:/)
  assert.match(workshopEvent, /visualTheme:\s*["']hermes["']/)
  assert.match(
    workshopEvent,
    /overviewImageSrc:\s*["']\/hermes-agent-homepage\.png["']/,
  )
  assert.match(
    workshopEvent,
    /overviewImageHref:\s*["']https:\/\/hermes-agent\.nousresearch\.com\/["']/,
  )
  assert.match(source, /className=[^\n]*event-detail-hermes/)
  assert.match(source, /className=["']event-reference-frame["']/)
  assert.match(source, /className=["']event-reference-image["']/)
  assert.match(
    source,
    /aria-label=["']Open the official Hermes Agent site in a new tab["']/,
  )
  assert.match(source, /Official Hermes Agent site/)
  assert.match(styles, /\.event-detail-hermes\s*\{/)
  assert.match(styles, /\.event-reference-frame\s*\{/)
  assert.match(styles, /font-family:\s*["']Bodoni Moda["']/)
  assert.match(styles, /font-family:\s*["']IBM Plex Mono["']/)
  assert.match(styles, /url\(["']?\/assets\/fonts\/bodoni-moda-latin\.woff2["']?\)/)
  assert.match(
    styles,
    /url\(["']?\/assets\/fonts\/ibm-plex-mono-500-latin\.woff2["']?\)/,
  )
  assert.match(
    styles,
    /url\(["']?\/assets\/fonts\/ibm-plex-mono-600-latin\.woff2["']?\)/,
  )

  for (const fontAsset of [
    'bodoni-moda-latin.woff2',
    'ibm-plex-mono-500-latin.woff2',
    'ibm-plex-mono-600-latin.woff2',
  ]) {
    const fontPath = join(publicDir, 'assets', 'fonts', fontAsset)
    const fontStat = await lstat(fontPath)
    assert.ok(fontStat.isFile() && !fontStat.isSymbolicLink())
    assert.ok(fontStat.size > 10_000)
    assert.equal((await readFile(fontPath)).subarray(0, 4).toString('ascii'), 'wOF2')
  }

  for (const [licenseAsset, copyrightNotice] of [
    [
      'OFL-BodoniModa.txt',
      'Copyright 2020 The Bodoni Moda Project Authors (https://github.com/indestructible-type/Bodoni)',
    ],
    [
      'OFL-IBMPlexMono.txt',
      'Copyright © 2017 IBM Corp. with Reserved Font Name "Plex"',
    ],
  ]) {
    const licensePath = join(publicDir, 'assets', 'fonts', licenseAsset)
    const licenseStat = await lstat(licensePath)
    assert.ok(licenseStat.isFile() && !licenseStat.isSymbolicLink())
    assert.ok(licenseStat.size > 4_000)
    const licenseText = await readFile(licensePath, 'utf8')
    assert.ok(licenseText.startsWith(copyrightNotice))
    assert.match(licenseText, /SIL OPEN FONT LICENSE Version 1\.1/)
  }

  const referenceImagePath = join(publicDir, 'hermes-agent-homepage.png')
  const referenceImageStat = await lstat(referenceImagePath)
  assert.ok(referenceImageStat.isFile() && !referenceImageStat.isSymbolicLink())
  assert.ok(referenceImageStat.size > 100_000)
  const referenceImage = await readFile(referenceImagePath)
  assert.deepEqual(
    [...referenceImage.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
  )

  assert.match(source, /title:\s*["']Build Your Own AI Agent["']/)
  assert.match(
    source,
    new RegExp(workshopSummary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
  )
  assert.match(source, /imageSrc:\s*["']\/hermes-agent-homepage\.png["']/)
  assert.match(
    source,
    /resourceUrl:\s*["']\/workshops\/build-your-own-ai-agent\/["']/,
  )
  assert.match(source, /Open workshop guide/)
  assert.match(source, /className="event-list-facts event-detail-facts"/)
  assert.match(source, /<time>\{activeEvent\.dateLabel\}<\/time>/)
  assert.match(source, /\{activeEvent\.timeLabel\}/)
  assert.match(source, /\{activeEvent\.location\}/)
  assert.match(workshopEvent, /timeLabel:\s*["']6:00 pm - 8:00 pm["']/)
  assert.match(
    workshopEvent,
    /location:\s*["']MSB\.0\.01, Hamilton Campus, University of Waikato["']/,
  )

  console.log(
    'Workshop source and published page, exact download links, artifact checksums, and 4 September event data verified.',
  )
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isDirectRun) {
  verifyWorkshopPage().catch((error) => {
    console.error(`Workshop verification failed: ${error.message}`)
    process.exitCode = 1
  })
}
