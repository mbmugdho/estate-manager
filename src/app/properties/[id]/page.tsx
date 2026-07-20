import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PropertyDetailClient from './PropertyDetailClient'

// full property type for detail page
export interface PropertyDetail {
  id:               string
  reference_code:   string
  title:            string
  description:      string | null
  price:            number
  price_type:       string
  property_type:    string
  bedrooms:         number | null
  bathrooms:        number | null
  area_sqft:        number | null
  city:             string
  location:         string | null
  address:          string | null
  status:           string
  featured:         boolean
  images:           string[] | null
  video_url:        string | null
  video_type:       string | null
  video_thumbnail:  string | null
  whatsapp_number:  string | null
  phone_number:     string | null
  views_count:      number
  saves_count:      number
  created_at:       string
}

export interface SimilarProperty {
  id:            string
  title:         string
  location:      string | null
  city:          string
  price:         number
  price_type:    string
  bedrooms:      number | null
  bathrooms:     number | null
  area_sqft:     number | null
  property_type: string
  featured:      boolean
  images:        string[] | null
  video_url:     string | null
}

// build supabase server client
async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
}

// fetch property by uuid
async function getProperty(id: string): Promise<PropertyDetail | null> {
  const supabase = await getSupabase()
  const { data } = await supabase
    .from('properties')
    .select(`
      id, reference_code, title, description, price, price_type,
      property_type, bedrooms, bathrooms, area_sqft, city, location,
      address, status, featured, images, video_url, video_type,
      video_thumbnail, whatsapp_number, phone_number,
      views_count, saves_count, created_at
    `)
    .eq('id', id)
    .maybeSingle()
  return data
}

// fetch similar properties — same city first, fill with same type
async function getSimilar(
  current: PropertyDetail
): Promise<SimilarProperty[]> {
  const supabase = await getSupabase()

  const { data: byCity } = await supabase
    .from('properties')
    .select('id, title, location, city, price, price_type, bedrooms, bathrooms, area_sqft, property_type, featured, images, video_url')
    .eq('status', 'available')
    .eq('city', current.city)
    .neq('id', current.id)
    .limit(4)

  if ((byCity?.length ?? 0) >= 4) return byCity as SimilarProperty[]

  // top up with same property_type from other cities
  const existingIds = [current.id, ...(byCity ?? []).map(p => p.id)]
  const needed = 4 - (byCity?.length ?? 0)

  const { data: byType } = await supabase
    .from('properties')
    .select('id, title, location, city, price, price_type, bedrooms, bathrooms, area_sqft, property_type, featured, images, video_url')
    .eq('status', 'available')
    .eq('property_type', current.property_type)
    .not('id', 'in', `(${existingIds.join(',')})`)
    .limit(needed)

  return [...(byCity ?? []), ...(byType ?? [])] as SimilarProperty[]
}

// dynamic SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) return { title: 'Property Not Found — Estate Manager' }

  const clean = property.title.replace(/^\[DEMO\]\s*/i, '')
  const image = property.images?.[0] ?? ''

  return {
    title:       `${clean} — Estate Manager Bangladesh`,
    description: `${property.property_type} in ${property.location ?? property.city}, ${property.city}. Ref: ${property.reference_code}.`,
    openGraph: {
      title:       clean,
      description: property.description?.slice(0, 160) ?? '',
      images:      image ? [{ url: image }] : [],
    },
  }
}

// page component
export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  // hide archived or missing properties from public
  if (!property || property.status === 'archived') notFound()

  const similar = await getSimilar(property)

  return (
    <PropertyDetailClient
      property={property}
      similar={similar}
    />
  )
}