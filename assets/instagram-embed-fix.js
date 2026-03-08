const fallbackPosts = [
  {
    title: "International Women's Day reel",
    href: 'https://www.instagram.com/reel/DVmugzek94K/',
  },
  {
    title: 'Club day update',
    href: 'https://www.instagram.com/p/DVcAjXIE3IM/',
  },
  {
    title: 'Global Game Jam project spotlight',
    href: 'https://www.instagram.com/p/DUpuTP2ER5B/',
  },
]

const embedScriptId = 'instagram-embed-script'
let postsPromise

function isValidInstagramPost(post) {
  return typeof post?.href === 'string' && post.href.startsWith('https://www.instagram.com/')
}

function getInstagramEmbedPermalink(href) {
  const permalink = new URL(href, window.location.origin)
  permalink.searchParams.set('utm_source', 'ig_embed')
  permalink.searchParams.set('utm_campaign', 'loading')
  return permalink.toString()
}

async function loadPosts() {
  if (!postsPromise) {
    postsPromise = (async () => {
      try {
        const response = await fetch('/instagram-posts.json', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Instagram feed returned ${response.status}`)
        }

        const payload = await response.json()
        if (!Array.isArray(payload?.posts)) {
          throw new Error('Instagram feed did not include a posts array')
        }

        const posts = payload.posts.filter(isValidInstagramPost)
        return posts.length > 0 ? posts : fallbackPosts
      } catch (error) {
        console.warn('Falling back to bundled Instagram post URLs.', error)
        return fallbackPosts
      }
    })()
  }

  return postsPromise
}

function ensureInstagramEmbedScript() {
  const processEmbeds = () => {
    window.instgrm?.Embeds?.process?.()
  }

  if (window.instgrm?.Embeds?.process) {
    processEmbeds()
    return
  }

  let script = document.getElementById(embedScriptId)
  if (!script) {
    script = document.createElement('script')
    script.id = embedScriptId
    script.async = true
    script.src = 'https://www.instagram.com/embed.js'
    document.body.appendChild(script)
  }

  script.addEventListener('load', processEmbeds, { once: true })
}

function buildEmbedCard(post) {
  const article = document.createElement('article')
  article.className = 'glass-card update-card'

  const shell = document.createElement('div')
  shell.className = 'update-embed-shell'

  const blockquote = document.createElement('blockquote')
  blockquote.className = 'instagram-media'
  blockquote.setAttribute('data-instgrm-captioned', 'true')
  blockquote.setAttribute('data-instgrm-permalink', getInstagramEmbedPermalink(post.href))
  blockquote.setAttribute('data-instgrm-version', '14')
  blockquote.setAttribute('cite', post.href)

  const link = document.createElement('a')
  link.href = post.href
  link.target = '_blank'
  link.rel = 'noreferrer'
  link.textContent = `View ${post.title} on Instagram`

  blockquote.appendChild(link)
  shell.appendChild(blockquote)
  article.appendChild(shell)

  return article
}

function renderUpdates(posts) {
  const updatesSection = document.getElementById('updates')
  const updatesGrid = updatesSection?.querySelector('.updates-grid')
  const sectionHeader = updatesSection?.querySelector('.section-header')

  if (!updatesGrid || !sectionHeader) {
    return false
  }

  const heading = sectionHeader.querySelector('h2')
  const description = sectionHeader.querySelector('p')

  if (heading) {
    heading.textContent = 'Live Instagram updates'
  }

  if (description) {
    description.textContent =
      'Recent posts are embedded directly from Instagram, so each post keeps its own layout and height.'
  }

  updatesGrid.replaceChildren(...posts.map(buildEmbedCard))
  ensureInstagramEmbedScript()
  return true
}

async function applyInstagramEmbedFix(attemptsRemaining = 40) {
  if (attemptsRemaining <= 0) {
    return
  }

  const posts = await loadPosts()
  if (renderUpdates(posts)) {
    return
  }

  window.setTimeout(() => {
    applyInstagramEmbedFix(attemptsRemaining - 1)
  }, 150)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    applyInstagramEmbedFix()
  })
} else {
  applyInstagramEmbedFix()
}
