import { copyFile, cp, readdir, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export async function publishRoot(rootDir = process.cwd()) {
  const distDir = join(rootDir, 'dist')
  const distEntries = await readdir(distDir, { withFileTypes: true })

  for (const entry of distEntries) {
    const from = join(distDir, entry.name)

    if (entry.isDirectory()) {
      const to = join(rootDir, entry.name)
      await rm(to, { recursive: true, force: true })
      await cp(from, to, { recursive: true })
      continue
    }

    const targetName = entry.name === 'site.html' ? 'index.html' : entry.name
    const to = join(rootDir, targetName)
    await copyFile(from, to)
  }
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isDirectRun) {
  await publishRoot()
}
