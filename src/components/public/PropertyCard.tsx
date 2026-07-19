'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MapPin, Bed, Bath, Ruler, ChevronRight,
  PlayCircle, Heart,
} from 'lucide-react'

// shared type
export interface PropertyCardData {
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
  featured?:     boolean
  images:        string[] | null
  video_url?:    string | null
}

// price formatter — Indian numbering
function formatPrice(price: number): string {
  if (price >= 10000000) return `৳${(price / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`
  if (price >= 100000)   return `৳${(price / 100000).toFixed(1).replace(/\.?0+$/, '')} Lac`
  return `৳${new Intl.NumberFormat('en-IN').format(price)}`
}

// property type label
function typeLabel(type: string): string {
  const map: Record<string, string> = {
    apartment: 'Apartment', villa: 'Villa', plot: 'Plot',
    office: 'Office', townhouse: 'Townhouse', studio: 'Studio', penthouse: 'Penthouse',
  }
  return map[type] ?? type
}

// strip [DEMO] prefix
function cleanTitle(t: string): string {
  return t.replace(/^\[DEMO\]\s*/i, '')
}

export default function PropertyCard({
  property,
  index = 0,
}: {
  property: PropertyCardData
  index?: number
}) {
  const router = useRouter()
  const [hovered,    setHovered]    = useState(false)
  const [imgHovered, setImgHovered] = useState(false)
  const [saved,      setSaved]      = useState(false)

  const image    = property.images?.[0] ?? 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'
  const hasVideo = !!property.video_url
  const featured = !!property.featured

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 6) * 0.06, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setImgHovered(false) }}
      onClick={() => router.push(`/properties/${property.id}`)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius:    '20px',
        overflow:        'hidden',
        cursor:          'pointer',
        position:        'relative',
        border:          hovered ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(226,232,240,0.8)',
        boxShadow:       hovered
          ? '0 20px 48px rgba(15,28,46,0.12), 0 4px 16px rgba(201,168,76,0.08)'
          : '0 4px 16px rgba(15,28,46,0.05)',
        transform:       hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition:      'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {/* gold roof line */}
      <div style={{
        position:   'absolute',
        top:        0,
        left:       0,
        right:      0,
        height:     '3px',
        background: hovered
          ? 'linear-gradient(90deg, #C9A84C 0%, #E8D48B 50%, #C9A84C 100%)'
          : 'linear-gradient(90deg, rgba(201,168,76,0.4) 0%, rgba(201,168,76,0.1) 100%)',
        transition: 'background 0.35s',
        zIndex:     10,
      }} />

      {/* left gold foundation stripe */}
      <div style={{
        position:   'absolute',
        top:        0,
        bottom:     0,
        left:       0,
        width:      '3px',
        background: hovered
          ? 'linear-gradient(to bottom, #C9A84C 0%, rgba(201,168,76,0.2) 100%)'
          : 'linear-gradient(to bottom, rgba(201,168,76,0.2) 0%, transparent 100%)',
        transition: 'background 0.35s',
        zIndex:     10,
      }} />

      {/* image */}
      <div
        style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: '#0F1C2E' }}
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={property.title}
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            display:    'block',
            transform:  imgHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        <div style={{
          position:      'absolute',
          inset:         0,
          background:    'linear-gradient(to top, rgba(15,28,46,0.5) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        {/* featured badge */}
        {featured && (
          <div style={{
            position:     'absolute',
            top:          '14px',
            left:         '14px',
            display:      'flex',
            alignItems:   'center',
            gap:          '5px',
            padding:      '5px 12px',
            borderRadius: '999px',
            background:   'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
            boxShadow:    '0 4px 12px rgba(201,168,76,0.4)',
          }}>
            <span style={{
              fontSize:      '9.5px',
              fontWeight:    800,
              color:         '#0F1C2E',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              Featured
            </span>
          </div>
        )}

        {/* video badge */}
        {hasVideo && (
          <div style={{
            position:        'absolute',
            top:             '14px',
            left:            featured ? '100px' : '14px',
            display:         'flex',
            alignItems:      'center',
            gap:             '5px',
            padding:         '5px 10px',
            borderRadius:    '999px',
            backgroundColor: 'rgba(15,28,46,0.75)',
            backdropFilter:  'blur(8px)',
            border:          '1px solid rgba(255,255,255,0.15)',
          }}>
            <PlayCircle style={{ width: '11px', height: '11px', color: '#E8D48B' }} />
            <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#fff' }}>Video</span>
          </div>
        )}

        {/* save button */}
        <button
          onClick={e => { e.stopPropagation(); setSaved(s => !s) }}
          style={{
            position:        'absolute',
            top:             '12px',
            right:           '12px',
            width:           '34px',
            height:          '34px',
            borderRadius:    '999px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter:  'blur(8px)',
            border:          '1px solid rgba(255,255,255,0.25)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            cursor:          'pointer',
            transition:      'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)' }}
        >
          <Heart style={{
            width:  '14px',
            height: '14px',
            color:  saved ? '#EF4444' : '#fff',
            fill:   saved ? '#EF4444' : 'none',
            transition: 'all 0.2s',
          }} />
        </button>

        {/* type chip */}
        <div style={{
          position:        'absolute',
          bottom:          '12px',
          left:            '14px',
          padding:         '4px 10px',
          borderRadius:    '6px',
          backgroundColor: 'rgba(15,28,46,0.7)',
          backdropFilter:  'blur(8px)',
          border:          '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            {typeLabel(property.property_type)}
          </span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: '18px 20px 20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
          <MapPin style={{ width: '11px', height: '11px', color: '#C9A84C', flexShrink: 0 }} />
          <span style={{ fontSize: '11.5px', color: '#6B7280', fontWeight: 500 }}>
            {property.location ?? property.city}, {property.city}
          </span>
        </div>

        <h3 style={{
          fontSize:        '15px',
          fontWeight:      700,
          color:           '#0F1C2E',
          lineHeight:      1.3,
          margin:          '0 0 14px 0',
          display:         '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow:        'hidden',
        }}>
          {cleanTitle(property.title)}
        </h3>

        <div style={{
          display:       'flex',
          alignItems:    'center',
          paddingBottom: '14px',
          marginBottom:  '14px',
          borderBottom:  '1px solid #F1F5F9',
        }}>
          {property.bedrooms != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '16px' }}>
              <Bed style={{ width: '13px', height: '13px', color: '#9CA3AF' }} />
              <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>{property.bedrooms}</span>
              <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Bed</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '16px' }}>
              <Bath style={{ width: '13px', height: '13px', color: '#9CA3AF' }} />
              <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>{property.bathrooms}</span>
              <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Bath</span>
            </div>
          )}
          {property.area_sqft != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Ruler style={{ width: '13px', height: '13px', color: '#9CA3AF' }} />
              <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>
                {new Intl.NumberFormat('en-IN').format(property.area_sqft)}
              </span>
              <span style={{ fontSize: '11px', color: '#9CA3AF' }}>sqft</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize:      '10px',
              fontWeight:    600,
              color:         '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom:  '3px',
            }}>
              {property.price_type === 'rent' ? 'Monthly Rent' : 'Sale Price'}
            </div>
            <div style={{
              fontSize:      '20px',
              fontWeight:    800,
              color:         '#0F1C2E',
              letterSpacing: '-0.02em',
              lineHeight:    1,
            }}>
              {formatPrice(property.price)}
              {property.price_type === 'rent' && (
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#9CA3AF', marginLeft: '4px' }}>/mo</span>
              )}
            </div>
          </div>

          <div style={{
            display:         'flex',
            alignItems:      'center',
            gap:             '6px',
            padding:         '10px 16px',
            borderRadius:    '12px',
            backgroundColor: hovered ? '#0F1C2E' : '#F8FAFC',
            border:          hovered ? '1px solid #0F1C2E' : '1px solid #E2E8F0',
            transition:      'all 0.3s',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: hovered ? '#C9A84C' : '#374151' }}>
              View
            </span>
            <ChevronRight style={{ width: '13px', height: '13px', color: hovered ? '#C9A84C' : '#9CA3AF' }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}