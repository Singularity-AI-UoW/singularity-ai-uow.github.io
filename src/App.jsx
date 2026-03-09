import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  CalendarDays,
  Code2,
  ExternalLink,
  Github,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react'

const joinLink = 'https://forms.office.com/'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Executives', href: '#executives' },
  { label: 'Events', href: '#events' },
  { label: 'Updates', href: '#updates' },
  { label: 'Resources', href: '#resources' },
]

const aboutCards = [
  {
    icon: Brain,
    accent: 'var(--primary)',
    title: 'Learn with structure',
    description:
      'Singularity keeps AI approachable through guided workshops, clear follow-up, and sessions that start from first principles.',
  },
  {
    icon: Users,
    accent: 'var(--secondary)',
    title: 'Meet collaborators',
    description:
      'The club gives students a place to compare tools, find teammates, and keep ideas moving after the first conversation.',
  },
  {
    icon: Sparkles,
    accent: 'var(--accent)',
    title: 'Stay current',
    description:
      'Events, Instagram updates, and shared resources make it easier to stay involved across the whole year.',
  },
]

const executiveRoles = [
  {
    role: 'President',
    name: 'Kang Zhou',
    photoName: 'kang-zhou',
    summary:
      'Owns direction, partnerships, and the overall rhythm of the club year.',
  },
  {
    role: 'Content Creator',
    name: 'Chianne Lyford Shields',
    photoName: 'chianne-lyford-shields',
    summary:
      'Supports content delivery across events, operations, and taking photo and video for the club.',
  },
  {
    role: 'Secretary',
    name: 'Andrew Lin',
    photoName: 'andrew-lin',
    summary:
      'Keeps communication, records, and follow-up organised so members know what is happening next.',
  },
  {
    role: 'Treasurer',
    name: 'Alex Noble',
    photoName: 'alex-noble',
    summary:
      'Looks after budgeting, approvals, and the practical resourcing behind club activity.',
  },
]

const executivePhotoExtensions = ['jpg', 'jpeg', 'png', 'webp']

const eventSchedule = [
  {
    month: 'March',
    dateLabel: '20 March 2026',
    title: 'Kickoff + On-ramp Demo',
    summary:
      'Participants build a working AI demo and leave with clear next steps for getting involved, with minimal technical barriers.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'March',
    dateLabel: '27 March 2026',
    title: 'Social + Lightning Intros',
    summary:
      'Members meet peers, surface shared interests, and shape future events through structured introductions and topic clustering.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'April',
    dateLabel: '10 April 2026',
    title: 'Model Basics Workshop',
    summary:
      'Beginners learn data splits and metrics while returning members improve model baselines in a deeper core lane.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'April',
    dateLabel: '24 April 2026',
    title: 'Git, Colab + Hugging Face Basics',
    summary:
      'Attendees clone a repo, run a notebook, and load a model for inference as a practical workflow setup session.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'May',
    dateLabel: '8 May 2026',
    title: 'Kaggle Lite',
    summary:
      'Teams start from a baseline notebook and iterate toward better scores, learning how to test improvements without heavy setup overhead.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'May',
    dateLabel: '22 May 2026',
    title: 'Paper Story Night',
    summary:
      'Members learn to explain a classic paper\'s problem, core idea, main result, and limitations in plain language.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'June',
    dateLabel: '5 June 2026',
    title: 'Campus Helper Bot Mini-hackathon',
    summary:
      'Teams build a demo that solves a real campus problem and leave with something concrete to present.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'June',
    dateLabel: '19 June 2026',
    title: 'Research Talk',
    summary:
      'Members get an accessible view of real AI research or industry work, with enough context for beginner questions.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'July',
    dateLabel: '3 July 2026',
    title: 'Debug Night',
    summary:
      'Beginners practise a repeatable debugging process while core members work through real ML and development failures.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'July',
    dateLabel: '17 July 2026',
    title: 'Diffusion Models Explained',
    summary:
      'Members build intuition for diffusion, where it works well, and the tradeoffs that matter most in practice.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'July',
    dateLabel: '31 July 2026',
    title: 'Diffusion Build-along',
    summary:
      'Attendees run a working diffusion pipeline and change key settings to see how outputs shift in practice.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'August',
    dateLabel: '14 August 2026',
    title: 'Serving Basics + Local Inference',
    summary:
      'Beginners learn what model serving means, while the core track explores performance and deployment tradeoffs.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'August',
    dateLabel: '28 August 2026',
    title: 'Debate Night: AI in Society',
    summary:
      'Members practise structured, balanced discussion about AI\'s social impact instead of defaulting to hot takes.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'September',
    dateLabel: '11 September 2026',
    title: 'Project Night: Website / OpenClaw',
    summary:
      'Members demo real progress, recruit collaborators, and make it easier for others to join active club projects.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'September',
    dateLabel: '25 September 2026',
    title: 'Fine-tuning Night',
    summary:
      'Beginners compare fine-tuning with prompting and RAG, while the core lane tries a small LoRA fine-tune.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'October',
    dateLabel: '9 October 2026',
    title: 'Ethics and Failure Modes',
    summary:
      'Members work through real risks such as bias, hallucination, privacy, and misuse, then plan practical mitigations.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'October',
    dateLabel: '23 October 2026',
    title: 'Kaggle Challenge Day',
    summary:
      'Teams make live Kaggle submissions, iterate from a baseline, and learn the full competition loop from setup to score improvement.',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'November',
    dateLabel: '6 November 2026',
    title: 'Showcase Night + Awards',
    summary:
      'Members present what they built, celebrate progress, and close the year with awards across beginner and technical categories.',
    location: 'University of Waikato, Hamilton Campus',
  },
]

const fallbackInstagramPosts = [
  {
    title: 'International Women\'s Day reel',
    href: 'https://www.instagram.com/reel/DVmugzek94K/',
    embedWidth: 360,
    embedHeight: 884,
  },
  {
    title: 'Club day update',
    href: 'https://www.instagram.com/p/DVcAjXIE3IM/',
    embedWidth: 360,
    embedHeight: 663,
  },
  {
    title: 'Global Game Jam project spotlight',
    href: 'https://www.instagram.com/p/DUpuTP2ER5B/',
    embedWidth: 360,
    embedHeight: 510,
  },
]

const instagramFeedEndpoint = '/instagram-posts.json'

const resources = [
  {
    title: 'Python docs',
    type: 'Reference',
    href: 'https://docs.python.org/3/',
    icon: BookOpen,
  },
  {
    title: 'PyTorch tutorials',
    type: 'Build',
    href: 'https://pytorch.org/tutorials/',
    icon: Code2,
  },
  {
    title: 'Hugging Face course',
    type: 'LLMs',
    href: 'https://huggingface.co/learn',
    icon: Bot,
  },
  {
    title: 'Kaggle Learn',
    type: 'Practice',
    href: 'https://www.kaggle.com/learn',
    icon: Zap,
  },
  {
    title: 'Papers with Code',
    type: 'Research',
    href: 'https://paperswithcode.com/',
    icon: Sparkles,
  },
  {
    title: 'NIST AI RMF',
    type: 'Responsible AI',
    href: 'https://www.nist.gov/itl/ai-risk-management-framework',
    icon: Brain,
  },
]

const contactLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/singularity_uow/',
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Singularity-AI-UoW',
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:singularity@clubs.wsu.org.nz',
    external: false,
  },
]

function isValidInstagramPost(post) {
  return (
    typeof post?.href === 'string' &&
    post.href.startsWith('https://www.instagram.com/') &&
    Number.isFinite(post?.embedWidth) &&
    Number.isFinite(post?.embedHeight)
  )
}

function getInstagramEmbedFrameUrl(href) {
  const url = new URL(href)
  url.search = ''
  url.hash = ''
  url.pathname = `${url.pathname.replace(/\/$/, '')}/embed/captioned/`
  return url.toString()
}

function parseInstagramEmbedMessage(message) {
  if (typeof message !== 'string') {
    return null
  }

  try {
    return JSON.parse(message)
  } catch {
    return null
  }
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

function Particles() {
  const [particles] = useState(() =>
    Array.from({ length: 16 }, (_, index) => ({
      id: index,
      size: Math.random() * 4 + 2,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.35 + 0.15,
      duration: Math.random() * 4 + 3,
      distance: Math.random() * 30 + 12,
      delay: Math.random() * 2,
      color:
        index % 3 === 0
          ? 'var(--primary)'
          : index % 3 === 1
            ? 'var(--secondary)'
            : 'var(--accent)',
    })),
  )

  return (
    <div className="floating-particles" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="particle"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
            background: particle.color,
          }}
          animate={{
            y: [0, -particle.distance, 0],
            opacity: [particle.opacity, particle.opacity + 0.2, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="section-header">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

function ExecutivePhoto({ member }) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isMissing, setIsMissing] = useState(!member.photoName)

  const photoSrc =
    !isMissing && member.photoName
      ? `/executives/${member.photoName}.${executivePhotoExtensions[photoIndex]}`
      : null

  const handleError = () => {
    const nextIndex = photoIndex + 1
    if (nextIndex < executivePhotoExtensions.length) {
      setPhotoIndex(nextIndex)
      return
    }

    setIsMissing(true)
  }

  return (
    <div className="exec-photo-frame">
      {photoSrc ? (
        <img
          src={photoSrc}
          alt={`Portrait of ${member.name}`}
          className="exec-photo"
          loading="lazy"
          onError={handleError}
        />
      ) : (
        <div className="exec-photo-fallback">{getInitials(member.name)}</div>
      )}
    </div>
  )
}

function InstagramEmbedCard({ post, index }) {
  const shellRef = useRef(null)
  const frameRef = useRef(null)
  const [frameHeight, setFrameHeight] = useState(post.embedHeight)

  useEffect(() => {
    const shell = shellRef.current
    const frame = frameRef.current
    if (!shell || !frame) {
      return undefined
    }

    const updateHeight = () => {
      const shellWidth = shell.getBoundingClientRect().width || post.embedWidth
      const scaledHeight = Math.round((shellWidth / post.embedWidth) * post.embedHeight)
      const nextHeight = Math.max(480, scaledHeight)
      setFrameHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      )
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(shell)

    const handleMessage = (event) => {
      if (event.origin !== 'https://www.instagram.com') {
        return
      }

      if (event.source !== frame.contentWindow) {
        return
      }

      const payload = parseInstagramEmbedMessage(event.data)
      if (payload?.type !== 'MEASURE') {
        return
      }

      const nextHeight = Math.max(480, Number(payload.details?.height) || 0)
      setFrameHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      )
    }

    window.addEventListener('message', handleMessage)

    return () => {
      observer.disconnect()
      window.removeEventListener('message', handleMessage)
    }
  }, [post.embedHeight, post.embedWidth])

  return (
    <motion.article
      className="glass-card update-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div ref={shellRef} className="update-embed-shell">
        <iframe
          ref={frameRef}
          className="update-embed-frame"
          title={`${post.title} Instagram embed`}
          src={getInstagramEmbedFrameUrl(post.href)}
          loading="lazy"
          scrolling="no"
          allowFullScreen
          style={{ height: `${frameHeight}px` }}
        />
      </div>
      <a
        className="inline-link update-embed-link"
        href={post.href}
        target="_blank"
        rel="noreferrer"
      >
        View on Instagram <ExternalLink size={16} />
      </a>
    </motion.article>
  )
}

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setMenuOpen(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#top" className="logo" onClick={closeMenu}>
          <img src="/singularity-icon.svg" alt="Singularity" />
          <div className="logo-copy">
            <strong>Singularity</strong>
            <span>University of Waikato AI Club</span>
          </div>
        </a>

        <div className="nav-desktop">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="mobile-nav-shell"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container">
              <div className="mobile-nav-panel glass-card">
                <ul className="mobile-nav-links">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} onClick={closeMenu}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <Particles />

      <div className="container hero-shell">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">University of Waikato AI Club</span>
          <h1>Singularity</h1>
          <p>
            Singularity is a student-led AI club focused on practical workshops,
            thoughtful discussion, and projects that members can actually show.
          </p>

          <div className="hero-actions">
            <a
              href={joinLink}
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Join Singularity <ArrowRight size={18} />
            </a>
            <a href="#events" className="btn btn-outline">
              View 2026 events <CalendarDays size={18} />
            </a>
          </div>
        </motion.div>

        <motion.aside
          className="hero-panel glass-card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="panel-badge">
            <Sparkles size={16} />
            What to expect
          </div>
          <h2>A full year of practical AI events.</h2>
          <p>
            From March to November, Singularity mixes on-ramps, project nights,
            talks, socials, and a showcase that keeps the year connected.
          </p>

          <div className="hero-stat-grid">
            <div className="hero-stat">
              <strong>{eventSchedule.length}</strong>
              <span>planned events</span>
            </div>
            <div className="hero-stat">
              <strong>Mar-Nov</strong>
              <span>from kickoff to showcase</span>
            </div>
            <div className="hero-stat">
              <strong>Beginner Friendly</strong>
              <span>with room to go deeper</span>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="About"
          title="What Singularity is for"
          description="Singularity is designed to help students get into AI, stay engaged, and keep momentum between events."
        />

        <div className="grid-3">
          {aboutCards.map((card, index) => (
            <motion.article
              key={card.title}
              className="glass-card info-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="info-icon" style={{ color: card.accent }}>
                <card.icon size={30} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Executives() {
  return (
    <section id="executives" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Executives"
          title="Executive team"
          description="Meet the team helping run Singularity through the 2026 club year."
        />

        <div className="exec-grid">
          {executiveRoles.map((member, index) => (
            <motion.article
              key={member.role}
              className="glass-card exec-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <ExecutivePhoto member={member} />
              <span className="tag exec-role">{member.role}</span>
              <h3 className="exec-name">{member.name}</h3>
              <p>{member.summary}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Events() {
  const carouselRef = useRef(null)

  const handleWheel = (event) => {
    const carousel = carouselRef.current
    if (!carousel) {
      return
    }

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return
    }

    event.preventDefault()
    carousel.scrollLeft += event.deltaY
  }

  return (
    <section id="events" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Events"
          title="The 2026 event calendar"
          description="Scroll through the 2026 lineup to see the workshops, socials, talks, and showcase moments planned across the year."
        />

        <p className="event-carousel-note">
          Hover here and use your scroll wheel to move sideways through the year.
        </p>

        <div ref={carouselRef} className="event-carousel" onWheel={handleWheel}>
          {eventSchedule.map((event, index) => (
            <motion.article
              key={`${event.dateLabel}-${event.title}`}
              className="glass-card event-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <div className="event-top">
                <span className="tag">{event.month}</span>
                <span className="event-date">
                  <CalendarDays size={16} />
                  {event.dateLabel}
                </span>
              </div>
              <h3>{event.title}</h3>
              <p className="event-summary">{event.summary}</p>
              <div className="event-location">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Updates() {
  const [posts, setPosts] = useState(fallbackInstagramPosts)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPosts() {
      try {
        const response = await fetch(instagramFeedEndpoint, {
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Instagram feed returned ${response.status}`)
        }

        const payload = await response.json()

        if (!Array.isArray(payload?.posts)) {
          throw new Error('Instagram feed did not include a posts array')
        }

        const latestPosts = payload.posts.filter(isValidInstagramPost)
        if (latestPosts.length > 0) {
          setPosts(latestPosts)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('Falling back to bundled Instagram post URLs.', error)
        }
      }
    }

    loadPosts()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <section id="updates" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Updates"
          title="Latest from Instagram"
          description="The feed below pulls from the club's latest public Instagram posts."
        />

        <div className="updates-grid">
          {posts.map((post, index) => (
            <InstagramEmbedCard key={post.href} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Resources() {
  return (
    <section id="resources" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Resources"
          title="A short starting stack"
          description="Useful references, tutorials, and courses for members who want a strong place to begin."
        />

        <div className="grid-3">
          {resources.map((resource, index) => (
            <motion.a
              key={resource.title}
              className="glass-card resource-card"
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="resource-icon">
                <resource.icon size={24} />
              </div>
              <div className="resource-copy">
                <span className="tag">{resource.type}</span>
                <h3>{resource.title}</h3>
              </div>
              <ExternalLink size={18} />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <a href="#top" className="logo footer-logo">
            <img src="/singularity-icon.svg" alt="Singularity" />
            <div className="logo-copy">
              <strong>Singularity</strong>
              <span>University of Waikato AI Club</span>
            </div>
          </a>
          <p>
            Singularity is the University of Waikato AI Club, focused on
            approachable workshops, strong follow-up, and student-led momentum.
          </p>
          <a
            href={joinLink}
            className="btn btn-primary footer-cta"
            target="_blank"
            rel="noreferrer"
          >
            Join Singularity <ArrowRight size={18} />
          </a>
        </div>

        <div>
          <h4>Explore</h4>
          <ul className="footer-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Connect</h4>
          <ul className="footer-links">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Singularity, University of Waikato.</p>
      </div>
    </footer>
  )
}

function App() {
  return (
    <>
      <div className="bg-grid" />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Executives />
        <Events />
        <Updates />
        <Resources />
      </main>
      <Footer />
    </>
  )
}

export default App
