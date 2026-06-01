import { useEffect, useRef } from 'react'
import Typed from 'typed.js'

function Home() {
  const typedRef = useRef(null)

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ['Backend Developer', 'Frontend Developer', 'Full Stack Developer'],
      typeSpeed: 100,
      backSpeed: 60,
      backDelay: 1000,
      loop: true,
    })
    return () => typed.destroy()
  }, [])

  return (
    <section className="home" id="home">
      <div className="home-content">
        <h3>Hello, It's Me</h3>
        <h1>Nirmalkumar R</h1>
        <h3>And I'm a <span className="text" ref={typedRef}></span></h3>
        <p>
          I am a Full Stack Developer skilled in both Frontend and Backend development.
          <br />I build modern, responsive, and user-friendly web applications.
        </p>
        <div className="home-sci">
          <a href="https://www.linkedin.com/in/nirmalkumar-r-nk-130b92314?utm_source=share_via&utm_content=profile&utm_medium=member_android" style={{ '--i': 4 }} aria-label="LinkedIn"><i className="bx bxl-linkedin"></i></a>
          <a href="https://github.com/Nirmalkumar-act" style={{ '--i': 5 }} aria-label="GitHub"><i className="bx bxl-github"></i></a>
          <a href="https://wa.me/qr/4DTJU6VK7MP4J1" style={{ '--i': 9 }} aria-label="WhatsApp"><i className="bx bxl-whatsapp"></i></a>
        </div>
        <div className="home-buttons">
          <a href="#about" className="btn-box" style={{ '--i': 10 }}>More About Me</a>
          <a href="/CV.pdf" download="Nirmalkumar_CV.pdf" className="btn-box btn-secondary" style={{ '--i': 11 }}>
            <i className="bx bx-download"></i> Download CV
          </a>
        </div>
      </div>
      <div className="home-banner-wrapper">
        <div className="banner-container">
          <div className="banner-glow"></div>
          <div className="banner-particles-1"></div>
          <div className="banner-particles-2"></div>
          <div className="banner-particles-3"></div>
          <div className="banner-image">
            <img src="/images/profile.jpg" alt="Profile Image" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
