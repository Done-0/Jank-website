'use client'

import { Providers } from '@shared/providers'
import { MainFooter } from '@shared/components/layout/Footer'
import React from 'react'

export default function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className='flex min-h-screen flex-col md:px-[12.6%]'>
        <main className='flex-1'>{children}</main>
        <MainFooter />
      </div>
    </Providers>
  )
}
