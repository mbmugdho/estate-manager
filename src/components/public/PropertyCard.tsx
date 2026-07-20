'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MapPin, Bed, Bath, Ruler, ChevronRight,
  PlayCircle, Heart,
} from 'lucide-react'
import { toggleSave, isSavedByVisitor } from '@/lib/visitor'

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
  const [saveLoading, setSaveLoading] = useState(false)
  const checkedRef = useRef(false)

  const image    = property.images?.[0] ?? 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'
  const hasVideo = !!property.video_url
  const featured = !!property.featured

  // check saved state on mount
  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true
    isSavedByVisitor(property.id).then(setSaved)
  }, [property.id])

  // handle save toggle
  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (saveLoading) return
    setSaveLoading(true)
    const next = !saved
    setSaved(next) // optimistic
    const actual = await toggleSave(property.id, !next)
    setSaved(actual) // correct if DB disagreed
    setSaveLoading(false)
  }

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
        style={{ position: 'relative', height: '240px', overflow: 'hidden', backgroundColor: '#0F1C2E' }}
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

        {/* gradient overlay — richer depth */}
        <div style={{
          position:      'absolute',
          inset:         0,
          background:    'linear-gradient(to top, rgba(15,28,46,0.6) 0%, rgba(15,28,46,0.1) 40%, transparent 65%)',
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
            left:            featured ? '108px' : '14px',
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

        {/* save button — wired to DB */}
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 1.25 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          style={{
            position:        'absolute',
            top:             '12px',
            right:           '12px',
            width:           '36px',
            height:          '36px',
            borderRadius:    '999px',
            backgroundColor: saved ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.15)',
            backdropFilter:  'blur(8px)',
            border:          saved ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.25)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            cursor:          'pointer',
            transition:      'all 0.25s',
          }}
          onMouseEnter={e => {
            if (!saved) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'
          }}
          onMouseLeave={e => {
            if (!saved) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'
          }}
        >
          <Heart style={{
            width:      '15px',
            height:     '15px',
            color:      saved ? '#EF4444' : '#fff',
            fill:       saved ? '#EF4444' : 'none',
            transition: 'all 0.25s',
            filter:     saved ? 'drop-shadow(0 0 4px rgba(239,68,68,0.4))' : 'none',
          }} />
        </motion.button>

        {/* price chip on image — premium overlay */}
        <div style={{
          position:        'absolute',
          bottom:          '12px',
          right:           '14px',
          padding:         '6px 14px',
          borderRadius:    '10px',
          backgroundColor: 'rgba(15,28,46,0.8)',
          backdropFilter:  'blur(12px)',
          border:          '1px solid rgba(201,168,76,0.2)',
        }}>
          <span style={{
            fontSize:      '15px',
            fontWeight:    800,
            color:         '#C9A84C',
            letterSpacing: '-0.01em',
          }}>
            {formatPrice(property.price)}
            {property.price_type === 'rent' && (
              <span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(201,168,76,0.6)', marginLeft: '2px' }}>/mo</span>
            )}
          </span>
        </div>

        {/* type chip */}
        <div style={{
          position:        'absolute',
          bottom:          '12px',
          left:            '14px',
          padding:         '5px 11px',
          borderRadius:    '8px',
          backgroundColor: 'rgba(15,28,46,0.7)',
          backdropFilter:  'blur(8px)',
          border:          '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.03em' }}>
            {typeLabel(property.property_type)}
          </span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: '18px 20px 20px 22px' }}>
        {/* location row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
          <MapPin style={{ width: '11px', height: '11px', color: '#C9A84C', flexShrink: 0 }} />
          <span style={{ fontSize: '11.5px', color: '#6B7280', fontWeight: 500 }}>
            {property.location ?? property.city}, {property.city}
          </span>
        </div>

        {/* title */}
        <h3 style={{
          fontSize:        '15.5px',
          fontWeight:      700,
          color:           '#0F1C2E',
          lineHeight:      1.3,
          margin:          '0 0 14px 0',
          display:         '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow:        'hidden',
          letterSpacing:   '-0.01em',
        }}>
          {cleanTitle(property.title)}
        </h3>

        {/* specs row */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          paddingBottom: '14px',
          marginBottom:  '14px',
          borderBottom:  '1px solid #F1F5F9',
          gap:           '4px',
        }}>
          {property.bedrooms != null && (
            <SpecChip icon={<Bed style={{ width: '13px', height: '13px', color: '#C9A84C' }} />} value={`${property.bedrooms}`} label="Bed" />
          )}
          {property.bedrooms != null && property.bathrooms != null && <SpecDot />}
          {property.bathrooms != null && (
            <SpecChip icon={<Bath style={{ width: '13px', height: '13px', color: '#C9A84C' }} />} value={`${property.bathrooms}`} label="Bath" />
          )}
          {(property.bedrooms != null || property.bathrooms != null) && property.area_sqft != null && <SpecDot />}
          {property.area_sqft != null && (
            <SpecChip icon={<Ruler style={{ width: '13px', height: '13px', color: '#C9A84C' }} />} value={new Intl.NumberFormat('en-IN').format(property.area_sqft)} label="sqft" />
          )}
        </div>

        {/* bottom row — sale type label + view button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize:      '10px',
              fontWeight:    700,
              color:         '#C9A84C',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom:  '2px',
            }}>
              {property.price_type === 'rent' ? 'For Rent' : 'For Sale'}
            </div>
            <div style={{
              fontSize:      '11px',
              color:         '#9CA3AF',
              fontWeight:    500,
            }}>
              {property.location ?? property.city}
            </div>
          </div>

          <div style={{
            display:         'flex',
            alignItems:      'center',
            gap:             '6px',
            padding:         '10px 18px',
            borderRadius:    '12px',
            backgroundColor: hovered ? '#0F1C2E' : '#F8FAFC',
            border:          hovered ? '1px solid #0F1C2E' : '1px solid #E2E8F0',
            transition:      'all 0.3s',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: hovered ? '#C9A84C' : '#374151' }}>
              Details
            </span>
            <ChevronRight style={{
              width:      '13px',
              height:     '13px',
              color:      hovered ? '#C9A84C' : '#9CA3AF',
              transform:  hovered ? 'translateX(2px)' : 'translateX(0)',
              transition: 'all 0.3s',
            }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// spec chip sub-component
function SpecChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {icon}
      <span style={{ fontSize: '12.5px', color: '#0F1C2E', fontWeight: 700 }}>{value}</span>
      <span style={{ fontSize: '10.5px', color: '#9CA3AF', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

// dot separator
function SpecDot() {
  return (
    <div style={{
      width:        '3px',
      height:       '3px',
      borderRadius: '999px',
      backgroundColor: '#CBD5E1',
      margin:       '0 8px',
      flexShrink:   0,
    }} />
  )
}