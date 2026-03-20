import { useEffect, useState } from 'react'

const sectionNames = ['Intro', 'Showreel', 'Work', 'About', 'Contact']

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
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9997] flex items-center gap-3"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        padding: '8px 20px',
        borderRadius: '40px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        border: '1px solid rgba(176,124,79,0.15)',
      }}
    >
      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
        style={{
          background: isFirst ? 'transparent' : 'rgba(176,124,79,0.1)',
          cursor: isFirst ? 'default' : 'pointer',
          opacity: isFirst ? 0.25 : 1,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1E" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Section label */}
      <span
        className="font-mono text-[11px] tracking-[0.25em] uppercase min-w-[80px] text-center select-none"
        style={{ color: '#1A1A1E' }}
      >
        {sectionNames[sectionIndex]}
      </span>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={isLast}
        className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
        style={{
          background: isLast ? 'transparent' : 'rgba(176,124,79,0.1)',
          cursor: isLast ? 'default' : 'pointer',
          opacity: isLast ? 0.25 : 1,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1E" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
