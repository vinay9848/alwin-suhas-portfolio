import { useEffect, useRef } from 'react'

const sections = ['Intro', 'Showreel', 'Work', 'Contact']

export default function SectionIndicator({ scrollProgress }) {
  const dotsRef = useRef([])
  const labelsRef = useRef([])
  const lastIndex = useRef(-1)

  useEffect(() => {
    let raf
    const tick = () => {
      const p = scrollProgress?.current ?? 0
      const idx = Math.min(3, Math.floor(p * 4))
      // Only update DOM when section actually changes
      if (idx !== lastIndex.current) {
        lastIndex.current = idx
        dotsRef.current.forEach((dot, i) => {
          if (!dot) return
          const active = i === idx
          dot.style.background = active ? '#B07C4F' : '#D0C8BC'
          dot.style.boxShadow = active ? '0 0 6px rgba(176,124,79,0.3)' : 'none'
        })
        labelsRef.current.forEach((label, i) => {
          if (!label) return
          const active = i === idx
          label.style.color = active ? '#B07C4F' : '#9A9A9F'
          label.style.opacity = active ? '1' : '0'
          label.style.transform = active ? 'translateX(0)' : 'translateX(-4px)'
        })
      }
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
            ref={(el) => { dotsRef.current[i] = el }}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: i === 0 ? '#B07C4F' : '#D0C8BC',
              transition: 'all 0.5s',
            }}
          />
          <span
            ref={(el) => { labelsRef.current[i] = el }}
            className="font-mono text-[8px] tracking-wider uppercase"
            style={{
              color: i === 0 ? '#B07C4F' : '#9A9A9F',
              opacity: i === 0 ? 1 : 0,
              transform: i === 0 ? 'translateX(0)' : 'translateX(-4px)',
              transition: 'all 0.5s',
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  )
}
