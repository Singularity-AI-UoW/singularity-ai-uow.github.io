import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
  mkdtemp,
  mkdir,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import {
  assertOfficialLinks,
  assertTreeParity,
  verifyDownloads,
} from './verify-workshop-page.mjs'

const pdfName = 'Build-Your-Own-AI-Agent-Workshop-Guide.pdf'
const docxName = 'Build-Your-Own-AI-Agent-Workshop-Guide.docx'
const canonicalRoute =
  'https://singularity-ai-uow.github.io/workshops/build-your-own-ai-agent/'

function sha256(content) {
  return createHash('sha256').update(content).digest('hex')
}

async function makeDownloadFixture() {
  const workshopDir = await mkdtemp(join(tmpdir(), 'singularity-workshop-verify-'))
  const files = [
    { name: pdfName, content: Buffer.from('verified pdf') },
    { name: docxName, content: Buffer.from('verified docx') },
  ]

  await mkdir(workshopDir, { recursive: true })
  for (const file of files) {
    await writeFile(join(workshopDir, file.name), file.content)
  }

  const manifest = {
    version: '1.0',
    files: files.map((file) => ({
      name: file.name,
      bytes: file.content.length,
      sha256: sha256(file.content),
    })),
  }
  const manifestPath = join(workshopDir, 'downloads.json')
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  return { files, manifest, manifestPath, workshopDir }
}

function localLinks() {
  return `<a href="${pdfName}">PDF</a><a href="./${docxName}">DOCX</a>`
}

test('assertTreeParity rejects corruption in the generated workshop copy', async () => {
  const sourceDir = await mkdtemp(join(tmpdir(), 'singularity-workshop-source-'))
  const generatedDir = await mkdtemp(join(tmpdir(), 'singularity-workshop-generated-'))
  await writeFile(join(sourceDir, 'workshop.css'), 'verified styles')
  await writeFile(join(generatedDir, 'workshop.css'), 'verified styles')

  await assert.doesNotReject(() => assertTreeParity(sourceDir, generatedDir))
  await writeFile(join(generatedDir, 'workshop.css'), 'corrupted styles')
  await assert.rejects(
    () => assertTreeParity(sourceDir, generatedDir),
    /content mismatch.*workshop\.css/i,
  )
})

test('assertTreeParity rejects a symlinked generated-tree ancestor', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'singularity-workshop-root-'))
  const sourceDir = join(rootDir, 'source')
  const realGeneratedParent = join(rootDir, 'real-workshops')
  const realGeneratedDir = join(realGeneratedParent, 'build-your-own-ai-agent')
  const generatedDir = join(rootDir, 'workshops/build-your-own-ai-agent')
  await mkdir(sourceDir, { recursive: true })
  await mkdir(realGeneratedDir, { recursive: true })
  await writeFile(join(sourceDir, 'workshop.css'), 'verified styles')
  await writeFile(join(realGeneratedDir, 'workshop.css'), 'verified styles')
  await symlink(realGeneratedParent, join(rootDir, 'workshops'))

  await assert.rejects(
    () =>
      assertTreeParity(sourceDir, generatedDir, {
        generatedRoot: rootDir,
      }),
    /generated workshop tree.*symbolic link.*workshops/i,
  )
})

test('verifyDownloads accepts exact local links and matching manifest metadata', async () => {
  const fixture = await makeDownloadFixture()

  await assert.doesNotReject(() =>
    verifyDownloads({ html: localLinks(), workshopDir: fixture.workshopDir }),
  )
})

test('verifyDownloads accepts canonical absolute download links', async () => {
  const fixture = await makeDownloadFixture()
  const html = `<a href="${canonicalRoute}${pdfName}">PDF</a><a href="${canonicalRoute}${docxName}">DOCX</a>`

  await assert.doesNotReject(() =>
    verifyDownloads({ html, workshopDir: fixture.workshopDir }),
  )
})

test('verifyDownloads rejects percent-encoded bytes before URL normalization', async () => {
  const fixture = await makeDownloadFixture()
  const origin = 'https://singularity-ai-uow.github.io'
  const unsafePdfLinks = [
    `${origin}/workshops/%2e/build-your-own-ai-agent/${pdfName}`,
    `${origin}/workshops/ignored/%2e%2e/build-your-own-ai-agent/${pdfName}`,
    `${origin}/workshops%2Fbuild-your-own-ai-agent%2F${pdfName}`,
  ]

  for (const unsafePdfLink of unsafePdfLinks) {
    const html = `<a href="${unsafePdfLink}">PDF</a><a href="${docxName}">DOCX</a>`
    await assert.rejects(
      () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
      /encoded|canonical path/i,
    )
  }
})

test('verifyDownloads rejects normalized but noncanonical anchor spellings', async () => {
  const fixture = await makeDownloadFixture()
  const host = 'singularity-ai-uow.github.io'
  const unsafeHrefs = [
    `https://${host}/workshops/../`,
    `https://${host}:443/`,
    `HTTPS://${host}/`,
    `//${host}/`,
    `https:\\\\${host}\\`,
  ]

  for (const unsafeHref of unsafeHrefs) {
    await assert.rejects(
      () =>
        verifyDownloads({
          html: `${localLinks()}<a href="${unsafeHref}">unsafe</a>`,
          workshopDir: fixture.workshopDir,
        }),
      /canonical literal|unapproved anchor/i,
    )
  }
})

test('verifyDownloads rejects unsafe anchor target and rel combinations', async () => {
  const fixture = await makeDownloadFixture()
  const safeHref = 'https://singularity-ai-uow.github.io/'
  const surfaces = [
    `<a href="${safeHref}" target="_blank">missing noreferrer</a>`,
    `<a href="${safeHref}" target="_blank" rel="opener">unsafe opener</a>`,
    `<a href="${safeHref}" target="_self" rel="noreferrer">unexpected target</a>`,
  ]

  for (const surface of surfaces) {
    await assert.rejects(
      () =>
        verifyDownloads({
          html: `${localLinks()}${surface}`,
          workshopDir: fixture.workshopDir,
        }),
      /target|noreferrer|rel/i,
    )
  }
})

test('verifyDownloads rejects an active base element that changes browser resolution', async () => {
  const fixture = await makeDownloadFixture()
  const html = `<base href="https://evil.example/other/">${localLinks()}`

  await assert.rejects(
    () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
    /base|unsupported HTML element/i,
  )
})

test('verifyDownloads rejects declarative shadow DOM templates', async () => {
  const fixture = await makeDownloadFixture()
  const html = `${localLinks()}<template shadowrootmode="open"><a href="javascript:alert(1)">unsafe</a></template>`

  await assert.rejects(
    () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
    /declarative shadow DOM/i,
  )
})

test('verifyDownloads rejects foreign-namespace content and SVG hyperlink mutation', async () => {
  const fixture = await makeDownloadFixture()
  const surfaces = [
    '<svg><a href="javascript:alert(1)" xlink:href="https://singularity-ai-uow.github.io/">unsafe</a></svg>',
    '<svg><a href="https://singularity-ai-uow.github.io/"><animate attributeName="href" to="javascript:alert(1)" dur="0.1s" fill="freeze"></animate></a></svg>',
  ]

  for (const surface of surfaces) {
    await assert.rejects(
      () =>
        verifyDownloads({
          html: `${localLinks()}${surface}`,
          workshopDir: fixture.workshopDir,
        }),
      /foreign namespace|HTML namespace/i,
    )
  }
})

test('verifyDownloads rejects elements and attributes outside the static page grammar', async () => {
  const fixture = await makeDownloadFixture()
  const surfaces = [
    '<a href="https://singularity-ai-uow.github.io/" ping="https://evil.example/collect">unsafe ping</a>',
    '<a href="https://singularity-ai-uow.github.io/" attributionsrc="https://evil.example/register">unsafe attribution</a>',
    '<a href="https://singularity-ai-uow.github.io/" xlink:href="javascript:alert(1)">namespaced override</a>',
    '<a href="https://singularity-ai-uow.github.io/"><img src="workshop-cover.png" alt="unsafe" ismap></a>',
    '<video src="https://evil.example/collect"></video>',
  ]

  for (const surface of surfaces) {
    await assert.rejects(
      () =>
        verifyDownloads({
          html: `${localLinks()}${surface}`,
          workshopDir: fixture.workshopDir,
        }),
      /unsupported (?:HTML element|attribute)/i,
    )
  }
})

test('verifyDownloads rejects noncanonical stylesheet and image resources', async () => {
  const fixture = await makeDownloadFixture()
  const surfaces = [
    '<link rel="stylesheet" href="https://evil.example/collect.css">',
    '<link rel="prefetch" href="workshop.css">',
    '<img src="https://evil.example/collect" alt="unsafe">',
  ]

  for (const surface of surfaces) {
    await assert.rejects(
      () =>
        verifyDownloads({
          html: `${localLinks()}${surface}`,
          workshopDir: fixture.workshopDir,
        }),
      /stylesheet|image|resource/i,
    )
  }
})

test('verifyDownloads rejects uninspectable dynamic and nested navigation surfaces', async () => {
  const fixture = await makeDownloadFixture()
  const surfaces = [
    '<script>document.body.innerHTML = `<a href="https://evil.example/">unsafe</a>`</script>',
    '<iframe srcdoc="&lt;a href=&quot;https://evil.example/&quot;&gt;unsafe&lt;/a&gt;"></iframe>',
    '<form action="https://evil.example/"><button>unsafe</button></form>',
    '<meta http-equiv="refresh" content="0;url=https://evil.example/">',
    '<svg onload="location.href=\'https://evil.example/\'"></svg>',
  ]

  for (const surface of surfaces) {
    await assert.rejects(
      () =>
        verifyDownloads({
          html: `${localLinks()}${surface}`,
          workshopDir: fixture.workshopDir,
        }),
      /unsupported active navigation|foreign namespace/i,
    )
  }
})

test('verifyDownloads rejects noscript content with mode-dependent links', async () => {
  const fixture = await makeDownloadFixture()
  const html = `${localLinks()}<noscript><a href="javascript:alert(1)">unsafe</a></noscript>`

  await assert.rejects(
    () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
    /noscript/i,
  )
})

test('verifyDownloads rejects an absolute link on a noncanonical host', async () => {
  const fixture = await makeDownloadFixture()
  const html = `<a href="https://workshop.invalid/workshops/build-your-own-ai-agent/${pdfName}">PDF</a><a href="${docxName}">DOCX</a>`

  await assert.rejects(
    () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
    /link.*PDF|PDF.*link|canonical workshop route|unapproved (?:external )?anchor/i,
  )
})

test('verifyDownloads rejects a traversal-style href even when the file exists', async () => {
  const fixture = await makeDownloadFixture()
  const html = `<a href="../${pdfName}">PDF</a><a href="${docxName}">DOCX</a>`

  await assert.rejects(
    () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
    /link.*PDF|PDF.*link|workshop route|unapproved anchor/i,
  )
})

test('verifyDownloads ignores links that appear only inside HTML comments', async () => {
  const fixture = await makeDownloadFixture()
  const html = `<!-- <a href="${pdfName}">PDF</a> --><a href="${docxName}">DOCX</a>`

  await assert.rejects(
    () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
    /link.*PDF|PDF.*link|workshop route/i,
  )
})

test('comment-only official links do not satisfy required-link verification', async () => {
  const fixture = await makeDownloadFixture()
  const discordLink = 'https://discord.gg/XZk7hgprR'
  const html = `${localLinks()}<!-- <a href="${discordLink}">Discord</a> -->`
  const activeLinks = await verifyDownloads({
    html,
    workshopDir: fixture.workshopDir,
  })

  assert.throws(
    () => assertOfficialLinks(activeLinks, [discordLink]),
    /official link missing.*discord/i,
  )
})

test('verifyDownloads rejects inert templates outside the static page grammar', async () => {
  const fixture = await makeDownloadFixture()
  const html = `<template><a href="${pdfName}">PDF</a></template><a href="${docxName}">DOCX</a>`

  await assert.rejects(
    () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
    /unsupported HTML element.*template/i,
  )
})

test('verifyDownloads rejects href attributes on non-anchor elements', async () => {
  const fixture = await makeDownloadFixture()
  const html = `<div href="${pdfName}">not a link</div><a href="${docxName}">DOCX</a>`

  await assert.rejects(
    () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
    /unsupported attribute.*div.*href/i,
  )
})

test('verifyDownloads rejects unsafe anchor schemes even when downloads are valid', async () => {
  const fixture = await makeDownloadFixture()
  const html = `${localLinks()}<a href="javascript:alert(1)">unsafe</a>`

  await assert.rejects(
    () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
    /unsafe anchor|scheme|javascript/i,
  )
})

test('verifyDownloads rejects raw empty userinfo syntax', async () => {
  const fixture = await makeDownloadFixture()
  const host = 'singularity-ai-uow.github.io'
  const unsafeHrefs = [
    `https://@${host}/`,
    `https://:@${host}/`,
    `https:////@${host}/`,
    `https:\\/\\@${host}/`,
  ]
  for (const unsafeHref of unsafeHrefs) {
    const html = `${localLinks()}<a href="${unsafeHref}">unsafe</a>`
    await assert.rejects(
      () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
      /credential|userinfo/i,
    )
  }
})

test('verifyDownloads rejects unapproved external origins even when downloads are valid', async () => {
  const fixture = await makeDownloadFixture()
  const html = `${localLinks()}<a href="https://evil.example/">unsafe</a>`

  await assert.rejects(
    () => verifyDownloads({ html, workshopDir: fixture.workshopDir }),
    /unapproved anchor|evil\.example|external/i,
  )
})

test('verifyDownloads rejects a symlinked artifact even when metadata matches', async () => {
  const fixture = await makeDownloadFixture()
  const externalPath = join(dirname(fixture.workshopDir), 'outside-guide.pdf')
  await writeFile(externalPath, fixture.files[0].content)
  await unlink(join(fixture.workshopDir, pdfName))
  await symlink(externalPath, join(fixture.workshopDir, pdfName))

  await assert.rejects(
    () => verifyDownloads({ html: localLinks(), workshopDir: fixture.workshopDir }),
    /symbolic link.*PDF|PDF.*symbolic link/i,
  )
})

test('verifyDownloads rejects a symlinked downloads manifest', async () => {
  const fixture = await makeDownloadFixture()
  const externalManifest = join(dirname(fixture.workshopDir), 'outside-downloads.json')
  await writeFile(
    externalManifest,
    `${JSON.stringify(fixture.manifest, null, 2)}\n`,
  )
  await unlink(fixture.manifestPath)
  await symlink(externalManifest, fixture.manifestPath)

  await assert.rejects(
    () => verifyDownloads({ html: localLinks(), workshopDir: fixture.workshopDir }),
    /downloads\.json.*symbolic link/i,
  )
})

test('verifyDownloads rejects a manifest checksum that does not match the file', async () => {
  const fixture = await makeDownloadFixture()
  fixture.manifest.files[0].sha256 = '0'.repeat(64)
  await writeFile(
    fixture.manifestPath,
    `${JSON.stringify(fixture.manifest, null, 2)}\n`,
  )

  await assert.rejects(
    () => verifyDownloads({ html: localLinks(), workshopDir: fixture.workshopDir }),
    /SHA-256.*PDF|PDF.*SHA-256/i,
  )
})
