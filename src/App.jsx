import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Calendar, 
  Users, 
  Code, 
  MessageSquare, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  Star,
  Zap
} from 'lucide-react'

// Particle background component
function Particles() {
  return (
    <div className="floating-particles" id="particles">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: i % 2 === 0 ? '#00d4ff' : '#7c3aed',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Navigation
function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Events', href: '#events' },
    { label: 'Forum', href: '#forum' },
    { label: 'Join', href: '#join' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <img src="/singularity-icon.svg" alt="Singularity AI Club" />
          <span>Singularity AI</span>
        </div>
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

// Hero Section
function Hero() {
  return (
    <section className="hero">
      <Particles />
      <div className="container hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Singularity AI Club</h1>
          <p>
            University of Waikato's hub for artificial intelligence exploration, 
            innovation, and collaboration. Build the future with us.
          </p>
          <div className="hero-actions">
            <a href="#join" className="btn btn-primary">
              Join the Club <ArrowRight size={18} />
            </a>
            <a href="#projects" className="btn btn-outline">
              View Projects <ChevronRight size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// About Section
function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <h2>About Singularity</h2>
          <p>
            We are a student-led club dedicated to exploring and advancing artificial intelligence 
            through hands-on projects, workshops, and collaboration.
          </p>
        </div>
        <div className="grid-3">
          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
              <Brain size={32} />
            </div>
            <h3>Learn</h3>
            <p>
              From beginner tutorials to advanced research papers, we provide resources 
              and workshops to deepen your AI knowledge.
            </p>
          </motion.div>
          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>
              <Code size={32} />
            </div>
            <h3>Build</h3>
            <p>
              Collaborate on real AI projects. From computer vision to LLMs, 
              we build tangible solutions to interesting problems.
            </p>
          </motion.div>
          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div style={{ marginBottom: '1rem', color: 'var(--accent)' }}>
              <Users size={32} />
            </div>
            <h3>Connect</h3>
            <p>
              Meet fellow AI enthusiasts, share ideas, and grow together 
              in a supportive and inclusive community.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Projects Section
function Projects() {
  const projects = [
    {
      title: "Neural Art Generator",
      description: "A web app that generates unique artwork using StyleGAN2. Users can adjust parameters and create AI-assisted art.",
      tags: ["GANs", "React", "Python"],
      status: "Active"
    },
    {
      title: "Campus Chatbot",
      description: "An AI assistant for University of Waikato students. Answers questions about courses, events, and campus services.",
      tags: ["NLP", "FastAPI", "RAG"],
      status: "Beta"
    },
    {
      title: "Object Detection Drone",
      description: "Real-time object detection system using YOLOv8 on Raspberry Pi. Designed for campus security applications.",
      tags: ["Computer Vision", "IoT", "Edge AI"],
      status: "Planning"
    }
  ]

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Our Projects</h2>
          <p>Explore what we're building. Our projects span machine learning, computer vision, NLP, and more.</p>
        </div>
        <div className="grid-3">
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              className="glass-card project-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <Zap size={24} style={{ color: 'var(--primary)' }} />
                <span className={`tag`} style={{ 
                  background: project.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 
                             project.status === 'Beta' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                  color: project.status === 'Active' ? '#10b981' : 
                         project.status === 'Beta' ? '#00d4ff' : '#7c3aed',
                }}>
                  {project.status}
                </span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Events Section with Countdown
function Events() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Next event: March 10, 2025 at 5:30 PM (example)
  const nextEventDate = new Date('2025-03-10T17:30:00').getTime()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = nextEventDate - now

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const events = [
    {
      date: "Mar 10, 2025",
      time: "5:30 PM",
      title: "Introduction to Large Language Models",
      description: "Learn how LLMs work and how to integrate them into your projects.",
      location: "S block, Waikato University"
    },
    {
      date: "Mar 17, 2025",
      time: "6:00 PM",
      title: "AI Ethics Hackathon",
      description: "48-hour hackathon focused on ethical AI solutions. Prizes for best projects!",
      location: "Tech Lab, Waikato University"
    },
    {
      date: "Mar 24, 2025",
      time: "5:00 PM",
      title: "Computer Vision Workshop",
      description: "Hands-on workshop building object detection models with YOLO.",
      location: "Room G.73, Waikato University"
    }
  ]

  return (
    <section id="events" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Events & Schedule</h2>
          <p>Join us for workshops, hackathons, and guest lectures. Stay updated with our upcoming events.</p>
        </div>

        {/* Countdown to next event */}
        <motion.div 
          className="glass-card"
          style={{ textAlign: 'center', marginBottom: '3rem' }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <h3>Next Event Starts In</h3>
          </div>
          <div className="event-countdown">
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>
        </motion.div>

        {/* Event list */}
        <div className="grid-2">
          {events.map((event, idx) => (
            <motion.div 
              key={idx}
              className="glass-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{ 
                  background: 'var(--glass)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  textAlign: 'center',
                  minWidth: '80px',
                  border: '1px solid var(--glass-border)'
                }}>
                  <Calendar size={20} style={{ margin: '0 auto 0.5rem', color: 'var(--primary)' }} />
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{event.date}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{event.time}</div>
                </div>
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)' }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram Feed */}
        <div style={{ marginTop: '4rem' }}>
          <div className="section-header">
            <h2>Latest Updates</h2>
            <p>Follow us on Instagram for real-time updates and behind-the-scenes content.</p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="instagram-feed">
              <iframe 
                src="https://www.instagram.com/singularity_uow/embed" 
                title="Singularity AI Instagram Feed"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allowTransparency="true"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Forum/Discussion Board
function Forum() {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('forumPosts')
    if (saved) {
      setPosts(JSON.parse(saved))
    } else {
      // Seed initial posts
      const initial = [
        {
          id: Date.now(),
          title: "Welcome to the Singularity AI Forum!",
          content: "This is a space for members to discuss AI topics, share resources, ask questions, and collaborate on projects. Feel free to introduce yourself!",
          author: "Admin",
          date: new Date().toISOString(),
          comments: []
        }
      ]
      setPosts(initial)
      localStorage.setItem('forumPosts', JSON.stringify(initial))
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newPost.title.trim() || !newPost.content.trim()) return

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: "Member", // In real app, would be logged in user
      date: new Date().toISOString(),
      comments: []
    }

    const updated = [post, ...posts]
    setPosts(updated)
    localStorage.setItem('forumPosts', JSON.stringify(updated))
    setNewPost({ title: '', content: '' })
    setShowForm(false)
  }

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <section id="forum" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Discussion Forum</h2>
          <p>Connect with fellow members, share ideas, ask questions, and collaborate.</p>
        </div>

        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          {showForm ? (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--light)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <textarea
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--light)',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">Post</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <MessageSquare size={18} /> New Post
            </button>
          )}
        </div>

        <div>
          {posts.map((post) => (
            <div key={post.id} className="forum-post glass-card">
              <div className="forum-header" style={{ marginBottom: '0.75rem' }}>
                <h3>{post.title}</h3>
                <div className="forum-meta">
                  <div className="forum-author">
                    <div className="author-avatar">{post.author.charAt(0)}</div>
                    <span>{post.author}</span>
                  </div>
                  <span>{formatDate(post.date)}</span>
                </div>
              </div>
              <div className="forum-content">
                <p>{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Join Section
function Join() {
  return (
    <section id="join" className="section">
      <div className="container">
        <motion.div 
          className="glass-card"
          style={{ textAlign: 'center', padding: '4rem 2rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Join the Movement</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
            Whether you're a beginner curious about AI or an experienced builder, 
            Singularity AI Club welcomes you. Together, we're shaping the future.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <a href="#" className="btn btn-primary">
              <Users size={18} /> Become a Member
            </a>
            <a href="#contact" className="btn btn-outline">
              <Mail size={18} /> Contact Us
            </a>
          </div>
          
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>100+</h3>
              <p style={{ margin: 0 }}>Active Members</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>15+</h3>
              <p style={{ margin: 0 }}>Projects</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', color: 'var(--accent)' }}>30+</h3>
              <p style={{ margin: 0 }}>Events</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Resources Section
function Resources() {
  const resources = [
    {
      title: "Getting Started with Python",
      type: "Tutorial",
      icon: "📚",
      link: "#"
    },
    {
      title: "Deep Learning with PyTorch",
      type: "Course",
      icon: "🎓",
      link: "#"
    },
    {
      title: "LangChain Documentation",
      type: "Library",
      icon: "📖",
      link: "#"
    },
    {
      title: "AI Ethics Guidelines",
      type: "Reading",
      icon: "⚖️",
      link: "#"
    },
    {
      title: "Hugging Face Models",
      type: "Platform",
      icon: "🤖",
      link: "#"
    },
    {
      title: "Kaggle Competitions",
      type: "Practice",
      icon: "🏆",
      link: "#"
    }
  ]

  return (
    <section id="resources" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Resources</h2>
          <p>Curated learning materials and tools to accelerate your AI journey.</p>
        </div>
        <div className="grid-3">
          {resources.map((res, idx) => (
            <motion.a
              key={idx}
              href={res.link}
              className="glass-card"
              style={{ display: 'block', textDecoration: 'none' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{res.icon}</div>
              <h3>{res.title}</h3>
              <span className="tag">{res.type}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// Team Section
function Team() {
  const team = [
    { name: "Alex Chen", role: "President", initials: "AC" },
    { name: "Sarah Williams", role: "Vice President", initials: "SW" },
    { name: "Mika Tanaka", role: "Technical Lead", initials: "MT" },
    { name: "James Morrison", role: "Events Coordinator", initials: "JM" },
    { name: "Priya Patel", role: "Outreach Lead", initials: "PP" },
    { name: "Liam Smith", role: "Workshop Lead", initials: "LS" }
  ]

  return (
    <section id="team" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Our Team</h2>
          <p>Meet the students making Singularity AI Club possible.</p>
        </div>
        <div className="grid-3">
          {team.map((member, idx) => (
            <motion.div 
              key={idx}
              className="glass-card team-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="team-avatar">{member.initials}</div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
                <a href="#" style={{ color: 'var(--muted)' }}><Github size={18} /></a>
                <a href="#" style={{ color: 'var(--muted)' }}><Linkedin size={18} /></a>
                <a href="#" style={{ color: 'var(--muted)' }}><Mail size={18} /></a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Get in Touch</h2>
          <p>Have questions or want to collaborate? Reach out to us!</p>
        </div>
        <div className="grid-2">
          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 style={{ marginBottom: '1.5rem' }}>Send a Message</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Name</label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--light)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Email</label>
                <input
                  type="email"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--light)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Message</label>
                <textarea
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--light)',
                    resize: 'vertical'
                  }}
                />
              </div>
              <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 style={{ marginBottom: '1.5rem' }}>Connect With Us</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'var(--glass)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid var(--glass-border)'
                }}>
                  <Mail size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>Email</div>
                  <div style={{ color: 'var(--muted)' }}>hello@singularityai.club</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'var(--glass)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid var(--glass-border)'
                }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>Instagram</div>
                  <div style={{ color: 'var(--muted)' }}>@singularity_uow</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'var(--glass)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid var(--glass-border)'
                }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>GitHub</div>
                  <div style={{ color: 'var(--muted)' }}>singularityai</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/singularity-icon.svg" alt="Singularity AI Club" style={{ height: '32px', width: '32px' }} />
              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Singularity AI</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              University of Waikato's AI student club. Building the future, one model at a time.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#join">Join</a></li>
              <li><a href="#forum">Forum</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><a href="#resources">Learning</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Discord</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Singularity AI Club, University of Waikato. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Main App
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
        <Forum />
        <Join />
        <Resources />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
