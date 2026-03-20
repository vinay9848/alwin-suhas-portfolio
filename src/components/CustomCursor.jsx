import { useEffect, useRef } from 'react'

/**
 * Custom cursor — dot + ring with lag.
 * Ring expands on hovering interactive elements.
 */
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const dotPos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const handleMove = (e) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
    }

    const tick = () => {
      // Dot follows closely
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.25
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.25
      dot.style.transform = `translate(${dotPos.current.x - 3}px, ${dotPos.current.y - 3}px)`

      // Ring follows with more lag
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12
      ring.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`

      requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove)
    const raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
