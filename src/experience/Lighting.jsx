import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Warm studio lighting — brighter ambient, warm key, copper accents.
 * Dark camera model pops against the light environment.
 */
export default function Lighting({ isMobile }) {
  const accentRef = useRef()

  useFrame((state) => {
    if (accentRef.current && !isMobile) {
      const flicker = Math.sin(state.clock.elapsedTime * 3.7) * 0.08
      accentRef.current.intensity = 2.0 + flicker
    }
  })

  return (
    <>
      {/* Higher ambient — light environment needs it */}
      <ambientLight color="#F5EDE0" intensity={isMobile ? 0.8 : 0.6} />

      {/* KEY — warm golden, from upper-right */}
      <spotLight
        position={[4, 6, 3]}
        angle={0.45}
        penumbra={0.8}
        intensity={isMobile ? 4 : 5}
        color="#FFF0D0"
      />

      {/* RIM — cool blue for contrast on metals */}
      <spotLight
        ref={accentRef}
        position={[-5, 4, -4]}
        angle={0.5}
        penumbra={0.6}
        intensity={isMobile ? 2 : 3}
        color="#6A8FC0"
      />

      {/* FILL — soft warm from front */}
      <directionalLight
        position={[0, 3, 6]}
        intensity={isMobile ? 0.6 : 0.5}
        color="#F8ECD8"
      />

      {/* Bottom bounce — warm, like light reflecting off the floor */}
      <pointLight
        position={[0, 0.2, 0]}
        intensity={0.3}
        color="#E8D8C0"
        distance={8}
        decay={2}
      />
    </>
  )
}
