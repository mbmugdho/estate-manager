import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import AboutClient from './AboutClient'

interface Settings {
  company_name: string | null
  tagline: string | null
  about: string | null
  logo_url: string | null
  founded_year: number | null
  stat_properties_sold: number | null
  stat_happy_clients: number | null
  stat_cities_served: number | null
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
    .select('company_name, tagline, about, logo_url, founded_year, stat_properties_sold, stat_happy_clients, stat_cities_served')
    .limit(1)
    .maybeSingle()

  return data
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const name = settings?.company_name ?? 'Estate Manager'
  return {
    title: `About — ${name}`,
    description: settings?.about?.slice(0, 160) ?? `Learn about ${name}, a trusted real estate developer in Bangladesh.`,
  }
}

export default async function AboutPage() {
  const settings = await getSettings()
  return (
    <>
      <Navbar />
      <AboutClient settings={settings} />
      <Footer />
    </>
  )
}