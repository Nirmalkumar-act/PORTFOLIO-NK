import { useEffect, useRef, useState } from 'react'

const ABOUT_DATA = [
  {
    id: '1',
    icon: 'bx bx-user-pin',
    title: 'Brief Background',
    content: (
      <p>
        Hi, I'm Nirmalkumar R, a passionate Full Stack Developer with strong
        skills in both Frontend and Backend development. I enjoy building
        modern, responsive, and scalable web applications using technologies
        like HTML, CSS, JavaScript, React, Java, and Spring Boot. I love
        creating efficient backend systems and clean user-friendly interfaces.
      </p>
    )
  },
  {
    id: 'exp1',
    icon: 'bx bx-briefcase',
    title: 'Internship Experience',
    content: (
      <div className="experience-content">
        <h4 style={{ color: '#0ef', marginBottom: '8px', fontSize: '18px' }}>Java Full Stack Developer Intern</h4>
        <p style={{ color: '#aac', marginBottom: '12px', fontStyle: 'italic', fontSize: '14px' }}>
          Dev Technology Solutions – Salem, Tamil Nadu (Dec 2025 – Jan 2026)
        </p>
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', listStyleType: 'disc' }}>
          <li style={{ display: 'list-item' }}>Developed responsive React.js interfaces and integrated them with Java Spring Boot REST APIs.</li>
          <li style={{ display: 'list-item' }}>Built and tested RESTful APIs using Java, Spring Boot, and MySQL for CRUD operations.</li>
          <li style={{ display: 'list-item' }}>Applied MVC architecture and basic system design principles to create modular backend services.</li>
          <li style={{ display: 'list-item' }}>Implemented JWT-based authentication concepts for secure application workflows.</li>
          <li style={{ display: 'list-item' }}>Debugged frontend-backend integration issues, API errors, and database connectivity problems.</li>
          <li style={{ display: 'list-item' }}>Used Git/GitHub and Agile-style practices to complete assigned internship tasks.</li>
        </ul>
      </div>
    )
  },
  {
    id: '2',
    icon: 'bx bxs-graduation',
    title: 'Education',
    content: (
      <ul>
        <li><strong>Degree:</strong> Bachelor of Computer Science</li>
        <li><strong>Institution:</strong> Dhirajlal Gandhi College of Technology</li>
        <li><strong>Graduation Year:</strong> 2026</li>
      </ul>
    )
  },
  {
    id: '3',
    icon: 'bx bx-target-lock',
    title: 'Career Objective',
    content: (
      <p>
        To obtain a challenging position in a software development company where
        I can apply my programming knowledge, improve my technical skills, and
        contribute to innovative projects while growing professionally.
      </p>
    )
  },
  {
    id: '4',
    icon: 'bx bx-code-alt',
    title: 'Areas of Interest',
    content: (
      <ul className="interest-tags">
        <li>Frontend Development</li>
        <li>Backend Development</li>
        <li>Web Application Development</li>
      </ul>
    )
  }
]

function About() {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const [visibleItems, setVisibleItems] = useState([])
  const [lineHeight, setLineHeight] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) sectionRef.current.classList.add('active') },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Scroll listener for glowing line progress & perfectly synced box reveals
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return
      
      const rect = timelineRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate progress based on scroll position.
      // Starts drawing when the top of the timeline is 60% down the viewport
      const startTrigger = (windowHeight * 0.6) - rect.top 
      const totalHeight = rect.height
      
      let progress = startTrigger / totalHeight
      progress = Math.max(0, Math.min(1, progress))
      
      setLineHeight(progress * 100)

      // Calculate how many pixels the line has actually drawn down the timeline
      const drawnPixels = progress * totalHeight

      // Check which boxes the line has touched
      const items = timelineRef.current.querySelectorAll('.timeline-item')
      const newVisible = []
      
      items.forEach(item => {
        // The dot is positioned at top: 0 inside the item.
        // We reveal the box exactly when the line reaches the dot.
        if (drawnPixels >= item.offsetTop + 15) {
          newVisible.push(item.dataset.id)
        }
      })
      
      // Only update state if it changed to prevent constant re-renders
      setVisibleItems(prev => {
        if (prev.length === newVisible.length) return prev
        return newVisible
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    handleScroll() // Trigger on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <section className="about reveal" id="about" ref={sectionRef}>
      <div className="about-heading-wrap">
        <h2 className="about-h2">About <span>Me</span></h2>
      </div>

      <div className="about-timeline" ref={timelineRef}>
        {/* The background track for the line */}
        <div className="timeline-line-track">
          {/* The colored animated glowing line */}
          <div className="timeline-line-progress" style={{ height: `${lineHeight}%` }}></div>
        </div>

        {ABOUT_DATA.map((item) => {
          const isVisible = visibleItems.includes(item.id)
          return (
            <div 
              key={item.id} 
              data-id={item.id}
              className={`timeline-item ${isVisible ? 'visible' : ''}`}
            >
              <div className="timeline-dot">
                <i className={item.icon}></i>
              </div>
              <div className="timeline-content about-box">
                <div className="about-box-header">
                  <h3>{item.title}</h3>
                </div>
                {item.content}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default About
