import * as fsPromises from 'node:fs/promises'
import { basename, extname, join, parse, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  assertPathHasNoSymlinkSegments,
  assertTreeHasNoSymlinks,
  lstatIfPresent,
} from './static-tree-safety.mjs'

const publicationManifestName = '.publish-root-manifest.json'
const publicationManifestVersion = 1
const generatedDirectoryNames = new Set(['assets', 'workshops'])
const generatedFileNames = new Set(['CNAME', 'index.html', 'robots.txt'])
const generatedFileExtensions = new Set([
  '.avif',
  '.docx',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.otf',
  '.pdf',
  '.png',
  '.svg',
  '.ttf',
  '.webmanifest',
  '.webp',
  '.woff',
  '.woff2',
  '.xml',
])

function publicationTargetKind(targetName) {
  const isTopLevelName =
    typeof targetName === 'string' &&
    targetName.length > 0 &&
    basename(targetName) === targetName &&
    targetName !== '.' &&
    targetName !== '..' &&
    targetName !== publicationManifestName
  if (!isTopLevelName) {
    throw new Error(`unsafe publication target in manifest: ${String(targetName)}`)
  }
  if (generatedDirectoryNames.has(targetName)) return 'directory'
  if (
    generatedFileNames.has(targetName) ||
    generatedFileExtensions.has(extname(targetName).toLowerCase())
  ) {
    return 'file'
  }
  throw new Error(`unsafe publication target in manifest: ${String(targetName)}`)
}

async function readPreviousManifest(rootDir, fs) {
  const manifestPath = join(rootDir, publicationManifestName)
  const stats = await lstatIfPresent(manifestPath, { fs })
  if (!stats) return []
  if (stats.isSymbolicLink()) {
    throw new Error(`publication manifest is a symbolic link: ${manifestPath}`)
  }
  if (!stats.isFile()) {
    throw new Error(`publication manifest is not a regular file: ${manifestPath}`)
  }

  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
  if (
    manifest?.version !== publicationManifestVersion ||
    !Array.isArray(manifest.targets)
  ) {
    throw new Error(`invalid publication manifest: ${manifestPath}`)
  }

  const uniqueTargets = new Set()
  for (const targetName of manifest.targets) {
    publicationTargetKind(targetName)
    if (uniqueTargets.has(targetName)) {
      throw new Error(`duplicate publication target in manifest: ${targetName}`)
    }
    uniqueTargets.add(targetName)
  }
  return [...uniqueTargets].sort()
}

async function rollbackPublishedEntries(applied, fs) {
  const errors = []
  for (const item of [...applied].reverse()) {
    try {
      if (item.installedNew) {
        await fs.rm(item.to, { recursive: true, force: true })
      }
      if (item.hadPrevious) {
        await fs.rename(item.backup, item.to)
      }
    } catch (error) {
      errors.push(error)
    }
  }
  if (errors.length > 0) {
    throw new AggregateError(errors, 'one or more publication rollback steps failed')
  }
}

async function cleanupTemporaryDirectories(paths, fs) {
  const errors = []
  for (const path of paths) {
    if (!path) continue
    try {
      await fs.rm(path, { recursive: true, force: true })
    } catch (error) {
      errors.push(error)
    }
  }
  return errors
}

export async function publishRoot(
  rootDir = process.cwd(),
  { fs = fsPromises } = {},
) {
  rootDir = resolve(rootDir)
  await assertPathHasNoSymlinkSegments(
    parse(rootDir).root,
    rootDir,
    'publication root',
    { fs },
  )
  const distDir = join(rootDir, 'dist')
  const manifestPath = join(rootDir, publicationManifestName)
  await assertTreeHasNoSymlinks(distDir, 'distribution output', { fs })

  const previousTargets = await readPreviousManifest(rootDir, fs)
  const distEntries = await fs.readdir(distDir, { withFileTypes: true })
  const plan = distEntries
    .map((entry) => {
      const targetName = entry.name === 'site.html' ? 'index.html' : entry.name
      const targetKind = publicationTargetKind(targetName)
      const hasExpectedType =
        targetKind === 'directory' ? entry.isDirectory() : entry.isFile()
      if (!hasExpectedType) {
        throw new Error(
          `distribution entry ${entry.name} must be a ${targetKind === 'directory' ? 'directory' : 'regular file'}`,
        )
      }
      return {
        entry,
        from: join(distDir, entry.name),
        targetName,
        to: join(rootDir, targetName),
      }
    })
    .sort((left, right) => left.targetName.localeCompare(right.targetName))

  const currentTargets = new Set()
  for (const item of plan) {
    if (currentTargets.has(item.targetName)) {
      throw new Error(`distribution output maps more than once to ${item.targetName}`)
    }
    currentTargets.add(item.targetName)
  }
  const currentTargetNames = [...currentTargets].sort()
  const staleTargetNames = previousTargets.filter(
    (targetName) => !currentTargets.has(targetName),
  )

  for (const targetName of [
    ...currentTargetNames,
    ...staleTargetNames,
  ]) {
    const destination = await lstatIfPresent(join(rootDir, targetName), { fs })
    if (destination?.isSymbolicLink()) {
      throw new Error(
        `published destination is a symbolic link: ${join(rootDir, targetName)}`,
      )
    }
    const targetKind = publicationTargetKind(targetName)
    const hasExpectedType =
      !destination ||
      (targetKind === 'directory'
        ? destination.isDirectory()
        : destination.isFile())
    if (!hasExpectedType) {
      throw new Error(
        `published destination ${join(rootDir, targetName)} must be a ${targetKind === 'directory' ? 'directory' : 'regular file'}`,
      )
    }
  }

  const manifestDestination = await lstatIfPresent(manifestPath, { fs })
  if (manifestDestination?.isSymbolicLink()) {
    throw new Error(`published destination is a symbolic link: ${manifestPath}`)
  }
  if (manifestDestination && !manifestDestination.isFile()) {
    throw new Error(`published destination ${manifestPath} must be a regular file`)
  }

  let stageDir
  let backupDir
  let primaryError = null
  let preserveBackup = false
  const applied = []

  try {
    stageDir = await fs.mkdtemp(join(rootDir, '.publish-root-stage-'))
    backupDir = await fs.mkdtemp(join(rootDir, '.publish-root-backup-'))

    for (const item of plan) {
      const staged = join(stageDir, item.targetName)
      if (item.entry.isDirectory()) {
        await fs.cp(item.from, staged, { recursive: true })
      } else if (item.entry.isFile()) {
        await fs.copyFile(item.from, staged)
      } else {
        throw new Error(`unsupported distribution entry: ${item.from}`)
      }
      item.staged = staged
    }

    const stagedManifest = join(stageDir, publicationManifestName)
    await fs.writeFile(
      stagedManifest,
      `${JSON.stringify(
        {
          version: publicationManifestVersion,
          targets: currentTargetNames,
        },
        null,
        2,
      )}\n`,
    )

    const actions = [
      ...plan,
      ...staleTargetNames.map((targetName) => ({
        staged: null,
        targetName,
        to: join(rootDir, targetName),
      })),
      {
        staged: stagedManifest,
        targetName: publicationManifestName,
        to: manifestPath,
      },
    ]

    for (const item of actions) {
      const previous = await lstatIfPresent(item.to, { fs })
      const appliedItem = {
        backup: join(backupDir, item.targetName),
        hadPrevious: Boolean(previous),
        installedNew: false,
        to: item.to,
      }

      if (previous) {
        await fs.rename(item.to, appliedItem.backup)
      }
      applied.push(appliedItem)

      if (item.staged) {
        await fs.rename(item.staged, item.to)
        appliedItem.installedNew = true
      }
    }
  } catch (error) {
    primaryError = error
    try {
      await rollbackPublishedEntries(applied, fs)
    } catch (rollbackError) {
      preserveBackup = true
      primaryError = new AggregateError(
        [error, rollbackError],
        `publication failed and rollback was incomplete; backups preserved at ${backupDir}`,
      )
    }
  }

  const cleanupErrors = await cleanupTemporaryDirectories(
    [stageDir, preserveBackup ? null : backupDir],
    fs,
  )
  if (primaryError && cleanupErrors.length > 0) {
    throw new AggregateError(
      [primaryError, ...cleanupErrors],
      `publication failed: ${primaryError.message}; temporary cleanup was incomplete`,
    )
  }
  if (primaryError) throw primaryError
  if (cleanupErrors.length > 0) {
    throw new AggregateError(
      cleanupErrors,
      'publication completed but temporary cleanup was incomplete',
    )
  }
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isDirectRun) {
  publishRoot().catch((error) => {
    console.error(`Root publication failed: ${error.message}`)
    process.exitCode = 1
  })
}
