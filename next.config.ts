import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  async rewrites() {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
        }
      ]
    }
    return []
  },
  typescript: { ignoreBuildErrors: true }
}

export default nextConfig
