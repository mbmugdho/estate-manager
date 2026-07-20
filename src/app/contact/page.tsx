import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ContactClient from './ContactClient'

interface ContactSettings {
  company_name: string | null
  primary_phone: string | null
  primary_whatsapp: string | null
  contact_email: string | null
  office_address: string | null
  office_hours: string | null
  facebook_url: string | null
  instagram_url: string | null
  linkedin_url: string | null
  youtube_url: string | null
}

async function getSettings(): Promise<ContactSettings | null> {
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
    .select('company_name, primary_phone, primary_whatsapp, contact_email, office_address, office_hours, facebook_url, instagram_url, linkedin_url, youtube_url')
    .limit(1)
    .maybeSingle()

  return data
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const name = settings?.company_name ?? 'Estate Manager'
  return {
    title: `Contact — ${name}`,
    description: `Get in touch with ${name}. Call, WhatsApp, or visit our office in Bangladesh.`,
  }
}

export default async function ContactPage() {
  const settings = await getSettings()
  return (
    <>
      <Navbar />
      <ContactClient settings={settings} />
      <Footer />
    </>
  )
}