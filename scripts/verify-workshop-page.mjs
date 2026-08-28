import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const workshopDir = join(repoDir, 'public/workshops/build-your-own-ai-agent')
const pagePath = join(workshopDir, 'index.html')
const requiredDownloads = [
  'Build-Your-Own-AI-Agent-Workshop-Guide.pdf',
  'Build-Your-Own-AI-Agent-Workshop-Guide.docx',
]
const officialLinks = [
  'https://hermes-agent.nousresearch.com/docs/getting-started/installation',
  'https://hermes-agent.nousresearch.com/docs/user-guide/messaging',
  'https://hermes-agent.nousresearch.com/docs/user-guide/features/cron',
  'https://discord.gg/XZk7hgprR',
  'https://www.instagram.com/singularity_uow/?utm_source=ig_web_button_share_sheet',
]
const workshopSummary =
  'Build a working AI agent workflow with Hermes Agent: connect Telegram, validate a read-only Gmail lane through Himalaya, then schedule and verify a daily briefing—plus a safe Telegram-only fallback.'

async function assertFile(path, label) {
  await assert.doesNotReject(access(path), `${label} should exist`)
}

function assertLocalDownloadLinks(html) {
  const hrefs = [...html.matchAll(/href=["']([^"']*)["']/gi)].map(
    ([, href]) => href,
  )

  assert.ok(hrefs.length > 0, 'workshop page should contain links')
  for (const href of hrefs) {
    assert.notEqual(href.trim(), '', 'workshop page contains an empty href')
    assert.ok(!href.includes('localhost'), `localhost URL found: ${href}`)
  }

  for (const filename of requiredDownloads) {
    assert.ok(
      hrefs.includes(filename),
      `workshop page should link to ${filename} in its own directory`,
    )
    const target = resolve(workshopDir, filename)
    const escaped = relative(workshopDir, target).startsWith('..')
    assert.equal(escaped, false, `${filename} must resolve inside the workshop directory`)
  }
}

async function main() {
  await assertFile(pagePath, 'workshop page')
  for (const filename of requiredDownloads) {
    await assertFile(join(workshopDir, filename), filename)
  }

  const html = await readFile(pagePath, 'utf8')
  const source = await readFile(join(repoDir, 'src/App.jsx'), 'utf8')

  assert.match(html, /<title>[^<]*Build Your Own AI Agent[^<]*<\/title>/i)
  assert.match(html, /4 September 2026/)
  assert.match(html, /Singularity\s*[—-]\s*University of Waikato AI Club/)
  assert.match(html, /From prompt to persistent workflow with Hermes Agent/)
  assertLocalDownloadLinks(html)

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
    assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `${phrase} missing from workshop page`)
  }

  for (const link of officialLinks) {
    assert.ok(html.includes(link), `official link missing: ${link}`)
  }

  for (const forbidden of [
    'http://localhost',
    'https://localhost',
    'BEGIN PRIVATE KEY',
    'BEGIN OPENSSH PRIVATE KEY',
    'ghp_',
    'sk-proj-',
    'xoxb-',
    'api_key=',
    'password=',
    'token=',
  ]) {
    assert.equal(html.includes(forbidden), false, `forbidden marker found: ${forbidden}`)
  }

  assert.match(source, /dateLabel:\s*["']4 September 2026["']/)
  const workshopEventStart = source.indexOf('dateLabel: "4 September 2026"')
  const workshopEventEnd = source.indexOf('\n  },', workshopEventStart)
  const workshopEvent = source.slice(workshopEventStart, workshopEventEnd)
  assert.ok(workshopEventStart >= 0 && workshopEventEnd > workshopEventStart)
  assert.doesNotMatch(workshopEvent, /TBA/)
  assert.match(source, /title:\s*["']Build Your Own AI Agent["']/)
  assert.match(source, new RegExp(workshopSummary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  assert.match(source, /imageSrc:\s*["']\/04_09_26\.png["']/)
  assert.match(source, /resourceUrl:\s*["']\/workshops\/build-your-own-ai-agent\/["']/)
  assert.match(source, /Open workshop guide/)
  assert.match(source, /className="event-list-facts event-detail-facts"/)
  assert.match(source, /<time>\{activeEvent\.dateLabel\}<\/time>/)
  assert.match(source, /\{activeEvent\.timeLabel\}/)
  assert.match(source, /\{activeEvent\.location\}/)
  assert.match(workshopEvent, /timeLabel:\s*["']6:00 pm - 8:00 pm["']/)
  assert.match(workshopEvent, /location:\s*["']MSB\.0\.01, Hamilton Campus, University of Waikato["']/)

  console.log('Workshop page, downloads, and 4 September event data verified.')
}

main().catch((error) => {
  console.error(`Workshop verification failed: ${error.message}`)
  process.exitCode = 1
})
