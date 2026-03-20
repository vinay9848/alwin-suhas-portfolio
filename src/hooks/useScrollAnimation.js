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

  // Section start points: [0, 0.2, 0.4, 0.6, 0.8]
  const sectionStart = useCallback((index) => {
    return Math.max(0, Math.min(1, index / totalSections))
  }, [totalSections])

  const goToSection = useCallback((index) => {
    targetProgress.current = sectionStart(index)
  }, [sectionStart])

  const nextSection = useCallback(() => {
    // Find which section we're currently in, then go to start of next
    const p = progress.current
    const currentIndex = Math.min(totalSections - 1, Math.floor(p * totalSections + 0.01))
    const nextIndex = Math.min(totalSections - 1, currentIndex + 1)
    targetProgress.current = sectionStart(nextIndex)
  }, [totalSections, sectionStart])

  const prevSection = useCallback(() => {
    // If we're past the start of current section, go to its start first
    // If we're at the start, go to previous section's start
    const p = progress.current
    const currentIndex = Math.floor(p * totalSections + 0.01)
    const currentStart = sectionStart(currentIndex)
    // If we're more than 2% into the section, snap to its start
    if (p - currentStart > 0.02) {
      targetProgress.current = currentStart
    } else {
      targetProgress.current = sectionStart(Math.max(0, currentIndex - 1))
    }
  }, [totalSections, sectionStart])

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
