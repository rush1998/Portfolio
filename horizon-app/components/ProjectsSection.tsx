import Image from 'next/image'

const PROJECTS = [
  {
    img: '/Figma-site1.png',
    alt: 'Experiential Network',
    title: 'experiential network',
    desc: 'A full-featured social platform designed for experiential learning communities with real-time collaboration features.',
    tags: ['figma', 'ux/ui', 'react'],
    github: 'https://github.com/rush1998',
    demo: 'https://www.figma.com/proto/l86d06P47h7vPOUxMwnHGD/New-website?node-id=1-2&starting-point-node-id=1%3A2',
    rot: '-2deg',
  },
  {
    img: '/Figma-site2.png',
    alt: 'Capstone Project',
    title: 'capstone project',
    desc: 'Graduate capstone — a platform bridging students and industry mentors with smart matching algorithms.',
    tags: ['informatics', 'node.js', 'mongodb'],
    github: 'https://github.com/rush1998',
    demo: 'https://www.figma.com/proto/j9ZXbhAjOAdJmidsKjAC2i/ITC6040?node-id=1-4&starting-point-node-id=1%3A4',
    rot: '1.5deg',
  },
  {
    img: '/Figma-site3.png',
    alt: 'E-commerce Website',
    title: 'e-commerce site',
    desc: 'Modern storefront with real-time inventory management, dynamic cart, and optimised checkout flow.',
    tags: ['javascript', 'css', 'node.js'],
    github: 'https://github.com/rush1998/Future_website.git',
    demo: 'https://github.com/rush1998/Future_website.git',
    rot: '-1deg',
  },
]

export default function ProjectsSection() {
  return (
    <section className="projects-section" id="projects">
      <div className="section-header">
        <span className="section-label">what i&apos;ve built</span>
        <h2 className="section-title">projects.</h2>
      </div>
      <div className="projects-grid">
        {PROJECTS.map(({ img, alt, title, desc, tags, github, demo, rot }) => (
          <div key={title} className="project-card" style={{ ['--rot' as string]: rot }}>
            <Image src={img} alt={alt} width={600} height={340} className="project-img" loading="lazy" />
            <div className="project-info">
              <h3 className="project-title">{title}</h3>
              <p className="project-desc">{desc}</p>
              <div className="project-tags">
                {tags.map(t => <span key={t} className="project-tag">{t}</span>)}
              </div>
              <div className="project-btns">
                <a href={github} target="_blank" rel="noopener" className="btn-brutal btn-brutal--black">github</a>
                <a href={demo}   target="_blank" rel="noopener" className="btn-brutal btn-brutal--white">live demo</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
