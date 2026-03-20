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
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#08090C]/90 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal — fullscreen on mobile */}
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
            {/* Close */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 flex items-center justify-center
                         text-[#505560] hover:text-white transition-colors ${
                isMobile ? 'w-10 h-10' : 'w-8 h-8'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>

            {/* Video placeholder */}
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

            {/* Info */}
            <h3 className={`font-display font-light tracking-wide ${
              isMobile ? 'text-lg' : 'text-xl md:text-2xl'
            }`} style={{ color: '#E8E6E3' }}>
              {project.name}
            </h3>
            <p className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] uppercase mt-1" style={{ color: project.gradient?.[0] || '#6C7CFF' }}>
              {project.type} &middot; {project.year} &middot; {project.role}
            </p>

            <p className={`font-body mt-3 md:mt-4 leading-relaxed ${
              isMobile ? 'text-xs' : 'text-sm'
            }`} style={{ color: '#8A8F98' }}>
              {project.description}
            </p>

            {/* Tools */}
            <div className="flex flex-wrap gap-1.5 md:gap-2 mt-4 md:mt-5">
              {project.tools?.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-[7px] md:text-[8px] tracking-wider uppercase px-2 md:px-3 py-1 md:py-1.5 border border-white/[0.06]"
                  style={{ color: '#505560' }}
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
