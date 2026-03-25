import { useEffect, useRef, useState } from 'react'

/**
 * Real-time FPS counter overlay.
 * Shows current FPS, average, min, and GPU load estimate.
 * Press 'F' key to toggle visibility.
 */
export default function FPSCounter() {
  const [visible, setVisible] = useState(true)
  const [stats, setStats] = useState({ fps: 0, avg: 0, min: 999, max: 0, frameTime: 0 })
  const frames = useRef([])
  const lastTime = useRef(performance.now())
  const frameCount = useRef(0)
  const allFps = useRef([])

  useEffect(() => {
    const toggle = (e) => {
      if (e.key === 'f' || e.key === 'F') setVisible((v) => !v)
    }
    window.addEventListener('keydown', toggle)
    return () => window.removeEventListener('keydown', toggle)
  }, [])

  useEffect(() => {
    let raf
    const tick = () => {
      const now = performance.now()
      const delta = now - lastTime.current
      lastTime.current = now
      frameCount.current++

      frames.current.push(delta)
      if (frames.current.length > 60) frames.current.shift()

      // Update stats every 10 frames
      if (frameCount.current % 10 === 0) {
        const avgDelta = frames.current.reduce((a, b) => a + b, 0) / frames.current.length
        const currentFps = Math.round(1000 / delta)
        const avgFps = Math.round(1000 / avgDelta)

        allFps.current.push(currentFps)
        if (allFps.current.length > 300) allFps.current.shift()

        const minFps = Math.min(...allFps.current)
        const maxFps = Math.max(...allFps.current)

        setStats({
          fps: currentFps,
          avg: avgFps,
          min: minFps,
          max: maxFps,
          frameTime: avgDelta.toFixed(1),
        })
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!visible) return null

  const fpsColor = stats.fps >= 55 ? '#22C55E' : stats.fps >= 30 ? '#EAB308' : '#EF4444'

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 99999,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11,
        lineHeight: 1.5,
        background: 'rgba(0,0,0,0.85)',
        color: '#ccc',
        padding: '8px 12px',
        borderRadius: 6,
        pointerEvents: 'none',
        minWidth: 140,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span>FPS</span>
        <span style={{ color: fpsColor, fontWeight: 700 }}>{stats.fps}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span>AVG</span>
        <span>{stats.avg}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span>MIN / MAX</span>
        <span>{stats.min} / {stats.max}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid #333', marginTop: 4, paddingTop: 4 }}>
        <span>Frame</span>
        <span>{stats.frameTime}ms</span>
      </div>
      <div style={{ fontSize: 9, color: '#666', marginTop: 4 }}>
        Press F to hide
      </div>
    </div>
  )
}
