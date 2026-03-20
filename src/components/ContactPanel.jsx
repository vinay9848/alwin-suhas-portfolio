import { useEffect, useState } from 'react'
import { personalInfo } from '../data/projects'

export default function ContactPanel({ scrollProgress, isMobile }) {
  const [opacity, setOpacity] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf
    const tick = () => {
      const p = scrollProgress?.current ?? 0
      const newOpacity = Math.max(0, Math.min(1, (p - 0.82) * 5.5))
      setOpacity(newOpacity)
      setVisible(newOpacity > 0.01)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress])

  if (!visible) return null

  const contactLinks = [
    {
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-10 7L2 7" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      value: personalInfo.whatsapp,
      href: `https://wa.me/${personalInfo.whatsapp.replace(/[^0-9]/g, '')}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
      ),
    },
    {
      label: 'Call',
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone.replace(/\s/g, '')}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      value: '@alwinsuhas',
      href: `https://${personalInfo.instagram}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
  ]

  return (
    <div className="section-overlay interactive" style={{ opacity }}>
      <div className={`absolute ${
        isMobile
          ? 'inset-x-0 bottom-16 px-4 text-center'
          : 'left-[6%] md:left-[10%] top-1/2 -translate-y-1/2 max-w-sm'
      }`}
        style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', padding: isMobile ? '20px' : '28px', borderRadius: '6px', boxShadow: '0 4px 30px rgba(0,0,0,0.08)' }}
      >
        <div className={`mb-4 md:mb-8`}>
          <div className={`mb-2 md:mb-3 h-px w-10 md:w-12 bg-gradient-to-r from-[#4A6FA5] to-transparent ${
            isMobile ? 'mx-auto' : ''
          }`} />
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.5em] uppercase" style={{ color: '#4A6FA5' }}>
            Contact
          </p>
        </div>

        <h2 className={`font-display font-light mb-1 md:mb-2 tracking-wide ${
          isMobile ? 'text-2xl' : 'text-2xl md:text-3xl'
        }`} style={{ color: '#0A0A0E' }}>
          Available for projects.
        </h2>
        <p className={`font-body mb-4 md:mb-8 ${isMobile ? 'text-sm' : 'text-sm'}`} style={{ color: '#2A2A30' }}>
          Let's create something cinematic.
        </p>

        <div className={`flex flex-col gap-1.5 md:gap-2 ${isMobile ? 'max-w-xs mx-auto' : ''}`}>
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.label === 'Instagram' ? '_blank' : undefined}
              rel={link.label === 'Instagram' ? 'noopener noreferrer' : undefined}
              className={`group flex items-center gap-3 border border-[#1A1A1E]/[0.15] bg-white/50
                         hover:border-[#B07C4F]/40 hover:bg-white/80
                         transition-all duration-500 ${
                isMobile ? 'py-3 px-4' : 'py-3 px-4'
              }`}
            >
              <span className="text-[#9A9A9F] group-hover:text-[#B07C4F] transition-colors duration-300">
                {link.icon}
              </span>
              <div className="text-left">
                <span className="font-mono text-[10px] md:text-[8px] tracking-[0.2em] uppercase block" style={{ color: '#2A2A30' }}>
                  {link.label}
                </span>
                <span className={`font-body group-hover:text-[#1A1A1E] transition-colors duration-300 ${
                  isMobile ? 'text-sm' : 'text-sm'
                }`} style={{ color: '#1A1A20' }}>
                  {link.value}
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="font-mono text-[8px] md:text-[9px] tracking-[0.15em] uppercase mt-4 md:mt-6" style={{ color: '#2A2A30' }}>
          {personalInfo.location} &middot; {personalInfo.experience}
        </p>
      </div>
    </div>
  )
}
