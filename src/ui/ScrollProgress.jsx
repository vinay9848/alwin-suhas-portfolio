import { useEffect, useRef } from 'react'

export default function ScrollProgress({ scrollProgress }) {
  const barRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    let raf
    const tick = () => {
      const p = (scrollProgress?.current ?? 0) * 100
      if (barRef.current) barRef.current.style.height = `${p}%`
      if (labelRef.current) labelRef.current.textContent = String(Math.round(p)).padStart(2, '0')
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress])

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2">
      <div className="w-px h-24 relative" style={{ background: '#D0C8BC' }}>
        <div
          ref={barRef}
          className="absolute bottom-0 w-px"
          style={{ height: '0%', background: 'linear-gradient(to top, #B07C4F, transparent)' }}
        />
      </div>
      <span ref={labelRef} className="font-mono text-[8px] tracking-wider" style={{ color: '#9A9A9F' }}>
        00
      </span>
    </div>
  )
}
