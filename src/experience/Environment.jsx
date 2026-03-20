import { Grid } from '@react-three/drei'

/**
 * Studio environment. Mobile gets smaller grid, closer fog.
 */
export default function StudioEnvironment({ isMobile }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} frustumCulled={false}>
        <planeGeometry args={[isMobile ? 30 : 50, isMobile ? 30 : 50]} />
        <meshStandardMaterial
          color="#0A0B10"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <Grid
        position={[0, 0, 0]}
        args={[isMobile ? 30 : 60, isMobile ? 30 : 60]}
        cellSize={1.5}
        cellThickness={0.4}
        cellColor="#1A1A30"
        sectionSize={4.5}
        sectionThickness={0.8}
        sectionColor="#252545"
        fadeDistance={isMobile ? 12 : 20}
        fadeStrength={1.5}
        infiniteGrid
      />

      <fog attach="fog" args={['#08090C', isMobile ? 8 : 10, isMobile ? 25 : 35]} />
    </group>
  )
}
