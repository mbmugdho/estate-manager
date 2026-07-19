import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Hero from '@/components/public/Hero'
import FeaturedProperties from '@/components/public/FeaturedProperties'
import WhyChooseUs from '@/components/public/WhyChooseUs'
import PropertyTypes from '@/components/public/PropertyTypes'
import LatestListings from '@/components/public/LatestListings'

// fetch server side
async function getData() {
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

  // featured
  const featuredQ = supabase
    .from('properties')
    .select('id, title, location, city, price, price_type, bedrooms, bathrooms, area_sqft, property_type, featured, images, video_url')
    .eq('featured', true)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(4)

  // latest (any available property, ordered by newest)
  const latestQ = supabase
    .from('properties')
    .select('id, title, location, city, price, price_type, bedrooms, bathrooms, area_sqft, property_type, images, created_at')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(6)

  const [{ data: featured }, { data: latest }] = await Promise.all([featuredQ, latestQ])
  return { featured: featured ?? [], latest: latest ?? [] }
}

export default async function Home() {
  const { featured, latest } = await getData()

  return (
    <main>
      <Hero />
      <FeaturedProperties properties={featured} />
      <WhyChooseUs />
      <PropertyTypes />
      <LatestListings properties={latest} />
    </main>
  )
}