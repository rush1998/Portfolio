/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow external Medium CDN images in BlogsSection
    remotePatterns: [
      { protocol: 'https', hostname: 'miro.medium.com' },
      { protocol: 'https', hostname: 'cdn-images-1.medium.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
  },
}
export default nextConfig
