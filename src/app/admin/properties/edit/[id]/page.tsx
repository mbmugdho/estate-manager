import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import PropertyForm from '@/components/admin/PropertyForm'

// fetch single property server-side
async function getProperty(id: string) {
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
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params
  const property = await getProperty(id)

  // 404 if property doesn't exist
  if (!property) notFound()

  // shape data for PropertyForm initialData
  const initialData = {
    id:              property.id,
    reference_code:  property.reference_code,
    title:           property.title,
    description:     property.description    ?? '',
    price:           String(property.price),
    price_type:      property.price_type     ?? 'sale',
    property_type:   property.property_type  ?? 'apartment',
    bedrooms:        property.bedrooms       != null ? String(property.bedrooms)  : '',
    bathrooms:       property.bathrooms      != null ? String(property.bathrooms) : '',
    area_sqft:       property.area_sqft      != null ? String(property.area_sqft) : '',
    city:            property.city           ?? '',
    location:        property.location       ?? '',
    address:         property.address        ?? '',
    status:          property.status         ?? 'available',
    featured:        property.featured       ?? false,
    whatsapp_number: property.whatsapp_number ?? '',
    phone_number:    property.phone_number    ?? '',
    video_url:       property.video_url       ?? '',
    video_type:      property.video_type      ?? '',
    images:          property.images          ?? [],
  }

  return (
    <main style={{ padding: '28px 24px', maxWidth: '1400px' }}>

      {/* page header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '999px',
            backgroundColor: '#C9A84C',
          }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Editing
          </span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>
          {property.title}
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px' }}>
          Last updated {new Date(property.updated_at ?? property.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </p>
      </div>

      <PropertyForm mode="edit" initialData={initialData} />
    </main>
  )
}