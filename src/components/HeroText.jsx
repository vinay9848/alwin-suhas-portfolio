import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function HeroText({ scrollProgress, isMobile }) {
  const [opacity, setOpacity] = useState(1)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let raf
    const tick = () => {
      const p = scrollProgress?.current ?? 0
      const newOpacity = Math.max(0, 1 - p * 6)
      setOpacity(newOpacity)
      setVisible(newOpacity > 0.01)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-10 flex items-center pointer-events-none" style={{ opacity }}>
      <div className={`pointer-events-auto ${
        isMobile
          ? 'mx-auto text-center px-6 max-w-xs'
          : 'ml-auto mr-[6%] md:mr-[10%] text-right max-w-lg'
      }`}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          {/* Copper accent line */}
          <motion.div
            className={`mb-4 md:mb-6 h-px bg-gradient-to-l from-[#B07C4F] to-transparent ${
              isMobile ? 'mx-auto' : 'ml-auto'
            }`}
            initial={{ width: 0 }}
            animate={{ width: isMobile ? 60 : 100 }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Name — dark on light */}
          <motion.h1
            className={`font-display tracking-[0.08em] font-light leading-[0.95] ${
              isMobile ? 'text-4xl' : 'text-5xl md:text-7xl lg:text-8xl'
            }`}
            style={{ color: '#1A1A1E' }}
            initial={{ opacity: 0, y: isMobile ? 20 : 0, x: isMobile ? 0 : 30 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            ALWIN<br />SUHAS
          </motion.h1>

          {/* Role — copper accent */}
          <motion.p
            className={`font-mono uppercase mt-3 md:mt-5 ${
              isMobile ? 'text-[9px] tracking-[0.4em]' : 'text-[10px] md:text-xs tracking-[0.5em]'
            }`}
            style={{ color: '#B07C4F' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            Cinematographer
          </motion.p>

          {/* Quote */}
          <motion.p
            className={`font-body font-light italic mt-4 md:mt-6 ${
              isMobile ? 'text-xs' : 'text-sm md:text-base'
            }`}
            style={{ color: '#9A9A9F' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.3 }}
          >
            "Every frame tells a story."
          </motion.p>

          {/* Bottom line */}
          <motion.div
            className={`mt-4 md:mt-6 h-px bg-gradient-to-l from-[#B07C4F]/30 to-transparent ${
              isMobile ? 'mx-auto' : 'ml-auto'
            }`}
            initial={{ width: 0 }}
            animate={{ width: isMobile ? 50 : 80 }}
            transition={{ duration: 1.5, delay: 0.6 }}
          />

          {/* Scroll hint */}
          <motion.div
            className={`mt-8 md:mt-14 flex flex-col ${isMobile ? 'items-center' : 'items-end'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase mb-2" style={{ color: '#9A9A9F' }}>
              {isMobile ? 'Swipe up' : 'Scroll'}
            </span>
            <motion.div
              className="w-px h-6 md:h-8 bg-gradient-to-b from-[#B07C4F]/40 to-transparent"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
