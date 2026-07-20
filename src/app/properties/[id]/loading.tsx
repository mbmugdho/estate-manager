// skeleton shown while server fetches property
export default function PropertyDetailLoading() {
  return (
    <div style={{ backgroundColor: '#F1F5F9', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>

        {/* breadcrumb skeleton */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[80, 90, 70, 120].map(w => (
            <div key={w} style={{ width: `${w}px`, height: '14px', borderRadius: '6px', backgroundColor: '#E2E8F0' }} className="animate-pulse" />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '28px' }}>
          {/* left */}
          <div style={{ flex: '0 0 62%' }}>
            <div style={{ width: '100%', paddingTop: '62.5%', borderRadius: '20px', backgroundColor: '#E2E8F0', marginBottom: '16px', position: 'relative' }} className="animate-pulse" />
            {[1, 2].map(i => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '16px' }}>
                <div style={{ width: '120px', height: '16px', borderRadius: '6px', backgroundColor: '#E2E8F0', marginBottom: '16px' }} className="animate-pulse" />
                {[100, 90, 85, 95].map((w, j) => (
                  <div key={j} style={{ width: `${w}%`, height: '13px', borderRadius: '4px', backgroundColor: '#F1F5F9', marginBottom: '10px' }} className="animate-pulse" />
                ))}
              </div>
            ))}
          </div>

          {/* right */}
          <div style={{ flex: '0 0 38%' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ height: '4px', backgroundColor: '#E8D48B' }} />
              <div style={{ padding: '24px' }}>
                {[60, 100, 70, 80].map((w, i) => (
                  <div key={i} style={{ width: `${w}%`, height: i === 2 ? '48px' : '14px', borderRadius: '8px', backgroundColor: '#E2E8F0', marginBottom: '16px' }} className="animate-pulse" />
                ))}
                <div style={{ height: '48px', borderRadius: '12px', backgroundColor: '#25D366', opacity: 0.3, marginBottom: '8px' }} className="animate-pulse" />
                <div style={{ height: '48px', borderRadius: '12px', backgroundColor: '#0F1C2E', opacity: 0.2 }} className="animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}