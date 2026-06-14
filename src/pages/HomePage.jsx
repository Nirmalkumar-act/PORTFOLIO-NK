import Header from '../components/Header'
import Home from '../components/Home'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Resume from '../components/Resume'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Home />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <Skills />
        <div className="section-divider" />
        <Projects />
        <div className="section-divider" />
        <Resume />
        <div className="section-divider" />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default HomePage
