import { copyFile, cp, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

const rootDir = process.cwd()
const distDir = join(rootDir, 'dist')
const rootAssetsDir = join(rootDir, 'assets')

const distEntries = await readdir(distDir, { withFileTypes: true })

await rm(rootAssetsDir, { recursive: true, force: true })

for (const entry of distEntries) {
  const from = join(distDir, entry.name)

  if (entry.isDirectory()) {
    if (entry.name === 'assets') {
      await cp(from, rootAssetsDir, { recursive: true })
    }
    continue
  }

  const targetName = entry.name === 'site.html' ? 'index.html' : entry.name
  const to = join(rootDir, targetName)
  await copyFile(from, to)
}
