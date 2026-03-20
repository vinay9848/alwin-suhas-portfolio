import { useRef, useEffect, useCallback } from 'react'

export function useScrollAnimation({ totalSections = 5, damping = 0.08 } = {}) {
  const targetProgress = useRef(0)
  const progress = useRef(0)
  const velocity = useRef(0)
  const active = useRef(true)
  const rafId = useRef(null)

  const setActive = useCallback((val) => {
    active.current = val
  }, [])

  // Programmatic jump to a section (0-based index)
  const goToSection = useCallback((index) => {
    targetProgress.current = Math.max(0, Math.min(1, index / totalSections))
  }, [totalSections])

  const nextSection = useCallback(() => {
    const current = Math.floor(progress.current * totalSections)
    goToSection(Math.min(totalSections, current + 1))
  }, [totalSections, goToSection])

  const prevSection = useCallback(() => {
    const current = Math.ceil(progress.current * totalSections)
    goToSection(Math.max(0, current - 1))
  }, [totalSections, goToSection])

  useEffect(() => {
    const handleWheel = (e) => {
      if (!active.current) return
      e.preventDefault()
      const delta = e.deltaY * 0.0004
      targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + delta))
    }

    let touchY = 0
    const handleTouchStart = (e) => {
      touchY = e.touches[0].clientY
    }
    const handleTouchMove = (e) => {
      if (!active.current) return
      e.preventDefault()
      const delta = (touchY - e.touches[0].clientY) * 0.0012
      targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + delta))
      touchY = e.touches[0].clientY
    }

    const tick = () => {
      const diff = targetProgress.current - progress.current
      velocity.current = velocity.current * 0.75 + diff * damping
      progress.current = Math.max(0, Math.min(1, progress.current + velocity.current))
      rafId.current = requestAnimationFrame(tick)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [damping])

  return { progress, velocity, setActive, goToSection, nextSection, prevSection }
}
