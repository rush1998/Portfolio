'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

const NAV_LINKS = [
  { href: '#about',    label: 'about' },
  { href: '#skills',   label: 'skills' },
  { href: '#projects', label: 'projects' },
  { href: '#blogs',    label: 'blogs' },
  { href: '#faq',      label: 'faq' },
  { href: '#contact',  label: 'contact' },
]

export default function NavPill() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('#about')
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const tlRefs = useRef<gsap.core.Timeline[]>([])
  const logoMarkRef = useRef<HTMLSpanElement>(null)

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMobileOpen(false) }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Escape key closes drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Scroll spy + pill shrink
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const scrollPos = window.scrollY + 170
      let current = sections[0]?.id ?? 'about'
      sections.forEach(s => { if (scrollPos >= s.offsetTop) current = s.id })
      setActiveHref('#' + current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // GSAP pill hover animations
  const buildTimelines = useCallback(() => {
    tlRefs.current.forEach(tl => tl?.kill())
    tlRefs.current = []
    linksRef.current.forEach((link) => {
      if (!link) return
      const circle = link.querySelector<HTMLSpanElement>('.pill-hover-circle')
      const label = link.querySelector<HTMLSpanElement>('.pill-label')
      const labelHover = link.querySelector<HTMLSpanElement>('.pill-label-hover')
      if (!circle || !label || !labelHover) return

      const { width: w, height: h } = link.getBoundingClientRect()
      const R = ((w * w) / 4 + h * h) / (2 * h)
      const D = Math.ceil(2 * R) + 2
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1

      circle.style.width = D + 'px'
      circle.style.height = D + 'px'
      circle.style.bottom = '-' + delta + 'px'

      gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${D - delta}px` })
      gsap.set(label, { y: 0 })
      gsap.set(labelHover, { y: h + 10, opacity: 0 })

      const tl = gsap.timeline({ paused: true })
      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.8, ease: 'power3.out' }, 0)
        .to(label, { y: -(h + 8), duration: 0.6, ease: 'power3.out' }, 0)
        .to(labelHover, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0)
      tlRefs.current.push(tl)
    })
  }, [])

  useEffect(() => {
    buildTimelines()
    window.addEventListener('resize', buildTimelines, { passive: true })
    return () => window.removeEventListener('resize', buildTimelines)
  }, [buildTimelines])

  const handleEnter = (i: number) => {
    if (linksRef.current[i]?.classList.contains('active')) return
    const tl = tlRefs.current[i]
    if (tl) tl.tweenTo(tl.duration(), { duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
  }
  const handleLeave = (i: number) => {
    if (linksRef.current[i]?.classList.contains('active')) return
    const tl = tlRefs.current[i]
    if (tl) tl.tweenTo(0, { duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
  }

  const onLogoEnter = () => {
    if (logoMarkRef.current)
      gsap.to(logoMarkRef.current, { rotate: 360, duration: 0.8, ease: 'elastic.out(1,0.5)',
        onComplete: () => gsap.set(logoMarkRef.current, { rotate: 0 }) })
  }

  return (
    <>
      <nav
        ref={navRef}
        className="nav-pill"
        id="nav-pill"
        style={{
          transform: scrolled ? 'translateX(-50%) scale(0.96)' : 'translateX(-50%) scale(1)',
          boxShadow: scrolled ? '3px 3px 0px rgba(0,0,0,0.55)' : '4px 4px 0px #0a0a0a',
        }}
      >
        <a href="#hero" className="nav-logo-link" onMouseEnter={onLogoEnter}>
          <span ref={logoMarkRef} className="logo-mark">R</span>
        </a>

        <ul className="nav-links" id="nav-links">
          {NAV_LINKS.map(({ href, label }, i) => (
            <li key={href}>
              <a
                href={href}
                ref={el => { linksRef.current[i] = el }}
                className={`pill-link${activeHref === href ? ' active' : ''}`}
                aria-label={`${label} section`}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={() => handleLeave(i)}
              >
                <span className="pill-hover-circle" aria-hidden="true" />
                <span className="label-stack">
                  <span className="pill-label">{label}</span>
                  <span className="pill-label-hover" aria-hidden="true">{label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="nav-cta-pill wobble-btn">get in touch</a>

        <button
          className="nav-hamburger"
          id="nav-hamburger"
          aria-label="open menu"
          onClick={() => setMobileOpen(v => !v)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`mobile-nav-overlay${mobileOpen ? ' visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`mobile-nav-drawer${mobileOpen ? ' open' : ''}`} id="mobile-drawer">
        <button className="drawer-close-btn" onClick={() => setMobileOpen(false)} aria-label="close menu">
          ✕
        </button>
        <ul>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={() => setMobileOpen(false)}>{label}</a>
            </li>
          ))}
          <li>
            <a href="#contact" className="drawer-cta" onClick={() => setMobileOpen(false)}>get in touch →</a>
          </li>
        </ul>
      </div>
    </>
  )
}
