import PropertyForm from '@/components/admin/PropertyForm'
import { createSupabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'

export default async function AddPropertyPage() {
  const supabase = await createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/admin/login')

  return <PropertyForm />
}