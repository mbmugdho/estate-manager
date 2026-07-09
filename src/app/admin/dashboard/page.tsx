import { createSupabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import { Building, DollarSign, MapPin, Star } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/admin/login')

  // placeholder stats
  const stats = [
    { label: 'Total Properties', value: '0', icon: Building, color: 'bg-blue-50 text-blue-500' },
    { label: 'Available', value: '0', icon: DollarSign, color: 'bg-green-50 text-green-500' },
    { label: 'Sold / Rented', value: '0', icon: MapPin, color: 'bg-orange-50 text-orange-500' },
    { label: 'Featured', value: '0', icon: Star, color: 'bg-purple-50 text-purple-500' },
  ]

  return (
    <div>
      {/* page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F1C2E]">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here is your property overview.</p>
      </div>

      {/* stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#0F1C2E]">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* recent properties placeholder */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#0F1C2E]">Recent Properties</h2>
            <p className="text-gray-400 text-sm">Your latest listings</p>
          </div>
          <a
            href="/admin/properties/add"
            className="bg-[#C9A84C] hover:bg-[#B8943F] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors duration-200"
          >
            + Add Property
          </a>
        </div>

        {/* empty state */}
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-300 mb-2">No Properties Yet</h3>
          <p className="text-gray-400 text-sm mb-6">Start by adding your first property listing</p>
          <a
            href="/admin/properties/add"
            className="inline-flex items-center gap-2 bg-[#0F1C2E] hover:bg-[#1A3C5E] text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors duration-200"
          >
            + Add Your First Property
          </a>
        </div>
      </div>
    </div>
  )
}