import { useEffect, useState } from 'react'

export default function AboutSection({ scrollProgress, isMobile }) {
  const [opacity, setOpacity] = useState(0)
  const [visible, setVisible] = useState(false)
  const [counts, setCounts] = useState({ projects: 0, clients: 0, years: 0 })

  useEffect(() => {
    let raf
    const tick = () => {
      const p = scrollProgress?.current ?? 0
      const fadeIn = Math.min(1, Math.max(0, (p - 0.63) * 6))
      const fadeOut = Math.min(1, Math.max(0, (0.82 - p) * 6))
      const newOpacity = fadeIn * fadeOut
      setOpacity(newOpacity)
      setVisible(newOpacity > 0.01)

      if (newOpacity > 0.3) {
        const progress = Math.min(1, (newOpacity - 0.3) / 0.7)
        setCounts({
          projects: Math.round(progress * 50),
          clients: Math.round(progress * 20),
          years: Math.round(progress * 3),
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress])

  if (!visible) return null

  const stats = [
    { value: `${counts.projects}+`, label: 'Projects' },
    { value: `${counts.clients}+`, label: 'Clients' },
    { value: `${counts.years}+`, label: 'Years' },
  ]

  const skills = [
    { name: 'Lighting', level: 92 },
    { name: 'Camera Movement', level: 88 },
    { name: 'Composition', level: 95 },
    { name: 'Color Grading', level: 85 },
    { name: 'Editing', level: 80 },
  ]

  return (
    <div className="section-overlay interactive" style={{ opacity }}>
      <div className={`absolute ${
        isMobile
          ? 'inset-x-0 bottom-8 px-6 text-center'
          : 'right-[6%] md:right-[10%] top-1/2 -translate-y-1/2 max-w-sm text-right'
      }`}>
        {/* Section label */}
        <div className={`mb-4 md:mb-8 ${isMobile ? '' : ''}`}>
          <div className={`mb-2 md:mb-3 h-px w-10 md:w-12 bg-gradient-to-r from-[#6C7CFF] to-transparent ${
            isMobile ? 'mx-auto' : 'ml-auto'
          }`} />
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.5em] uppercase" style={{ color: '#6C7CFF' }}>
            About
          </p>
        </div>

        {/* Stats */}
        <div className={`flex gap-6 md:gap-8 mb-6 md:mb-10 ${isMobile ? 'justify-center' : 'justify-end'}`}>
          {stats.map((stat) => (
            <div key={stat.label} className={isMobile ? 'text-center' : 'text-right'}>
              <p className={`font-display font-light tracking-tight ${
                isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'
              }`} style={{ color: '#E8E6E3' }}>
                {stat.value}
              </p>
              <p className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] uppercase mt-1" style={{ color: '#505560' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className={`space-y-2 md:space-y-3 mb-6 md:mb-10 ${isMobile ? 'max-w-xs mx-auto' : ''}`}>
          {skills.map((skill) => (
            <div key={skill.name} className="flex items-center gap-2 md:gap-3">
              <span className={`font-mono text-[8px] md:text-[9px] tracking-wider uppercase text-right ${
                isMobile ? 'w-20' : 'w-28'
              }`} style={{ color: '#8A8F98' }}>
                {skill.name}
              </span>
              <div className="flex-1 h-px relative" style={{ background: '#1A1D28' }}>
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-1000"
                  style={{
                    width: `${opacity > 0.5 ? skill.level : 0}%`,
                    background: 'linear-gradient(90deg, #6C7CFF, #FF8A50)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <p className={`font-body leading-relaxed ${
          isMobile ? 'text-xs text-center' : 'text-sm text-right'
        }`} style={{ color: '#8A8F98' }}>
          Crafting visual narratives through light,
          {!isMobile && <br />}
          {isMobile ? ' ' : ''}movement, and intentional composition.
        </p>
      </div>
    </div>
  )
}
