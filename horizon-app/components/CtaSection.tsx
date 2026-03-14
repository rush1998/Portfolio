export default function CtaSection() {
  return (
    <section className="cta-section" id="contact">
      <span className="cta-sticker cta-sticker-1" aria-hidden="true">💣</span>
      <span className="cta-sticker cta-sticker-2" aria-hidden="true">🦄</span>
      <span className="cta-sticker cta-sticker-3" aria-hidden="true">⚡</span>
      <span className="cta-sticker cta-sticker-4" aria-hidden="true">🌶️</span>
      <div className="cta-inner">
        <h2 className="cta-headline">let&apos;s build</h2>
        <h2 className="cta-headline cta-headline--outline">something</h2>
        <h2 className="cta-headline">wild.</h2>
        <p className="cta-sub">i&apos;m available for full-time roles, consulting &amp; fun projects.</p>
        <div className="cta-btns">
          <a href="mailto:rushabh.patel1998@gmail.com" className="btn-brutal btn-brutal--black wobble-btn">
            ✉ email me
          </a>
          <a href="https://www.linkedin.com/in/prushabh/" target="_blank" rel="noopener" className="btn-brutal btn-brutal--white wobble-btn">
            in linkedin
          </a>
        </div>
      </div>
    </section>
  )
}
