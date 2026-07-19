import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import PropertiesClient from './PropertiesClient'

export interface Property {
  id:              string
  reference_code:  string
  title:           string
  description:     string | null
  price:           number
  price_type:      string
  property_type:   string
  bedrooms:        number | null
  bathrooms:       number | null
  area_sqft:       number | null
  city:            string
  location:        string | null
  status:          string
  featured:        boolean
  images:          string[] | null
  video_url:      string | null   
  video_type:     string | null
  created_at:      string
}

async function getProperties(): Promise<Property[]> {
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

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch error:', error)
    return []
  }
  return data ?? []
}

export default async function PropertiesPage() {
  const properties = await getProperties()
  return <PropertiesClient initialProperties={properties} />
}