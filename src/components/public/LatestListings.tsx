'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Ruler, ArrowUpRight, Sparkles } from 'lucide-react'

interface Property {
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
  images:        string[] | null
  created_at:    string
}

// price formatter — Indian numbering
function formatPrice(price: number): string {
  if (price >= 10000000) return `৳${(price / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`
  if (price >= 100000)   return `৳${(price / 100000).toFixed(1).replace(/\.?0+$/, '')} Lac`
  return `৳${new Intl.NumberFormat('en-IN').format(price)}`
}

function cleanTitle(t: string) { return t.replace(/^\[DEMO\]\s*/i, '') }

function daysAgo(ts: string): string {
  const d = Math.floor((Date.now() - new Date(ts).getTime()) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 7)   return `${d}d ago`
  if (d < 30)  return `${Math.floor(d / 7)}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

// ── single card ────────────────────────────────────────────────
function ListingCard({ property, index, isDesktop }: { property: Property; index: number; isDesktop: boolean }) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const image = property.images?.[0] ?? 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'
  const isNew = (Date.now() - new Date(property.created_at).getTime()) < 7 * 86400000

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.55 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/properties/${property.id}`)}
      style={{
        position:         'relative',
        cursor:           'pointer',
        overflow:         'hidden',
        borderRadius:     '16px',
        backgroundColor:  hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border:           hovered ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.08)',
        backdropFilter:   'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transform:        hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:        hovered ? '0 20px 48px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
        transition:       'all 0.3s ease',
      }}
    >
      {/* gold roof line on hover */}
      <div style={{
        position:   'absolute',
        top:        0,
        left:       0,
        right:      0,
        height:     '2px',
        background: 'linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%)',
        opacity:    hovered ? 1 : 0,
        transition: 'opacity 0.3s',
        zIndex:     10,
      }} />

      {/* ── IMAGE ── */}
      <div style={{
        position: 'relative',
        height:   isDesktop ? '208px' : '192px',
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={property.title}
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            display:    'block',
            transform:  hovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />

        {/* gradient overlay */}
        <div style={{
          position:      'absolute',
          inset:         0,
          background:    'linear-gradient(to top, rgba(15,28,46,0.85) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        {/* NEW pill — top left */}
        {isNew && (
          <div style={{
            position:        'absolute',
            top:             '12px',
            left:            '12px',
            display:         'flex',
            alignItems:      'center',
            gap:             '5px',
            padding:         '4px 10px',
            borderRadius:    '999px',
            backgroundColor: 'rgba(201,168,76,0.95)',
            boxShadow:       '0 4px 12px rgba(201,168,76,0.4)',
          }}>
            <Sparkles style={{ width: '10px', height: '10px', color: '#0F1C2E' }} />
            <span style={{
              fontSize:      '9.5px',
              fontWeight:    800,
              color:         '#0F1C2E',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              New
            </span>
          </div>
        )}

        {/* posted date — top right */}
        <div style={{
          position:        'absolute',
          top:             '12px',
          right:           '12px',
          padding:         '4px 10px',
          borderRadius:    '999px',
          fontSize:        '10px',
          fontWeight:      600,
          backgroundColor: 'rgba(15,28,46,0.7)',
          backdropFilter:  'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border:          '1px solid rgba(255,255,255,0.12)',
          color:           'rgba(255,255,255,0.85)',
        }}>
          {daysAgo(property.created_at)}
        </div>

        {/* location — bottom left */}
        <div style={{
          position:   'absolute',
          bottom:     '12px',
          left:       '12px',
          display:    'flex',
          alignItems: 'center',
          gap:        '5px',
        }}>
          <MapPin style={{ width: '11px', height: '11px', color: '#E8D48B' }} />
          <span style={{
            fontSize:   '12px',
            fontWeight: 500,
            color:      'rgba(255,255,255,0.9)',
          }}>
            {property.location ?? property.city}
          </span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: isDesktop ? '18px 20px' : '16px 18px' }}>
        <h3 style={{
          fontSize:        isDesktop ? '15px' : '14px',
          fontWeight:      700,
          lineHeight:      1.35,
          margin:          '0 0 12px 0',
          color:           '#FFFFFF',
          display:         '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow:        'hidden',
        }}>
          {cleanTitle(property.title)}
        </h3>

        {/* specs */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '14px',
          paddingBottom: '12px',
          marginBottom:  '12px',
          borderBottom:  '1px solid rgba(255,255,255,0.08)',
        }}>
          {property.bedrooms != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bed style={{ width: '12px', height: '12px', color: '#C9A84C' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                {property.bedrooms}
              </span>
            </div>
          )}
          {property.bathrooms != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bath style={{ width: '12px', height: '12px', color: '#C9A84C' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                {property.bathrooms}
              </span>
            </div>
          )}
          {property.area_sqft != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Ruler style={{ width: '12px', height: '12px', color: '#C9A84C' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                {new Intl.NumberFormat('en-IN').format(property.area_sqft)} ft
              </span>
            </div>
          )}
        </div>

        {/* price + arrow */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize:      '9.5px',
              fontWeight:    700,
              color:         'rgba(255,255,255,0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom:  '4px',
            }}>
              {property.price_type === 'rent' ? 'Monthly' : 'Price'}
            </div>
            <div style={{
              fontSize:      isDesktop ? '20px' : '18px',
              fontWeight:    800,
              color:         '#E8D48B',
              letterSpacing: '-0.02em',
              lineHeight:    1,
            }}>
              {formatPrice(property.price)}
            </div>
          </div>

          <div style={{
            width:           '36px',
            height:          '36px',
            borderRadius:    '999px',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            backgroundColor: hovered ? '#C9A84C' : 'rgba(255,255,255,0.08)',
            transform:       hovered ? 'translate(2px, -2px)' : 'translate(0, 0)',
            transition:      'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}>
            <ArrowUpRight style={{
              width:  '15px',
              height: '15px',
              color:  hovered ? '#0F1C2E' : 'rgba(255,255,255,0.7)',
              transition: 'color 0.3s',
            }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── main section ──────────────────────────────────────────────
export default function LatestListings({ properties }: { properties: Property[] }) {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)
  const [isTablet,  setIsTablet]  = useState(false)

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 1024)
      setIsTablet(window.innerWidth >= 640)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{
      position:        'relative',
      overflow:        'hidden',
      padding:         isDesktop ? '80px 0' : '64px 0',
      background:      'linear-gradient(180deg, #0A1628 0%, #0F1C2E 50%, #0A1628 100%)',
    }}>
      {/* gold glow top-left */}
      <div style={{
        position: 'absolute',
        top:      '-100px',
        left:     '-100px',
        width:    '500px',
        height:   '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* gold glow bottom-right */}
      <div style={{
        position: 'absolute',
        bottom:   '-100px',
        right:    '-100px',
        width:    '500px',
        height:   '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* dot grid overlay */}
      <div style={{
        position: 'absolute',
        inset:    0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
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

        {/* ── HEADER ── */}
        <div style={{
          display:        'flex',
          flexDirection:  isTablet ? 'row' : 'column',
          alignItems:     isTablet ? 'flex-end' : 'flex-start',
          justifyContent: 'space-between',
          gap:            '20px',
          marginBottom:   isDesktop ? '48px' : '36px',
        }}>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}
            >
              <div style={{ width: '32px', height: '1px', backgroundColor: '#C9A84C' }} />
              <span style={{
                fontSize:      '10.5px',
                fontWeight:    700,
                color:         '#C9A84C',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}>
                Fresh From Our Portfolio
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{
                fontSize:      isDesktop ? '38px' : '28px',
                fontWeight:    700,
                lineHeight:    1.1,
                color:         '#FFFFFF',
                letterSpacing: '-0.03em',
                margin:        0,
                maxWidth:      '520px',
              }}
            >
              Latest Additions{' '}
              <span style={{
                fontWeight: 300,
                fontStyle:  'italic',
                background: 'linear-gradient(135deg, #E8D48B 0%, #C9A84C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                This Season
              </span>
            </motion.h2>
          </div>

          {isDesktop && (
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={() => router.push('/properties')}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             '8px',
                padding:         '12px 24px',
                borderRadius:    '999px',
                border:          '1.5px solid rgba(201,168,76,0.4)',
                backgroundColor: 'transparent',
                color:           '#E8D48B',
                fontSize:        '13px',
                fontWeight:      700,
                cursor:          'pointer',
                transition:      'all 0.25s',
                flexShrink:      0,
                fontFamily:      'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A84C'
                e.currentTarget.style.color = '#0F1C2E'
                e.currentTarget.style.borderColor = '#C9A84C'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#E8D48B'
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
              }}
            >
              Browse All Listings
              <ArrowUpRight style={{ width: '15px', height: '15px' }} />
            </motion.button>
          )}
        </div>

        {/* ── GRID ── */}
        {properties.length === 0 ? (
          <div style={{
            textAlign:       'center',
            padding:         '80px 20px',
            borderRadius:    '16px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border:          '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏗️</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              New listings coming soon
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
              We&apos;re adding fresh properties every week.
            </div>
          </div>
        ) : (
          <div style={{
            display:              'grid',
            gridTemplateColumns:  isDesktop ? 'repeat(3, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr',
            gap:                  isDesktop ? '20px' : '16px',
          }}>
            {properties.map((p, i) => (
              <ListingCard key={p.id} property={p} index={i} isDesktop={isDesktop} />
            ))}
          </div>
        )}

        {/* mobile view all */}
        {!isDesktop && properties.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={() => router.push('/properties')}
              style={{
                display:         'inline-flex',
                alignItems:      'center',
                gap:             '8px',
                padding:         '14px 32px',
                borderRadius:    '999px',
                border:          '1.5px solid rgba(201,168,76,0.4)',
                backgroundColor: 'transparent',
                color:           '#E8D48B',
                fontSize:        '14px',
                fontWeight:      700,
                cursor:          'pointer',
                fontFamily:      'inherit',
              }}
            >
              Browse All Listings
              <ArrowUpRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}