import React, { Suspense } from 'react'
import { cn } from '@shared/lib/utils'
import '@shared/styles/globals.css'
import { Inter } from 'next/font/google'
import { seoConfig } from '@shared/config/seo.config'
import { siteConfig } from '@shared/config/site.config'
import ClientHead from '@/shared/components/layout/ClientHead'
import ClientLayout from '@/shared/components/layout/ClientBody'
import { GoogleAnalytics } from '@/shared/components/custom/Analytics'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

/**
 * 全局元数据配置
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: seoConfig.meta.title,
    template: seoConfig.meta.titleTemplate
  },
  description: seoConfig.meta.description,
  keywords: seoConfig.meta.keywords,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.ico'
  },
  openGraph: {
    title: seoConfig.meta.title,
    description: seoConfig.meta.description,
    url: siteConfig.url,
    siteName: seoConfig.social.og.siteName,
    images: [
      {
        url: `${siteConfig.url}/images/home-black.png`,
        width: 1280,
        height: 720,
        alt: 'Jank博客系统预览',
        type: 'image/png'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.meta.title,
    description: seoConfig.meta.description,
    images: [`${siteConfig.url}/images/home-black.png`]
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': `${siteConfig.url}/rss.xml`
    }
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <meta name='robots' content='index, follow, max-image-preview:large' />
        <link
          rel='search'
          type='application/opensearchdescription+xml'
          title={siteConfig.name}
          href='/opensearch.xml'
        />
        <ClientHead />
        <GoogleAnalytics />
      </head>
      <body className={cn('min-h-screen bg-background', inter.className)}>
        <Suspense fallback={null}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  )
}
