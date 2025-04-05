import type { NextConfig } from 'next'

/**
 * Jank 配置
 * 支持开发/生产环境自动切换、性能优化与安全配置
 */

// 环境配置
const isProd = process.env.NEXT_PUBLIC_ENV === 'production'
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://127.0.0.1:9010/api'
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
  images: {
    formats: ['image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  } as any,
  rewrites: async () =>
    apiUrl
      ? [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/:path*`
        }
      ]
      : [],
  headers: async () => securityHeaders
}

// 生产环境扩展
const prodExtend = isProd
  ? {
    compiler: { removeConsole: { exclude: ['error', 'warn'] } },
    webpack: (cfg: any) => ({
      ...cfg,
      optimization: {
        ...cfg.optimization,
        minimize: true,
        splitChunks: { chunks: 'all' }
      }
    }),
    headers: async () => [
      ...securityHeaders,
      {
        source: '/(.*)\\.(jpg|png|webp|svg|js|css|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
  : {}

export default { ...baseConfig, ...prodExtend }
