import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { projects } from '../data/projects'
import { mapRange } from '../utils/helpers'

const _scaleVec = new THREE.Vector3()

/**
 * Project cards using real thumbnail images.
 */
export default function ProjectCards({ scrollProgress, onProjectClick }) {
  const groupRef = useRef()
  const cardsRef = useRef([])
  const [hoveredIndex, setHoveredIndex] = useState(null)

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
        if (!pos) return null
        return (
          <ProjectCard
            key={project.id}
            project={project}
            position={[pos.x, pos.y, pos.z]}
            rotation={[0, pos.ry, 0]}
            index={i}
            isHovered={hoveredIndex === i}
            frameMat={frameMat}
            onRef={(el) => { cardsRef.current[i] = el }}
            onHover={() => {
              setHoveredIndex(i)
              document.querySelector('.cursor-ring')?.classList.add('hovering')
            }}
            onUnhover={() => {
              setHoveredIndex(null)
              document.querySelector('.cursor-ring')?.classList.remove('hovering')
            }}
            onClick={(e) => {
              e.stopPropagation()
              onProjectClick?.(project)
            }}
          />
        )
      })}
    </group>
  )
}

/** Individual card with real image texture */
function ProjectCard({ project, position, rotation, index, isHovered, frameMat, onRef, onHover, onUnhover, onClick }) {
  const imagePath = index === 0
    ? './assets/veera-dheera-sooran.avif'
    : './assets/kara.jpeg'

  const texture = useTexture(imagePath)

  // Add project label overlay via canvas
  const labelTex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 288
    const ctx = canvas.getContext('2d')

    // Transparent top, dark gradient at bottom for text
    ctx.clearRect(0, 0, 512, 288)
    const overlay = ctx.createLinearGradient(0, 160, 0, 288)
    overlay.addColorStop(0, 'rgba(0,0,0,0)')
    overlay.addColorStop(1, 'rgba(0,0,0,0.7)')
    ctx.fillStyle = overlay
    ctx.fillRect(0, 0, 512, 288)

    // Project name
    ctx.font = '600 22px "Space Grotesk", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.textAlign = 'left'
    ctx.fillText(project.name, 24, 255)

    // Type + year
    ctx.font = '400 11px "JetBrains Mono", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillText(`${project.type} · ${project.year}`, 24, 275)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [project])

  return (
    <group
      ref={onRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); onHover() }}
      onPointerOut={onUnhover}
      onClick={onClick}
    >
      {/* Real image */}
      <mesh>
        <planeGeometry args={[1.4, 0.8]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Label overlay */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[1.4, 0.8]} />
        <meshBasicMaterial map={labelTex} transparent />
      </mesh>

      {/* Frame */}
      <mesh material={frameMat} position={[0, 0, -0.008]}>
        <planeGeometry args={[1.46, 0.86]} />
      </mesh>

      {/* Copper accent top edge */}
      <mesh position={[0, 0.41, 0.003]}>
        <planeGeometry args={[1.4, 0.003]} />
        <meshBasicMaterial
          color="#B07C4F"
          transparent
          opacity={isHovered ? 0.8 : 0.3}
        />
      </mesh>
    </group>
  )
}
