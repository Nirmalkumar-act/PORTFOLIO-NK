import { useState, useEffect, useRef } from 'react'

function Contact() {
  const [formStatus, setFormStatus] = useState('idle') // 'idle' | 'submitting' | 'success'
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) sectionRef.current.classList.add('active') },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormStatus('submitting')

    // Simulate network request
    setTimeout(() => {
      setFormStatus('success')
      e.target.reset()

      // Reset back to idle after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000)
    }, 1500)
  }

  return (
    <section className="contact reveal" id="contact" ref={sectionRef}>
      <div className="contact-text">
        <h2 className="contact-h2">Contact <span>Me</span></h2>
        <h4>Let's work Together</h4>
        <p>
          I am always open to professional opportunities, collaborations, and meaningful discussions related to
          technology and software development. If you would like to connect, discuss a project, or explore
          potential opportunities, please feel free to reach out. You can contact me via phone or email, or
          connect with me through LinkedIn and GitHub. I look forward to connecting with you.
        </p>

        <ul className="contact-list">
          <li>
            <i className="bx bxs-send"></i>
            <a href="mailto:nirmalkumar76950@gmail.com">nirmalkumar76950@gmail.com</a>
          </li>
          <li>
            <i className="bx bxs-phone"></i>
            <a href="tel:+917695824253">7695824253</a>
          </li>
        </ul>

        <div className="contact-icons">
          <a href="https://www.instagram.com/nkmsdmass?igsh=MXEzcHJ0MDNtZGtoMg==" style={{ '--i': 3 }} aria-label="Instagram"><i className="bx bxl-instagram"></i></a>
          <a href="https://www.linkedin.com/in/nirmalkumar-r-nk-130b92314?utm_source=share_via&utm_content=profile&utm_medium=member_android" style={{ '--i': 4 }} aria-label="LinkedIn"><i className="bx bxl-linkedin"></i></a>
          <a href="https://github.com/Nirmalkumar-act" style={{ '--i': 5 }} aria-label="GitHub"><i className="bx bxl-github"></i></a>
        </div>
      </div>

      <div className="contact-form">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" placeholder="Enter Your Name" required disabled={formStatus !== 'idle'} />
          </div>
          <div className="input-group">
            <input type="email" placeholder="Enter Your Email" required disabled={formStatus !== 'idle'} />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Enter Your Subject" required disabled={formStatus !== 'idle'} />
          </div>
          <div className="input-group">
            <textarea name="message" cols="40" rows="8" placeholder="Enter Your Message" required disabled={formStatus !== 'idle'}></textarea>
          </div>

          {formStatus === 'success' ? (
            <div className="success-message">
              <i className="bx bx-check-circle"></i>
              <span>Message sent successfully! I'll get back to you soon.</span>
            </div>
          ) : (
            <button type="submit" className="send" disabled={formStatus !== 'idle'}>
              {formStatus === 'submitting' ? (
                <><i className="bx bx-loader-alt bx-spin"></i> Sending...</>
              ) : (
                <><i className="bx bx-send"></i> Submit Message</>
              )}
            </button>
          )}
        </form>
      </div>
    </section>
  )
}

export default Contact
