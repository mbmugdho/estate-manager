'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Building, DollarSign, MapPin, Star, Plus, ArrowUpRight } from 'lucide-react'

// animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const stats = [
  { label: 'Total Properties', value: '0', icon: Building, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
  { label: 'Available', value: '0', icon: DollarSign, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Sold / Rented', value: '0', icon: MapPin, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50' },
  { label: 'Featured', value: '0', icon: Star, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
]

export default function DashboardPage() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setEmail(session.user.email || '')
    }
    getUser()
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* page header */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#0F1C2E] tracking-tight">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1.5">Welcome back! Here is your property overview.</p>
          </div>
          <motion.a
            href="/admin/properties/add"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A84C] to-[#B8943F] hover:from-[#B8943F] hover:to-[#A6832E] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-[#C9A84C]/20 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </motion.a>
        </div>
      </motion.div>

      {/* stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-5">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: stat.color.includes('blue') ? '#3B82F6' : stat.color.includes('emerald') ? '#10B981' : stat.color.includes('orange') ? '#F97316' : '#8B5CF6' }} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-3xl font-black text-[#0F1C2E] tracking-tight">{stat.value}</p>
            <p className="text-gray-400 text-[13px] mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* recent properties */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        {/* header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#0F1C2E]">Recent Properties</h2>
            <p className="text-gray-400 text-[13px] mt-0.5">Your latest listings</p>
          </div>
          <a
            href="/admin/properties"
            className="text-[#C9A84C] hover:text-[#B8943F] text-sm font-semibold transition-colors duration-200"
          >
            View All
          </a>
        </div>

        {/* empty state */}
        <div className="text-center py-20 px-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="w-20 h-20 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="w-9 h-9 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-[#0F1C2E] mb-2">No Properties Yet</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
              Start building your portfolio by adding your first property listing
            </p>
            <motion.a
              href="/admin/properties/add"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#0F1C2E] hover:bg-[#1A3C5E] text-white text-sm font-bold px-7 py-3.5 rounded-xl transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Your First Property
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}