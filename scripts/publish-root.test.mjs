import test from 'node:test'
import assert from 'node:assert/strict'
import * as fsPromises from 'node:fs/promises'
import {
  chmod,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const publicationManifest = '.publish-root-manifest.json'

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
  await writeFile(join(rootDir, 'index.html'), '<main>old site</main>')
  await writeFile(join(rootDir, 'assets/stale.css'), 'stale asset')
  await writeFile(join(rootDir, 'workshops/stale/old.txt'), 'stale workshop')
  await writeFile(join(rootDir, 'old-public.png'), 'obsolete generated asset')
  await writeFile(join(rootDir, 'src/keep.txt'), 'do not touch')
  await writeFile(
    join(rootDir, publicationManifest),
    `${JSON.stringify(
      {
        version: 1,
        targets: ['assets', 'index.html', 'old-public.png', 'workshops'],
      },
      null,
      2,
    )}\n`,
  )

  return rootDir
}

async function loadPublisher() {
  const publisherPath = join(process.cwd(), 'scripts/publish-root.mjs')
  return import(`${pathToFileURL(publisherPath).href}?test=${Date.now()}-${Math.random()}`)
}

test('publishRoot replaces outputs, removes manifest-tracked stale targets, and preserves sources', async () => {
  const rootDir = await makeFixture()
  const { publishRoot } = await loadPublisher()

  await publishRoot(rootDir)

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
  await assert.rejects(() => readFile(join(rootDir, 'old-public.png')))
  assert.equal(await readFile(join(rootDir, 'src/keep.txt'), 'utf8'), 'do not touch')

  const manifest = JSON.parse(
    await readFile(join(rootDir, publicationManifest), 'utf8'),
  )
  assert.deepEqual(manifest, {
    version: 1,
    targets: ['assets', 'index.html', 'workshops'],
  })
})

test('publishRoot rejects source symlinks before changing published output', async () => {
  const rootDir = await makeFixture()
  const externalPath = join(rootDir, 'external-secret.txt')
  await writeFile(externalPath, 'must not publish')
  await symlink(externalPath, join(rootDir, 'dist/leak.txt'))
  const { publishRoot } = await loadPublisher()

  await assert.rejects(() => publishRoot(rootDir), /symbolic link/i)
  assert.equal(await readFile(join(rootDir, 'assets/stale.css'), 'utf8'), 'stale asset')
  assert.equal(
    await readFile(join(rootDir, 'workshops/stale/old.txt'), 'utf8'),
    'stale workshop',
  )
})

test('publishRoot rejects a directory whose name is reserved for generated files', async () => {
  const rootDir = await makeFixture()
  await mkdir(join(rootDir, 'dist/evil.svg'))
  await writeFile(join(rootDir, 'dist/evil.svg/index.html'), '<script>evil()</script>')
  const { publishRoot } = await loadPublisher()

  await assert.rejects(
    () => publishRoot(rootDir),
    /distribution.*evil\.svg.*(?:file|directory)|evil\.svg.*regular file/i,
  )
  assert.equal(await readFile(join(rootDir, 'index.html'), 'utf8'), '<main>old site</main>')
  await assert.rejects(() => readFile(join(rootDir, 'evil.svg/index.html')))
})

test('publishRoot rejects a regular file whose name is reserved for generated directories', async () => {
  const rootDir = await makeFixture()
  await fsPromises.rm(join(rootDir, 'dist/assets'), { recursive: true })
  await writeFile(join(rootDir, 'dist/assets'), 'not a generated directory')
  const { publishRoot } = await loadPublisher()

  await assert.rejects(
    () => publishRoot(rootDir),
    /distribution entry assets must be a directory/i,
  )
  assert.equal(await readFile(join(rootDir, 'index.html'), 'utf8'), '<main>old site</main>')
  assert.equal(await readFile(join(rootDir, 'assets/stale.css'), 'utf8'), 'stale asset')
})

test('publishRoot rejects destination symlinks without following them', async () => {
  const rootDir = await makeFixture()
  const externalPath = join(rootDir, 'external-target.txt')
  await writeFile(externalPath, 'must remain unchanged')
  await fsPromises.rm(join(rootDir, 'index.html'))
  await symlink(externalPath, join(rootDir, 'index.html'))
  const { publishRoot } = await loadPublisher()

  await assert.rejects(() => publishRoot(rootDir), /symbolic link/i)
  assert.equal(await readFile(externalPath, 'utf8'), 'must remain unchanged')
  assert.equal(await readFile(join(rootDir, 'assets/stale.css'), 'utf8'), 'stale asset')
})

test('publishRoot rejects a symlinked publication root before changing output', async () => {
  const rootDir = await makeFixture()
  const aliasParent = await mkdtemp(join(tmpdir(), 'singularity-publish-alias-'))
  const aliasRoot = join(aliasParent, 'site')
  await symlink(rootDir, aliasRoot, 'dir')
  const { publishRoot } = await loadPublisher()

  await assert.rejects(() => publishRoot(aliasRoot), /publication root.*symbolic link/i)
  assert.equal(await readFile(join(rootDir, 'index.html'), 'utf8'), '<main>old site</main>')
  assert.equal(await readFile(join(rootDir, 'assets/stale.css'), 'utf8'), 'stale asset')
})

test('publishRoot stages all copies before replacing published output', async () => {
  const rootDir = await makeFixture()
  const unreadablePath = join(
    rootDir,
    'dist/workshops/build-your-own-ai-agent/guide.pdf',
  )
  await chmod(unreadablePath, 0o000)
  const { publishRoot } = await loadPublisher()

  try {
    await assert.rejects(() => publishRoot(rootDir))
  } finally {
    await chmod(unreadablePath, 0o600)
  }

  assert.equal(await readFile(join(rootDir, 'assets/stale.css'), 'utf8'), 'stale asset')
  assert.equal(
    await readFile(join(rootDir, 'workshops/stale/old.txt'), 'utf8'),
    'stale workshop',
  )
})

test('publishRoot preserves backup data when rollback restoration fails', async () => {
  const rootDir = await makeFixture()
  const { publishRoot } = await loadPublisher()
  const failingFs = {
    ...fsPromises,
    async rename(from, to) {
      const fromPath = String(from)
      const toName = basename(String(to))
      if (fromPath.includes('.publish-root-stage-') && toName === 'index.html') {
        throw new Error('injected commit failure')
      }
      if (fromPath.includes('.publish-root-backup-') && toName === 'assets') {
        throw new Error('injected rollback failure')
      }
      return fsPromises.rename(from, to)
    },
  }

  await assert.rejects(
    () => publishRoot(rootDir, { fs: failingFs }),
    /rollback was incomplete.*backups preserved/is,
  )

  const entries = await readdir(rootDir)
  const backupDirs = entries.filter((name) => name.startsWith('.publish-root-backup-'))
  const stageDirs = entries.filter((name) => name.startsWith('.publish-root-stage-'))
  assert.equal(backupDirs.length, 1)
  assert.equal(stageDirs.length, 0)
  assert.equal(
    await readFile(join(rootDir, backupDirs[0], 'assets/stale.css'), 'utf8'),
    'stale asset',
  )
  assert.equal(await readFile(join(rootDir, 'index.html'), 'utf8'), '<main>old site</main>')
})

test('publishRoot rejects unsafe stale-target entries without deleting sources', async () => {
  const rootDir = await makeFixture()
  await writeFile(
    join(rootDir, publicationManifest),
    `${JSON.stringify({ version: 1, targets: ['assets', 'index.html', 'src'] })}\n`,
  )
  const { publishRoot } = await loadPublisher()

  await assert.rejects(() => publishRoot(rootDir), /unsafe publication target.*src/i)
  assert.equal(await readFile(join(rootDir, 'src/keep.txt'), 'utf8'), 'do not touch')
})

test('publishRoot does not delete a stale directory whose name is reserved for generated files', async () => {
  const rootDir = await makeFixture()
  await mkdir(join(rootDir, 'evil.svg'))
  await writeFile(join(rootDir, 'evil.svg/keep.txt'), 'source directory')
  await writeFile(
    join(rootDir, publicationManifest),
    `${JSON.stringify({
      version: 1,
      targets: ['assets', 'evil.svg', 'index.html', 'workshops'],
    })}\n`,
  )
  const { publishRoot } = await loadPublisher()

  await assert.rejects(
    () => publishRoot(rootDir),
    /published destination.*evil\.svg.*regular file/i,
  )
  assert.equal(
    await readFile(join(rootDir, 'evil.svg/keep.txt'), 'utf8'),
    'source directory',
  )
  assert.equal(await readFile(join(rootDir, 'index.html'), 'utf8'), '<main>old site</main>')
})

test('publishRoot does not delete a stale file whose name is reserved for generated directories', async () => {
  const rootDir = await makeFixture()
  await fsPromises.rm(join(rootDir, 'dist/workshops'), { recursive: true })
  await fsPromises.rm(join(rootDir, 'workshops'), { recursive: true })
  await writeFile(join(rootDir, 'workshops'), 'source file')
  const { publishRoot } = await loadPublisher()

  await assert.rejects(
    () => publishRoot(rootDir),
    /published destination.*workshops.*directory/i,
  )
  assert.equal(await readFile(join(rootDir, 'workshops'), 'utf8'), 'source file')
  assert.equal(await readFile(join(rootDir, 'index.html'), 'utf8'), '<main>old site</main>')
})
