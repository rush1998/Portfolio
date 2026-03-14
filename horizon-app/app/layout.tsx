import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rushabh Patel — DevOps Engineer',
  description:
    'Rushabh Patel is a DevOps Engineer and Cloud Architect specializing in AWS, Azure, Terraform, Kubernetes, CI/CD, and full-stack development.',
  keywords:
    'Rushabh Patel, DevOps Engineer, Cloud Architect, AWS, Azure, Terraform, Kubernetes, CI/CD, Full Stack Developer',
  authors: [{ name: 'Rushabh Patel' }],
  robots: 'index, follow, max-image-preview:large',
  themeColor: '#0a0a0a',
  openGraph: {
    type: 'website',
    title: 'Rushabh Patel — DevOps Engineer',
    description: 'Portfolio of Rushabh Patel: DevOps Engineer, Cloud Architect, and Full-Stack Developer.',
    images: [{ url: '/main.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rushabh Patel — DevOps Engineer',
    description: 'DevOps Engineer and Cloud Architect specializing in AWS, Azure, Terraform, and Kubernetes.',
    images: ['/main.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rushabh Patel',
  jobTitle: 'DevOps Engineer',
  description: 'DevOps Engineer and Cloud Architect specializing in AWS, Azure, Terraform, Kubernetes, and CI/CD.',
  url: 'https://rushabhpatel.dev',
  image: '/main.jpg',
  homeLocation: { '@type': 'Country', name: 'Canada' },
  sameAs: [
    'https://www.linkedin.com/in/prushabh/',
    'https://github.com/rush1998',
    'https://medium.com/@rushpatel',
  ],
  knowsAbout: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'CI/CD', 'DevOps', 'Full Stack Development'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
