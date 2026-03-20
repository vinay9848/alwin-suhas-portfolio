import { useEffect, useState } from 'react'

const sectionNames = ['Intro', 'Showreel', 'Work', 'About', 'Contact']

/**
 * Bottom nav arrows — prev/next with section label.
 * Always visible. Works on both mobile and desktop.
 */
export default function NavArrows({ scrollProgress, onPrev, onNext }) {
  const [sectionIndex, setSectionIndex] = useState(0)

  useEffect(() => {
    let raf
    const tick = () => {
      const p = scrollProgress?.current ?? 0
      setSectionIndex(Math.min(4, Math.floor(p * 5)))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress])

  const isFirst = sectionIndex === 0
  const isLast = sectionIndex === 4

  return (
    <div className="fixed bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 md:gap-6">
      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        className="flex items-center justify-center w-11 h-11 md:w-10 md:h-10 rounded-full
                   border transition-all duration-300"
        style={{
          borderColor: isFirst ? 'rgba(26,26,30,0.1)' : 'rgba(26,26,30,0.25)',
          background: isFirst ? 'transparent' : 'rgba(255,255,255,0.7)',
          cursor: isFirst ? 'default' : 'pointer',
          opacity: isFirst ? 0.3 : 1,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1E" strokeWidth="1.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Section label */}
      <span
        className="font-mono text-[10px] md:text-[9px] tracking-[0.3em] uppercase min-w-[80px] text-center"
        style={{ color: '#1A1A1E' }}
      >
        {sectionNames[sectionIndex]}
      </span>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={isLast}
        className="flex items-center justify-center w-11 h-11 md:w-10 md:h-10 rounded-full
                   border transition-all duration-300"
        style={{
          borderColor: isLast ? 'rgba(26,26,30,0.1)' : 'rgba(176,124,79,0.4)',
          background: isLast ? 'transparent' : 'rgba(255,255,255,0.7)',
          cursor: isLast ? 'default' : 'pointer',
          opacity: isLast ? 0.3 : 1,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1E" strokeWidth="1.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
