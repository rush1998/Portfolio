'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

interface Article {
  title: string
  link: string
  description: string
  categories: string[]
}

function estimateReadTime(html: string): string {
  const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200)) + ' min read'
}

function getRealCategories(article: Article): string[] {
  if (article.categories?.length) {
    const cats = article.categories
      .map(c => c.toLowerCase().trim())
      .filter(c => c.length > 0 && c.length < 22)
      .slice(0, 3)
    if (cats.length) return cats
  }
  const t = article.title.toLowerCase()
  const fallback: string[] = []
  if (t.includes('devops'))                       fallback.push('devops')
  if (t.includes('kubernetes') || t.includes('k8s')) fallback.push('k8s')
  if (t.includes('cloud'))                        fallback.push('cloud')
  if (t.includes('terraform'))                    fallback.push('terraform')
  if (t.includes('aws'))                          fallback.push('aws')
  return fallback.length ? fallback : ['article']
}

export default function BlogsSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const galleryRef   = useRef<HTMLDivElement>(null)
  const leftBtnRef   = useRef<HTMLButtonElement>(null)
  const rightBtnRef  = useRef<HTMLButtonElement>(null)
  const SCROLL_AMT   = 380

  const updateButtons = useCallback(() => {
    const g = galleryRef.current
    if (!g || !leftBtnRef.current || !rightBtnRef.current) return
    leftBtnRef.current.disabled  = g.scrollLeft === 0
    rightBtnRef.current.disabled = g.scrollLeft + g.clientWidth >= g.scrollWidth - 10
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    const g = galleryRef.current
    if (!g) return
    const target = g.scrollLeft + (dir === 'left' ? -SCROLL_AMT : SCROLL_AMT)
    gsap.to(g, { scrollLeft: target, duration: 0.6, ease: 'power2.inOut', onUpdate: updateButtons })
  }

  useEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@rushpatel')
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok' && data.items?.length) {
          setArticles(data.items.slice(0, 6))
        } else {
          setError(true)
        }
        setLoading(false)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  useEffect(() => {
    updateButtons()
    const g = galleryRef.current
    if (!g) return
    g.addEventListener('scroll', updateButtons, { passive: true })
    window.addEventListener('resize', updateButtons, { passive: true })
    return () => {
      g.removeEventListener('scroll', updateButtons)
      window.removeEventListener('resize', updateButtons)
    }
  }, [articles, updateButtons])

  return (
    <section className="blogs-section" id="blogs">
      <div className="section-header">
        <span className="section-label">thoughts &amp; insights</span>
        <h2 className="section-title">blogs.</h2>
      </div>

      <div className="blogs-gallery-wrapper">
        <button ref={leftBtnRef}  className="gallery-nav gallery-nav--left"  aria-label="Scroll left"  onClick={() => scroll('left')}>&#8249;</button>

        <div className="blogs-gallery" ref={galleryRef}>
          {loading && (
            <div className="blogs-loading">⏳ loading articles...</div>
          )}
          {error && !loading && (
            <div className="blogs-loading">Unable to load articles. Please check back later.</div>
          )}
          {!loading && !error && articles.map(article => {
            const imageMatch = article.description?.match(/<img[^>]+src=["']([^"']+)["']/)
            const imageUrl   = imageMatch?.[1] ??
              `https://via.placeholder.com/350x200?text=${encodeURIComponent(article.title.slice(0, 20))}`
            const readTime   = estimateReadTime(article.description ?? '')
            const categories = getRealCategories(article)
            const cleanDesc  = (article.description ?? '').replace(/<[^>]*>/g, '').slice(0, 100)

            return (
              <div key={article.link} className="blog-card project-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={article.title} className="blog-card-image project-img" loading="lazy" />
                <div className="blog-card-content project-info">
                  <h3 className="blog-card-title project-title">{article.title}</h3>
                  <div className="blog-card-stats">
                    <span className="blog-stat blog-stat--time">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {readTime}
                    </span>
                  </div>
                  <p className="blog-card-description project-desc">{cleanDesc}...</p>
                  <div className="blog-card-tags project-tags">
                    {categories.map(cat => <span key={cat} className="project-tag">{cat}</span>)}
                  </div>
                  <div className="blog-card-footer project-btns">
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="btn-brutal btn-brutal--black">read article</a>
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="btn-brutal btn-brutal--white">medium</a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button ref={rightBtnRef} className="gallery-nav gallery-nav--right" aria-label="Scroll right" onClick={() => scroll('right')}>&#8250;</button>
      </div>

      <div className="blogs-footer">
        <a href="https://medium.com/@rushpatel" target="_blank" rel="noopener noreferrer" className="btn-brutal btn-brutal--white wobble-btn">
          ✍ read more on medium
        </a>
      </div>
    </section>
  )
}
