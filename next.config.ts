import type { NextConfig } from 'next'

/**
 * Jank 配置
 * 支持开发/生产环境自动切换、性能优化与安全配置
 */

// 环境配置
const isProd = process.env.NEXT_PUBLIC_ENV === 'production'
const securityHeaders = [
  {
    source: '/:path*',
    headers: [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
    ]
  }
]

// 基础配置
const baseConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' }
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  } as any,
  headers: async () => securityHeaders
}

// 生产环境扩展
const prodExtend = isProd
  ? {
      compiler: { removeConsole: { exclude: ['error', 'warn'] } },
      webpack: (config: any, { dev, isServer }: any) => {
        if (!dev && !isServer) {
          config.optimization.minimize = true
          config.optimization.splitChunks = {
            chunks: 'all'
          }
        }
        return config
      },
      headers: async () => [
        ...securityHeaders,
        {
          source: '/(.*)\\.(jpg|png|webp|js|css|woff2)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable'
            }
          ]
        },
        {
          source: '/(.*)\\.(svg)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable'
            },
            {
              key: 'Access-Control-Allow-Origin',
              value: '*'
            },
            {
              key: 'Timing-Allow-Origin',
              value: '*'
            },
            {
              key: 'Vary',
              value: 'Accept'
            }
          ]
        },
        {
          // 为SEO预览图提供特殊头信息
          source: '/_next/image',
          headers: [
            {
              key: 'Vary',
              value: 'Accept'
            }
          ]
        }
      ]
    }
  : {}

export default { ...baseConfig, ...prodExtend }
