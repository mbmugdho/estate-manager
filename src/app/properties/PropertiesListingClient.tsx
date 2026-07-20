'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, X, SlidersHorizontal, MapPin, Home, DollarSign, TrendingUp, ArrowDown } from 'lucide-react'
import PropertyCard, { PropertyCardData } from '@/components/public/PropertyCard'

interface Property extends PropertyCardData {
  created_at:   string
  views_count?: number
}

const TYPES = [
  { value: 'all',        label: 'All Types' },
  { value: 'apartment',  label: 'Apartment' },
  { value: 'villa',      label: 'Villa' },
  { value: 'plot',       label: 'Plot' },
  { value: 'office',     label: 'Office' },
  { value: 'townhouse',  label: 'Townhouse' },
  { value: 'studio',     label: 'Studio' },
  { value: 'penthouse',  label: 'Penthouse' },
]

const PRICE_RANGES = [
  { value: 'all',        label: 'Any Price',      min: 0,        max: Infinity },
  { value: 'under-50l',  label: 'Under ৳50 Lac',  min: 0,        max: 5000000 },
  { value: '50l-1cr',    label: '৳50 Lac – 1 Cr', min: 5000000,  max: 10000000 },
  { value: '1cr-5cr',    label: '৳1 – 5 Cr',      min: 10000000, max: 50000000 },
  { value: '5cr-plus',   label: '৳5 Cr and above', min: 50000000, max: Infinity },
]

const SORTS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'views-desc', label: 'Most Viewed' },
]

const INITIAL_COUNT = 12
const STEP          = 12

export default function PropertiesListingClient({ properties }: { properties: Property[] }) {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [isDesktop,   setIsDesktop]   = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)

  // filter state — initialised from URL
  const [query, setQuery] = useState('')
  const [city,  setCity]  = useState('all')
  const [type,  setType]  = useState(searchParams.get('type')  ?? 'all')
  const [price, setPrice] = useState('all')
  const [sort,  setSort]  = useState('newest')

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // sync URL query params on mount
  useEffect(() => {
    const urlCity  = searchParams.get('city')
    const urlType  = searchParams.get('type')
    const urlPrice = searchParams.get('price')
    const urlSort  = searchParams.get('sort')

    if (urlCity)  setCity(urlCity)
    if (urlType)  setType(urlType)
    if (urlPrice) setPrice(urlPrice)
    if (urlSort)  setSort(urlSort)
  }, [searchParams])

  // unique cities from data
  const cities = useMemo(() => {
    const set = new Set<string>()
    properties.forEach(p => p.city && set.add(p.city))
    return ['all', ...Array.from(set).sort()]
  }, [properties])

  // filter + sort logic
  const filtered = useMemo(() => {
    let result = [...properties]

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.location?.toLowerCase().includes(q) ?? false) ||
        p.city.toLowerCase().includes(q)
      )
    }
    if (city !== 'all')  result = result.filter(p => p.city === city)
    if (type !== 'all')  result = result.filter(p => p.property_type === type)
    if (price !== 'all') {
      const range = PRICE_RANGES.find(r => r.value === price)
      if (range) result = result.filter(p => p.price >= range.min && p.price < range.max)
    }

    switch (sort) {
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'views-desc': result.sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0)); break
      case 'newest':
      default:           result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return result
  }, [properties, query, city, type, price, sort])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  // reset visible count when filters change
  useEffect(() => { setVisibleCount(INITIAL_COUNT) }, [query, city, type, price, sort])

  // update URL when filters change
  const updateUrl = (patch: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(patch).forEach(([k, v]) => {
      if (v === 'all' || v === '' || v === 'newest') params.delete(k)
      else params.set(k, v)
    })
    router.replace(`/properties${params.toString() ? '?' + params.toString() : ''}`, { scroll: false })
  }

  const resetFilters = () => {
    setQuery('')
    setCity('all')
    setType('all')
    setPrice('all')
    setSort('newest')
    router.replace('/properties', { scroll: false })
  }

  const activeFilterCount =
    (query ? 1 : 0) + (city !== 'all' ? 1 : 0) + (type !== 'all' ? 1 : 0) + (price !== 'all' ? 1 : 0)

  return (
    <main style={{ backgroundColor: '#FAFAF7', minHeight: '100vh' }}>

      {/* ── HEADER SECTION ── */}
      <section style={{
        paddingTop:    '110px',
        paddingBottom: isDesktop ? '40px' : '28px',
        background:    'linear-gradient(180deg, #0A1628 0%, #0F1C2E 100%)',
        position:      'relative',
        overflow:      'hidden',
      }}>
        {/* gold glow */}
        <div style={{
          position:      'absolute',
          top:           '-100px',
          right:         '-100px',
          width:         '500px',
          height:        '500px',
          borderRadius:  '50%',
          background:    'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        {/* dot grid */}
        <div style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize:  '32px 32px',
          pointerEvents:   'none',
        }} />

        <div style={{
          position:    'relative',
          maxWidth:    '1440px',
          marginLeft:  'auto',
          marginRight: 'auto',
          padding:     isDesktop ? '0 60px' : '0 20px',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}
          >
            <div style={{ width: '32px', height: '1px', backgroundColor: '#C9A84C' }} />
            <span style={{
              fontSize:      '10.5px',
              fontWeight:    700,
              color:         '#C9A84C',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}>
              Our Portfolio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{
              fontSize:      isDesktop ? '48px' : '32px',
              fontWeight:    700,
              lineHeight:    1.1,
              color:         '#FFFFFF',
              margin:        '0 0 12px 0',
              letterSpacing: '-0.03em',
            }}
          >
            All{' '}
            <span style={{
              fontWeight: 300,
              fontStyle:  'italic',
              background: 'linear-gradient(135deg, #F5E5A8 0%, #C9A84C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              paddingRight: '6px',
            }}>
              Properties
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize:  isDesktop ? '15px' : '14px',
              color:     'rgba(255,255,255,0.6)',
              margin:    0,
              maxWidth:  '520px',
            }}
          >
            Browse our complete collection across Dhaka, Chittagong and Rangpur — every listing verified, every price transparent.
          </motion.p>
        </div>
      </section>

      {/* ── FILTERS BAR ── */}
      <section style={{
        position:        'sticky',
        top:             '68px',
        zIndex:          40,
        backgroundColor: 'rgba(250,250,247,0.97)',
        backdropFilter:  'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom:    '1px solid #E2E8F0',
        padding:         '18px 0',
      }}>
        <div style={{
          maxWidth:    '1440px',
          marginLeft:  'auto',
          marginRight: 'auto',
          padding:     isDesktop ? '0 60px' : '0 20px',
        }}>
          {/* search + filter toggle row */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* search input */}
            <div style={{ position: 'relative', flex: 1, maxWidth: isDesktop ? '400px' : 'none' }}>
              <Search style={{
                position:  'absolute',
                left:      '14px',
                top:       '50%',
                transform: 'translateY(-50%)',
                width:     '15px',
                height:    '15px',
                color:     '#9CA3AF',
                pointerEvents: 'none',
              }} />
              <input
                type="text"
                placeholder="Search by title, location, or city..."
                value={query}
                onChange={e => { setQuery(e.target.value); updateUrl({ q: e.target.value }) }}
                style={{
                  width:           '100%',
                  padding:         '12px 40px 12px 40px',
                  borderRadius:    '12px',
                  border:          '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  fontSize:        '13.5px',
                  color:           '#0F1C2E',
                  outline:         'none',
                  fontFamily:      'inherit',
                }}
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); updateUrl({ q: '' }) }}
                  style={{
                    position:        'absolute',
                    right:           '10px',
                    top:             '50%',
                    transform:       'translateY(-50%)',
                    width:           '22px',
                    height:          '22px',
                    borderRadius:    '999px',
                    backgroundColor: '#F1F5F9',
                    border:          'none',
                    cursor:          'pointer',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                  }}
                >
                  <X style={{ width: '11px', height: '11px', color: '#6B7280' }} />
                </button>
              )}
            </div>

            {/* filter toggle button — mobile & tablet */}
            {!isDesktop && (
              <button
                onClick={() => setShowFilters(o => !o)}
                style={{
                  position:        'relative',
                  display:         'flex',
                  alignItems:      'center',
                  gap:             '6px',
                  padding:         '12px 16px',
                  borderRadius:    '12px',
                  border:          '1px solid #E2E8F0',
                  backgroundColor: showFilters ? '#0F1C2E' : '#FFFFFF',
                  color:           showFilters ? '#C9A84C' : '#374151',
                  cursor:          'pointer',
                  fontSize:        '13px',
                  fontWeight:      600,
                  fontFamily:      'inherit',
                  transition:      'all 0.2s',
                }}
              >
                <SlidersHorizontal style={{ width: '14px', height: '14px' }} />
                Filters
                {activeFilterCount > 0 && (
                  <span style={{
                    position:        'absolute',
                    top:             '-4px',
                    right:           '-4px',
                    width:           '18px',
                    height:          '18px',
                    borderRadius:    '999px',
                    backgroundColor: '#C9A84C',
                    color:           '#0F1C2E',
                    fontSize:        '10px',
                    fontWeight:      800,
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            {/* desktop inline filters */}
            {isDesktop && (
              <>
                <FilterSelect
                  icon={<MapPin size={13} />}
                  value={city}
                  onChange={v => { setCity(v); updateUrl({ city: v }) }}
                  options={cities.map(c => ({ value: c, label: c === 'all' ? 'All Cities' : c }))}
                />
                <FilterSelect
                  icon={<Home size={13} />}
                  value={type}
                  onChange={v => { setType(v); updateUrl({ type: v }) }}
                  options={TYPES}
                />
                <FilterSelect
                  icon={<DollarSign size={13} />}
                  value={price}
                  onChange={v => { setPrice(v); updateUrl({ price: v }) }}
                  options={PRICE_RANGES.map(p => ({ value: p.value, label: p.label }))}
                />
                <FilterSelect
                  icon={<TrendingUp size={13} />}
                  value={sort}
                  onChange={v => { setSort(v); updateUrl({ sort: v }) }}
                  options={SORTS}
                />
              </>
            )}
          </div>

          {/* mobile filter panel */}
          {!isDesktop && showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '14px' }}>
                <FilterSelect
                  icon={<MapPin size={13} />}
                  value={city}
                  onChange={v => { setCity(v); updateUrl({ city: v }) }}
                  options={cities.map(c => ({ value: c, label: c === 'all' ? 'All Cities' : c }))}
                />
                <FilterSelect
                  icon={<Home size={13} />}
                  value={type}
                  onChange={v => { setType(v); updateUrl({ type: v }) }}
                  options={TYPES}
                />
                <FilterSelect
                  icon={<DollarSign size={13} />}
                  value={price}
                  onChange={v => { setPrice(v); updateUrl({ price: v }) }}
                  options={PRICE_RANGES.map(p => ({ value: p.value, label: p.label }))}
                />
                <FilterSelect
                  icon={<TrendingUp size={13} />}
                  value={sort}
                  onChange={v => { setSort(v); updateUrl({ sort: v }) }}
                  options={SORTS}
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section style={{ padding: isDesktop ? '32px 0 80px' : '24px 0 56px' }}>
        <div style={{
          maxWidth:    '1440px',
          marginLeft:  'auto',
          marginRight: 'auto',
          padding:     isDesktop ? '0 60px' : '0 20px',
        }}>
          {/* result count + reset */}
          <div style={{
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'space-between',
            gap:          '12px',
            marginBottom: '24px',
            flexWrap:     'wrap',
          }}>
            <div style={{ fontSize: '13.5px', color: '#6B7280', fontWeight: 500 }}>
              Showing <span style={{ color: '#0F1C2E', fontWeight: 700 }}>{visible.length}</span>
              {' of '}
              <span style={{ color: '#0F1C2E', fontWeight: 700 }}>{filtered.length}</span> properties
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  gap:             '5px',
                  padding:         '7px 14px',
                  borderRadius:    '999px',
                  border:          '1px solid #E2E8F0',
                  backgroundColor: 'transparent',
                  color:           '#6B7280',
                  fontSize:        '12px',
                  fontWeight:      600,
                  cursor:          'pointer',
                  fontFamily:      'inherit',
                }}
              >
                <X style={{ width: '12px', height: '12px' }} />
                Reset filters
              </button>
            )}
          </div>

          {/* grid or empty */}
          {filtered.length === 0 ? (
            <div style={{
              textAlign:       'center',
              padding:         '80px 20px',
              borderRadius:    '20px',
              backgroundColor: '#FFFFFF',
              border:          '1px solid #E2E8F0',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F1C2E', marginBottom: '8px' }}>
                No properties match your filters
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>
                Try adjusting your search or resetting filters.
              </div>
              <button
                onClick={resetFilters}
                style={{
                  padding:         '11px 24px',
                  borderRadius:    '999px',
                  border:          'none',
                  backgroundColor: '#0F1C2E',
                  color:           '#C9A84C',
                  fontSize:        '13px',
                  fontWeight:      700,
                  cursor:          'pointer',
                  fontFamily:      'inherit',
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div style={{
                display:              'grid',
                gridTemplateColumns:  isDesktop ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))',
                gap:                  isDesktop ? '24px' : '18px',
              }}>
                {visible.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
              </div>

              {/* load more */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '48px' }}>
                  <button
                    onClick={() => setVisibleCount(c => c + STEP)}
                    style={{
                      display:         'inline-flex',
                      alignItems:      'center',
                      gap:             '10px',
                      padding:         '15px 32px',
                      borderRadius:    '999px',
                      border:          '1.5px solid #0F1C2E',
                      backgroundColor: 'transparent',
                      color:           '#0F1C2E',
                      fontSize:        '14px',
                      fontWeight:      700,
                      cursor:          'pointer',
                      fontFamily:      'inherit',
                      transition:      'all 0.25s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#0F1C2E'
                      e.currentTarget.style.color = '#C9A84C'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#0F1C2E'
                    }}
                  >
                    <ArrowDown style={{ width: '14px', height: '14px' }} />
                    Load {Math.min(STEP, filtered.length - visibleCount)} more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

// ── filter select — reusable styled select ────────────────────
function FilterSelect({
  icon,
  value,
  onChange,
  options,
}: {
  icon:     React.ReactNode
  value:    string
  onChange: (v: string) => void
  options:  { value: string; label: string }[]
}) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div style={{
        position:      'absolute',
        left:          '12px',
        top:           '50%',
        transform:     'translateY(-50%)',
        color:         '#9CA3AF',
        pointerEvents: 'none',
        display:       'flex',
        alignItems:    'center',
      }}>
        {icon}
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width:              '100%',
          padding:            '12px 34px 12px 34px',
          borderRadius:       '12px',
          border:             '1px solid #E2E8F0',
          backgroundColor:    '#FFFFFF',
          fontSize:           '13px',
          fontWeight:         600,
          color:              '#0F1C2E',
          outline:            'none',
          cursor:             'pointer',
          appearance:         'none',
          fontFamily:         'inherit',
          backgroundImage:    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat:   'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}