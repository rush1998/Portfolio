import Image from 'next/image'

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="section-header">
        <span className="section-label">get to know me</span>
        <h2 className="section-title">about me.</h2>
      </div>
      <div className="about-grid">
        <div className="about-photo-wrap">
          <Image
            src="/main.jpg"
            alt="Rushabh Patel"
            width={400}
            height={500}
            className="about-photo"
            loading="lazy"
          />
          <div className="sticker sticker-about-1" aria-hidden="true">🎓</div>
          <div className="sticker sticker-about-2" aria-hidden="true">🌍</div>
        </div>
        <div className="about-text-wrap">
          <p className="about-text">
            hey! i&apos;m rushabh — a <strong>devops engineer &amp; cloud architect</strong> based in Canada.
            i graduated with an MS in Informatics from <strong>Northeastern University</strong>
            {' '}and a BE in Computer Science from <strong>GTU</strong>.
          </p>
          <p className="about-text">
            i specialize in designing resilient cloud infrastructure, automating ci/cd pipelines,
            and bridging the gap between dev teams and ops.
            {' '}<strong>3+ years</strong> of building things that actually scale.
          </p>
          <div className="about-badges">
            <span className="badge badge--green">ms informatics</span>
            <span className="badge badge--purple">3+ yrs exp</span>
            <span className="badge badge--orange">open to work</span>
          </div>
        </div>
      </div>
    </section>
  )
}
