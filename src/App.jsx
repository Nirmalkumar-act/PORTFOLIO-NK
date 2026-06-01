import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectDetails from './pages/ProjectDetails'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
    </Routes>
  )
}

export default App
