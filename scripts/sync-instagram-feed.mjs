import { access, readFile, writeFile } from 'node:fs/promises'
import { constants as fsConstants } from 'node:fs'
import { join } from 'node:path'

const USERNAME = 'singularity_uow'
const MAX_POSTS = 3
const OUTPUT_PATH = join(process.cwd(), 'public', 'instagram-posts.json')
const PROFILE_URL = `https://www.instagram.com/${USERNAME}/`
const TIMELINE_URL = `https://www.instagram.com/api/v1/feed/user/${USERNAME}/username/?count=12`

function getEmbedPath(item) {
  return item.product_type === 'clips' || item.subtype_name_for_REST__ === 'XDTClipsMedia'
    ? 'reel'
    : 'p'
}

function getEmbedHeight(item) {
  if (getEmbedPath(item) === 'reel') {
    return 884
  }

  const width = item.original_width || item.image_versions2?.candidates?.[0]?.width || 1
  const height = item.original_height || item.image_versions2?.candidates?.[0]?.height || 1
  const aspectRatio = height / width

  if (aspectRatio >= 1.1) {
    return 760
  }

  if (aspectRatio <= 0.85) {
    return 620
  }

  return 700
}

function getTitle(item) {
  const kind = getEmbedPath(item) === 'reel' ? 'Instagram reel' : 'Instagram post'
  const publishedAt = item.taken_at ? new Date(item.taken_at * 1000) : null
  if (publishedAt && Number.isFinite(publishedAt.getTime())) {
    return `${kind} from ${publishedAt.toISOString().slice(0, 10)}`
  }

  return kind
}

function getThumbnailUrl(item) {
  const candidates = item.image_versions2?.candidates

  if (Array.isArray(candidates) && candidates.length > 0) {
    return candidates[0].url
  }

  const carouselCandidates = item.carousel_media?.[0]?.image_versions2?.candidates
  if (Array.isArray(carouselCandidates) && carouselCandidates.length > 0) {
    return carouselCandidates[0].url
  }

  return null
}

function normalisePost(item) {
  if (!item?.code) {
    return null
  }

  const imageUrl = getThumbnailUrl(item)

  return {
    title: getTitle(item),
    href: `https://www.instagram.com/${getEmbedPath(item)}/${item.code}/`,
    imageUrl,
    embedWidth: 360,
    embedHeight: getEmbedHeight(item),
  }
}

async function fileExists(path) {
  try {
    await access(path, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

async function readExistingPayload() {
  if (!(await fileExists(OUTPUT_PATH))) {
    return null
  }

  try {
    const raw = await readFile(OUTPUT_PATH, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function fetchLatestPosts() {
  const response = await fetch(TIMELINE_URL, {
    headers: {
      accept: 'application/json',
      referer: PROFILE_URL,
      'user-agent': 'Mozilla/5.0',
      'x-ig-app-id': '936619743392459',
    },
  })

  if (!response.ok) {
    throw new Error(`Instagram timeline request failed with ${response.status}`)
  }

  const payload = await response.json()
  const items = Array.isArray(payload?.items) ? payload.items : []
  const posts = items.map(normalisePost).filter(Boolean).slice(0, MAX_POSTS)

  if (posts.length === 0) {
    throw new Error('Instagram timeline returned no usable posts')
  }

  return {
    username: USERNAME,
    generatedAt: new Date().toISOString(),
    posts,
  }
}

async function main() {
  try {
    const payload = await fetchLatestPosts()
    await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
    console.log(`Synced ${payload.posts.length} Instagram posts to public/instagram-posts.json`)
  } catch (error) {
    const existingPayload = await readExistingPayload()

    if (existingPayload?.posts?.length) {
      console.warn(
        `Instagram sync failed (${error.message}). Keeping existing public/instagram-posts.json.`,
      )
      return
    }

    throw error
  }
}

await main()
