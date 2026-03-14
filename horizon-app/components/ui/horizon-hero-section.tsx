'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

gsap.registerPlugin(ScrollTrigger)

// ── Types ──────────────────────────────────────────────────────
interface ThreeRefs {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  renderer: THREE.WebGLRenderer | null
  composer: EffectComposer | null
  stars: THREE.Points[]
  nebula: THREE.Mesh | null
  mountains: THREE.Mesh[]
  animationId: number | null
  targetCameraX?: number
  targetCameraY?: number
  targetCameraZ?: number
  locations?: number[]
}

export const Component: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const subtitleRef  = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef<HTMLDivElement>(null)
  const menuRef      = useRef<HTMLDivElement>(null)

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 })

  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(1)
  const [isReady, setIsReady] = useState(false)
  const totalSections = 2

  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
  })

  // ── Three.js init ─────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return

    const refs = threeRefs.current

    // Scene
    refs.scene = new THREE.Scene()
    refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025)

    // Camera
    refs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    refs.camera.position.set(0, 20, 100)

    // Renderer
    refs.renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
    refs.renderer.setSize(window.innerWidth, window.innerHeight)
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping
    refs.renderer.toneMappingExposure = 0.5

    // Post-processing
    refs.composer = new EffectComposer(refs.renderer)
    refs.composer.addPass(new RenderPass(refs.scene, refs.camera))
    refs.composer.addPass(
      new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.4, 0.85)
    )

    // ── Star field ────────────────────────────────────────────
    const starCount = 5000
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(starCount * 3)
      const colors    = new Float32Array(starCount * 3)
      const sizes     = new Float32Array(starCount)

      for (let j = 0; j < starCount; j++) {
        const radius = 200 + Math.random() * 800
        const theta  = Math.random() * Math.PI * 2
        const phi    = Math.acos(Math.random() * 2 - 1)
        positions[j * 3]     = radius * Math.sin(phi) * Math.cos(theta)
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[j * 3 + 2] = radius * Math.cos(phi)

        const color = new THREE.Color()
        const c = Math.random()
        if (c < 0.7)      color.setHSL(0, 0, 0.8 + Math.random() * 0.2)
        else if (c < 0.9) color.setHSL(0.08, 0.5, 0.8)
        else               color.setHSL(0.6, 0.5, 0.8)
        colors[j * 3] = color.r; colors[j * 3 + 1] = color.g; colors[j * 3 + 2] = color.b
        sizes[j] = Math.random() * 2 + 0.5
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, depth: { value: i } },
        vertexShader: `
          attribute float size; attribute vec3 color; varying vec3 vColor;
          uniform float time; uniform float depth;
          void main() {
            vColor = color;
            vec3 pos = position;
            float angle = time * 0.05 * (1.0 - depth * 0.3);
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            pos.xy = rot * pos.xy;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }`,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(vColor, opacity);
          }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const stars = new THREE.Points(geometry, material)
      refs.scene.add(stars)
      refs.stars.push(stars)
    }

    // ── Nebula ────────────────────────────────────────────────
    const nebulaGeo = new THREE.PlaneGeometry(8000, 4000, 100, 100)
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: {
        time:    { value: 0 },
        color1:  { value: new THREE.Color(0x0033ff) },
        color2:  { value: new THREE.Color(0xff0066) },
        opacity: { value: 0.3 },
      },
      vertexShader: `
        varying vec2 vUv; varying float vElevation; uniform float time;
        void main() {
          vUv = uv; vec3 pos = position;
          float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
          pos.z += elevation; vElevation = elevation;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 color1; uniform vec3 color2; uniform float opacity; uniform float time;
        varying vec2 vUv; varying float vElevation;
        void main() {
          float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
          vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
          float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
          alpha *= 1.0 + vElevation * 0.01;
          gl_FragColor = vec4(color, alpha);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const nebula = new THREE.Mesh(nebulaGeo, nebulaMat)
    nebula.position.z = -1050
    refs.scene.add(nebula)
    refs.nebula = nebula

    // ── Mountains ─────────────────────────────────────────────
    const layers = [
      { distance: -50,  height: 60,  color: 0x1a1a2e, opacity: 1   },
      { distance: -100, height: 80,  color: 0x16213e, opacity: 0.8 },
      { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
      { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 },
    ]
    layers.forEach((layer, index) => {
      const pts: THREE.Vector2[] = []
      for (let i = 0; i <= 50; i++) {
        const x = (i / 50 - 0.5) * 1000
        const y = Math.sin(i * 0.1) * layer.height +
                  Math.sin(i * 0.05) * layer.height * 0.5 +
                  Math.random() * layer.height * 0.2 - 100
        pts.push(new THREE.Vector2(x, y))
      }
      pts.push(new THREE.Vector2(5000, -300))
      pts.push(new THREE.Vector2(-5000, -300))
      const shape = new THREE.Shape(pts)
      const geo   = new THREE.ShapeGeometry(shape)
      const mat   = new THREE.MeshBasicMaterial({ color: layer.color, transparent: true, opacity: layer.opacity, side: THREE.DoubleSide })
      const mesh  = new THREE.Mesh(geo, mat)
      mesh.position.z = layer.distance
      mesh.position.y = layer.distance
      mesh.userData = { baseZ: layer.distance, index }
      refs.scene.add(mesh)
      refs.mountains.push(mesh)
    })

    // Record original z positions
    refs.locations = refs.mountains.map(m => m.position.z)

    // ── Atmosphere ────────────────────────────────────────────
    const atmoGeo = new THREE.SphereGeometry(600, 32, 32)
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal; varying vec3 vPosition;
        void main() { vNormal = normalize(normalMatrix * normal); vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        varying vec3 vNormal; uniform float time;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
          atmosphere *= sin(time * 2.0) * 0.1 + 0.9;
          gl_FragColor = vec4(atmosphere, intensity * 0.25);
        }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })
    refs.scene.add(new THREE.Mesh(atmoGeo, atmoMat))

    // ── Animation loop ────────────────────────────────────────
    const animate = () => {
      refs.animationId = requestAnimationFrame(animate)
      const time = Date.now() * 0.001

      refs.stars.forEach(sf => {
        if ((sf.material as THREE.ShaderMaterial).uniforms) {
          ;(sf.material as THREE.ShaderMaterial).uniforms.time.value = time
        }
      })

      if (refs.nebula) {
        ;(refs.nebula.material as THREE.ShaderMaterial).uniforms.time.value = time * 0.5
      }

      if (refs.camera && refs.targetCameraX !== undefined) {
        const s = 0.05
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * s
        smoothCameraPos.current.y += (refs.targetCameraY! - smoothCameraPos.current.y) * s
        smoothCameraPos.current.z += (refs.targetCameraZ! - smoothCameraPos.current.z) * s
        refs.camera.position.x = smoothCameraPos.current.x + Math.sin(time * 0.1) * 2
        refs.camera.position.y = smoothCameraPos.current.y + Math.cos(time * 0.15) * 1
        refs.camera.position.z = smoothCameraPos.current.z
        refs.camera.lookAt(0, 10, -600)
      }

      refs.mountains.forEach((m, i) => {
        const pf = 1 + i * 0.5
        m.position.x = Math.sin(time * 0.1) * 2 * pf
        m.position.y = 50 + Math.cos(time * 0.15) * 1 * pf
      })

      refs.composer?.render()
    }
    animate()
    setIsReady(true)

    // ── Resize handler ────────────────────────────────────────
    const handleResize = () => {
      if (!refs.camera || !refs.renderer || !refs.composer) return
      refs.camera.aspect = window.innerWidth / window.innerHeight
      refs.camera.updateProjectionMatrix()
      refs.renderer.setSize(window.innerWidth, window.innerHeight)
      refs.composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener('resize', handleResize)
      refs.stars.forEach(s => { s.geometry.dispose(); ;(s.material as THREE.Material).dispose() })
      refs.mountains.forEach(m => { m.geometry.dispose(); ;(m.material as THREE.Material).dispose() })
      if (refs.nebula) { refs.nebula.geometry.dispose(); ;(refs.nebula.material as THREE.Material).dispose() }
      refs.renderer?.dispose()
    }
  }, [])

  // ── GSAP entrance animations ──────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: 'visible',
    })
    const tl = gsap.timeline()
    if (menuRef.current)          tl.from(menuRef.current, { x: -100, opacity: 0, duration: 1, ease: 'power3.out' })
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.title-char')
      tl.from(chars, { y: 200, opacity: 0, duration: 1.5, stagger: 0.05, ease: 'power4.out' }, '-=0.5')
    }
    if (subtitleRef.current) {
      const lines = subtitleRef.current.querySelectorAll('.subtitle-line')
      tl.from(lines, { y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }, '-=0.8')
    }
    if (scrollProgressRef.current)
      tl.from(scrollProgressRef.current, { opacity: 0, y: 50, duration: 1, ease: 'power2.out' }, '-=0.5')
    return () => { tl.kill() }
  }, [isReady])

  // ── Scroll handler ────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollY    = window.scrollY
      const maxScroll  = document.documentElement.scrollHeight - window.innerHeight
      const progress   = Math.min(scrollY / maxScroll, 1)
      setScrollProgress(progress)
      const newSection = Math.floor(progress * totalSections)
      setCurrentSection(newSection)

      const refs           = threeRefs.current
      const totalProgress  = progress * totalSections
      const sectionProgress = totalProgress % 1
      const cameraPositions = [
        { x: 0, y: 30, z: 300  },
        { x: 0, y: 40, z: -50  },
        { x: 0, y: 50, z: -700 },
      ]
      const cur  = cameraPositions[newSection]  ?? cameraPositions[0]
      const next = cameraPositions[newSection + 1] ?? cur
      refs.targetCameraX = cur.x + (next.x - cur.x) * sectionProgress
      refs.targetCameraY = cur.y + (next.y - cur.y) * sectionProgress
      refs.targetCameraZ = cur.z + (next.z - cur.z) * sectionProgress

      refs.mountains.forEach((mountain, i) => {
        const speed   = 1 + i * 0.9
        const targetZ = mountain.userData.baseZ + scrollY * speed * 0.5
        mountain.userData.targetZ = targetZ
        if (progress > 0.7) {
          mountain.position.z = 600000
        } else {
          mountain.position.z = refs.locations![i]
        }
      })
      if (refs.nebula && refs.mountains[3])
        refs.nebula.position.z = refs.mountains[3].position.z
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [totalSections])

  const splitTitle = (text: string) =>
    text.split('').map((char, i) => (
      <span key={i} className="title-char">{char}</span>
    ))

  const sectionTitles: Record<number, string> = { 0: 'HORIZON', 1: 'COSMOS', 2: 'INFINITY' }
  const sectionSubtitles: Record<number, { line1: string; line2: string }> = {
    0: { line1: 'Where vision meets reality,',             line2: 'we shape the future of tomorrow' },
    1: { line1: 'Beyond the boundaries of imagination,',   line2: 'lies the universe of possibilities' },
    2: { line1: 'In the space between thought and creation,', line2: 'we find the essence of true innovation' },
  }

  return (
    <div ref={containerRef} className="hero-container cosmos-style">
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Side menu */}
      <div ref={menuRef} className="side-menu" style={{ visibility: 'hidden' }}>
        <div className="menu-icon">
          <span /><span /><span />
        </div>
        <div className="vertical-text">SPACE</div>
      </div>

      {/* Main content */}
      <div className="hero-content cosmos-content">
        <h1 ref={titleRef} className="hero-title">
          {splitTitle('HORIZON')}
        </h1>
        <div ref={subtitleRef} className="hero-subtitle cosmos-subtitle">
          <p className="subtitle-line">Where vision meets reality,</p>
          <p className="subtitle-line">we shape the future of tomorrow</p>
        </div>
      </div>

      {/* Scroll progress */}
      <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: 'hidden' }}>
        <div className="scroll-text">SCROLL</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${scrollProgress * 100}%` }} />
        </div>
        <div className="section-counter">
          {String(currentSection).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
        </div>
      </div>

      {/* Scroll sections */}
      <div className="scroll-sections">
        {[...Array(2)].map((_, i) => (
          <section key={i} className="content-section">
            <h1 className="hero-title">{sectionTitles[i + 1] ?? 'DEFAULT'}</h1>
            <div className="hero-subtitle cosmos-subtitle">
              <p className="subtitle-line">{sectionSubtitles[i + 1].line1}</p>
              <p className="subtitle-line">{sectionSubtitles[i + 1].line2}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
