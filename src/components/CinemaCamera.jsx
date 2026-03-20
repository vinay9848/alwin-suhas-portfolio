import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mapRange, easeInOutCubic } from '../utils/helpers'

/**
 * Cinema camera on tripod — physically correct.
 * Tripod legs splay outward at proper angles.
 * Camera has weight — movements have inertia and settle.
 */
export default function CinemaCamera({ scrollProgress }) {
  const groupRef = useRef()
  const ledPulseRef = useRef(0)
  const currentRotation = useRef({ x: 0, y: 0, z: 0 })
  const currentPosition = useRef(new THREE.Vector3(0, 0, 0))
  const rotVelocity = useRef({ x: 0, y: 0, z: 0 })
  const posVelocity = useRef(new THREE.Vector3(0, 0, 0))

  const materials = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({
      color: '#2A2D35',
      metalness: 0.3,
      roughness: 0.55,
    }),
    carbon: new THREE.MeshStandardMaterial({
      color: '#1E2028',
      metalness: 0.4,
      roughness: 0.4,
    }),
    titanium: new THREE.MeshStandardMaterial({
      color: '#9DA3B0',
      metalness: 0.95,
      roughness: 0.08,
    }),
    darkAlloy: new THREE.MeshStandardMaterial({
      color: '#3D4450',
      metalness: 0.88,
      roughness: 0.18,
    }),
    chrome: new THREE.MeshStandardMaterial({
      color: '#C8CED8',
      metalness: 0.98,
      roughness: 0.03,
    }),
    led: new THREE.MeshStandardMaterial({
      color: '#6C7CFF',
      emissive: '#6C7CFF',
      emissiveIntensity: 2.0,
    }),
    redLed: new THREE.MeshStandardMaterial({
      color: '#FF3030',
      emissive: '#FF3030',
      emissiveIntensity: 2.5,
    }),
    lensGlass: new THREE.MeshPhysicalMaterial({
      color: '#080818',
      metalness: 0,
      roughness: 0,
      transmission: 0.85,
      thickness: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      ior: 1.8,
      envMapIntensity: 5,
    }),
    lensRing: new THREE.MeshStandardMaterial({
      color: '#2E323C',
      metalness: 0.92,
      roughness: 0.08,
    }),
    grip: new THREE.MeshStandardMaterial({
      color: '#151618',
      metalness: 0,
      roughness: 0.95,
    }),
    screen: new THREE.MeshStandardMaterial({
      color: '#080C14',
      emissive: '#1A2540',
      emissiveIntensity: 0.3,
    }),
  }), [])

  useFrame((state) => {
    if (!groupRef.current) return
    const p = scrollProgress?.current ?? 0
    const time = state.clock.elapsedTime

    // LED pulse
    ledPulseRef.current = Math.sin(time * 2) * 0.3 + 0.7
    materials.led.emissiveIntensity = 1.2 + ledPulseRef.current * 0.8
    // Red blink
    materials.redLed.emissiveIntensity = Math.sin(time * 1.2) > 0.3 ? 2.5 : 0.3

    // Storyboard transforms — with weight/inertia
    // Target rotation (reuse object, no alloc)
    let trx = 0, try_ = 0, trz = 0
    let tpx = 0, tpy = 0, tpz = 0

    if (p < 0.20) {
      try_ = Math.sin(time * 0.25) * 0.01
    } else if (p < 0.40) {
      const t = easeInOutCubic(mapRange(p, 0.20, 0.40, 0, 1))
      trx = t * -0.15; try_ = t * 0.4; trz = t * -0.08
      tpx = t * -0.3; tpz = t * 0.2
    } else if (p < 0.65) {
      const t = easeInOutCubic(mapRange(p, 0.40, 0.65, 0, 1))
      trx = -0.15 + t * -0.1; try_ = 0.4 + t * 0.8; trz = -0.08 + t * 0.05
      tpx = -0.3 + t * 0.5; tpy = t * -0.1; tpz = 0.2 + t * -0.1
    } else {
      const t = easeInOutCubic(mapRange(p, 0.65, 1.0, 0, 1))
      trx = (-0.25) * (1 - t); try_ = (1.2) * (1 - t); trz = (-0.03) * (1 - t)
      tpx = 0.2 * (1 - t); tpy = -0.1 * (1 - t); tpz = 0.1 * (1 - t)
    }

    // Spring physics — no allocations
    const stiff = 0.07
    const damp = 0.78
    const cr = currentRotation.current
    const rv = rotVelocity.current
    rv.x = (rv.x + (trx - cr.x) * stiff) * damp; cr.x += rv.x
    rv.y = (rv.y + (try_ - cr.y) * stiff) * damp; cr.y += rv.y
    rv.z = (rv.z + (trz - cr.z) * stiff) * damp; cr.z += rv.z

    const cp = currentPosition.current
    const pv = posVelocity.current
    pv.x = (pv.x + (tpx - cp.x) * stiff) * damp; cp.x += pv.x
    pv.y = (pv.y + (tpy - cp.y) * stiff) * damp; cp.y += pv.y
    pv.z = (pv.z + (tpz - cp.z) * stiff) * damp; cp.z += pv.z

    groupRef.current.rotation.set(currentRotation.current.x, currentRotation.current.y, currentRotation.current.z)
    groupRef.current.position.copy(currentPosition.current)
  })

  // Tripod leg geometry helpers
  const hubY = 1.15
  const footY = 0.0
  const footRadius = 0.42
  const legLength = Math.sqrt(footRadius * footRadius + (hubY - footY) * (hubY - footY))
  const tiltAngle = Math.atan2(footRadius, hubY - footY)

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.3}>
      {/* === CAMERA BODY === */}
      <group position={[0, 1.55, 0]}>
        {/* Main body */}
        <mesh material={materials.body} castShadow>
          <boxGeometry args={[1.2, 0.6, 0.8]} />
        </mesh>

        {/* Top panel */}
        <mesh material={materials.carbon} position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[1.18, 0.02, 0.78]} />
        </mesh>

        {/* Top handle */}
        <group position={[0, 0.48, 0]}>
          <mesh material={materials.titanium} castShadow>
            <boxGeometry args={[0.8, 0.04, 0.035]} />
          </mesh>
          <mesh material={materials.darkAlloy} position={[-0.36, -0.1, 0]} castShadow>
            <boxGeometry args={[0.025, 0.2, 0.035]} />
          </mesh>
          <mesh material={materials.darkAlloy} position={[0.36, -0.1, 0]} castShadow>
            <boxGeometry args={[0.025, 0.2, 0.035]} />
          </mesh>
          {/* Handle LED */}
          <mesh material={materials.led} position={[0, -0.005, 0.02]}>
            <boxGeometry args={[0.5, 0.006, 0.004]} />
          </mesh>
        </group>

        {/* === LENS === */}
        <group position={[0, 0, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={materials.lensRing} castShadow>
            <cylinderGeometry args={[0.22, 0.26, 0.5, 32]} />
          </mesh>
          <mesh material={materials.grip} position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.08, 32]} />
          </mesh>
          <mesh material={materials.titanium} position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.03, 32]} />
          </mesh>
          <mesh material={materials.lensGlass} position={[0, -0.26, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.015, 32]} />
          </mesh>
          <mesh material={materials.darkAlloy} position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.2, 0.28, 0.12, 4, 1, true]} />
          </mesh>
          {/* Lens LED ring */}
          <mesh material={materials.led} position={[0, -0.2, 0]}>
            <torusGeometry args={[0.24, 0.004, 8, 32]} />
          </mesh>
          <mesh material={materials.chrome} position={[0, 0.0, 0]}>
            <torusGeometry args={[0.26, 0.006, 8, 32]} />
          </mesh>
        </group>

        {/* Sensor module */}
        <mesh material={materials.carbon} position={[0, 0.42, -0.12]} castShadow>
          <boxGeometry args={[0.5, 0.28, 0.4]} />
        </mesh>

        {/* Side panels */}
        <mesh material={materials.carbon} position={[0.62, 0, 0]}>
          <boxGeometry args={[0.02, 0.48, 0.65]} />
        </mesh>
        <mesh material={materials.carbon} position={[-0.62, 0, 0]}>
          <boxGeometry args={[0.02, 0.48, 0.65]} />
        </mesh>

        {/* Side LED strips */}
        <mesh material={materials.led} position={[0.63, 0.12, 0]}>
          <boxGeometry args={[0.004, 0.004, 0.4]} />
        </mesh>
        <mesh material={materials.led} position={[-0.63, 0.12, 0]}>
          <boxGeometry args={[0.004, 0.004, 0.4]} />
        </mesh>

        {/* Grip */}
        <mesh material={materials.grip} position={[0.66, -0.05, 0.08]} castShadow>
          <boxGeometry args={[0.07, 0.4, 0.25]} />
        </mesh>

        {/* Viewfinder */}
        <group position={[-0.32, 0.32, -0.28]}>
          <mesh material={materials.darkAlloy} castShadow>
            <boxGeometry args={[0.16, 0.12, 0.25]} />
          </mesh>
          <mesh material={materials.grip} position={[-0.09, 0, -0.04]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.045, 0.05, 6]} />
          </mesh>
        </group>

        {/* Record button */}
        <mesh material={materials.redLed} position={[0.5, 0.22, 0.28]}>
          <sphereGeometry args={[0.02, 16, 16]} />
        </mesh>

        {/* Rear screen */}
        <mesh material={materials.screen} position={[0, 0, -0.41]}>
          <boxGeometry args={[0.5, 0.35, 0.015]} />
        </mesh>
        <mesh material={materials.darkAlloy} position={[0, 0, -0.42]}>
          <boxGeometry args={[0.55, 0.4, 0.008]} />
        </mesh>

        {/* Bottom plate */}
        <mesh material={materials.titanium} position={[0, -0.32, 0]}>
          <boxGeometry args={[0.9, 0.03, 0.6]} />
        </mesh>
      </group>

      {/* === TRIPOD — Physically correct === */}
      <group>
        {/* Fluid head */}
        <mesh material={materials.darkAlloy} position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.11, 0.1, 16]} />
        </mesh>

        {/* Center column */}
        <mesh material={materials.carbon} position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
        </mesh>

        {/* Spreader hub */}
        <mesh material={materials.titanium} position={[0, hubY, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 8]} />
        </mesh>

        {/* Legs — PROPERLY ANGLED outward from hub to feet */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => {
          const footX = Math.sin(angle) * footRadius
          const footZ = Math.cos(angle) * footRadius
          // Midpoint between hub center and foot
          const midX = footX * 0.5
          const midY = (hubY + footY) / 2
          const midZ = footZ * 0.5
          // Rotation to tilt leg outward
          const rotX = -tiltAngle * Math.cos(angle)
          const rotZ = tiltAngle * Math.sin(angle)

          return (
            <group key={i}>
              {/* Leg tube — angled from hub to foot */}
              <mesh
                material={materials.carbon}
                position={[midX, midY, midZ]}
                rotation={[rotX, 0, rotZ]}
                             >
                <cylinderGeometry args={[0.015, 0.015, legLength, 6]} />
              </mesh>
              {/* Rubber foot */}
              <mesh material={materials.grip} position={[footX, 0.015, footZ]}>
                <cylinderGeometry args={[0.025, 0.03, 0.03, 6]} />
              </mesh>
            </group>
          )
        })}
      </group>
    </group>
  )
}
