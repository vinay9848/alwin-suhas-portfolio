import * as THREE from 'three'

/** Linearly interpolate between a and b */
export function lerp(a, b, t) {
  return a + (b - a) * t
}

/** Clamp value between min and max */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

/** Map a value from one range to another */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return clamp(
    ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin,
    Math.min(outMin, outMax),
    Math.max(outMin, outMax),
  )
}

/** Ease-in-out cubic */
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/** Ease-out expo — dramatic deceleration */
export function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/** Ease-in-out quart — snappy with soft ends */
export function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
}

/** Spring interpolation — overshoot and settle */
export function springLerp(current, target, velocity, stiffness = 0.08, damping = 0.82) {
  const force = (target - current) * stiffness
  const newVelocity = (velocity + force) * damping
  return { value: current + newVelocity, velocity: newVelocity }
}

/** Create a gradient canvas texture for project placeholders */
export function createGradientTexture(color1, color2, width = 512, height = 288) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  // Add subtle noise
  const imageData = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 15
    imageData.data[i] += noise
    imageData.data[i + 1] += noise
    imageData.data[i + 2] += noise
  }
  ctx.putImageData(imageData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
