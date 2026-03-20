import { useEffect, useState } from 'react'

const sections = ['Intro', 'Showreel', 'Work', 'Contact']

export default function SectionIndicator({ scrollProgress }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let raf
    const tick = () => {
      const p = scrollProgress?.current ?? 0
      setActiveIndex(Math.min(3, Math.floor(p * 4)))
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
              background: i === activeIndex ? '#B07C4F' : '#D0C8BC',
              boxShadow: i === activeIndex ? '0 0 6px rgba(176,124,79,0.3)' : 'none',
            }}
          />
          <span
            className="font-mono text-[8px] tracking-wider uppercase transition-all duration-500"
            style={{
              color: i === activeIndex ? '#B07C4F' : '#9A9A9F',
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
