import { motion, AnimatePresence } from 'framer-motion'

export default function ProjectModal({ project, isOpen, onClose, isMobile }) {
  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Warm backdrop */}
          <div
            className="absolute inset-0 bg-[#F2EDE7]/85 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className={`relative z-10 glass-panel overflow-y-auto ${
              isMobile
                ? 'w-full h-full p-5'
                : 'w-[90vw] max-w-3xl max-h-[85vh] p-6 md:p-10'
            }`}
            initial={{ scale: isMobile ? 1 : 0.95, y: isMobile ? 30 : 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: isMobile ? 1 : 0.95, y: isMobile ? 30 : 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 flex items-center justify-center
                         text-[#9A9A9F] hover:text-[#1A1A1E] transition-colors ${
                isMobile ? 'w-10 h-10' : 'w-8 h-8'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>

            <div
              className="w-full aspect-video mb-4 md:mb-6 flex items-center justify-center rounded-sm"
              style={{
                background: `linear-gradient(135deg, ${project.gradient?.[0] || '#333'}, ${project.gradient?.[1] || '#111'})`,
              }}
            >
              <div className="text-center">
                <div className={`mx-auto rounded-full border border-white/20 flex items-center justify-center mb-2 ${
                  isMobile ? 'w-10 h-10' : 'w-14 h-14'
                }`}>
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                    <path d="M15 9L1 17.66V0.34L15 9Z" fill="white" fillOpacity="0.6" />
                  </svg>
                </div>
                <p className="font-mono text-[8px] md:text-[9px] tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Replace with project video
                </p>
              </div>
            </div>

            <h3 className={`font-display font-light tracking-wide ${
              isMobile ? 'text-lg' : 'text-xl md:text-2xl'
            }`} style={{ color: '#1A1A1E' }}>
              {project.name}
            </h3>
            <p className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] uppercase mt-1" style={{ color: '#B07C4F' }}>
              {project.type} &middot; {project.year} &middot; {project.role}
            </p>

            <p className={`font-body mt-3 md:mt-4 leading-relaxed ${
              isMobile ? 'text-xs' : 'text-sm'
            }`} style={{ color: '#5A5A62' }}>
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5 md:gap-2 mt-4 md:mt-5">
              {project.tools?.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-[7px] md:text-[8px] tracking-wider uppercase px-2 md:px-3 py-1 md:py-1.5 border border-[#1A1A1E]/[0.08]"
                  style={{ color: '#9A9A9F' }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
