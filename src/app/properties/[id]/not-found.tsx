import Link from 'next/link'

// shown when property id doesn't exist or is archived
export default function PropertyNotFound() {
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#F1F5F9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>

        {/* gold accent */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '20px', margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px',
        }}>
          🏚️
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0F1C2E', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          Property Not Found
        </h1>
        <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.6, margin: '0 0 32px' }}>
          This property may have been sold, rented, or removed from our listings.
          Browse our current available properties below.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/properties"
            style={{
              padding: '12px 28px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
              color: '#0F1C2E', fontWeight: 700, fontSize: '14px', textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(201,168,76,0.3)',
            }}
          >
            Browse Properties
          </Link>
          <Link
            href="/"
            style={{
              padding: '12px 28px', borderRadius: '12px',
              backgroundColor: '#fff', border: '1.5px solid #E2E8F0',
              color: '#374151', fontWeight: 700, fontSize: '14px', textDecoration: 'none',
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}