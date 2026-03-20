import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Floating cinema screen playing "Final Out" short film.
 * Autoplays muted, with copper accent frame.
 */
export default function ShowreelScreen({ scrollProgress }) {
  const groupRef = useRef()
  const [videoReady, setVideoReady] = useState(false)

  // Create video element and texture
  const { video, videoTexture } = useMemo(() => {
    const vid = document.createElement('video')
    vid.src = './assets/final-out.mp4'
    vid.crossOrigin = 'anonymous'
    vid.loop = true
    vid.muted = true
    vid.playsInline = true
    vid.preload = 'auto'

    const tex = new THREE.VideoTexture(vid)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter

    return { video: vid, videoTexture: tex }
  }, [])

  // Fallback canvas texture for when video isn't loaded yet
  const fallbackTex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 288
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#1A1A22'
    ctx.fillRect(0, 0, 512, 288)

    // Play triangle
    ctx.beginPath()
    ctx.moveTo(240, 115)
    ctx.lineTo(240, 175)
    ctx.lineTo(280, 145)
    ctx.closePath()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(256, 144, 32, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.font = '500 10px "JetBrains Mono", monospace'
    ctx.fillStyle = 'rgba(176,124,79,0.8)'
    ctx.textAlign = 'center'
    ctx.fillText('FINAL OUT', 256, 100)

    ctx.font = '400 8px "Inter", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.fillText('Short Film by Alwin Suhas', 256, 200)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Try to play video when it can
  useEffect(() => {
    const handleCanPlay = () => {
      setVideoReady(true)
      video.play().catch(() => {})
    }
    video.addEventListener('canplay', handleCanPlay)
    // Also try loading
    video.load()
    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.pause()
    }
  }, [video])

  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2A2A32',
    metalness: 0.8,
    roughness: 0.15,
  }), [])

  const edgeGlowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#B07C4F',
    transparent: true,
    opacity: 0.5,
  }), [])

  useFrame((state) => {
    if (!groupRef.current) return
    const p = scrollProgress?.current ?? 0
    const time = state.clock.elapsedTime

    const fadeIn = Math.min(1, Math.max(0, (p - 0.15) * 6))
    const fadeOut = Math.min(1, Math.max(0, (0.50 - p) * 5))
    const vis = fadeIn * fadeOut

    groupRef.current.visible = vis > 0.01
    groupRef.current.scale.setScalar(0.85 + vis * 0.15)
    groupRef.current.position.y = 2.8 + Math.sin(time * 0.4) * 0.03

    // Play/pause based on visibility
    if (videoReady) {
      if (vis > 0.1 && video.paused) {
        video.play().catch(() => {})
      } else if (vis <= 0.1 && !video.paused) {
        video.pause()
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 2.8, -3]} visible={false}>
      {/* Video screen */}
      <mesh>
        <planeGeometry args={[4.0, 2.25]} />
        <meshBasicMaterial map={videoReady ? videoTexture : fallbackTex} />
      </mesh>

      {/* Frame backing */}
      <mesh material={frameMat} position={[0, 0, -0.03]}>
        <boxGeometry args={[4.15, 2.4, 0.05]} />
      </mesh>

      {/* Copper edge accents */}
      <mesh material={edgeGlowMat} position={[0, 1.13, 0.01]}>
        <planeGeometry args={[4.0, 0.006]} />
      </mesh>
      <mesh material={edgeGlowMat} position={[0, -1.13, 0.01]}>
        <planeGeometry args={[4.0, 0.006]} />
      </mesh>
      <mesh material={edgeGlowMat} position={[-2.0, 0, 0.01]}>
        <planeGeometry args={[0.006, 2.25]} />
      </mesh>
      <mesh material={edgeGlowMat} position={[2.0, 0, 0.01]}>
        <planeGeometry args={[0.006, 2.25]} />
      </mesh>

      {/* Stand */}
      <mesh material={frameMat} position={[0, -1.7, -0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
      </mesh>
      <mesh material={frameMat} position={[0, -2.25, -0.05]}>
        <cylinderGeometry args={[0.12, 0.12, 0.03, 8]} />
      </mesh>
    </group>
  )
}
