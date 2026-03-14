'use client'

import { useRef } from 'react'

const FAQS = [
  {
    q: "what do you actually do every day?",
    a: "mostly coffee + iac. i design cloud infra, write terraform modules, build ci/cd pipelines, and make sure deployments go out without drama. occasionally i also push real app code.",
  },
  {
    q: "are you open to new opportunities?",
    a: "yes! i'm actively exploring full-time devops / cloud engineering roles. contract work, consulting, and interesting side projects are all on the table. just reach out.",
  },
  {
    q: "what's your cloud of choice?",
    a: "aws is home base — i'm certified at solutions architect level. but i've shipped real workloads on azure too, and i believe in picking the right tool over platform loyalty.",
  },
  {
    q: "can you help with my startup's infra?",
    a: "absolutely. i love working with early-stage teams to lay the right foundations — scalable infra from day one so you're not scrambling when traction hits. drop me an email and let's talk specifics.",
  },
  {
    q: "do you code frontend too?",
    a: "yep — this very page is hand-coded by me. i'm comfortable across the full stack: html/css, javascript, react, node.js, and enough python to be dangerous.",
  },
]

export default function FaqSection() {
  const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([])

  const handleClick = (i: number) => {
    detailsRefs.current.forEach((el, j) => {
      if (el && j !== i && el.open) el.open = false
    })
  }

  return (
    <section className="faq-section" id="faq">
      <div className="section-header">
        <span className="section-label">got questions?</span>
        <h2 className="section-title">faq.</h2>
      </div>
      <div className="faq-container">
        {FAQS.map(({ q, a }, i) => (
          <details
            key={q}
            className="faq-item"
            ref={el => { detailsRefs.current[i] = el }}
          >
            <summary className="faq-summary" onClick={() => handleClick(i)}>
              {q}
              <span className="faq-icon" aria-hidden="true">+</span>
            </summary>
            <p className="faq-body">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
