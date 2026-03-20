import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Cinematic 3-light setup. Mobile gets simpler lighting (no flicker calc).
 */
export default function Lighting({ isMobile }) {
  const rimRef = useRef()

  useFrame((state) => {
    if (rimRef.current && !isMobile) {
      const flicker = Math.sin(state.clock.elapsedTime * 3.7) * 0.15 +
        Math.sin(state.clock.elapsedTime * 7.1) * 0.05
      rimRef.current.intensity = 4.0 + flicker
    }
  })

  return (
    <>
      <ambientLight color="#1a1a2e" intensity={isMobile ? 0.25 : 0.15} />

      {/* KEY — warm white */}
      <spotLight
        position={[4, 6, 3]}
        angle={0.4}
        penumbra={0.8}
        intensity={isMobile ? 6 : 8}
        color="#FFF5E6"
      />

      {/* RIM — cool blue */}
      <spotLight
        ref={rimRef}
        position={[-5, 4, -4]}
        angle={0.5}
        penumbra={0.6}
        intensity={4}
        color="#4A7CFF"
      />

      {/* FILL — subtle front (skip on mobile, ambient covers it) */}
      {!isMobile && (
        <directionalLight
          position={[0, 2, 6]}
          intensity={0.4}
          color="#C0C8D8"
        />
      )}
    </>
  )
}
