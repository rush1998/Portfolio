import Image from 'next/image'

const AWS_CHIPS = ['IAM','EC2','S3','Lambda','EKS','CloudWatch','CodePipeline','Cost Explorer']
const DEVOPS_ITEMS = [
  'Terraform / HCL','Kubernetes & Helm','ArgoCD / GitOps',
  'Jenkins / GitHub Actions','Ansible / Puppet','Docker',
]
const AZURE_CHIPS = ['Entra ID','Azure Monitor','Cost Mgmt','Compute','Networking','Load Balancer']
const STACK_PILLS = ['HTML','CSS','JavaScript','Node.js','React','MongoDB','Git','Python']
const CERTS = [
  { src: '/blob.png',   alt: 'HashiCorp Terraform',     label: 'HashiCorp Terraform' },
  { src: '/aws-1.png',  alt: 'AWS Cloud Practitioner',  label: 'AWS Cloud Practitioner' },
  { src: '/aws-2.png',  alt: 'AWS Solutions Architect', label: 'AWS Solutions Architect' },
  { src: '/az-900.jpg', alt: 'Azure Fundamentals',      label: 'Azure Fundamentals' },
]

export default function SkillsSection() {
  return (
    <section className="bento-section" id="skills">
      <div className="section-header">
        <span className="section-label">what i know</span>
        <h2 className="section-title">experience &amp; certs.</h2>
      </div>
      <div className="bento-grid">

        {/* Card A: AWS */}
        <div className="bento-card bento-card--a" style={{ ['--rot' as string]: '-1deg' }}>
          <p className="bento-card-label">amazon web services</p>
          <div className="skill-chips">
            {AWS_CHIPS.map(c => <span key={c} className="chip">{c}</span>)}
          </div>
          <div className="bento-icon-pop" aria-hidden="true">☁️</div>
        </div>

        {/* Card B: DevOps Toolkit */}
        <div className="bento-card bento-card--b" style={{ ['--rot' as string]: '2deg' }}>
          <p className="bento-card-label bento-card-label--light">devops toolkit</p>
          <ul className="neon-list">
            {DEVOPS_ITEMS.map(item => (
              <li key={item}><span className="neon-dot">✦</span> {item}</li>
            ))}
          </ul>
        </div>

        {/* Card C: Certs */}
        <div className="bento-card bento-card--c" style={{ ['--rot' as string]: '-0.5deg' }}>
          <p className="bento-card-label bento-card-label--light">my certifications</p>
          <div className="cert-dashboard">
            {CERTS.map(({ src, alt, label }) => (
              <div key={label} className="cert-item">
                <Image src={src} alt={alt} width={60} height={60} className="cert-img" loading="lazy" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card D: Azure */}
        <div className="bento-card bento-card--d" style={{ ['--rot' as string]: '1.5deg' }}>
          <p className="bento-card-label">microsoft azure</p>
          <div className="skill-chips">
            {AZURE_CHIPS.map(c => <span key={c} className="chip chip--purple">{c}</span>)}
          </div>
          <div className="bento-icon-pop" aria-hidden="true">🔷</div>
        </div>

        {/* Card E: Full Stack */}
        <div className="bento-card bento-card--e" style={{ ['--rot' as string]: '-2deg' }}>
          <p className="bento-card-label bento-card-label--light">full stack dev</p>
          <div className="stack-pills">
            {STACK_PILLS.map(p => <span key={p} className="stack-pill">{p}</span>)}
          </div>
        </div>

      </div>
    </section>
  )
}
