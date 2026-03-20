import { useEffect, useState } from 'react'

const SHOWREEL_URL = 'https://drive.google.com/file/d/1aJ1gDLeAa4HZJJWnUY2yP40V8Y1gsgsb/view?pli=1'

export default function ShowreelOverlay({ scrollProgress, isMobile }) {
  const [opacity, setOpacity] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf
    const tick = () => {
      const p = scrollProgress?.current ?? 0
      const fadeIn = Math.min(1, Math.max(0, (p - 0.18) * 6))
      const fadeOut = Math.min(1, Math.max(0, (0.45 - p) * 5))
      const newOpacity = fadeIn * fadeOut
      setOpacity(newOpacity)
      setVisible(newOpacity > 0.01)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center pointer-events-none"
      style={{ opacity, paddingBottom: isMobile ? '24px' : '48px' }}
    >
      <a
        href={SHOWREEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 group"
        style={{
          background: 'rgba(26,26,30,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(176,124,79,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          cursor: 'pointer',
        }}
      >
        {/* Play icon */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(176,124,79,0.2)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#B07C4F">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        </div>
        <div>
          <p className="font-display text-sm font-medium" style={{ color: '#F0EDE8' }}>
            Play Showreel
          </p>
          <p className="font-mono text-[8px] tracking-[0.2em] uppercase" style={{ color: '#B07C4F' }}>
            Final Out — Short Film
          </p>
        </div>
        <svg
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B07C4F" strokeWidth="1.5"
        >
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </a>
    </div>
  )
}
