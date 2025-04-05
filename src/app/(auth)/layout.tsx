import { Navbar } from '@shared/components/custom/Navbar'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
