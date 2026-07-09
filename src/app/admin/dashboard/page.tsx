import { createSupabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  // double check protection
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#0F1C2E] mb-2">
          🎉 Dashboard Coming Next
        </h1>
        <p className="text-gray-500">
          Logged in as: {session.user.email}
        </p>
      </div>
    </div>
  )
}