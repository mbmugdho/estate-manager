import PropertyForm from '@/components/admin/PropertyForm'

export default function AddPropertyPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ color: '#0F1C2E', fontSize: '22px', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
          New Listing
        </h2>
        <p style={{ color: '#6B7280', fontSize: '13.5px', marginTop: '6px' }}>
          Fill in the details below to publish a property.
        </p>
      </div>
      <PropertyForm mode="add" />
    </div>
  )
}