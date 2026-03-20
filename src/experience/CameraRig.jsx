import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { lerp, mapRange, easeInOutQuart } from '../utils/helpers'

// Pre-allocated temp vectors — ZERO allocations in the render loop
const _tmpVec = new THREE.Vector3()

/**
 * Cinematic camera choreography — spring physics, no GC pressure.
 */
export default function CameraRig({ scrollProgress, scrollVelocity }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(1.8, 1.2, 4.5))
  const targetLookAt = useRef(new THREE.Vector3(0, 1.3, 0))
  const currentPos = useRef(new THREE.Vector3(1.8, 1.2, 4.5))
  const currentLookAt = useRef(new THREE.Vector3(0, 1.3, 0))
  const posVel = useRef(new THREE.Vector3())
  const lookVel = useRef(new THREE.Vector3())

  useFrame((state) => {
    const p = scrollProgress?.current ?? 0
    const v = scrollVelocity?.current ?? 0
    const time = state.clock.elapsedTime

    const breatheScale = Math.max(0.1, 1 - Math.abs(v) * 30)
    const bx = Math.sin(time * 0.3) * 0.02 * breatheScale
    const by = Math.sin(time * 0.5) * 0.015 * breatheScale

    if (p < 0.20) {
      const orbitAngle = time * 0.08 + mapRange(p, 0, 0.20, 0, 1) * 0.3
      targetPos.current.set(1.8 + Math.sin(orbitAngle) * 0.3 + bx, 1.2 + by, 4.5 + Math.cos(orbitAngle) * 0.2)
      targetLookAt.current.set(0, 1.4, 0)
    } else if (p < 0.40) {
      const t = easeInOutQuart(mapRange(p, 0.20, 0.40, 0, 1))
      targetPos.current.set(lerp(1.8, 0.0, t) + bx, lerp(1.2, 3.0, t) + by, lerp(4.5, 7.0, t))
      targetLookAt.current.set(0, lerp(1.4, 1.8, t), lerp(0, -2, t))
    } else if (p < 0.65) {
      const t = easeInOutQuart(mapRange(p, 0.40, 0.65, 0, 1))
      const a = lerp(0, Math.PI * 0.6, t)
      const r = lerp(7.0, 5.5, t)
      targetPos.current.set(Math.sin(a) * r + bx, lerp(3.0, 2.2, t) + by, Math.cos(a) * r)
      targetLookAt.current.set(lerp(0, 1.0, t), lerp(1.8, 1.0, t), lerp(-2, -1, t))
    } else if (p < 0.80) {
      const t = easeInOutQuart(mapRange(p, 0.65, 0.80, 0, 1))
      const pa = Math.PI * 0.6
      targetPos.current.set(lerp(Math.sin(pa) * 5.5, 3.0, t) + bx, lerp(2.2, 2.0, t) + by, lerp(Math.cos(pa) * 5.5, 4.5, t))
      targetLookAt.current.set(lerp(1.0, 0, t), lerp(1.0, 1.3, t), lerp(-1, 0, t))
    } else {
      const t = easeInOutQuart(mapRange(p, 0.80, 1.0, 0, 1))
      targetPos.current.set(lerp(3.0, 1.5, t) + bx, lerp(2.0, 1.6, t) + by, lerp(4.5, 3.8, t))
      targetLookAt.current.set(0, lerp(1.3, 1.4, t), 0)
    }

    // Spring interpolation — reuse _tmpVec, zero allocs
    const stiff = 0.08
    const damp = 0.78

    _tmpVec.subVectors(targetPos.current, currentPos.current).multiplyScalar(stiff)
    posVel.current.add(_tmpVec).multiplyScalar(damp)
    currentPos.current.add(posVel.current)

    _tmpVec.subVectors(targetLookAt.current, currentLookAt.current).multiplyScalar(stiff)
    lookVel.current.add(_tmpVec).multiplyScalar(damp)
    currentLookAt.current.add(lookVel.current)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
