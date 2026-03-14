import NavPill from '@/components/NavPill'
import HeroSection from '@/components/HeroSection'
import MarqueeSection from '@/components/MarqueeSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import ProjectsSection from '@/components/ProjectsSection'
import BlogsSection from '@/components/BlogsSection'
import FaqSection from '@/components/FaqSection'
import CtaSection from '@/components/CtaSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <NavPill />
      <main id="main-content">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <BlogsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
