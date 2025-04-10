import { Suspense } from 'react'
import { cn } from '@shared/lib/utils'
import '@shared/styles/globals.css'
import { Inter } from 'next/font/google'
import { metadata as seoMetadata } from '@shared/components/layout/Header'
import ClientHead from '@/shared/components/layout/ClientHead'
import ClientLayout from '@/shared/components/layout/ClientBody'

const inter = Inter({ subsets: ['latin'] })

export const metadata = seoMetadata

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <Suspense fallback={null}>
          <ClientHead />
        </Suspense>
      </head>
      <body className={cn('min-h-screen bg-background', inter.className)}>
        <Suspense fallback={null}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  )
}
