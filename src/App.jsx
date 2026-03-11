import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  CalendarDays,
  Clock3,
  Code2,
  ExternalLink,
  Image,
  MapPin,
  Menu,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'

const joinLink = 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=9jvQPMMGY0yZwYCOOP1xLMgpwwYUoCxPr3eZ-P4o8yJUOFRaOEg4OUlLUEZVOEhGVzJSWUxWNjc3Ri4u'

const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Updates', href: '#updates' },
  { label: 'Events', href: '#events' },
  { label: 'Resources', href: '#resources' },
]

const eventSchedule = [
  {
    month: 'March',
    dateLabel: '20 March 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Club Kickoff: Build Your First AI Demo',
    summary:
      'Participants build a working AI demo and leave with clear next steps for getting involved in the club. The session stays beginner-friendly through a guided Colab workflow, while returning members can explore optional extensions in a deeper core lane.',
    imageSrc: '/20_03_26.png',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'March',
    dateLabel: '27 March 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Club Social: AI Interests Night',
    summary:
      'This structured social helps members meet peers, find shared interests, and shape the direction of upcoming club events. Expect guided introductions, themed discussion groups, and clear ways to volunteer for future projects or sessions.',
    imageSrc: '27_03_26.png',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'April',
    dateLabel: '10 April 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Model Basics Workshop',
    summary:
      'Members learn the practical foundations of modelling through a notebook-first workshop focused on splits, metrics, and overfitting. Beginners get a clear introduction without heavy maths, while the core lane tests stronger baselines and compares what actually improves results.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'April',
    dateLabel: '24 April 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Tooling Workshop: Git, Colab & Hugging Face',
    summary:
      'This is a hands-on tooling session where attendees clone a repo, run a notebook, and use a Hugging Face model for inference. The goal is to make the club workflow feel approachable, with live examples and troubleshooting support built into the session.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'May',
    dateLabel: '8 May 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Kaggle Mini Challenge',
    summary:
      'Teams start from a known-good baseline and work toward measurable score improvements in a low-friction challenge format. The session emphasizes iteration, evaluation, and teamwork so members can learn the competition loop without getting blocked by setup.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'May',
    dateLabel: '22 May 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Paper Story Night: A Classic AI Paper',
    summary:
      'This session turns a classic AI paper into a clear story about the problem, the main idea, the key result, and the limitations. It is designed to stay approachable for beginners while still giving more advanced members room for deeper discussion afterward.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'June',
    dateLabel: '5 June 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Mini Hackathon: Campus Helper Bot',
    summary:
      'Teams build a small demo that solves a real campus problem, using templates and judging criteria that keep the hackathon accessible. The focus is on shipping something real, presenting it clearly, and giving teams a path to continue the project afterward.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'June',
    dateLabel: '19 June 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Guest Research Talk',
    summary:
      'A guest speaker will share a real research or industry perspective on AI in a way that stays accessible to newer members. The event is structured to support good questions, clear takeaways, and follow-up discussion after the talk.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'July',
    dateLabel: '3 July 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Debug Night: Reading Errors & Fixing Bugs',
    summary:
      'This workshop teaches a repeatable debugging process through real examples like traceback issues, dependency conflicts, and broken notebooks. Beginners get confidence with the basics, while the core lane works through harder ML and tooling failures in groups.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'July',
    dateLabel: '17 July 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Paper Story Night: Diffusion Models',
    summary:
      'Members build intuition for diffusion models through diagrams, examples, and guided discussion instead of heavy equations. The session explains what diffusion is useful for, where it breaks down, and why it matters in current AI workflows.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'July',
    dateLabel: '31 July 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Build Along: Try a Diffusion Pipeline',
    summary:
      'Attendees run a working diffusion pipeline and then change one variable at a time to see how outputs shift in practice. The session is designed to make experimentation feel tangible, with side-by-side comparisons and fallback outputs ready if runtime issues appear.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'August',
    dateLabel: '14 August 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Serving Workshop: Basics, vLLM & Ollama',
    summary:
      'This workshop introduces model serving through a beginner-safe on-ramp and a more technical core track. Members learn the practical tradeoffs around latency, throughput, and local deployment tools like vLLM and Ollama.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'August',
    dateLabel: '28 August 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'AI in Society Debate Night',
    summary:
      'The debate night gives members a structured format for discussing AI\'s impact on society without drifting into hot takes. Small teams, timed rounds, and audience questions keep the session inclusive, evidence-based, and reflective.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'September',
    dateLabel: '11 September 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Project Showcase: Website & OpenClaw',
    summary:
      'This showcase night puts active club projects in front of the wider membership so teams can demo progress and recruit collaborators. Each project is expected to show something concrete and leave with clear next steps that new contributors can join.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'September',
    dateLabel: '25 September 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Fine-Tuning Night: Concepts + LoRA',
    summary:
      'Members compare prompting, RAG, and fine-tuning before the core lane runs a small LoRA workflow end to end. The event is structured to keep the conceptual path clear for beginners while still giving hands-on depth to members ready to experiment.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'October',
    dateLabel: '9 October 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'AI Safety & Failure Modes',
    summary:
      'This session explores real AI risks such as hallucination, bias, privacy, and prompt injection through case studies and practical worksheets. Members leave with a stronger sense of how to spot failure modes and design realistic mitigations for their own projects.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'October',
    dateLabel: '23 October 2026',
    timeLabel: '6:00 pm - 11:00 pm',
    title: 'Kaggle Year-end Hackathon',
    summary:
      'This longer-format Kaggle event is designed to feel like a real competition while still staying beginner-safe through strong scaffolding and checkpoints. Teams make real submissions, iterate on their ideas, and present what worked, what failed, and what they learned.',
    imageSrc: '',
    location: 'University of Waikato, Hamilton Campus',
  },
  {
    month: 'November',
    dateLabel: '6 November 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'Year-End Showcase & Awards',
    summary:
      'The year-end showcase celebrates what members built across the year through short demos, fast presentations, and awards. It is meant to recognize progress at every skill level while closing the calendar with a strong sense of momentum for next year.',
    imageSrc: '',
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
    (typeof post?.imageUrl === 'string' || post?.imageUrl == null) &&
    Number.isFinite(post?.embedWidth) &&
    Number.isFinite(post?.embedHeight)
  )
}

function getInstagramPostType(href) {
  if (href.includes('/reel/')) {
    return 'Reel'
  }

  return 'Post'
}

function getInstagramPostDate(title) {
  const match = typeof title === 'string' ? title.match(/\d{4}-\d{2}-\d{2}/) : null
  return match ? match[0] : title
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

function InstagramPostCard({ post, index }) {
  const postType = getInstagramPostType(post.href)
  const postDate = getInstagramPostDate(post.title)

  return (
    <motion.a
      className="glass-card update-card"
      href={post.href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={
        post.imageUrl
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(10, 10, 15, 0.14), rgba(10, 10, 15, 0.82)), url("${post.imageUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="update-card-top">
        <span className="tag">{postType}</span>
        <ExternalLink size={18} />
      </div>
      {post.imageUrl ? null : (
        <div className="update-card-preview" aria-hidden="true">
          <span>@singularity_uow</span>
          <strong>{postType}</strong>
        </div>
      )}
      <div className="update-card-body">
        <h3>{postDate}</h3>
      </div>
    </motion.a>
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
            Singularity is a student-led club for Waikato students who want
            practical AI workshops, projects, and a strong community.
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Events() {
  const [activeEvent, setActiveEvent] = useState(eventSchedule[0])

  return (
    <section id="events" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Events"
          title="The 2026 Event Calendar"
          description="Free food served in all event!"
        />

        <div className="events-layout">
          <div className="glass-card events-list" role="list">
            {eventSchedule.map((event, index) => (
              <motion.article
                key={`${event.dateLabel}-${event.title}`}
                className={`event-list-item ${activeEvent.title === event.title ? 'active' : ''}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                onMouseEnter={() => setActiveEvent(event)}
                onFocus={() => setActiveEvent(event)}
                tabIndex={0}
                role="listitem"
                >
                  <div className="event-list-meta">
                    <span className="tag">{event.month}</span>
                    <span className="event-date">
                      <CalendarDays size={16} />
                      {event.dateLabel}
                    </span>
                  </div>
                  <h3>{event.title}</h3>
                  <div className="event-list-facts">
                    <div className="event-fact">
                      <Clock3 size={16} />
                      <span>{event.timeLabel}</span>
                    </div>
                    <div className="event-fact">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

          <motion.aside
            key={activeEvent.title}
            className="glass-card event-detail"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            >
              <span className="eyebrow">Event overview</span>
              {activeEvent.imageSrc ? (
                <img
                  className="event-preview-image"
                  src={activeEvent.imageSrc}
                  alt={`${activeEvent.title} preview`}
                />
              ) : (
                <div
                  className="event-preview-placeholder"
                  role="img"
                  aria-label={`${activeEvent.title} preview placeholder`}
                >
                  <Image size={28} />
                  <span>Event preview image placeholder</span>
                </div>
              )}
              <h3>{activeEvent.title}</h3>
              <p className="event-summary">{activeEvent.summary}</p>
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
          eyebrow="Latest Updates"
          title="Instagram Post & Reel"
          description="Keeps you updated with latest AI trends!"
        />

        <div className="updates-grid">
          {posts.map((post, index) => (
            <InstagramPostCard key={post.href} post={post} index={index} />
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
          title="Your Journey Starts Here"
          description="Beginner friendly tutorials for AI!"
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
                <ExternalLink className="resource-link-icon" size={18} />
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
        <div className="footer-sponsor">
          <span className="eyebrow footer-eyebrow">Sponsors</span>
          <img
            className="footer-sponsor-logo"
            src="/WSU-logo-transparent.svg"
            alt="Waikato Students' Union"
          />
        </div>

        <div className="footer-connect">
          <span className="eyebrow footer-eyebrow">Connect</span>
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
      <Particles />
      <Navigation />
      <main>
        <Hero />
        <Updates />
        <Events />
        <Resources />
      </main>
      <Footer />
    </>
  )
}

export default App
