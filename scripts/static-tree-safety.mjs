import * as fsPromises from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export async function lstatIfPresent(path, { fs = fsPromises } = {}) {
  try {
    return await fs.lstat(path)
  } catch (error) {
    if (error?.code === 'ENOENT') return null
    throw error
  }
}

export async function assertPathHasNoSymlinkSegments(
  containmentRoot,
  targetPath,
  label,
  { fs = fsPromises } = {},
) {
  const rootPath = resolve(containmentRoot)
  const resolvedTarget = resolve(targetPath)
  const relativeTarget = relative(rootPath, resolvedTarget)

  if (
    isAbsolute(relativeTarget) ||
    relativeTarget === '..' ||
    relativeTarget.startsWith(`..${sep}`)
  ) {
    throw new Error(`${label} escapes its containment root: ${targetPath}`)
  }

  const segments = relativeTarget ? relativeTarget.split(sep) : []
  let currentPath = rootPath
  for (let index = -1; index < segments.length; index += 1) {
    if (index >= 0) currentPath = join(currentPath, segments[index])
    const stats = await fs.lstat(currentPath)
    if (stats.isSymbolicLink()) {
      throw new Error(`${label} contains a symbolic link: ${currentPath}`)
    }
    if (index < segments.length - 1 && !stats.isDirectory()) {
      throw new Error(
        `${label} contains a non-directory path segment: ${currentPath}`,
      )
    }
  }
}

export async function assertTreeHasNoSymlinks(
  path,
  label,
  { fs = fsPromises } = {},
) {
  const stats = await fs.lstat(path)
  if (stats.isSymbolicLink()) {
    throw new Error(`${label} contains a symbolic link: ${path}`)
  }
  if (stats.isFile()) return
  if (!stats.isDirectory()) {
    throw new Error(`${label} contains an unsupported filesystem entry: ${path}`)
  }

  const entries = await fs.readdir(path, { withFileTypes: true })
  for (const entry of entries) {
    const childPath = join(path, entry.name)
    if (entry.isSymbolicLink()) {
      throw new Error(`${label} contains a symbolic link: ${childPath}`)
    }
    if (entry.isDirectory()) {
      await assertTreeHasNoSymlinks(childPath, label, { fs })
      continue
    }
    if (!entry.isFile()) {
      throw new Error(`${label} contains an unsupported filesystem entry: ${childPath}`)
    }
  }
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isDirectRun) {
  const repoDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const publicDir = join(repoDir, 'public')
  assertTreeHasNoSymlinks(publicDir, 'public static source').catch((error) => {
    console.error(`Static source verification failed: ${error.message}`)
    process.exitCode = 1
  })
}
