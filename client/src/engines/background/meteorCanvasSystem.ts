import type { useThemeStore } from '@/stores/useThemeStore'

// ===========================================================================
// 🌠 Awwwards 級 360° 天球仰望偶發流星物理系統 (Celestial Sporadic Meteor Engine)
// ===========================================================================
export interface MeteorSpark {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  decay: number
  size: number
  color: string
}

export interface MeteorAfterglowSegment {
  x: number
  y: number
  width: number
  alpha: number
  decay: number
  color: string
}

export interface CelestialMeteor {
  x: number
  y: number
  startX: number
  startY: number
  prevX: number
  prevY: number
  angle: number
  speed: number
  length: number
  currentLength: number
  colorScheme: {
    core: string
    glow: string
    outer: string
    accent: string
  }
  isFireball: boolean
  isCodeMeteor: boolean
  isWelcome?: boolean
  hasExploded: boolean
  flareAlpha: number
  flareRadius: number
  age: number
  duration: number
  dead: boolean
}

// ===========================================================================
// 👾 幽靈代碼流星彩蛋 (Cyber Matrix Code-Meteor)
// ===========================================================================
export interface CodeDust {
  x: number
  y: number
  vx: number
  vy: number
  text: string
  alpha: number
  decay: number
  color: string
  size: number
}

export interface CodeSymbolItem {
  text: string
  color: string
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'milestone'
}

export const CODE_SYMBOLS: CodeSymbolItem[] = [
  // 💻 前端網頁技術 (Frontend)
  { text: '<Vue/>', color: '#4ade80', category: 'frontend' },
  { text: 'JavaScript', color: '#facc15', category: 'frontend' },
  { text: 'HTML5', color: '#fb923c', category: 'frontend' },
  { text: 'CSS3', color: '#38bdf8', category: 'frontend' },
  { text: 'Pinia', color: '#fde047', category: 'frontend' },
  { text: 'Bootstrap', color: '#c084fc', category: 'frontend' },

  // ⚙️ 後端開發與執行環境 (Backend)
  { text: 'Node.js', color: '#22c55e', category: 'backend' },
  { text: 'Express', color: '#94a3b8', category: 'backend' },
  { text: 'REST API', color: '#38bdf8', category: 'backend' },
  { text: 'Axios', color: '#818cf8', category: 'backend' },
  { text: 'NPM', color: '#f87171', category: 'backend' },

  // 🗄️ 資料庫 (Database - 專屬 MongoDB NoSQL)
  { text: 'MongoDB', color: '#10b981', category: 'database' },
  { text: 'NoSQL', color: '#34d399', category: 'database' },
  { text: 'JSON', color: '#fbbf24', category: 'database' },
  { text: 'CRUD', color: '#2dd4bf', category: 'database' },

  // 🧠 AI 與智慧應用 (AI)
  { text: 'AI', color: '#f472b6', category: 'ai' },
  { text: 'GenAI', color: '#fb7185', category: 'ai' },
  { text: 'Prompt', color: '#22d3ee', category: 'ai' },
  { text: 'Agent', color: '#e879f9', category: 'ai' },

  // 🏅 職訓精神里程碑
  { text: '920h', color: '#ffffff', category: 'milestone' }
]

// ===========================================================================
// 🧠 宇宙深空量子思維漣漪 (Quantum Mind Waves) - 純光環擴散，無任何直線連線
// ===========================================================================
export interface NeuralFlashWave {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
  decay: number
  speed: number
  color: string
  hasSecondaryRing: boolean
}

export const METEOR_PALETTES = [
  {
    name: 'cyan_plasma',
    core: '#ffffff',
    glow: 'rgba(34, 211, 238, 0.95)',
    outer: 'rgba(59, 130, 246, 0.40)',
    accent: '#22d3ee'
  },
  {
    name: 'violet_aurora',
    core: '#ffffff',
    glow: 'rgba(192, 132, 252, 0.95)',
    outer: 'rgba(147, 51, 234, 0.35)',
    accent: '#c084fc'
  },
  {
    name: 'bolide_gold',
    core: '#ffffff',
    glow: 'rgba(253, 224, 71, 0.95)',
    outer: 'rgba(249, 115, 22, 0.40)',
    accent: '#fde047'
  },
  {
    name: 'diamond_white',
    core: '#ffffff',
    glow: 'rgba(224, 242, 254, 0.90)',
    outer: 'rgba(56, 189, 248, 0.30)',
    accent: '#e0f2fe'
  },
  {
    name: 'cyber_matrix',
    core: '#ffffff',
    glow: 'rgba(52, 211, 153, 0.95)',
    outer: 'rgba(6, 182, 212, 0.40)',
    accent: '#34d399'
  }
]

/**
 * ⚡ 高效能粒子無痛移除輔助函式 (O(1) Swap-and-Pop)
 * 避免 Array.prototype.splice 引發的記憶體搬移與 GC 停頓
 */
function fastRemove<T>(arr: T[], index: number): void {
  const last = arr.pop()!
  if (index < arr.length) {
    arr[index] = last
  }
}

export interface MeteorCanvasSystemOptions {
  canvas: HTMLCanvasElement
  store: ReturnType<typeof useThemeStore>
  getIsMobile: () => boolean
}

export class MeteorCanvasSystem {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null = null
  private store: ReturnType<typeof useThemeStore>
  private getIsMobile: () => boolean

  private activeMeteors: CelestialMeteor[] = []
  private activeSparks: MeteorSpark[] = []
  private activeAfterglows: MeteorAfterglowSegment[] = []
  private activeCodeDusts: CodeDust[] = []
  private activeFlashWaves: NeuralFlashWave[] = []

  private nextAutonomousFlashCountdown = 3.6
  private lastManualPulseCount = 0

  private nextMeteorCountdown = 2.2
  private hasSpawnedWelcomeMeteor = false
  private lastMeteorTriggerCount = 0
  private lastMeteorCodeTriggerCount = 0

  constructor(options: MeteorCanvasSystemOptions) {
    this.canvas = options.canvas
    this.store = options.store
    this.getIsMobile = options.getIsMobile
    this.ctx = this.canvas.getContext('2d')
  }

  public resize(width: number, height: number, dpr: number): void {
    this.canvas.width = Math.round(width * dpr)
    this.canvas.height = Math.round(height * dpr)
  }

  public spawnMeteor(forceFireball = false, forceCode = false, isWelcome = false): void {
    const w = window.innerWidth
    const h = window.innerHeight
    const isMobile = this.getIsMobile()

    let startX = 0
    let startY = 0
    let angle = 0
    let customTravelDistance = 0
    let customSpeed = 0
    let customLength = 0

    if (isWelcome && isMobile) {
      // 📱【手機版首發流星 - 驚艷核心聚焦算法】
      const targetX = w * (0.48 + (Math.random() - 0.5) * 0.08)
      const targetY = h * (0.38 + (Math.random() - 0.5) * 0.06)

      const fromLeft = Math.random() < 0.65
      angle = fromLeft
        ? Math.PI * 0.22 + (Math.random() - 0.5) * 0.06
        : Math.PI * 0.78 + (Math.random() - 0.5) * 0.06

      const backDist = Math.min(w * 0.65, 260)
      startX = targetX - Math.cos(angle) * backDist
      startY = targetY - Math.sin(angle) * backDist

      customTravelDistance = backDist * 2.25
      customSpeed = 720 + Math.random() * 100
      customLength = 210 + Math.random() * 35
    } else {
      // 🖥️ 大螢幕首發流星與常規偶發流星
      const dirMode = this.store.meteorConfig.direction

      if (dirMode === 'radiant') {
        startX = w * 0.5 + (Math.random() - 0.5) * (w * 0.2)
        startY = h * 0.4 + (Math.random() - 0.5) * (h * 0.2)
        angle = Math.random() * Math.PI * 2
      } else if (dirMode === 'diagonal') {
        startX = Math.random() * w * 0.75 + w * 0.15
        startY = -35
        angle = Math.PI * 0.75 + (Math.random() - 0.5) * 0.35
      } else {
        if (isMobile) {
          const side = Math.random()
          if (side < 0.45) {
            startX = w * 0.15 + Math.random() * w * 0.70
            startY = -30
            angle = Math.PI * 0.25 + (Math.random() - 0.5) * 0.40
          } else if (side < 0.75) {
            startX = -25
            startY = h * 0.15 + Math.random() * h * 0.45
            angle = (Math.random() - 0.25) * (Math.PI * 0.40)
          } else {
            startX = w + 25
            startY = h * 0.15 + Math.random() * h * 0.45
            angle = Math.PI - (Math.random() - 0.25) * (Math.PI * 0.40)
          }
        } else {
          const side = Math.random()
          if (side < 0.35) {
            startX = Math.random() * w
            startY = -30
            angle = Math.PI * 0.25 + Math.random() * Math.PI * 0.50
          } else if (side < 0.60) {
            startX = Math.random() * w
            startY = h + 30
            angle = Math.PI * 1.25 + Math.random() * Math.PI * 0.50
          } else if (side < 0.80) {
            startX = -30
            startY = Math.random() * h
            angle = (Math.random() - 0.5) * (Math.PI * 0.60)
          } else if (side < 0.95) {
            startX = w + 30
            startY = Math.random() * h
            angle = Math.PI + (Math.random() - 0.5) * (Math.PI * 0.60)
          } else {
            startX = w * 0.3 + Math.random() * w * 0.4
            startY = h * 0.3 + Math.random() * h * 0.4
            angle = Math.random() * Math.PI * 2
          }
        }
      }
    }

    const isFireball = !forceCode && (forceFireball || this.store.meteorConfig.mode === 'fireball' || Math.random() < this.store.meteorConfig.fireballChance)
    const isCodeMeteor = forceCode || (!isFireball && Math.random() < this.store.meteorConfig.codeMeteorChance)

    let palette = METEOR_PALETTES[Math.floor(Math.random() * 4)]
    if (isFireball) {
      palette = METEOR_PALETTES[2] // bolide_gold
    } else if (isCodeMeteor) {
      palette = METEOR_PALETTES[4] // cyber_matrix
    }

    const speed = customSpeed > 0 ? customSpeed : (isFireball
      ? 850 + Math.random() * 450
      : isCodeMeteor
        ? 1250 + Math.random() * 450
        : 1200 + Math.random() * 600)

    const length = customLength > 0 ? customLength : (isFireball
      ? 240 + Math.random() * 200
      : isCodeMeteor
        ? 200 + Math.random() * 120
        : 140 + Math.random() * 120)

    const travelDistance = customTravelDistance > 0
      ? customTravelDistance
      : Math.sqrt(w * w + h * h) * (0.42 + Math.random() * 0.35)

    const duration = travelDistance / speed

    const meteor: CelestialMeteor = {
      x: startX,
      y: startY,
      startX,
      startY,
      prevX: startX,
      prevY: startY,
      angle,
      speed,
      length,
      currentLength: 0,
      colorScheme: palette,
      isFireball,
      isCodeMeteor,
      isWelcome,
      hasExploded: false,
      flareAlpha: 0,
      flareRadius: 0,
      age: 0,
      duration: Math.max(0.55, Math.min(1.4, duration)),
      dead: false
    }

    this.activeMeteors.push(meteor)
  }

  public triggerAutonomousFlash(w: number, h: number): void {
    const randTier = Math.random()
    let targetMaxRadius: number
    let speed: number
    let decay: number
    let hasSecondaryRing = false

    const minDim = Math.min(w, h)

    if (randTier < 0.35) {
      targetMaxRadius = Math.max(300, minDim * (0.32 + Math.random() * 0.15))
      speed = 190 + Math.random() * 60
      decay = 0.45 + Math.random() * 0.10
      hasSecondaryRing = false
    } else if (randTier < 0.80) {
      targetMaxRadius = Math.max(520, minDim * (0.55 + Math.random() * 0.22))
      speed = 260 + Math.random() * 80
      decay = 0.32 + Math.random() * 0.08
      hasSecondaryRing = Math.random() < 0.65
    } else {
      targetMaxRadius = Math.max(850, minDim * (0.85 + Math.random() * 0.35))
      speed = 340 + Math.random() * 90
      decay = 0.26 + Math.random() * 0.06
      hasSecondaryRing = true
    }

    const color = Math.random() < 0.85 ? '#22d3ee' : '#38bdf8'

    this.activeFlashWaves.push({
      x: w * 0.15 + Math.random() * w * 0.70,
      y: h * 0.15 + Math.random() * h * 0.70,
      radius: 10,
      maxRadius: targetMaxRadius,
      alpha: 0.90,
      decay,
      speed,
      color,
      hasSecondaryRing
    })
  }

  public renderQuantumMindWaves(ctx: CanvasRenderingContext2D, dt: number, w: number, h: number): void {
    const isMobile = this.getIsMobile()

    if (this.store.synapticConfig.autonomousPulse) {
      this.nextAutonomousFlashCountdown -= dt
      if (this.nextAutonomousFlashCountdown <= 0) {
        this.triggerAutonomousFlash(w, h)
        this.nextAutonomousFlashCountdown = 8.0 + Math.random() * 5.5
      }
    }

    if (this.store.synapticConfig.manualPulseCount !== this.lastManualPulseCount) {
      this.lastManualPulseCount = this.store.synapticConfig.manualPulseCount
      this.triggerAutonomousFlash(w, h)
    }

    for (let i = this.activeFlashWaves.length - 1; i >= 0; i--) {
      const wave = this.activeFlashWaves[i]
      const progress = Math.min(1.0, wave.radius / wave.maxRadius)
      
      const currentSpeed = wave.speed * Math.max(0.20, 1.0 - progress * 0.75)
      wave.radius += currentSpeed * dt
      wave.alpha -= dt * wave.decay

      const edgeFade = 1.0 - Math.pow(progress, 1.4)
      const currentAlpha = Math.max(0, wave.alpha * edgeFade)

      if (wave.alpha <= 0 || progress >= 1.0 || currentAlpha <= 0.003) {
        fastRemove(this.activeFlashWaves, i)
        continue
      }

      ctx.save()
      ctx.beginPath()
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
      ctx.strokeStyle = wave.color === '#22d3ee'
        ? `rgba(34, 211, 238, ${(currentAlpha * 0.28).toFixed(3)})`
        : `rgba(56, 189, 248, ${(currentAlpha * 0.28).toFixed(3)})`
      ctx.lineWidth = Math.max(0.8, 1.8 - progress * 0.9)
      if (!isMobile) {
        ctx.shadowColor = wave.color
        ctx.shadowBlur = 10 + progress * 12
      }
      ctx.stroke()

      if (!isMobile && wave.hasSecondaryRing && wave.radius > 35) {
        const secondaryRadius = Math.max(10, wave.radius - Math.min(22, Math.max(5, wave.radius * 0.065)))
        ctx.beginPath()
        ctx.arc(wave.x, wave.y, secondaryRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(56, 189, 248, ${(currentAlpha * 0.13).toFixed(3)})`
        ctx.lineWidth = 0.8
        ctx.shadowBlur = 6
        ctx.stroke()
      }
      ctx.restore()
    }
  }

  public updateAndRenderMeteors(dt: number): void {
    if (!this.ctx) return
    const ctx = this.ctx
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const logicalW = window.innerWidth
    const logicalH = window.innerHeight
    const isMobile = this.getIsMobile()

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, logicalW, logicalH)

    if (this.store.synapticConfig.enabled) {
      this.renderQuantumMindWaves(ctx, dt, logicalW, logicalH)
    }

    if (this.store.meteorConfig.manualTriggerCount !== this.lastMeteorTriggerCount) {
      this.lastMeteorTriggerCount = this.store.meteorConfig.manualTriggerCount
      this.spawnMeteor()
    }

    if (this.store.meteorConfig.manualTriggerCodeCount !== this.lastMeteorCodeTriggerCount) {
      this.lastMeteorCodeTriggerCount = this.store.meteorConfig.manualTriggerCodeCount
      this.spawnMeteor(false, true)
    }

    if (this.store.meteorConfig.enabled) {
      this.nextMeteorCountdown -= dt
      if (this.nextMeteorCountdown <= 0) {
        if (!this.hasSpawnedWelcomeMeteor) {
          this.hasSpawnedWelcomeMeteor = true
          this.spawnMeteor(false, true, true)
        } else {
          this.spawnMeteor()
        }

        if (this.store.meteorConfig.mode === 'shower') {
          this.nextMeteorCountdown = 2.0 + Math.random() * 2.5
        } else {
          this.nextMeteorCountdown = 6.0 + Math.random() * 8.0
        }
      }
    }

    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    // 煙霧痕跡
    for (let i = this.activeAfterglows.length - 1; i >= 0; i--) {
      const ag = this.activeAfterglows[i]
      ag.alpha -= ag.decay * dt
      if (ag.alpha <= 0) {
        fastRemove(this.activeAfterglows, i)
        continue
      }
      ctx.beginPath()
      ctx.arc(ag.x, ag.y, ag.width, 0, Math.PI * 2)
      ctx.fillStyle = ag.color.replace('ALPHA', String(ag.alpha * 0.12))
      ctx.fill()
    }

    // 火流星碎屑
    for (let i = this.activeSparks.length - 1; i >= 0; i--) {
      const s = this.activeSparks[i]
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.vy += 60 * dt
      s.vx *= 0.96
      s.vy *= 0.96
      s.alpha -= s.decay * dt

      if (s.alpha <= 0) {
        fastRemove(this.activeSparks, i)
        continue
      }

      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size * s.alpha, 0, Math.PI * 2)
      ctx.fillStyle = s.color.replace('ALPHA', String(s.alpha))
      if (!isMobile) {
        ctx.shadowColor = s.color.replace('ALPHA', '0.8')
        ctx.shadowBlur = 6
      }
      ctx.fill()
    }

    // 代碼流星粒子
    for (let i = this.activeCodeDusts.length - 1; i >= 0; i--) {
      const cd = this.activeCodeDusts[i]
      cd.x += cd.vx * dt
      cd.y += cd.vy * dt
      cd.alpha -= cd.decay * dt

      if (cd.alpha <= 0) {
        fastRemove(this.activeCodeDusts, i)
        continue
      }

      ctx.save()
      ctx.font = `bold ${Math.round(cd.size)}px "JetBrains Mono", "Fira Code", monospace`
      ctx.fillStyle = cd.color
      ctx.globalAlpha = Math.max(0, Math.min(1, cd.alpha * 0.95))
      if (!isMobile) {
        ctx.shadowColor = cd.color
        ctx.shadowBlur = 8
      }
      ctx.fillText(cd.text, cd.x, cd.y)
      ctx.restore()
    }

    // 主體流星
    for (let i = this.activeMeteors.length - 1; i >= 0; i--) {
      const m = this.activeMeteors[i]
      m.age += dt
      const progress = m.age / m.duration

      if (progress >= 1.0) {
        m.dead = true
        fastRemove(this.activeMeteors, i)
        continue
      }

      const moveStep = m.speed * dt
      m.prevX = m.x
      m.prevY = m.y
      m.x += Math.cos(m.angle) * moveStep
      m.y += Math.sin(m.angle) * moveStep

      if (progress < 0.25) {
        m.currentLength = (progress / 0.25) * m.length
      } else if (progress > 0.75) {
        m.currentLength = ((1.0 - progress) / 0.25) * m.length
      } else {
        m.currentLength = m.length
      }

      const tailX = m.x - Math.cos(m.angle) * m.currentLength
      const tailY = m.y - Math.sin(m.angle) * m.currentLength

      let opacity = 1.0
      if (progress < 0.15) opacity = progress / 0.15
      else if (progress > 0.80) opacity = (1.0 - progress) / 0.20

      const dustSpawnChance = m.isWelcome ? (progress > 0.18 && progress < 0.75 ? 0.65 : 0.35) : 0.40
      if (m.isCodeMeteor && Math.random() < dustSpawnChance) {
        const item = CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)]
        const dustSize = m.isWelcome && isMobile
          ? 13 + Math.random() * 4
          : 11 + Math.random() * 4

        this.activeCodeDusts.push({
          x: m.x + (Math.random() - 0.5) * 20,
          y: m.y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 36 - Math.cos(m.angle) * 35,
          vy: (Math.random() - 0.5) * 36 - Math.sin(m.angle) * 35,
          text: item.text,
          alpha: 1.0,
          decay: m.isWelcome ? 0.55 + Math.random() * 0.40 : 0.70 + Math.random() * 0.50,
          color: item.color,
          size: dustSize
        })
      }

      if (Math.random() < 0.40) {
        this.activeAfterglows.push({
          x: m.x,
          y: m.y,
          width: m.isFireball ? 4.5 : (m.isCodeMeteor ? 3.0 : 2.5),
          alpha: opacity,
          decay: m.isFireball ? 0.65 : 1.1,
          color: m.colorScheme.glow.replace(/[\d\.]+\)$/, 'ALPHA)')
        })
      }

      if (m.isFireball && !m.hasExploded && progress >= 0.58) {
        m.hasExploded = true
        m.flareAlpha = 1.0
        m.flareRadius = 110

        const sparkCount = 6 + Math.floor(Math.random() * 4)
        for (let s = 0; s < sparkCount; s++) {
          const sparkAngle = m.angle + (Math.random() - 0.5) * Math.PI * 1.2
          const sparkSpeed = 80 + Math.random() * 220
          this.activeSparks.push({
            x: m.x,
            y: m.y,
            vx: Math.cos(sparkAngle) * sparkSpeed,
            vy: Math.sin(sparkAngle) * sparkSpeed,
            alpha: 1.0,
            decay: 1.8 + Math.random() * 1.5,
            size: 1.2 + Math.random() * 1.8,
            color: m.colorScheme.glow.replace(/[\d\.]+\)$/, 'ALPHA)')
          })
        }
      }

      const ambientRadius = m.isFireball ? 65 : (m.isCodeMeteor ? 45 : 35)
      const ambGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, ambientRadius)
      ambGrad.addColorStop(0, m.colorScheme.glow.replace(/[\d\.]+\)$/, `${0.45 * opacity})`))
      ambGrad.addColorStop(0.5, m.colorScheme.outer.replace(/[\d\.]+\)$/, `${0.20 * opacity})`))
      ambGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = ambGrad
      ctx.beginPath()
      ctx.arc(m.x, m.y, ambientRadius, 0, Math.PI * 2)
      ctx.fill()

      if (m.flareAlpha > 0.01) {
        m.flareAlpha -= dt * 4.5
        const fGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.flareRadius)
        fGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * m.flareAlpha})`)
        fGrad.addColorStop(0.25, m.colorScheme.glow.replace(/[\d\.]+\)$/, `${0.75 * m.flareAlpha})`))
        fGrad.addColorStop(0.65, m.colorScheme.outer.replace(/[\d\.]+\)$/, `${0.30 * m.flareAlpha})`))
        fGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = fGrad
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.flareRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      const trailGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y)
      trailGrad.addColorStop(0, 'rgba(0, 0, 0, 0)')
      trailGrad.addColorStop(0.35, m.colorScheme.outer.replace(/[\d\.]+\)$/, `${0.30 * opacity})`))
      trailGrad.addColorStop(0.75, m.colorScheme.glow.replace(/[\d\.]+\)$/, `${0.80 * opacity})`))
      trailGrad.addColorStop(1, `rgba(255, 255, 255, ${0.98 * opacity})`)

      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(m.x, m.y)
      ctx.strokeStyle = trailGrad
      ctx.lineWidth = m.isFireball ? 3.0 : (m.isCodeMeteor ? 2.2 : 1.8)
      ctx.lineCap = 'round'
      if (!isMobile) {
        ctx.shadowColor = m.colorScheme.accent
        ctx.shadowBlur = m.isFireball ? 16 : (m.isCodeMeteor ? 12 : 9)
      }
      ctx.stroke()

      const coreGrad = ctx.createLinearGradient(
        m.x - Math.cos(m.angle) * (m.isFireball ? 25 : 16),
        m.y - Math.sin(m.angle) * (m.isFireball ? 25 : 16),
        m.x,
        m.y
      )
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
      coreGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.6)')
      coreGrad.addColorStop(1, `rgba(255, 255, 255, ${1.0 * opacity})`)

      ctx.beginPath()
      ctx.moveTo(m.x - Math.cos(m.angle) * (m.isFireball ? 25 : 16), m.y - Math.sin(m.angle) * (m.isFireball ? 25 : 16))
      ctx.lineTo(m.x, m.y)
      ctx.strokeStyle = coreGrad
      ctx.lineWidth = m.isFireball ? 1.6 : 1.0
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(m.x, m.y, m.isFireball ? 2.2 : 1.4, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      if (!isMobile) {
        ctx.shadowColor = '#ffffff'
        ctx.shadowBlur = 12
      }
      ctx.fill()
    }

    ctx.restore()
  }

  public dispose(): void {
    this.activeMeteors = []
    this.activeSparks = []
    this.activeAfterglows = []
    this.activeCodeDusts = []
    this.activeFlashWaves = []
    this.ctx = null
  }
}
