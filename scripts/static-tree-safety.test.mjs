import test from 'node:test'
import assert from 'node:assert/strict'
import {
  mkdtemp,
  mkdir,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  assertPathHasNoSymlinkSegments,
  assertTreeHasNoSymlinks,
} from './static-tree-safety.mjs'

test('assertTreeHasNoSymlinks accepts a regular static source tree', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'singularity-static-tree-'))
  await mkdir(join(rootDir, 'nested'), { recursive: true })
  await writeFile(join(rootDir, 'nested/asset.txt'), 'safe static content')

  await assert.doesNotReject(() =>
    assertTreeHasNoSymlinks(rootDir, 'public static source'),
  )
})

test('assertTreeHasNoSymlinks rejects a committed-style source symlink', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'singularity-static-tree-'))
  const externalPath = join(rootDir, '..', 'maintainer-readable-secret.txt')
  await writeFile(externalPath, 'must never enter dist')
  await symlink(externalPath, join(rootDir, 'leak.txt'))

  await assert.rejects(
    () => assertTreeHasNoSymlinks(rootDir, 'public static source'),
    /symbolic link.*leak\.txt/i,
  )
})

test('assertPathHasNoSymlinkSegments rejects a symlinked ancestor', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'singularity-path-tree-'))
  const realWorkshopsDir = join(rootDir, 'real-workshops')
  await mkdir(join(realWorkshopsDir, 'build-your-own-ai-agent'), {
    recursive: true,
  })
  await symlink(realWorkshopsDir, join(rootDir, 'workshops'))

  await assert.rejects(
    () =>
      assertPathHasNoSymlinkSegments(
        rootDir,
        join(rootDir, 'workshops/build-your-own-ai-agent'),
        'published workshop tree',
      ),
    /symbolic link.*workshops/i,
  )
})
