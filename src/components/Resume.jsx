import { useEffect, useRef } from 'react'

function Resume() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) sectionRef.current.classList.add('active') },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="resume reveal" id="resume" ref={sectionRef}>
      <div className="resume-container">
        <h2 className="heading">My <span>Resume</span></h2>

        <div className="resume-card">
          <i className="bx bx-file"></i>
          <h3>My Professional Resume</h3>
          <p>
            You can view or download my latest resume to learn more about my
            skills, education, and project experience.
          </p>
          <div className="resume-buttons">
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="resume-btn view-btn">
              View Resume
            </a>
            <a href="/resume.pdf" download className="resume-btn download-btn">
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resume
