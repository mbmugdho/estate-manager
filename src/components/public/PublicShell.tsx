'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/public/Navbar'

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // admin routes get no navbar, no container cap
  if (pathname.startsWith('/admin')) return <>{children}</>

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}