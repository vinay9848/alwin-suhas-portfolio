import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'

export default function WorkSection({ scrollProgress, isMobile, onProjectClick }) {
  const containerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    let raf
    const tick = () => {
      const el = containerRef.current
      if (!el) { raf = requestAnimationFrame(tick); return }
      const p = scrollProgress?.current ?? 0
      const fadeIn = Math.min(1, Math.max(0, (p - 0.36) * 6))
      const fadeOut = Math.min(1, Math.max(0, (0.68 - p) * 5))
      const o = fadeIn * fadeOut
      el.style.opacity = o
      el.style.display = o < 0.01 ? 'none' : ''

      // Card stagger — direct DOM
      const cardProgress = Math.min(1, Math.max(0, (p - 0.38) * 4))
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        const delay = i * 0.3
        const vis = Math.min(1, Math.max(0, (cardProgress - delay) / 0.5))
        const tx = (1 - vis) * (isMobile ? 60 : 120)
        card.style.opacity = vis
        card.style.transform = `translateX(${tx}px)`
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress, isMobile])

  return (
    <div ref={containerRef} className="section-overlay interactive" style={{ display: 'none' }}>
      <div className={`absolute ${isMobile ? 'top-6 left-4' : 'top-12 left-[6%] md:left-[10%]'}`}>
        <div className="mb-2 h-px w-10 bg-gradient-to-r from-[#B07C4F] to-transparent" />
        <p className="font-mono text-[9px] md:text-[10px] tracking-[0.5em] uppercase" style={{ color: '#B07C4F' }}>
          Selected Work
        </p>
      </div>

      <div className={`absolute ${
        isMobile
          ? 'inset-x-0 bottom-4 top-16 px-4 flex flex-col gap-3 justify-center'
          : 'right-[4%] md:right-[6%] top-1/2 -translate-y-1/2 flex flex-col gap-4'
      }`}>
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { cardsRef.current[i] = el }}
            className="group cursor-pointer"
            style={{ opacity: 0, transform: 'translateX(120px)' }}
            onClick={() => onProjectClick?.(project)}
          >
            <div
              className={`relative overflow-hidden rounded-lg ${
                isMobile ? 'flex gap-3 items-center' : ''
              }`}
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(176,124,79,0.12)',
                padding: isMobile ? '12px' : '0',
              }}
            >
              <div className={`overflow-hidden ${
                isMobile ? 'w-24 h-16 rounded-md flex-shrink-0' : 'w-[380px] h-[200px]'
              }`}>
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {isMobile ? (
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-medium truncate" style={{ color: '#0A0A0E' }}>
                    {project.name}
                  </h3>
                  <p className="font-mono text-[9px] tracking-[0.15em] uppercase mt-0.5" style={{ color: '#B07C4F' }}>
                    {project.type} · {project.year}
                  </p>
                  <p className="font-body text-xs mt-1 line-clamp-2" style={{ color: '#444' }}>
                    {project.role}
                  </p>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-lg font-medium" style={{ color: '#0A0A0E' }}>
                      {project.name}
                    </h3>
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: '#B07C4F' }}>
                      {project.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: '#666' }}>
                      {project.type}
                    </span>
                    <span className="w-px h-3" style={{ background: '#CCC' }} />
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: '#666' }}>
                      {project.role}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: '#B07C4F' }}>
                      View Project
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B07C4F" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}

              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, #B07C4F, transparent)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
