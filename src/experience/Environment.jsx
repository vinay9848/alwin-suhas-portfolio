import { Grid } from '@react-three/drei'

/**
 * Light studio environment — warm floor, subtle grid.
 */
export default function StudioEnvironment({ isMobile }) {
  return (
    <group>
      {/* Warm light floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} frustumCulled={false}>
        <planeGeometry args={[isMobile ? 30 : 50, isMobile ? 30 : 50]} />
        <meshStandardMaterial
          color="#D8D2C8"
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>

      {/* Subtle warm grid */}
      <Grid
        position={[0, 0, 0]}
        args={[isMobile ? 30 : 60, isMobile ? 30 : 60]}
        cellSize={1.5}
        cellThickness={0.3}
        cellColor="#C8C0B4"
        sectionSize={4.5}
        sectionThickness={0.6}
        sectionColor="#B8AFA2"
        fadeDistance={isMobile ? 12 : 20}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/* Warm fog */}
      <fog attach="fog" args={['#E8E2DA', isMobile ? 8 : 10, isMobile ? 25 : 35]} />
    </group>
  )
}
