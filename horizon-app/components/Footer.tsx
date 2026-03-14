const FOOTER_LINKS = [
  { href: '#about',    label: 'about' },
  { href: '#skills',   label: 'skills' },
  { href: '#projects', label: 'projects' },
  { href: '#blogs',    label: 'blogs' },
  { href: '#faq',      label: 'faq' },
  { href: '#contact',  label: 'contact' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-bg" aria-hidden="true">rushabh</div>
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-logo">RP</span>
          <p className="footer-tagline">devops · cloud · full stack</p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          {FOOTER_LINKS.map(({ href, label }) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <div className="footer-socials">
          <a href="https://www.linkedin.com/in/prushabh/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-link">in</a>
          <a href="https://github.com/rush1998"            target="_blank" rel="noopener noreferrer" aria-label="GitHub"   className="footer-social-link">gh</a>
          <a href="https://medium.com/@rushpatel"          target="_blank" rel="noopener noreferrer" aria-label="Medium"   className="footer-social-link">md</a>
        </div>
      </div>
      <p className="footer-legal">© 2026 rushabh patel. all rights reserved.</p>
    </footer>
  )
}
