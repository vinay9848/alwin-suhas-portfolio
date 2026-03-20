import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const taglines = [
  'Loading Visual Experience',
  'Preparing Portfolio',
  'Entering Cinematic Space',
]

/**
 * Cinematic loading screen — line animation, percentage, rotating taglines.
 */
export default function LoadingScreen({ loaded }) {
  const [percent, setPercent] = useState(0)
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const intervalRef = useRef(null)

  // Animate percentage
  useEffect(() => {
    const target = loaded ? 100 : 85
    intervalRef.current = setInterval(() => {
      setPercent((prev) => {
        if (prev >= target) {
          if (loaded && prev >= 100) clearInterval(intervalRef.current)
          return Math.min(prev, 100)
        }
        const speed = loaded ? 5 : Math.random() * 3 + 0.5
        return Math.min(prev + speed, target)
      })
    }, 50)
    return () => clearInterval(intervalRef.current)
  }, [loaded])

  // Cycle taglines
  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length)
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  // Fade out when loaded
  useEffect(() => {
    if (loaded && percent >= 100) {
      const timer = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(timer)
    }
  }, [loaded, percent])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Name */}
          <motion.p
            className="font-display text-xs md:text-sm tracking-[0.4em] md:tracking-[0.5em] uppercase mb-10 md:mb-16"
            style={{ color: '#505560' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            Alwin Suhas
          </motion.p>

          {/* Loading line */}
          <div className="relative w-[140px] md:w-[200px] h-px mb-8 md:mb-10">
            <div className="absolute inset-0 bg-[#1A1D28]" />
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-[#E8E6E3] to-transparent"
              style={{ width: `${percent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Percentage */}
          <motion.p
            className="font-mono text-xs tracking-[0.3em]"
            style={{ color: '#8A8F98' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {String(Math.round(percent)).padStart(3, '0')}
          </motion.p>

          {/* Rotating tagline */}
          <div className="mt-12 h-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                className="font-mono text-[10px] tracking-[0.3em] uppercase"
                style={{ color: '#505560' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {taglines[taglineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
