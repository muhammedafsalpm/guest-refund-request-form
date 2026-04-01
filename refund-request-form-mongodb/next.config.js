/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'yourdomain.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongodb', 'mongoose'],
  },
}

module.exports = nextConfig
