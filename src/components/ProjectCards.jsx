import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { projects } from '../data/projects'
import { mapRange } from '../utils/helpers'

const _scaleVec = new THREE.Vector3()

/**
 * Project cards with richer gradients — visible on light background.
 */
export default function ProjectCards({ scrollProgress, onProjectClick }) {
  const groupRef = useRef()
  const cardsRef = useRef([])
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const textures = useMemo(() => {
    return projects.map((p) => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 288
      const ctx = canvas.getContext('2d')

      // Richer gradient
      const gradient = ctx.createLinearGradient(0, 0, 512, 288)
      gradient.addColorStop(0, p.gradient[0])
      gradient.addColorStop(1, p.gradient[1])
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 512, 288)

      // Light noise
      const imageData = ctx.getImageData(0, 0, 512, 288)
      for (let i = 0; i < imageData.data.length; i += 16) {
        const noise = (Math.random() - 0.5) * 10
        imageData.data[i] += noise
        imageData.data[i + 1] += noise
        imageData.data[i + 2] += noise
      }
      ctx.putImageData(imageData, 0, 0)

      // Dark overlay for text
      const overlay = ctx.createLinearGradient(0, 140, 0, 288)
      overlay.addColorStop(0, 'rgba(0,0,0,0)')
      overlay.addColorStop(1, 'rgba(0,0,0,0.55)')
      ctx.fillStyle = overlay
      ctx.fillRect(0, 0, 512, 288)

      // Project name
      ctx.font = '500 22px "Space Grotesk", sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.textAlign = 'left'
      ctx.fillText(p.name, 24, 258)

      ctx.font = '400 11px "JetBrains Mono", monospace'
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.fillText(`${p.type} · ${p.year}`, 24, 278)

      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      return tex
    })
  }, [])

  const cardPositions = useMemo(() => [
    { x: -1.2, y: 1.8, z: -1.0, ry: 0.12 },
    { x: 1.2, y: 1.8, z: -1.0, ry: -0.12 },
  ], [])

  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2A2A30',
    metalness: 0.6,
    roughness: 0.25,
    transparent: true,
    opacity: 0.7,
  }), [])

  useFrame((state) => {
    if (!groupRef.current) return
    const p = scrollProgress?.current ?? 0
    const time = state.clock.elapsedTime

    const fadeIn = Math.min(1, Math.max(0, (p - 0.35) * 5))
    const fadeOut = Math.min(1, Math.max(0, (0.72 - p) * 4))
    const vis = fadeIn * fadeOut

    groupRef.current.visible = vis > 0.01
    groupRef.current.position.x = mapRange(p, 0.35, 0.72, 1.5, -1.5)

    for (let i = 0; i < cardsRef.current.length; i++) {
      const card = cardsRef.current[i]
      if (!card) continue
      card.position.y = cardPositions[i].y + Math.sin(time * 0.4 + i * 1.2) * 0.03
      card.rotation.z = Math.sin(time * 0.3 + i * 0.8) * 0.005
      const s = hoveredIndex === i ? 1.06 : 1.0
      _scaleVec.set(s, s, s)
      card.scale.lerp(_scaleVec, 0.12)
    }
  })

  return (
    <group ref={groupRef} visible={false}>
      {projects.map((project, i) => {
        const pos = cardPositions[i]
        return (
          <group
            key={project.id}
            ref={(el) => { cardsRef.current[i] = el }}
            position={[pos.x, pos.y, pos.z]}
            rotation={[0, pos.ry, 0]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredIndex(i)
              document.querySelector('.cursor-ring')?.classList.add('hovering')
            }}
            onPointerOut={() => {
              setHoveredIndex(null)
              document.querySelector('.cursor-ring')?.classList.remove('hovering')
            }}
            onClick={(e) => {
              e.stopPropagation()
              onProjectClick?.(project)
            }}
          >
            <mesh>
              <planeGeometry args={[1.4, 0.8]} />
              <meshBasicMaterial map={textures[i]} />
            </mesh>
            <mesh material={frameMat} position={[0, 0, -0.008]}>
              <planeGeometry args={[1.46, 0.86]} />
            </mesh>
            <mesh position={[0, 0.41, 0.003]}>
              <planeGeometry args={[1.4, 0.003]} />
              <meshBasicMaterial
                color="#B07C4F"
                transparent
                opacity={hoveredIndex === i ? 0.8 : 0.3}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
