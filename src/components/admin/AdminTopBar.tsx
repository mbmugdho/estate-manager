'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Bell, Search } from 'lucide-react'

export default function AdminTopBar() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setEmail(session.user.email || '')
    }
    getUser()
  }, [])

  const initial = email ? email.charAt(0).toUpperCase() : 'A'

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-[72px] bg-white/80 backdrop-blur-xl border-b border-gray-200/60 flex items-center justify-between px-5 sm:px-8 lg:px-10 sticky top-0 z-30"
    >
      {/* left — search */}
      <div className="hidden sm:flex items-center gap-3 bg-[#F1F5F9] rounded-xl px-4 py-2.5 w-80 group focus-within:ring-2 focus-within:ring-[#C9A84C]/20 focus-within:bg-white focus-within:border-[#C9A84C]/30 border border-transparent transition-all duration-300">
        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-[#C9A84C] transition-colors duration-200" />
        <input
          type="text"
          placeholder="Search properties..."
          className="bg-transparent text-sm text-[#0F1C2E] placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* spacer for mobile */}
      <div className="sm:hidden w-12" />

      {/* right */}
      <div className="flex items-center gap-3">

        {/* notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl flex items-center justify-center transition-colors duration-200"
        >
          <Bell className="w-[18px] h-[18px] text-gray-500" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C9A84C] rounded-full flex items-center justify-center ring-2 ring-white">
            <span className="text-[9px] font-bold text-white">3</span>
          </span>
        </motion.button>

        {/* divider */}
        <div className="w-px h-8 bg-gray-200/80 mx-1" />

        {/* user */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0F1C2E] to-[#1A3C5E] rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">{initial}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold text-[#0F1C2E]">Admin</p>
            <p className="text-[11px] text-gray-400 -mt-0.5">{email}</p>
          </div>
        </div>

      </div>
    </motion.header>
  )
}