'use client'

import { useState, useEffect } from 'react'

// wraps content and applies sidebar offset on desktop
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div
      style={{
        marginLeft: isDesktop ? '280px' : '0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.2s',
      }}
    >
      {children}
    </div>
  )
}