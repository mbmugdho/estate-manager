import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import PropertiesListingClient from './PropertiesListingClient'

// server component — fetches all available properties
async function getAllProperties() {
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
    .from('properties')
    .select('id, title, location, city, price, price_type, bedrooms, bathrooms, area_sqft, property_type, featured, images, video_url, created_at, views_count')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  return data ?? []
}

export const metadata = {
  title:       'All Properties — Estate Manager Bangladesh',
  description: 'Browse verified apartments, villas, plots and commercial spaces across Dhaka, Chittagong and Rangpur.',
}

export default async function PropertiesPage() {
  const properties = await getAllProperties()
  return <PropertiesListingClient properties={properties} />
}