import { Suspense } from "react"
import { Navbar } from '@shared/components/custom/Navbar'
import { ReactNode } from 'react'

interface PortalLayoutProps {
  children: ReactNode
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
