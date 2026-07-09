'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bell, Search } from 'lucide-react'

export default function AdminTopBar() {
  const [email, setEmail] = useState('')

  // get current user email
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setEmail(session.user.email || '')
    }
    getUser()
  }, [])

  // get first letter for avatar
  const initial = email ? email.charAt(0).toUpperCase() : 'A'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      {/* left — search */}
      <div className="hidden sm:flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-72">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search properties..."
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* spacer for mobile */}
      <div className="sm:hidden" />

      {/* right — user info */}
      <div className="flex items-center gap-4">

        {/* notification bell */}
        <button className="relative w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors duration-200">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] rounded-full flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">3</span>
          </span>
        </button>

        {/* divider */}
        <div className="w-px h-8 bg-gray-200" />

        {/* user avatar + info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#0F1C2E] rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">{initial}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#0F1C2E]">Admin</p>
            <p className="text-xs text-gray-400">{email}</p>
          </div>
        </div>

      </div>

    </header>
  )
}