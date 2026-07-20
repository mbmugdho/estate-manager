import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import SettingsClient from './SettingsClient'

export interface Settings {
  id:               string
  company_name:     string
  tagline:          string | null
  about:            string | null
  logo_url:         string | null
  founded_year:     number | null
  primary_phone:    string | null
  primary_whatsapp: string | null
  contact_email:    string | null
  office_address:   string | null
  office_hours:     string | null
  facebook_url:     string | null
  instagram_url:    string | null
  linkedin_url:     string | null
  youtube_url:      string | null
  stat_properties_sold: number | null
  stat_happy_clients:   number | null
  stat_cities_served:   number | null
  meta_title:       string | null
  meta_description: string | null
}

async function getSettings(): Promise<Settings | null> {
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

  const { data } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single()

  return data
}

export default async function SettingsPage() {
  const settings = await getSettings()
  if (!settings) {
    return <div>Failed to load settings.</div>
  }
  return <SettingsClient initial={settings} />
}