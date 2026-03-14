'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const ROLES = ['devops engineer', 'cloud architect', 'full-stack dev', 'automation-first builder']

export default function HeroSection() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [swapping, setSwapping] = useState(false)
  const heroLeftRef = useRef<HTMLDivElement>(null)

  // Role rotator
  useEffect(() => {
    const id = setInterval(() => {
      setSwapping(true)
      setTimeout(() => {
        setRoleIdx(i => (i + 1) % ROLES.length)
        setSwapping(false)
      }, 220)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  // Hero entrance animation
  useEffect(() => {
    const el = heroLeftRef.current
    if (!el) return
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement
      c.style.opacity = '0'
      c.style.transform = 'translateY(24px)'
      c.style.transition = `opacity 0.55s ease ${0.1 + i * 0.12}s, transform 0.55s cubic-bezier(0.175,0.885,0.32,1.275) ${0.1 + i * 0.12}s`
      requestAnimationFrame(() => requestAnimationFrame(() => {
        c.style.opacity = '1'
        c.style.transform = 'translateY(0)'
      }))
    })
  }, [])

  // Cursor glow
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero')
    if (!hero || window.matchMedia('(hover: none)').matches) return
    const glow = document.createElement('div')
    glow.className = 'hero-cursor-glow'
    hero.appendChild(glow)
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0, rafId = 0, inside = false
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const animate = () => {
      glowX = lerp(glowX, mouseX, 0.1)
      glowY = lerp(glowY, mouseY, 0.1)
      glow.style.left = glowX + 'px'
      glow.style.top = glowY + 'px'
      if (inside) rafId = requestAnimationFrame(animate)
    }
    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      mouseX = e.clientX - rect.left; mouseY = e.clientY - rect.top
      if (!inside) { inside = true; glowX = mouseX; glowY = mouseY; glow.classList.add('visible'); rafId = requestAnimationFrame(animate) }
    }
    const onLeave = () => { inside = false; glow.classList.remove('visible'); cancelAnimationFrame(rafId) }
    hero.addEventListener('mousemove', onMove, { passive: true })
    hero.addEventListener('mouseleave', onLeave, { passive: true })
    return () => {
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
      glow.remove()
    }
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-blob hero-blob--purple" aria-hidden="true" />
      <div className="hero-blob hero-blob--pink"   aria-hidden="true" />

      <div className="hero-left" ref={heroLeftRef}>
        <span className="hero-eyebrow">👋 hey, i&apos;m</span>
        <h1 className="hero-headline">
          Rushabh<br />
          <span className="gradient-text">Patel.</span>
        </h1>
        <p className="hero-sub">
          <span className="hero-role-line">
            <span className={`hero-role-text${swapping ? ' is-swapping' : ''}`}>
              {ROLES[roleIdx]}
            </span>
            <span className="hero-role-cursor" aria-hidden="true" />
          </span><br />
          i build infrastructure that <em>doesn&apos;t</em> break at 3 am.
        </p>
        <div className="hero-cta-row">
          <a href="/resume.pdf" target="_blank" rel="noopener" className="btn-brutal btn-brutal--black wobble-btn">
            ↓ download cv
          </a>
          <a href="#contact" className="btn-brutal btn-brutal--white wobble-btn">
            let&apos;s talk →
          </a>
        </div>
        <div className="hero-socials">
          <a href="https://www.linkedin.com/in/prushabh/" target="_blank" rel="noopener noreferrer" className="social-chip">
            in linkedin
          </a>
          <a href="https://github.com/rush1998" target="_blank" rel="noopener noreferrer" className="social-chip">
            ⌥ github
          </a>
          <a href="https://medium.com/@rushpatel" target="_blank" rel="noopener noreferrer" className="social-chip">
            ✍ medium
          </a>
        </div>
      </div>

      <div className="hero-right">
        {['☁️','⚡','🚀','🔥','✨'].map((emoji, i) => (
          <div key={i} className={`sticker sticker-${i + 1}`} aria-hidden="true">{emoji}</div>
        ))}
        <div className="phone-mockup">
          <div className="phone-frame">
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="phone-header">
                <span className="phone-header-title">my stack</span>
                <span className="phone-header-badge">live</span>
              </div>
              <div className="phone-feed">
                {[
                  { cls: 'aws',   icon: '☁️', name: 'amazon web services', role: 'ec2 · s3 · lambda · eks' },
                  { cls: 'tf',    icon: '🏗️', name: 'terraform / iac',       role: 'hashicorp certified' },
                  { cls: 'k8s',   icon: '🐳', name: 'kubernetes',             role: 'eks · argocd · helm' },
                  { cls: 'azure', icon: '🔷', name: 'microsoft azure',        role: 'entra id · monitor · networking' },
                  { cls: 'dev',   icon: '💻', name: 'full stack',             role: 'js · node · react' },
                ].map(({ cls, icon, name, role }) => (
                  <div key={cls} className={`phone-post phone-post--${cls}`}>
                    <span className="phone-post-icon">{icon}</span>
                    <div>
                      <div className="phone-post-name">{name}</div>
                      <div className="phone-post-role">{role}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="phone-tabbar">
                <span>🏠</span><span>🔍</span>
                <span className="phone-tab-action">＋</span>
                <span>📊</span><span>👤</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
