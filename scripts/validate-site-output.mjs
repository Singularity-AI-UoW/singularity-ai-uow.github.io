import { constants as fsConstants } from 'node:fs'
import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const rootDir = process.cwd()
const filesToValidate = [
  join(rootDir, 'public', 'instagram-posts.json'),
  join(rootDir, 'dist', 'instagram-posts.json'),
  join(rootDir, 'instagram-posts.json'),
]

async function assertFileExists(path) {
  try {
    await access(path, fsConstants.F_OK)
  } catch {
    throw new Error(`Expected generated file is missing: ${path}`)
  }
}

function assertValidPost(post, path, index) {
  if (
    typeof post?.title !== 'string' ||
    typeof post?.href !== 'string' ||
    !post.href.startsWith('https://www.instagram.com/') ||
    (post.imageUrl != null && typeof post.imageUrl !== 'string') ||
    !Number.isFinite(post?.embedWidth) ||
    !Number.isFinite(post?.embedHeight)
  ) {
    throw new Error(`Invalid Instagram post at index ${index} in ${path}`)
  }
}

function assertValidPayload(payload, path) {
  if (typeof payload?.username !== 'string' || !Array.isArray(payload?.posts)) {
    throw new Error(`Invalid Instagram payload structure in ${path}`)
  }

  if (payload.posts.length === 0) {
    throw new Error(`Instagram payload in ${path} did not include any posts`)
  }

  payload.posts.forEach((post, index) => assertValidPost(post, path, index))
}

async function validateJsonFile(path) {
  await assertFileExists(path)

  let payload
  try {
    const raw = await readFile(path, 'utf8')
    payload = JSON.parse(raw)
  } catch (error) {
    throw new Error(`Failed to parse JSON in ${path}: ${error.message}`)
  }

  assertValidPayload(payload, path)
}

await Promise.all(filesToValidate.map(validateJsonFile))
console.log('Validated generated Instagram feed files.')
