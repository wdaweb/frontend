import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { useThemeStore } from '@/stores/useThemeStore'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface ThreeNebulaEngineOptions {
  canvas: HTMLCanvasElement
  store: ReturnType<typeof useThemeStore>
  getIsMobile: () => boolean
  getPrefersReducedMotion: () => boolean
}

export class ThreeNebulaEngine {
  private canvas: HTMLCanvasElement
  private store: ReturnType<typeof useThemeStore>
  private getIsMobile: () => boolean
  private getPrefersReducedMotion: () => boolean

  private scene: THREE.Scene | null = null
  private camera: THREE.PerspectiveCamera | null = null
  private renderer: THREE.WebGLRenderer | null = null
  private clock: THREE.Clock | null = null

  private currentModeGroup: THREE.Group | null = null
  private currentUpdateFn: ((delta: number, elapsedTime: number) => void) | null = null

  private nebulaTexture: THREE.CanvasTexture | null = null
  private starTexture: THREE.CanvasTexture | null = null
  private starShaderMaterial: THREE.ShaderMaterial | null = null

  private scrollParallaxState = {
    progress: 0,
    parallaxY: 0
  }
  private parallaxTween: gsap.core.Tween | null = null
  private scrollTriggerInstance: ScrollTrigger | null = null

  private targetMouseX = 0
  private targetMouseY = 0
  private currentMouseX = 0
  private currentMouseY = 0

  constructor(options: ThreeNebulaEngineOptions) {
    this.canvas = options.canvas
    this.store = options.store
    this.getIsMobile = options.getIsMobile
    this.getPrefersReducedMotion = options.getPrefersReducedMotion
  }

  public init(): void {
    const width = window.innerWidth
    const height = window.innerHeight
    const dpr = this.getOptimalDpr()

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 120)
    this.camera.position.set(0, 0, 15)
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(dpr)

    this.clock = new THREE.Clock()

    this.initNebulaFlowScene()
    this.initScrollParallax()
  }

  public getOptimalDpr(): number {
    const rawDpr = window.devicePixelRatio || 1
    return this.getIsMobile() ? Math.min(rawDpr, 1.25) : Math.min(rawDpr, 2.0)
  }

  public handleMouseMove(e: MouseEvent): void {
    this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
    this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
  }

  public resize(width: number, height: number, dpr: number): void {
    if (this.renderer && this.camera) {
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height)
      this.renderer.setPixelRatio(dpr)
    }

    if (this.starShaderMaterial) {
      this.starShaderMaterial.uniforms.uPixelRatio.value = dpr
    }

    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.refresh()
    }
  }

  public refreshScrollTrigger(): void {
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.refresh()
    } else {
      ScrollTrigger.refresh()
    }
  }

  public setScrollParallaxEnabled(enabled: boolean): void {
    if (!enabled && this.currentModeGroup) {
      this.currentModeGroup.position.y = 0
    }
  }

  public resetClock(): void {
    if (this.clock) {
      this.clock.getDelta()
    }
  }

  public render(): void {
    if (!this.renderer || !this.scene || !this.camera || !this.clock) return

    const delta = this.clock.getDelta()
    const elapsedTime = this.clock.getElapsedTime()

    if (this.getPrefersReducedMotion()) {
      this.renderer.render(this.scene, this.camera)
      return
    }

    if (this.currentUpdateFn) {
      this.currentUpdateFn(delta, elapsedTime)
    }
    this.renderer.render(this.scene, this.camera)
  }

  private initScrollParallax(): void {
    if (typeof window === 'undefined') return
    if (this.getPrefersReducedMotion()) {
      this.scrollParallaxState.parallaxY = 0
      if (this.currentModeGroup) this.currentModeGroup.position.y = 0
      return
    }

    if (this.parallaxTween) {
      this.parallaxTween.kill()
      this.parallaxTween = null
    }
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill()
      this.scrollTriggerInstance = null
    }

    const maxParallaxY = this.getIsMobile() ? 4.5 : 7.5

    this.parallaxTween = gsap.to(this.scrollParallaxState, {
      parallaxY: maxParallaxY,
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          this.scrollParallaxState.progress = self.progress
        }
      }
    })

    if (this.parallaxTween.scrollTrigger) {
      this.scrollTriggerInstance = this.parallaxTween.scrollTrigger
    }
  }

  private getOrCreateNebulaTexture(): THREE.CanvasTexture {
    if (this.nebulaTexture) return this.nebulaTexture

    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    const center = size / 2

    const grad = ctx.createRadialGradient(center, center, 0, center, center, center)
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
    grad.addColorStop(0.20, 'rgba(255, 255, 255, 0.55)')
    grad.addColorStop(0.48, 'rgba(255, 255, 255, 0.18)')
    grad.addColorStop(0.78, 'rgba(255, 255, 255, 0.03)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)')

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(center, center, center, 0, Math.PI * 2)
    ctx.fill()

    const imgData = ctx.getImageData(0, 0, size, size)
    const data = imgData.data

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4
        const alpha = data[idx + 3]
        if (alpha > 5) {
          const nx = (x / size) * 8.0
          const ny = (y / size) * 8.0
          const noise = Math.sin(nx * 3.5 + Math.cos(ny * 2.5)) * Math.cos(ny * 4.0 - Math.sin(nx * 2.0))
          const modulation = 1.0 + noise * 0.18
          data[idx + 3] = Math.min(255, Math.max(0, alpha * modulation))
        }
      }
    }
    ctx.putImageData(imgData, 0, 0)

    this.nebulaTexture = new THREE.CanvasTexture(canvas)
    this.nebulaTexture.needsUpdate = true
    return this.nebulaTexture
  }

  private getOrCreateStarTexture(): THREE.CanvasTexture {
    if (this.starTexture) return this.starTexture

    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    const center = size / 2

    const outerGrad = ctx.createRadialGradient(center, center, 0, center, center, 14)
    outerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
    outerGrad.addColorStop(0.25, 'rgba(165, 243, 252, 0.65)')
    outerGrad.addColorStop(0.60, 'rgba(56, 189, 248, 0.20)')
    outerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = outerGrad
    ctx.beginPath()
    ctx.arc(center, center, 14, 0, Math.PI * 2)
    ctx.fill()

    ctx.save()
    ctx.translate(center, center)
    ctx.rotate(Math.PI / 4)
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.45)'
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(-10, 0)
    ctx.lineTo(10, 0)
    ctx.moveTo(0, -10)
    ctx.lineTo(0, 10)
    ctx.stroke()
    ctx.restore()

    const drawSpike = (angle: number) => {
      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(angle)

      ctx.beginPath()
      ctx.moveTo(0, -0.8)
      ctx.lineTo(24, 0)
      ctx.lineTo(0, 0.8)
      ctx.lineTo(-24, 0)
      ctx.closePath()

      const spikeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 24)
      spikeGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
      spikeGrad.addColorStop(0.35, 'rgba(224, 242, 254, 0.80)')
      spikeGrad.addColorStop(0.70, 'rgba(56, 189, 248, 0.25)')
      spikeGrad.addColorStop(1, 'rgba(6, 182, 212, 0)')
      ctx.fillStyle = spikeGrad
      ctx.fill()
      ctx.restore()
    }

    drawSpike(0)
    drawSpike(Math.PI / 2)

    const coreGrad = ctx.createRadialGradient(center, center, 0, center, center, 3)
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
    coreGrad.addColorStop(0.70, 'rgba(255, 255, 255, 0.95)')
    coreGrad.addColorStop(1, 'rgba(224, 242, 254, 0)')

    ctx.fillStyle = coreGrad
    ctx.beginPath()
    ctx.arc(center, center, 3, 0, Math.PI * 2)
    ctx.fill()

    this.starTexture = new THREE.CanvasTexture(canvas)
    this.starTexture.needsUpdate = true
    return this.starTexture
  }

  private disposeObject(obj: THREE.Object3D): void {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Sprite) {
        if (child.geometry) {
          child.geometry.dispose()
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose())
          } else {
            child.material.dispose()
          }
        }
      }
    })
  }

  private clearCurrentScene(): void {
    if (this.currentModeGroup && this.scene) {
      this.scene.remove(this.currentModeGroup)
      this.disposeObject(this.currentModeGroup)
      this.currentModeGroup = null
    }
    this.starShaderMaterial = null
    this.currentUpdateFn = null
  }

  private initNebulaFlowScene(): void {
    if (!this.scene) return
    this.clearCurrentScene()

    const group = new THREE.Group()
    const nTex = this.getOrCreateNebulaTexture()
    const sTex = this.getOrCreateStarTexture()
    const isMobile = this.getIsMobile()

    const nebulaConfigs = [
      {
        color: new THREE.Color('#06b6d4'),
        baseX: -14,
        baseY: 7,
        baseZ: -18,
        scale: 58,
        driftRadiusX: 16.0,
        driftRadiusY: 10.0,
        driftRadiusZ: 6.5,
        speed: 0.28,
        phase: 0.0,
        baseOpacity: 0.20,
        pulseSpeed: 0.45,
        parallaxWeight: 1.1
      },
      {
        color: new THREE.Color('#3b82f6'),
        baseX: 16,
        baseY: -7,
        baseZ: -26,
        scale: 66,
        driftRadiusX: 18.5,
        driftRadiusY: 11.5,
        driftRadiusZ: 8.0,
        speed: 0.24,
        phase: 1.25,
        baseOpacity: 0.22,
        pulseSpeed: 0.38,
        parallaxWeight: 0.7
      },
      {
        color: new THREE.Color('#8b5cf6'),
        baseX: 8,
        baseY: 10,
        baseZ: -14,
        scale: 52,
        driftRadiusX: 14.5,
        driftRadiusY: 9.0,
        driftRadiusZ: 6.0,
        speed: 0.32,
        phase: 2.50,
        baseOpacity: 0.18,
        pulseSpeed: 0.50,
        parallaxWeight: 1.3
      },
      {
        color: new THREE.Color('#0284c7'),
        baseX: -12,
        baseY: -10,
        baseZ: -32,
        scale: 70,
        driftRadiusX: 20.0,
        driftRadiusY: 12.0,
        driftRadiusZ: 9.0,
        speed: 0.22,
        phase: 3.75,
        baseOpacity: 0.19,
        pulseSpeed: 0.35,
        parallaxWeight: 0.5
      },
      {
        color: new THREE.Color('#a855f7'),
        baseX: 0,
        baseY: 2,
        baseZ: -9,
        scale: 46,
        driftRadiusX: 13.0,
        driftRadiusY: 8.0,
        driftRadiusZ: 5.0,
        speed: 0.35,
        phase: 5.0,
        baseOpacity: 0.16,
        pulseSpeed: 0.55,
        parallaxWeight: 1.6
      }
    ]

    interface NebulaSpriteRuntime {
      sprite: THREE.Sprite
      material: THREE.SpriteMaterial
      config: typeof nebulaConfigs[0]
    }
    const spritesRuntime: NebulaSpriteRuntime[] = []

    nebulaConfigs.forEach((cfg) => {
      const mat = new THREE.SpriteMaterial({
        map: nTex,
        color: cfg.color,
        transparent: true,
        opacity: cfg.baseOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
      const sprite = new THREE.Sprite(mat)
      sprite.scale.set(cfg.scale, cfg.scale, 1)
      sprite.position.set(cfg.baseX, cfg.baseY, cfg.baseZ)
      group.add(sprite)

      spritesRuntime.push({ sprite, material: mat, config: cfg })
    })

    const winW = typeof window !== 'undefined' ? window.innerWidth : 1920
    const winH = typeof window !== 'undefined' ? window.innerHeight : 1080
    const aspect = winW / Math.max(winH, 1)
    const tanHalfFov = Math.tan((55 * Math.PI) / 360)

    const starCount = isMobile ? 680 : 1880
    const tier1Count = isMobile ? 38 : 96
    const tier2Count = isMobile ? 192 : 524
    const tier1End = tier1Count
    const tier2End = tier1Count + tier2Count

    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    const starScales = new Float32Array(starCount)
    const starBaseBrightness = new Float32Array(starCount)
    const starPhases = new Float32Array(starCount)
    const starSpeeds = new Float32Array(starCount)
    const starTwinkleStrengths = new Float32Array(starCount)
    const starParallaxes = new Float32Array(starCount)

    const colorBrightWhite = new THREE.Color('#ffffff')
    const colorCyan = new THREE.Color('#a5f3fc')
    const colorPurple = new THREE.Color('#f3e8ff')

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      let z = 0

      if (i < tier1End) {
        z = -12 - Math.random() * 16
      } else if (i < tier2End) {
        z = -18 - Math.random() * 32
      } else {
        z = -22 - Math.random() * 58
      }

      const dist = 15 - z
      const frustumHalfH = dist * tanHalfFov
      const frustumHalfW = frustumHalfH * aspect
      const boundHalfW = frustumHalfW * 1.08
      const boundHalfH = frustumHalfH * 1.08

      let x = 0
      let y = 0
      let scale = 1.0
      let baseBrightness = 0.7
      let speed = 1.0
      let twinkleStrength = 0.5
      let parallax = 0.35
      let c = colorBrightWhite

      if (i < tier1End) {
        const isArmBeacon = i < Math.round(tier1Count * 0.65)
        if (isArmBeacon) {
          const norm = (Math.random() - 0.5) * 2
          x = norm * boundHalfW * 0.88 + (Math.random() - 0.5) * (boundHalfW * 0.12)
          y = norm * (boundHalfH * 0.52) + Math.sin(norm * Math.PI) * (boundHalfH * 0.14) + (Math.random() - 0.5) * (boundHalfH * 0.16)
        } else {
          x = (Math.random() - 0.5) * 2 * boundHalfW * 0.92
          y = (Math.random() - 0.5) * 2 * boundHalfH * 0.92
        }

        scale = 1.15 + Math.random() * 0.45
        baseBrightness = 1.15 + Math.random() * 0.35
        speed = 1.2 + Math.random() * 1.6
        twinkleStrength = 0.75 + Math.random() * 0.35
        parallax = 0.45 + Math.random() * 0.35
        c = Math.random() < 0.75 ? colorBrightWhite : colorCyan
      } else if (i < tier2End) {
        const norm = (Math.random() - 0.5) * 2
        x = norm * boundHalfW * 1.02
        const armCurve = norm * (boundHalfH * 0.50) + Math.sin(norm * Math.PI * 1.1) * (boundHalfH * 0.15)
        const spread = (Math.random() - 0.5) * (boundHalfH * 0.35)
        y = armCurve + spread

        scale = 0.55 + Math.random() * 0.32
        baseBrightness = 0.82 + Math.random() * 0.32
        speed = 0.7 + Math.random() * 1.3
        twinkleStrength = 0.52 + Math.random() * 0.35
        parallax = 0.22 + Math.random() * 0.22

        const rndColor = Math.random()
        if (rndColor < 0.58) c = colorBrightWhite
        else if (rndColor < 0.85) c = colorCyan
        else c = colorPurple
      } else {
        x = (Math.random() - 0.5) * 2 * boundHalfW
        y = (Math.random() - 0.5) * 2 * boundHalfH

        scale = 0.32 + Math.random() * 0.26
        baseBrightness = 0.62 + Math.random() * 0.32
        speed = 0.40 + Math.random() * 0.80
        twinkleStrength = 0.35 + Math.random() * 0.30
        parallax = 0.08 + Math.random() * 0.12

        c = Math.random() < 0.80 ? colorBrightWhite : colorCyan
      }

      starPositions[i3] = x
      starPositions[i3 + 1] = y
      starPositions[i3 + 2] = z

      starColors[i3] = c.r
      starColors[i3 + 1] = c.g
      starColors[i3 + 2] = c.b

      starScales[i] = scale
      starBaseBrightness[i] = baseBrightness
      starPhases[i] = Math.random() * Math.PI * 2
      starSpeeds[i] = speed
      starTwinkleStrengths[i] = twinkleStrength
      starParallaxes[i] = parallax
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3))
    starGeometry.setAttribute('aScale', new THREE.BufferAttribute(starScales, 1))
    starGeometry.setAttribute('aBaseBrightness', new THREE.BufferAttribute(starBaseBrightness, 1))
    starGeometry.setAttribute('aPhase', new THREE.BufferAttribute(starPhases, 1))
    starGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(starSpeeds, 1))
    starGeometry.setAttribute('aTwinkleStrength', new THREE.BufferAttribute(starTwinkleStrengths, 1))
    starGeometry.setAttribute('aParallax', new THREE.BufferAttribute(starParallaxes, 1))

    this.starShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uTexture: { value: sTex },
        uMouseParallax: { value: this.store.nebulaFeatures.mouseParallax ? 1.0 : 0.0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPixelRatio;
        uniform float uMouseParallax;

        attribute vec3 aColor;
        attribute float aScale;
        attribute float aBaseBrightness;
        attribute float aPhase;
        attribute float aSpeed;
        attribute float aTwinkleStrength;
        attribute float aParallax;

        varying vec3 vColor;
        varying float vBrightness;

        void main() {
          vColor = aColor;

          vec3 pos = position;
          pos.x += uMouse.x * aParallax * 1.5 * uMouseParallax;
          pos.y += -uMouse.y * aParallax * 1.0 * uMouseParallax;

          float wave1 = sin(uTime * aSpeed + aPhase);
          float wave2 = cos(uTime * aSpeed * 0.618 + aPhase * 1.414);
          float wave3 = sin(uTime * aSpeed * 1.732 + aPhase * 2.236);
          float rawTwinkle = wave1 * 0.55 + wave2 * 0.30 + wave3 * 0.15;
          float peakedTwinkle = sign(rawTwinkle) * pow(abs(rawTwinkle), 1.35);

          float brightness = clamp(aBaseBrightness + peakedTwinkle * aTwinkleStrength, 0.18, 1.60);
          vBrightness = brightness;

          float dynamicScale = aScale * (0.75 + brightness * 0.42);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float dist = max(-mvPosition.z, 1.0);
          gl_PointSize = clamp(dynamicScale * (230.0 / dist) * uPixelRatio, 1.8 * uPixelRatio, 26.0 * uPixelRatio);

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;

        varying vec3 vColor;
        varying float vBrightness;

        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);

          vec3 rgb = vColor * tex.rgb * vBrightness;

          if (vBrightness > 1.0) {
            float excess = vBrightness - 1.0;
            rgb += vec3(excess * 0.90);
          }

          float alpha = tex.a * clamp(vBrightness * 0.85 + 0.28, 0.28, 1.0);

          gl_FragColor = vec4(rgb, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const starPoints = new THREE.Points(starGeometry, this.starShaderMaterial)
    group.add(starPoints)

    this.scene.add(group)
    this.currentModeGroup = group

    this.currentUpdateFn = (_delta: number, elapsedTime: number) => {
      this.currentMouseX += (this.targetMouseX - this.currentMouseX) * 0.04
      this.currentMouseY += (this.targetMouseY - this.currentMouseY) * 0.04

      spritesRuntime.forEach(({ sprite, material, config }) => {
        const t = elapsedTime * config.speed + config.phase

        const driftX = config.baseX + Math.cos(t) * config.driftRadiusX
        const driftY = config.baseY + Math.sin(t * 0.85) * config.driftRadiusY
        const driftZ = config.baseZ + Math.sin(t * 0.6) * config.driftRadiusZ

        const pX = this.store.nebulaFeatures.mouseParallax ? this.currentMouseX * config.parallaxWeight * 2.8 : 0
        const pY = this.store.nebulaFeatures.mouseParallax ? -this.currentMouseY * config.parallaxWeight * 2.0 : 0

        sprite.position.x = driftX + pX
        sprite.position.y = driftY + pY
        sprite.position.z = driftZ

        material.rotation = Math.sin(t * 0.3) * 0.2 + elapsedTime * (config.speed * 0.08)

        const pulsePhase = this.store.nebulaFeatures.entangledPulse ? config.phase : 0
        const dynamicScale = config.scale * (1 + Math.sin(elapsedTime * config.pulseSpeed + pulsePhase) * 0.12)
        sprite.scale.set(dynamicScale, dynamicScale, 1)

        material.opacity = config.baseOpacity + Math.sin(elapsedTime * config.pulseSpeed + pulsePhase) * 0.025
      })

      if (this.starShaderMaterial) {
        this.starShaderMaterial.uniforms.uTime.value = elapsedTime
        this.starShaderMaterial.uniforms.uMouse.value.set(this.currentMouseX, this.currentMouseY)
        this.starShaderMaterial.uniforms.uMouseParallax.value = this.store.nebulaFeatures.mouseParallax ? 1.0 : 0.0
      }

      if (this.currentModeGroup) {
        if (this.store.nebulaFeatures.scrollParallax && !this.getPrefersReducedMotion()) {
          this.currentModeGroup.position.y = this.scrollParallaxState.parallaxY
        } else {
          this.currentModeGroup.position.y = 0
        }
      }
    }
  }

  public dispose(): void {
    if (this.parallaxTween) {
      this.parallaxTween.kill()
      this.parallaxTween = null
    }
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill()
      this.scrollTriggerInstance = null
    }

    this.clearCurrentScene()

    if (this.nebulaTexture) {
      this.nebulaTexture.dispose()
      this.nebulaTexture = null
    }
    if (this.starTexture) {
      this.starTexture.dispose()
      this.starTexture = null
    }

    if (this.renderer) {
      this.renderer.dispose()
      this.renderer = null
    }

    this.scene = null
    this.camera = null
    this.clock = null
  }
}
