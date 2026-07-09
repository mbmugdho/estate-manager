'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  LayoutDashboard,
  Building,
  PlusCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'All Properties', href: '/admin/properties', icon: Building },
  { label: 'Add Property', href: '/admin/properties/add', icon: PlusCircle },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // handle logout
  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // check active
  function isActive(href: string) {
    if (href === '/admin/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  // sidebar content (shared between mobile and desktop)
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* logo */}
      <div className="px-8 py-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[#C9A84C] to-[#B8943F] rounded-xl flex items-center justify-center shadow-lg shadow-[#C9A84C]/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base tracking-tight">Estate Manager</h2>
            <p className="text-[#C9A84C]/60 text-[11px] font-medium tracking-wide">ADMIN PANEL</p>
          </div>
        </div>
      </div>

      {/* divider */}
      <div className="mx-6 h-px bg-white/[0.06]" />

      {/* label */}
      <div className="px-8 pt-8 pb-3">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Menu</p>
      </div>

      {/* nav links */}
      <nav className="flex-1 px-5 space-y-1">
        {navItems.map((item, index) => {
          const active = isActive(item.href)
          return (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`
                flex items-center justify-between px-4 py-3.5 rounded-xl text-[13px] font-medium
                transition-all duration-200 group relative overflow-hidden
                ${active
                  ? 'bg-gradient-to-r from-[#C9A84C] to-[#B8943F] text-white shadow-lg shadow-[#C9A84C]/20'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white/80'
                }
              `}
            >
              <div className="flex items-center gap-3 z-10">
                <item.icon className={`w-[18px] h-[18px] ${active ? 'text-white' : 'text-white/30 group-hover:text-white/60'} transition-colors duration-200`} />
                <span>{item.label}</span>
              </div>
              {active && <ChevronRight className="w-4 h-4 text-white/60" />}
            </motion.a>
          )
        })}
      </nav>

      {/* bottom */}
      <div className="px-5 pb-6 space-y-2">
        <div className="mx-1 h-px bg-white/[0.06] mb-4" />

        {/* user card */}
        <div className="bg-white/[0.03] rounded-xl px-4 py-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#C9A84C] to-[#B8943F] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Demo Admin</p>
              <p className="text-white/25 text-[10px] truncate">demo@estatemanager.com</p>
            </div>
          </div>
        </div>

        {/* logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-50 w-11 h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <Menu className="w-5 h-5 text-[#0F1C2E]" />
      </button>

      {/* desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 w-72 h-screen bg-[#0A1628] z-40">
        {sidebarContent}
      </aside>

      {/* mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* mobile sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 w-72 h-screen bg-[#0A1628] z-50"
            >
              {/* close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-6 right-5 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>

              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}