'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Building2,
  LayoutDashboard,
  Building,
  PlusCircle,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react'

// nav items
const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Properties', href: '/admin/properties', icon: Building },
  { label: 'Add Property', href: '/admin/properties/add', icon: PlusCircle },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // handle logout
  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // check active link
  function isActive(href: string) {
    if (href === '/admin/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm"
      >
        <Menu className="w-5 h-5 text-[#0F1C2E]" />
      </button>

      {/* mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[#0F1C2E] z-50
          flex flex-col transition-all duration-300
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* logo area */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-white font-bold text-sm whitespace-nowrap">Estate Manager</h2>
                <p className="text-[#C9A84C] text-[10px] font-medium">Admin Panel</p>
              </div>
            )}
          </div>

          {/* close on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* divider */}
        <div className="mx-4 h-px bg-white/10" />

        {/* nav links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${active
                    ? 'bg-[#C9A84C] text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </a>
            )
          })}
        </nav>

        {/* bottom section */}
        <div className="p-4 space-y-2">
          {/* divider */}
          <div className="mx-0 h-px bg-white/10 mb-3" />

          {/* collapse toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 w-full"
          >
            <ChevronLeft className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>}
          </button>
        </div>

      </aside>
    </>
  )
}