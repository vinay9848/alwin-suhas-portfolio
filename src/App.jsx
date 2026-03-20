import { useState, useCallback, useEffect } from 'react'
import './App.css'

import Experience from './experience/Experience'
import HeroText from './components/HeroText'
import ContactPanel from './components/ContactPanel'
import AboutSection from './components/AboutSection'
import ProjectModal from './ui/Modal'
import ScrollProgress from './ui/ScrollProgress'
import SectionIndicator from './ui/SectionIndicator'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import { useMobile } from './hooks/useMobile'

function App() {
  const isMobile = useMobile()
  const { progress, velocity, setActive } = useScrollAnimation({
    totalSections: 5,
    damping: 0.08,
  })

  const [loaded, setLoaded] = useState(false)
  const [introComplete, setIntroComplete] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), isMobile ? 2000 : 3000)
    return () => clearTimeout(timer)
  }, [isMobile])

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setIntroComplete(true), 800)
      return () => clearTimeout(timer)
    }
  }, [loaded])

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project)
    setModalOpen(true)
    setActive(false)
  }, [setActive])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setActive(true)
  }, [setActive])

  return (
    <>
      <LoadingScreen loaded={loaded} />

      {/* No custom cursor on mobile */}
      {!isMobile && <CustomCursor />}

      {introComplete && (
        <>
          <Experience
            scrollProgress={progress}
            scrollVelocity={velocity}
            onProjectClick={handleProjectClick}
            isMobile={isMobile}
          />

          <HeroText scrollProgress={progress} isMobile={isMobile} />
          <AboutSection scrollProgress={progress} isMobile={isMobile} />
          <ContactPanel scrollProgress={progress} isMobile={isMobile} />

          {/* Hide side UI on mobile — too small to tap */}
          {!isMobile && (
            <>
              <ScrollProgress scrollProgress={progress} />
              <SectionIndicator scrollProgress={progress} />
            </>
          )}

          <div className="film-grain" />
          <div className="vignette" />

          <ProjectModal
            project={selectedProject}
            isOpen={modalOpen}
            onClose={handleCloseModal}
            isMobile={isMobile}
          />
        </>
      )}
    </>
  )
}

export default App
