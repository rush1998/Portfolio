const ITEMS = [
  'devops engineer', 'cloud architect', 'terraform & aws',
  'kubernetes fanatic', 'full stack dev', 'ci/cd pipelines',
  'open source nerd', 'northeastern alum',
]

export default function MarqueeSection() {
  // Duplicate items for seamless infinite loop (same as original JS)
  const allItems = [...ITEMS, ...ITEMS]
  return (
    <div className="marquee-outer" aria-hidden="true">
      <div className="marquee-wrap">
        <div className="marquee-track">
          {allItems.map((item, i) => (
            <>
              <span key={`item-${i}`}>{item}</span>
              <span key={`sep-${i}`} className="marquee-sep">✦</span>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
