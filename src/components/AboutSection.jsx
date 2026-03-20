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
          projects: Math.round(progress * 3),
          clients: Math.round(progress * 2),
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
    { value: `${counts.projects}`, label: 'Projects' },
    { value: `${counts.clients}+`, label: 'Years' },
    { value: `${counts.years}`, label: 'Films' },
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
          ? 'inset-x-0 bottom-16 px-4 text-center'
          : 'right-[6%] md:right-[10%] top-1/2 -translate-y-1/2 max-w-sm text-right'
      }`}
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', padding: isMobile ? '20px' : '28px', borderRadius: '6px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
      >
        <div className={`mb-4 md:mb-8`}>
          <div className={`mb-2 md:mb-3 h-px w-10 md:w-12 bg-gradient-to-r from-[#B07C4F] to-transparent ${
            isMobile ? 'mx-auto' : 'ml-auto'
          }`} />
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.5em] uppercase" style={{ color: '#B07C4F' }}>
            About
          </p>
        </div>

        <div className={`flex gap-6 md:gap-8 mb-6 md:mb-10 ${isMobile ? 'justify-center' : 'justify-end'}`}>
          {stats.map((stat) => (
            <div key={stat.label} className={isMobile ? 'text-center' : 'text-right'}>
              <p className={`font-display font-light tracking-tight ${
                isMobile ? 'text-3xl' : 'text-3xl md:text-4xl'
              }`} style={{ color: '#000000' }}>
                {stat.value}
              </p>
              <p className="font-mono text-[10px] md:text-[9px] tracking-[0.2em] uppercase mt-1" style={{ color: '#111111' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className={`space-y-2 md:space-y-3 mb-6 md:mb-10 ${isMobile ? 'max-w-xs mx-auto' : ''}`}>
          {skills.map((skill) => (
            <div key={skill.name} className="flex items-center gap-2 md:gap-3">
              <span className={`font-mono text-[10px] md:text-[9px] tracking-wider uppercase text-right ${
                isMobile ? 'w-24' : 'w-28'
              }`} style={{ color: '#000000' }}>
                {skill.name}
              </span>
              <div className="flex-1 h-px relative" style={{ background: '#CCCCCC' }}>
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-1000"
                  style={{
                    width: `${opacity > 0.5 ? skill.level : 0}%`,
                    background: 'linear-gradient(90deg, #B07C4F, #4A6FA5)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className={`font-body leading-relaxed ${
          isMobile ? 'text-sm text-center' : 'text-sm text-right'
        }`} style={{ color: '#000000' }}>
          Crafting visual narratives through light,
          {!isMobile && <br />}
          {isMobile ? ' ' : ''}movement, and intentional composition.
        </p>
      </div>
    </div>
  )
}
