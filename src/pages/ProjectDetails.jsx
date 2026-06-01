import { useParams, Link, Navigate } from 'react-router-dom'
import { projectsData } from '../data/projects'
import { useEffect } from 'react'
import './ProjectDetails.css'

function ProjectDetails() {
  const { id } = useParams()
  const project = projectsData.find(p => p.id === parseInt(id))

  // Scroll to top when opening the page
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!project) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="project-details-page">
      <header className="details-header">
        <Link to="/" className="back-btn">
          <i className="bx bx-left-arrow-alt"></i> Back to Home
        </Link>
      </header>

      <div className="details-container">
        <div className="details-hero">
          <img src={project.img} alt={project.alt} className="details-image" />
          <div className="details-overlay" style={{ '--project-color': project.color }}>
            <h1 className="details-title">{project.title}</h1>
            <div className="tech-tags">
              {project.tech.map(t => (
                <span className="tag" key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="details-content">
          <div className="details-about">
            <h2>About this project</h2>
            <div className="project-description">
              {project.fullDesc ? (
                project.fullDesc.split('\n').map((line, i) => (
                  <p key={i} style={{ marginBottom: '12px' }}>{line}</p>
                ))
              ) : (
                <p>{project.desc}</p>
              )}
            </div>
          </div>

          <div className="details-sidebar">
            <div className="sidebar-card">
              <h3>Links</h3>
              <a href={project.github} className="sidebar-link github" target="_blank" rel="noreferrer">
                <i className="bx bxl-github"></i> View Source
              </a>
              <a href={project.demo} className="sidebar-link demo" style={{ '--project-color': project.color }} target="_blank" rel="noreferrer">
                <i className="bx bx-link-external"></i> Live Demo
              </a>
            </div>
            
            <div className="sidebar-card">
              <h3>Technologies Used</h3>
              <ul className="tech-list">
                {project.tech.map(t => (
                  <li key={t}>
                    <i className="bx bx-check-circle" style={{ color: project.color }}></i> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
