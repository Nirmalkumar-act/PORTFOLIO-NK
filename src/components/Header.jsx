import { useEffect, useRef, useState } from 'react'

function Header() {
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const navLinks = navRef.current?.querySelectorAll('a')

    const handleScroll = () => {
      let current = ''
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100
        if (window.scrollY >= sectionTop) current = section.getAttribute('id')
      })
      navLinks?.forEach(link => {
        link.classList.remove('active')
        if (link.getAttribute('href') === '#' + current) link.classList.add('active')
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <a href="#" className="logo">Nirmalkumar R</a>

      {/* Hamburger Button */}
      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(prev => !prev)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`navbar ${menuOpen ? 'nav-open' : ''}`} ref={navRef}>
        <a href="#home"    style={{ '--i': 1 }} className="active" onClick={closeMenu}>Home</a>
        <a href="#about"   style={{ '--i': 2 }} onClick={closeMenu}>About</a>
        <a href="#skills"  style={{ '--i': 3 }} onClick={closeMenu}>Skills</a>
        <a href="#projects" style={{ '--i': 4 }} onClick={closeMenu}>Project</a>
        <a href="#resume"  style={{ '--i': 5 }} onClick={closeMenu}>Resume</a>
        <a href="#contact" style={{ '--i': 6 }} onClick={closeMenu}>Contact</a>
      </nav>
    </header>
  )
}

export default Header
