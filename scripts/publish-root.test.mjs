import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

async function makeFixture() {
  const rootDir = await mkdtemp(join(tmpdir(), 'singularity-publish-root-'))
  await mkdir(join(rootDir, 'dist/assets'), { recursive: true })
  await mkdir(join(rootDir, 'dist/workshops/build-your-own-ai-agent'), {
    recursive: true,
  })
  await mkdir(join(rootDir, 'assets'), { recursive: true })
  await mkdir(join(rootDir, 'workshops/stale'), { recursive: true })
  await mkdir(join(rootDir, 'src'), { recursive: true })

  await writeFile(join(rootDir, 'dist/assets/site.css'), 'new css')
  await writeFile(
    join(rootDir, 'dist/workshops/build-your-own-ai-agent/index.html'),
    '<h1>Workshop</h1>',
  )
  await writeFile(
    join(rootDir, 'dist/workshops/build-your-own-ai-agent/guide.pdf'),
    'new guide',
  )
  await writeFile(join(rootDir, 'dist/site.html'), '<main>new site</main>')
  await writeFile(join(rootDir, 'assets/stale.css'), 'stale asset')
  await writeFile(join(rootDir, 'workshops/stale/old.txt'), 'stale workshop')
  await writeFile(join(rootDir, 'src/keep.txt'), 'do not touch')

  return rootDir
}

test('publishRoot recursively replaces generated output and preserves sources', async () => {
  const rootDir = await makeFixture()
  const publisherPath = join(process.cwd(), 'scripts/publish-root.mjs')
  const previousCwd = process.cwd()

  try {
    process.chdir(rootDir)
    const { publishRoot } = await import(
      `${pathToFileURL(publisherPath).href}?test=${Date.now()}`,
    )

    assert.equal(typeof publishRoot, 'function')
    await publishRoot(rootDir)
  } finally {
    process.chdir(previousCwd)
  }

  assert.equal(await readFile(join(rootDir, 'index.html'), 'utf8'), '<main>new site</main>')
  assert.equal(await readFile(join(rootDir, 'assets/site.css'), 'utf8'), 'new css')
  await assert.rejects(() => readFile(join(rootDir, 'assets/stale.css')))
  assert.equal(
    await readFile(
      join(rootDir, 'workshops/build-your-own-ai-agent/index.html'),
      'utf8',
    ),
    '<h1>Workshop</h1>',
  )
  assert.equal(
    await readFile(join(rootDir, 'workshops/build-your-own-ai-agent/guide.pdf'), 'utf8'),
    'new guide',
  )
  await assert.rejects(() => readFile(join(rootDir, 'workshops/stale/old.txt')))
  assert.equal(await readFile(join(rootDir, 'src/keep.txt'), 'utf8'), 'do not touch')
})
