import { MainFooter } from '@/shared/components/layout/Footer'
import { cn } from '@/shared/lib/utils'
import { Providers } from '@/shared/providers'
import '@/shared/styles/globals.css'
import { Inter } from 'next/font/google'
import { metadata as seoMetadata } from '@/shared/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = seoMetadata

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background', inter.className)}>
        <Providers>
          <div className='flex min-h-screen flex-col md:px-[12.6%]'>
            <main className='flex-1'>{children}</main>
            <MainFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
