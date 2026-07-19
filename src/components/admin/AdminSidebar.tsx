'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, LayoutDashboard, Building, PlusCircle,
  LogOut, Menu, X, ChevronRight, Settings,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',      href: '/admin/dashboard',      icon: LayoutDashboard },
  { label: 'All Properties', href: '/admin/properties',     icon: Building        },
  { label: 'Add Property',   href: '/admin/properties/add', icon: PlusCircle      },
  { label: 'Settings',       href: '/admin/settings',       icon: Settings        },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  function isActive(href: string) {
    if (href === '/admin/dashboard')  return pathname === href
    if (href === '/admin/properties') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* mobile hamburger */}
      {!isDesktop && (
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 50,
            width: '44px',
            height: '44px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
          }}
        >
          <Menu style={{ width: '20px', height: '20px', color: '#0F1C2E' }} />
        </button>
      )}

      {/* desktop sidebar — always in DOM, shown via inline style */}
      {isDesktop && (
        <aside
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '280px',
            height: '100vh',
            backgroundColor: '#080F1D',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 40,
            borderRight: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <SidebarInner
            isActive={isActive}
            loggingOut={loggingOut}
            onLogout={handleLogout}
          />
        </aside>
      )}

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && !isDesktop && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 40,
              }}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '280px',
                height: '100vh',
                backgroundColor: '#080F1D',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 50,
                borderRight: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <X style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.4)' }} />
              </button>
              <SidebarInner
                isActive={isActive}
                loggingOut={loggingOut}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function SidebarInner({
  isActive,
  loggingOut,
  onLogout,
}: {
  isActive: (href: string) => boolean
  loggingOut: boolean
  onLogout: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* logo */}
      <div style={{ padding: '28px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(201,168,76,0.25)',
              flexShrink: 0,
            }}
          >
            <Building2 style={{ width: '20px', height: '20px', color: '#fff' }} />
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', lineHeight: 1.2, margin: 0 }}>
              Estate Manager
            </p>
            <p
              style={{
                color: 'rgba(201,168,76,0.6)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* divider */}
      <div
        style={{
          margin: '0 24px',
          height: '1px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)',
        }}
      />

      {/* nav label */}
      <div style={{ padding: '24px 24px 12px' }}>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          Navigation
        </p>
      </div>

      {/* nav items */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
                color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                background: active
                  ? 'linear-gradient(135deg, #C9A84C 0%, #B8943F 100%)'
                  : 'transparent',
                boxShadow: active ? '0 4px 16px rgba(201,168,76,0.25)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <item.icon
                  style={{
                    width: '17px',
                    height: '17px',
                    color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                  }}
                />
                {item.label}
              </span>
              {active && (
                <ChevronRight style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.6)' }} />
              )}
            </a>
          )
        })}
      </nav>

      {/* bottom */}
      <div style={{ padding: '0 12px 24px', marginTop: '8px' }}>
        <div
          style={{
            margin: '0 12px 16px',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)',
          }}
        />

        {/* user card */}
        <div
          style={{
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '8px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(201,168,76,0.2)',
                flexShrink: 0,
              }}
            >
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>D</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  color: '#fff',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Demo Admin
              </p>
              <p
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '11px',
                  marginTop: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                demo@estatemanager.com
              </p>
            </div>
          </div>
        </div>

        {/* logout */}
        <button
          onClick={onLogout}
          disabled={loggingOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 500,
            width: '100%',
            color: 'rgba(255,255,255,0.3)',
            background: 'transparent',
            border: 'none',
            cursor: loggingOut ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: loggingOut ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'
            e.currentTarget.style.color = '#F87171'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
          }}
        >
          <LogOut style={{ width: '16px', height: '16px' }} />
          {loggingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}