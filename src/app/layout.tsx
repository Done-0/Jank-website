import { MainFooter } from '@/shared/components/layout/Footer'
import { OptimizedResources } from '@/shared/lib/seo'
import { createMetadata } from '@/shared/lib/seo/metadata'
import { cn } from '@/shared/lib/utils'
import { Providers } from '@/shared/providers'
import '@/shared/styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = createMetadata({})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <OptimizedResources />
      </head>
      <body className={cn(inter.className, 'min-h-screen bg-background')}>
        <Providers>
          <div className='flex flex-col min-h-screen md:px-[12.6%]'>
            <div className='flex-1 space-y-4'>{children}</div>
            <MainFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
