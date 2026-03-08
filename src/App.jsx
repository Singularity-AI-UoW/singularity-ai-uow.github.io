import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  CalendarDays,
  ChevronRight,
  Code2,
  ExternalLink,
  Github,
  Instagram,
  Mail,
  Menu,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Build', href: '#projects' },
  { label: 'Events', href: '#events' },
  { label: 'Updates', href: '#updates' },
  { label: 'Join', href: '#join' },
  { label: 'Contact', href: '#contact' },
]

const aboutCards = [
  {
    icon: Brain,
    accent: 'var(--primary)',
    title: 'Learn together',
    description:
      'Beginner-friendly sessions make core AI ideas practical, from prompting and Python basics to model evaluation.',
  },
  {
    icon: Code2,
    accent: 'var(--secondary)',
    title: 'Build in public',
    description:
      'We turn ideas into prototypes through collaborative build nights, hackathons, and student-led demos.',
  },
  {
    icon: Users,
    accent: 'var(--accent)',
    title: 'Meet your people',
    description:
      'The club is a low-pressure place to find collaborators, compare tools, and share what is actually working.',
  },
]

const buildTracks = [
  {
    title: 'LLMs and agents',
    description:
      'Experiment with prompt design, retrieval, structured outputs, and assistant-style workflows.',
    status: 'Current focus',
    tags: ['Prompting', 'RAG', 'Interfaces'],
  },
  {
    title: 'Vision and robotics',
    description:
      'Prototype with computer vision, sensors, and edge hardware for projects that can move beyond the screen.',
    status: 'Hands-on',
    tags: ['CV', 'Edge AI', 'Robotics'],
  },
  {
    title: 'Creative AI and game jams',
    description:
      'Use generative tools, playful experiments, and rapid jam cycles to learn by shipping something memorable.',
    status: 'Club favourite',
    tags: ['Game Jam', 'Media', 'Prototyping'],
  },
]

const eventFormats = [
  {
    icon: CalendarDays,
    title: 'Workshop sessions',
    description:
      'Short guided sessions that introduce a tool, concept, or workflow without assuming everyone starts at the same level.',
  },
  {
    icon: Zap,
    title: 'Project sprints',
    description:
      'Build nights focused on momentum: pick an idea, prototype quickly, and get feedback while it is still easy to change.',
  },
  {
    icon: Sparkles,
    title: 'Show and tell',
    description:
      'Casual demos, guest speakers, and end-of-trimester showcases that turn learning into something visible.',
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
    title: 'Instagram',
    description: '@singularity_uow',
    href: 'https://www.instagram.com/singularity_uow/',
    icon: Instagram,
    external: true,
  },
  {
    title: 'GitHub',
    description: 'Singularity-AI-UoW',
    href: 'https://github.com/Singularity-AI-UoW',
    icon: Github,
    external: true,
  },
  {
    title: 'Email',
    description: 'hello@singularityai.club',
    href: 'mailto:hello@singularityai.club',
    icon: Mail,
    external: false,
  },
]

const joinBenefits = [
  'Learn the tooling with other students, not in isolation.',
  'Find collaborators for prototypes, jams, and portfolio work.',
  'Share experiments early and improve them while they are still rough.',
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

function Particles() {
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, index) => ({
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
          <img src="/singularity-icon.svg" alt="Singularity AI" />
          <div className="logo-copy">
            <strong>Singularity AI</strong>
            <span>University of Waikato</span>
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
          <a
            className="btn btn-outline nav-cta"
            href="https://www.instagram.com/singularity_uow/"
            target="_blank"
            rel="noreferrer"
          >
            Follow us <ExternalLink size={16} />
          </a>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
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
                <a
                  className="btn btn-primary"
                  href="https://www.instagram.com/singularity_uow/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                >
                  Follow on Instagram <ExternalLink size={16} />
                </a>
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
          <span className="eyebrow">University of Waikato AI student club</span>
          <h1>
            Learn AI by
            <span>building with people.</span>
          </h1>
          <p>
            Singularity AI is a student club for experimenting with modern AI
            tools, sharing ideas, and turning curiosity into projects that
            actually ship.
          </p>
          <div className="hero-actions">
            <a href="#join" className="btn btn-primary">
              Join the club <ArrowRight size={18} />
            </a>
            <a href="#updates" className="btn btn-outline">
              See latest updates <ChevronRight size={18} />
            </a>
          </div>
          <ul className="hero-highlights">
            <li>Beginner-friendly workshops</li>
            <li>Build nights and demos</li>
            <li>Project-first learning</li>
          </ul>
        </motion.div>

        <motion.aside
          className="hero-panel glass-card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="panel-badge">
            <Sparkles size={16} />
            What the club feels like
          </div>
          <h2>Low ego. High signal. Lots of building.</h2>
          <p>
            The goal is simple: make AI feel approachable, practical, and worth
            doing well.
          </p>

          <div className="panel-list">
            <div className="panel-item">
              <div className="panel-icon">
                <BookOpen size={18} />
              </div>
              <div>
                <strong>Learn the fundamentals</strong>
                <span>Workshops that explain the why, not only the clicks.</span>
              </div>
            </div>
            <div className="panel-item">
              <div className="panel-icon">
                <Code2 size={18} />
              </div>
              <div>
                <strong>Prototype fast</strong>
                <span>Test ideas quickly, then keep the ones that survive contact.</span>
              </div>
            </div>
            <div className="panel-item">
              <div className="panel-icon">
                <Users size={18} />
              </div>
              <div>
                <strong>Share the work</strong>
                <span>Demo what you are trying, get feedback, and keep iterating.</span>
              </div>
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
          title="A club built around practical AI learning"
          description="We learn AI through workshops, experiments, and collaborative projects that help students move from theory to practice."
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

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Build"
          title="The kinds of projects we rally around"
          description="These are the build tracks members can plug into across workshops, jams, and self-directed prototypes."
        />

        <div className="grid-3">
          {buildTracks.map((track, index) => (
            <motion.article
              key={track.title}
              className="glass-card project-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="project-head">
                <Zap size={22} />
                <span className="tag project-status">{track.status}</span>
              </div>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <div className="project-tags">
                {track.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Events() {
  return (
    <section id="events" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Events"
          title="Structured enough to be useful, flexible enough to stay current"
          description="Expect workshops, build nights, and showcase moments throughout the trimester, with exact details shared through our live channels."
        />

        <div className="activity-layout">
          <div className="grid-3">
            {eventFormats.map((event, index) => (
              <motion.article
                key={event.title}
                className="glass-card activity-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="info-icon">
                  <event.icon size={26} />
                </div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </motion.article>
            ))}
          </div>

          <motion.aside
            className="glass-card spotlight-card"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
          >
            <span className="eyebrow">Best place for exact dates</span>
            <h3>Follow the live channels for room changes and announcements</h3>
            <p>
              Workshops, rooms, and showcase details shift during the trimester.
              Instagram is now the primary place to publish current updates.
            </p>
            <div className="spotlight-actions">
              <a
                className="btn btn-primary"
                href="https://www.instagram.com/singularity_uow/"
                target="_blank"
                rel="noreferrer"
              >
                View Instagram <ExternalLink size={16} />
              </a>
              <a
                className="btn btn-outline"
                href="https://github.com/Singularity-AI-UoW"
                target="_blank"
                rel="noreferrer"
              >
                View GitHub <Github size={16} />
              </a>
            </div>
          </motion.aside>
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
          eyebrow="Latest updates"
          title="Live Instagram updates"
          description="Recent posts are embedded directly from Instagram, so each post keeps its own layout and height."
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

function Join() {
  return (
    <section id="join" className="section">
      <div className="container">
        <motion.div
          className="glass-card join-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <span className="eyebrow">Join</span>
            <h2>Show up curious. Leave with momentum.</h2>
            <p>
              Whether you are testing your first model or already shipping side
              projects, the club is designed to help you keep moving.
            </p>
            <div className="hero-actions">
              <a
                href="mailto:hello@singularityai.club?subject=I%20want%20to%20join%20Singularity%20AI"
                className="btn btn-primary"
              >
                Reach out <Mail size={18} />
              </a>
              <a href="#contact" className="btn btn-outline">
                Contact options <ChevronRight size={18} />
              </a>
            </div>
          </div>

          <div className="benefit-list">
            {joinBenefits.map((benefit) => (
              <div key={benefit} className="benefit-tile">
                <span className="benefit-dot" />
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </motion.div>
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
          title="A cleaner starting stack"
          description="A short list of tools, references, and learning paths that are worth starting with."
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

function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Contact"
          title="Keep in touch with the club"
          description="The fastest way to hear about rooms, workshops, demos, and collaborations is through these channels."
        />

        <div className="contact-grid">
          {contactLinks.map((link, index) => (
            <motion.a
              key={link.title}
              className="glass-card contact-card"
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="contact-icon">
                <link.icon size={24} />
              </div>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <span className="inline-link">
                Open link <ExternalLink size={16} />
              </span>
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
            <img src="/singularity-icon.svg" alt="Singularity AI" />
            <div className="logo-copy">
              <strong>Singularity AI</strong>
              <span>University of Waikato</span>
            </div>
          </a>
          <p>
            University of Waikato&apos;s AI student club. Building skills,
            projects, and momentum together.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul className="footer-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href="#resources">Resources</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Follow</h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://www.instagram.com/singularity_uow/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Singularity-AI-UoW"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a href="mailto:hello@singularityai.club">Email</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Singularity AI Club, University of
          Waikato.
        </p>
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
        <Projects />
        <Events />
        <Updates />
        <Join />
        <Resources />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
