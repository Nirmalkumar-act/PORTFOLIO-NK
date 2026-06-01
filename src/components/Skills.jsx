import { useEffect, useRef, useState } from 'react'

/* ── Data ─────────────────────────────────────────────────────── */
const ALL_SKILLS = [
  {
    id: 1,
    category: 'languages',
    icon: 'bx bx-code-alt',
    title: 'Programming Languages',
    accent: '#4285F4',
    items: [
      { name: 'Java',       level: 85, icon: 'bx bxl-java' },
      { name: 'Python',     level: 80, icon: 'bx bxl-python' },
      { name: 'JavaScript', level: 78, icon: 'bx bxl-javascript' },
      { name: 'C',          level: 70, icon: 'bx bx-code' },
      { name: 'C++',        level: 65, icon: 'bx bx-code-block' },
    ],
  },
  {
    id: 2,
    category: 'frontend',
    icon: 'bx bx-window-alt',
    title: 'Frontend',
    accent: '#00eeff',
    items: [
      { name: 'React.js',  level: 80, icon: 'bx bxl-react' },
      { name: 'HTML5',     level: 90, icon: 'bx bxl-html5' },
      { name: 'CSS3',      level: 85, icon: 'bx bxl-css3' },
      { name: 'Bootstrap', level: 75, icon: 'bx bxl-bootstrap' },
    ],
  },
  {
    id: 3,
    category: 'backend',
    icon: 'bx bx-server',
    title: 'Backend',
    accent: '#a855f7',
    items: [
      { name: 'Spring Boot', level: 75, icon: 'bx bx-leaf' },
      { name: 'Node.js',     level: 60, icon: 'bx bxl-nodejs' },
      { name: 'REST APIs',   level: 78, icon: 'bx bx-transfer' },
    ],
  },
  {
    id: 4,
    category: 'database',
    icon: 'bx bx-data',
    title: 'Databases',
    accent: '#22c55e',
    items: [
      { name: 'MySQL',   level: 82, icon: 'bx bx-data' },
      { name: 'MongoDB', level: 72, icon: 'bx bx-cylinder' },
      { name: 'Oracle',  level: 65, icon: 'bx bx-database' },
    ],
  },
  {
    id: 5,
    category: 'tools',
    icon: 'bx bx-wrench',
    title: 'Tools & DevOps',
    accent: '#f97316',
    items: [
      { name: 'Git',          level: 85, icon: 'bx bxl-git' },
      { name: 'GitHub',       level: 85, icon: 'bx bxl-github' },
      { name: 'VS Code',      level: 90, icon: 'bx bx-code-curly' },
      { name: 'IntelliJ',     level: 80, icon: 'bx bx-coffee' },
      { name: 'Postman',      level: 75, icon: 'bx bx-send' },
    ],
  },
]

const FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'languages', label: 'Languages' },
  { key: 'frontend',  label: 'Frontend' },
  { key: 'backend',   label: 'Backend' },
  { key: 'database',  label: 'Database' },
  { key: 'tools',     label: 'Tools' },
]

const STATS = [
  { value: 5,  suffix: '+', label: 'Languages' },
  { value: 10, suffix: '+', label: 'Technologies' },
  { value: 5,  suffix: '+', label: 'Projects Built' },
  { value: 2,  suffix: '+', label: 'Years Learning' },
]

/* ── Count-up hook ──────────────────────────────────────────────── */
function useCountUp(target, active, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

/* ── Stat item ──────────────────────────────────────────────────── */
function StatItem({ value, suffix, label, active }) {
  const count = useCountUp(value, active)
  return (
    <div className="skill-stat">
      <span className="skill-stat-num">{count}{suffix}</span>
      <span className="skill-stat-label">{label}</span>
    </div>
  )
}

/* ── Skill bar row ──────────────────────────────────────────────── */
function SkillBar({ name, level, icon, accent, animate }) {
  return (
    <li className="skill-bar-item">
      <div className="skill-bar-header">
        <span className="skill-bar-name">
          <i className={icon}></i> {name}
        </span>
        <span className="skill-bar-pct" style={{ color: accent }}>{level}%</span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            '--bar-color': accent,
            width: animate ? `${level}%` : '0%',
          }}
        />
      </div>
    </li>
  )
}

/* ── Main component ─────────────────────────────────────────────── */
function Skills() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(false)
  const [filter, setFilter] = useState('all')

  /* IntersectionObserver — trigger once, then disconnect */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()         // ← fix: stop observing after first trigger
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const visibleCards = filter === 'all'
    ? ALL_SKILLS
    : ALL_SKILLS.filter(c => c.category === filter)

  return (
    <section
      className={`skills-section ${active ? 'skills-visible' : ''}`}
      id="skills"
      ref={sectionRef}
    >
      {/* ── Heading ── */}
      <div className="skills-heading-wrap">
        <h2 className="skills-h2">My <span>Skills</span></h2>
        <p className="skills-subtext">
          Technologies I work with — from languages to deployment tools.
        </p>
      </div>

      {/* ── Stats bar ── */}
      <div className="skills-stats">
        {STATS.map((s, i) => (
          <StatItem key={i} {...s} active={active} />
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="skill-filters" role="tablist" aria-label="Skill category filters">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`skill-filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
            role="tab"
            aria-selected={filter === f.key}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Cards grid ── */}
      <div className="skills-grid">
        {visibleCards.map((card, idx) => (
          <div
            key={card.id}
            className={`skill-card-wrap ${active ? 'card-visible' : ''}`}
            style={{
              '--delay': `${idx * 0.1}s`,
              '--accent': card.accent,
            }}
          >
            <div className="skill-card-inner">
              <div className="skill-face skill-front">
                <div className="skill-card-icon-wrap">
                  <i className={card.icon}></i>
                </div>
                <h3 className="skill-card-title">{card.title}</h3>

                <ul className="skill-bar-list">
                  {card.items.map(item => (
                    <SkillBar
                      key={item.name}
                      {...item}
                      accent={card.accent}
                      animate={active}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
