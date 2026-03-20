import { useEffect, useState } from 'react'

const sections = ['Intro', 'Showreel', 'Work', 'About', 'Contact']

export default function SectionIndicator({ scrollProgress }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let raf
    const tick = () => {
      const p = scrollProgress?.current ?? 0
      const index = Math.min(4, Math.floor(p * 5))
      setActiveIndex(index)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress])

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
      {sections.map((name, i) => (
        <div key={name} className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: i === activeIndex ? '#6C7CFF' : '#1A1D28',
              boxShadow: i === activeIndex ? '0 0 8px rgba(108,124,255,0.4)' : 'none',
            }}
          />
          <span
            className="font-mono text-[8px] tracking-wider uppercase transition-all duration-500"
            style={{
              color: i === activeIndex ? '#6C7CFF' : '#505560',
              opacity: i === activeIndex ? 1 : 0,
              transform: i === activeIndex ? 'translateX(0)' : 'translateX(-4px)',
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  )
}
