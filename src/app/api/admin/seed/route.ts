import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SEED_PROPERTIES } from '@/lib/seedData'

// admin client with service role (bypasses RLS)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST() {
  try {
    const supabase = getAdminClient()

    // insert all seed properties
    const { data, error } = await supabase
      .from('properties')
      .insert(SEED_PROPERTIES)
      .select('id')

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      count: data?.length ?? 0,
      message: `Successfully seeded ${data?.length ?? 0} demo properties`,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}