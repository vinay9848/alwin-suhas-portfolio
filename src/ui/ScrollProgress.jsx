import { useEffect, useState } from 'react'

export default function ScrollProgress({ scrollProgress }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf
    const tick = () => {
      setProgress((scrollProgress?.current ?? 0) * 100)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress])

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2">
      <div className="w-px h-24 relative" style={{ background: '#D0C8BC' }}>
        <div
          className="absolute bottom-0 w-px transition-all duration-75"
          style={{
            height: `${progress}%`,
            background: 'linear-gradient(to top, #B07C4F, transparent)',
          }}
        />
      </div>
      <span className="font-mono text-[8px] tracking-wider" style={{ color: '#9A9A9F' }}>
        {String(Math.round(progress)).padStart(2, '0')}
      </span>
    </div>
  )
}
