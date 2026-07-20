import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import DashboardClient from './DashboardClient'

async function getStats() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const [
    { count: total },
    { count: available },
    { count: sold },
    { count: featured },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'sold'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('featured', true),
  ])

  const { data: recent } = await supabase
    .from('properties')
    .select('id, title, status, price, price_type, city, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    total:     total     ?? 0,
    available: available ?? 0,
    sold:      sold      ?? 0,
    featured:  featured  ?? 0,
    recent:    recent    ?? [],
  }
}

export default async function DashboardPage() {
  const stats = await getStats()
  return <DashboardClient stats={stats} />
}