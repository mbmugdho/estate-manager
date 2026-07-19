import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    // delete only properties with [DEMO] in the title
    const { data, error } = await supabase
      .from('properties')
      .delete()
      .like('title', '[DEMO]%')
      .select('id')

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // also clear related notifications for those properties
    await supabase
      .from('notifications')
      .delete()
      .in('property_id', (data ?? []).map(p => p.id))

    return NextResponse.json({
      success: true,
      count: data?.length ?? 0,
      message: `Cleared ${data?.length ?? 0} demo properties`,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}