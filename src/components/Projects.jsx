import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { projectsData } from '../data/projects'

const VISIBLE_SIDE = 2   // how many cards visible on each side of center
const AUTO_PLAY_MS = 3500

function Projects() {
  const [index, setIndex]           = useState(0)
  const [activeCard, setActiveCard] = useState(null) // null = show info panel; number = expanded overlay on mobile
  const [paused, setPaused]         = useState(false)
  const total                       = projectsData.length
  const itemRefs                    = useRef([])
  const wrapperRef                  = useRef(null)
  const touchStartX                 = useRef(null)
  const autoRef                     = useRef(null)
  const sectionRef                  = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) sectionRef.current.classList.add('active') },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  /* ── carousel positioning ── */
  const getCardWidth = () => {
    const vw = window.innerWidth
    if (vw <= 480) return 160
    if (vw <= 768) return 200
    if (vw <= 991) return 230
    return 280
  }

  const getGap = () => {
    const vw = window.innerWidth
    if (vw <= 480) return 100
    if (vw <= 768) return 120
    if (vw <= 991) return 130
    return 150
  }

  const updateCarousel = useCallback(() => {
    const cardWidth = getCardWidth()
    const gap       = getGap()
    itemRefs.current.forEach((item, i) => {
      if (!item) return
      const offset   = ((i - index + total) % total + total) % total
      const position = offset > total / 2 ? offset - total : offset
      const absPos   = Math.abs(position)
      const translateX = position * gap
      const scale      = position === 0 ? 1.1 : Math.max(0.75, 1 - absPos * 0.08)
      const zIndex     = 100 - absPos
      const opacity    = absPos > VISIBLE_SIDE ? 0 : absPos === VISIBLE_SIDE ? 0.45 : 1
      const blur       = absPos === 0 ? 0 : absPos === 1 ? 0 : 3

      item.style.width     = `${cardWidth}px`
      item.style.transform = `translateX(${translateX}px) scale(${scale})`
      item.style.zIndex    = zIndex
      item.style.opacity   = opacity
      item.style.filter    = blur ? `blur(${blur}px)` : 'none'
      item.style.pointerEvents = absPos === 0 ? 'auto' : 'auto'
    })
  }, [index, total])

  /* run on index change + window resize */
  useEffect(() => {
    updateCarousel()
    window.addEventListener('resize', updateCarousel)
    return () => window.removeEventListener('resize', updateCarousel)
  }, [updateCarousel])

  /* auto-play */
  useEffect(() => {
    if (paused) return
    autoRef.current = setInterval(() => {
      setIndex(i => (i + 1) % total)
    }, AUTO_PLAY_MS)
    return () => clearInterval(autoRef.current)
  }, [paused, total])

  /* keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const prev = useCallback(() => {
    setIndex(i => (i - 1 + total) % total)
    setPaused(true)
  }, [total])

  const next = useCallback(() => {
    setIndex(i => (i + 1) % total)
    setPaused(true)
  }, [total])

  /* touch / swipe */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  /* click a side card to jump to it */
  const onCardClick = (i) => {
    if (i === index) {
      // toggle mobile expanded overlay on active card
      setActiveCard(prev => (prev === i ? null : i))
    } else {
      setIndex(i)
      setPaused(true)
      setActiveCard(null)
    }
  }

  const current = projectsData[index]

  return (
    <section
      className="projects-section reveal"
      id="projects"
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Heading ── */}
      <h2 className="heading">
        My <span>Projects</span>
      </h2>

      {/* ── Carousel ── */}
      <div
        className="carousel-wrapper"
        ref={wrapperRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-label="Projects carousel"
      >
        {/* Left arrow */}
        <button
          className="nav left"
          onClick={prev}
          aria-label="Previous project"
        >
          &#10094;
        </button>

        {/* Cards */}
        <div className="projects-carousel" aria-live="polite">
          {projectsData.map((project, i) => {
            const isActive   = i === index
            const isExpanded = activeCard === i
            return (
              <div
                className={`project-item ${isActive ? 'active-card' : ''} ${isExpanded ? 'expanded' : ''}`}
                key={project.id}
                ref={el => (itemRefs.current[i] = el)}
                onClick={() => onCardClick(i)}
                style={{ '--accent': project.color }}
                role="button"
                tabIndex={0}
                aria-label={project.title}
                onKeyDown={e => e.key === 'Enter' && onCardClick(i)}
              >
                <img src={project.img} alt={project.alt} loading="lazy" />

                {/* Overlay — shows on hover (desktop) or tap (mobile expanded) */}
                <div className={`project-overlay ${isExpanded ? 'overlay-visible' : ''}`}>
                  <h3>{project.title}</h3>
                  <p>{project.desc}</p>
                  <div className="tech-tags">
                    {project.tech.map(t => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a
                      href={project.github}
                      onClick={e => e.stopPropagation()}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="bx bxl-github"></i> GitHub
                    </a>
                    <Link
                      to={`/project/${project.id}`}
                      target="_blank"
                      onClick={e => e.stopPropagation()}
                    >
                      <i className="bx bx-info-circle"></i> Show More
                    </Link>
                  </div>
                </div>

                {/* Mobile tap hint on non-active cards */}
                {!isActive && (
                  <div className="card-tap-hint">tap to view</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right arrow */}
        <button
          className="nav right"
          onClick={next}
          aria-label="Next project"
        >
          &#10095;
        </button>
      </div>

      {/* ── Dot indicators ── */}
      <div className="dot-indicators" role="tablist" aria-label="Project indicators">
        {projectsData.map((p, i) => (
          <button
            key={p.id}
            className={`dot ${i === index ? 'dot-active' : ''}`}
            onClick={() => { setIndex(i); setPaused(true) }}
            aria-label={`Go to ${p.title}`}
            role="tab"
            aria-selected={i === index}
          />
        ))}
      </div>

      {/* ── Active project info panel ── */}
      <div
        className="project-info-panel"
        style={{ '--accent': current.color }}
        key={index}
      >
        <div className="pip-left">
          <span className="pip-counter">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <h3 className="pip-title">{current.title}</h3>
          <p className="pip-desc">{current.desc}</p>
          <div className="tech-tags">
            {current.tech.map(t => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="pip-right">
          <a
            href={current.github}
            className="pip-btn pip-github"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bx bxl-github"></i> GitHub
          </a>
          <Link
            to={`/project/${current.id}`}
            target="_blank"
            className="pip-btn pip-demo"
          >
            <i className="bx bx-info-circle"></i> Show More
          </Link>
        </div>
      </div>

      {/* ── Auto-play progress bar ── */}
      <div className="progress-bar-wrap">
        <div
          className={`progress-bar ${paused ? 'paused' : ''}`}
          style={{ animationDuration: `${AUTO_PLAY_MS}ms` }}
          key={`${index}-${paused}`}
        />
      </div>

      {/* ── Mobile hint ── */}
      <p className="swipe-hint">
        <i className="bx bx-left-arrow-alt"></i> Swipe or tap arrows to browse &nbsp;
        <i className="bx bx-right-arrow-alt"></i>
      </p>
    </section>
  )
}

export default Projects
