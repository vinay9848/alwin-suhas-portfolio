import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

import CameraRig from './CameraRig'
import Lighting from './Lighting'
import StudioEnvironment from './Environment'
import CinemaCamera from '../components/CinemaCamera'
import ShowreelScreen from '../components/ShowreelScreen'
import ProjectCards from '../components/ProjectCards'

export default function Experience({ scrollProgress, scrollVelocity, onProjectClick, isMobile }) {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{
        fov: isMobile ? 42 : 32,
        near: 0.1,
        far: 100,
        position: [1.8, 1.2, 4.5],
      }}
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{
        antialias: !isMobile,
        toneMapping: 3,
        toneMappingExposure: 1.6,
        outputColorSpace: 'srgb',
        powerPreference: 'high-performance',
      }}
    >
      {/* Warm cream background */}
      <color attach="background" args={['#E8E2DA']} />

      <Suspense fallback={null}>
        <CameraRig scrollProgress={scrollProgress} scrollVelocity={scrollVelocity} />
        <Lighting isMobile={isMobile} />
        <StudioEnvironment isMobile={isMobile} />
        <CinemaCamera scrollProgress={scrollProgress} />
        <ShowreelScreen scrollProgress={scrollProgress} />
        <ProjectCards scrollProgress={scrollProgress} onProjectClick={onProjectClick} />

        {!isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.15}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
            <Vignette
              offset={0.3}
              darkness={0.25}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  )
}
