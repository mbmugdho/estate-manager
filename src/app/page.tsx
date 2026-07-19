import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Hero from '@/components/public/Hero'
import FeaturedProperties from '@/components/public/FeaturedProperties'
import WhyChooseUs from '@/components/public/WhyChooseUs'
import PropertyTypes from '@/components/public/PropertyTypes'

async function getFeatured() {
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
    .select('id, title, location, city, price, price_type, bedrooms, bathrooms, area_sqft, property_type, featured, images, video_url')
    .eq('featured', true)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(4)

  return data ?? []
}

export default async function Home() {
  const featured = await getFeatured()

  return (
    <main>
      <Hero />
      <FeaturedProperties properties={featured} />
      <WhyChooseUs />
      <PropertyTypes />
    </main>
  )
}