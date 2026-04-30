import { useEffect, useState } from 'react'
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
const instagramEmbedUrl = 'https://www.instagram.com/singularity_uow/embed'

const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Events', href: '#events' },
  { label: 'Instagram', href: '#instagram' },
  { label: 'Resources', href: '#resources' },
]

const eventSchedule = [
  {
    month: 'March',
    dateLabel: '20 March 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: '2026 Kickoff: Build Your First AI Demo',
    summary:
      'Join us for a hands-on AI workshop at the University of Waikato, where we\'ll explore the fundamentals of computer vision using Google Colab and PyTorch. You will learn how to prepare a custom fruit dataset and fine-tune a pre-trained ResNet-18 model to achieve high-accuracy image classification. By the end of the session, you\'ll understand the power of transfer learning and how to evaluate AI model performance with professional diagnostic tools.',
    imageSrc: '/20_03_26.png',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'April',
    dateLabel: '02 April 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'AI Open House + Prompting Playground',
    summary:
      'A relaxed welcome session for new and returning members to explore a few useful AI tools, meet the club, and try short prompt experiments without needing prior experience. We will run a handful of live demos, then give everyone time to test ideas in pairs or small groups and see how different prompts change the result. It is designed as a soft entry point before the more structured technical and project-focused events later in the semester.',
    imageSrc: '/27_03_26.png',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'May',
    dateLabel: '15 May 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'May',
    dateLabel: '29 May 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'June',
    dateLabel: '5 June 2026 -  19 June 2026',
    timeLabel: 'TBA',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'Online',
  },
  {
    month: 'June',
    dateLabel: '26 June 2026 - 10 July 2026',
    timeLabel: 'TBA',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'Online',
  },
  {
    month: 'July',
    dateLabel: '9 July 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'July',
    dateLabel: '24 July 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'August',
    dateLabel: '7 August 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'August',
    dateLabel: '21 August 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'September',
    dateLabel: '4 September 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'September',
    dateLabel: '18 September 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'October',
    dateLabel: '2 October 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
  {
    month: 'October',
    dateLabel: '16 October 2026',
    timeLabel: '6:00 pm - 8:00 pm',
    title: 'TBA',
    summary:
      'TBA',
    imageSrc: '',
    location: 'MSB.0.01, Hamilton Campus, University of Waikato',
  },
]

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

const monthIndex = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
}

function parseEventDateLabel(dateLabel) {
  const primaryDateLabel = dateLabel.split('-')[0].trim()
  const match = primaryDateLabel.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/)

  if (!match) {
    return null
  }

  const [, day, monthName, year] = match
  const month = monthIndex[monthName.toLowerCase()]

  if (month === undefined) {
    return null
  }

  return {
    day: Number(day),
    month,
    year: Number(year),
  }
}

function parseEventTimeLabel(timeLabel) {
  const match = timeLabel.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i)

  if (!match) {
    return { hours: 0, minutes: 0 }
  }

  let hours = Number(match[1]) % 12
  const minutes = Number(match[2])

  if (match[3].toLowerCase() === 'pm') {
    hours += 12
  }

  return { hours, minutes }
}

function getEventStart(event) {
  const dateParts = parseEventDateLabel(event.dateLabel)

  if (!dateParts) {
    return null
  }

  const { hours, minutes } = parseEventTimeLabel(event.timeLabel)

  return new Date(dateParts.year, dateParts.month, dateParts.day, hours, minutes)
}

function getNextUpcomingEvent(now) {
  const datedEvents = eventSchedule
    .map((event) => ({
      event,
      start: getEventStart(event),
    }))
    .filter((entry) => entry.start)

  const upcomingEvent = datedEvents.find(
    (entry) => entry.start.getTime() >= now.getTime(),
  )

  if (upcomingEvent) {
    return upcomingEvent
  }

  const lastScheduledEvent = datedEvents[datedEvents.length - 1]

  return lastScheduledEvent ?? { event: eventSchedule[0], start: null }
}

function getCountdownParts(targetDate, now) {
  const remainingMs = Math.max(targetDate.getTime() - now.getTime(), 0)
  const totalSeconds = Math.floor(remainingMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [
    { label: 'Days', value: String(days).padStart(2, '0') },
    { label: 'Hours', value: String(hours).padStart(2, '0') },
    { label: 'Minutes', value: String(minutes).padStart(2, '0') },
    { label: 'Seconds', value: String(seconds).padStart(2, '0') },
  ]
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
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  const nextEventEntry = getNextUpcomingEvent(now)
  const nextEvent = nextEventEntry.event
  const countdownParts = nextEventEntry.start
    ? getCountdownParts(nextEventEntry.start, now)
    : []

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

        <motion.aside
          className="glass-card hero-event-card"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          <span className="eyebrow">Next event</span>

          {nextEvent.imageSrc ? (
            <img
              className="event-preview-image hero-event-media"
              src={nextEvent.imageSrc}
              alt={`${nextEvent.title} preview`}
            />
          ) : (
            <div
              className="event-preview-placeholder hero-event-media"
              role="img"
              aria-label={`${nextEvent.title} preview placeholder`}
            >
              <Image size={28} />
              <span>Preview image coming soon</span>
            </div>
          )}

          <div className="hero-event-body">
            <p className="hero-event-kicker">Countdown to</p>
            <h2>{nextEvent.title}</h2>

            <div className="hero-event-meta">
              <span>
                <CalendarDays size={16} />
                {nextEvent.dateLabel}
              </span>
              <span>
                <Clock3 size={16} />
                {nextEvent.timeLabel}
              </span>
            </div>

            {countdownParts.length ? (
              <div
                className="hero-countdown"
                aria-label={`Countdown until ${nextEvent.title}`}
              >
                {countdownParts.map((part) => (
                  <div key={part.label} className="hero-countdown-unit">
                    <strong>{part.value}</strong>
                    <span>{part.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="hero-countdown-note">
                The next event date will be announced soon.
              </p>
            )}

            <a href="#events" className="inline-link">
              View the full event list <ArrowRight size={16} />
            </a>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}

function Events() {
  const [activeEvent, setActiveEvent] = useState(eventSchedule[0])
  const activeEventKey = `${activeEvent.dateLabel}-${activeEvent.title}`

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
                className={`event-list-item ${
                  activeEventKey === `${event.dateLabel}-${event.title}` ? 'active' : ''
                }`}
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
            key={activeEventKey}
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

function InstagramSection() {
  return (
    <section id="instagram" className="section instagram-section">
      <div className="container">
        <SectionHeader
          eyebrow="Instagram"
          title="See The Club Feed Live"
          description="Browse the official Singularity Instagram profile here."
        />

        <motion.div
          className="glass-card instagram-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45 }}
        >
          <iframe
            className="instagram-frame"
            src={instagramEmbedUrl}
            title="Singularity Instagram profile"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
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
          title="Your Journey Start Here"
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
        <Events />
        <InstagramSection />
        <Resources />
      </main>
      <Footer />
    </>
  )
}

export default App
