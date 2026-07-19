'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Ruler, ArrowUpRight, Sparkles } from 'lucide-react'

// property type from DB
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

// price formatter — Indian style
function formatPrice(price: number): string {
  if (price >= 10000000) return `৳${(price / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`
  if (price >= 100000)   return `৳${(price / 100000).toFixed(1).replace(/\.?0+$/, '')} Lac`
  return `৳${new Intl.NumberFormat('en-IN').format(price)}`
}

// strip [DEMO] prefix
function cleanTitle(t: string) { return t.replace(/^\[DEMO\]\s*/i, '') }

// how many days ago
function daysAgo(ts: string): string {
  const d = Math.floor((Date.now() - new Date(ts).getTime()) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 7)   return `${d}d ago`
  if (d < 30)  return `${Math.floor(d / 7)}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

// ── single card ────────────────────────────────────────────────
function ListingCard({ property, index }: { property: Property; index: number }) {
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
      className="group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        backgroundColor: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: hovered ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      {/* ── gold roof line on hover ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%)',
          opacity: hovered ? 1 : 0,
          zIndex: 10,
        }}
      />

      {/* ── IMAGE ── */}
      <div className="relative h-48 md:h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
        />

        {/* gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(15,28,46,0.85) 0%, transparent 55%)' }}
        />

        {/* new pill — top left */}
        {isNew && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(201,168,76,0.95)',
              boxShadow: '0 4px 12px rgba(201,168,76,0.4)',
            }}
          >
            <Sparkles style={{ width: '10px', height: '10px', color: '#0F1C2E' }} />
            <span
              className="text-[9.5px] font-extrabold uppercase"
              style={{ color: '#0F1C2E', letterSpacing: '0.12em' }}
            >
              New
            </span>
          </div>
        )}

        {/* posted date — top right */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold"
          style={{
            backgroundColor: 'rgba(15,28,46,0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          {daysAgo(property.created_at)}
        </div>

        {/* location — bottom left over image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <MapPin style={{ width: '11px', height: '11px', color: '#E8D48B' }} />
          <span
            className="text-xs font-medium"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {property.location ?? property.city}
          </span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="p-4 md:p-5">
        {/* title */}
        <h3
          className="text-sm md:text-[15px] font-bold leading-snug mb-3 line-clamp-2"
          style={{ color: '#FFFFFF' }}
        >
          {cleanTitle(property.title)}
        </h3>

        {/* specs row */}
        <div
          className="flex items-center gap-3 pb-3 mb-3 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {property.bedrooms != null && (
            <div className="flex items-center gap-1">
              <Bed style={{ width: '12px', height: '12px', color: '#C9A84C' }} />
              <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {property.bedrooms}
              </span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1">
              <Bath style={{ width: '12px', height: '12px', color: '#C9A84C' }} />
              <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {property.bathrooms}
              </span>
            </div>
          )}
          {property.area_sqft != null && (
            <div className="flex items-center gap-1">
              <Ruler style={{ width: '12px', height: '12px', color: '#C9A84C' }} />
              <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {new Intl.NumberFormat('en-IN').format(property.area_sqft)} ft
              </span>
            </div>
          )}
        </div>

        {/* price + arrow */}
        <div className="flex items-end justify-between">
          <div>
            <div
              className="text-[9.5px] font-bold uppercase mb-1"
              style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}
            >
              {property.price_type === 'rent' ? 'Monthly' : 'Price'}
            </div>
            <div
              className="text-lg md:text-xl font-extrabold leading-none"
              style={{ color: '#E8D48B', letterSpacing: '-0.02em' }}
            >
              {formatPrice(property.price)}
            </div>
          </div>

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: hovered ? '#C9A84C' : 'rgba(255,255,255,0.08)',
              transform: hovered ? 'translate(2px, -2px)' : 'translate(0, 0)',
            }}
          >
            <ArrowUpRight
              style={{
                width: '15px',
                height: '15px',
                color: hovered ? '#0F1C2E' : 'rgba(255,255,255,0.7)',
              }}
            />
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

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section
      className="relative overflow-hidden py-16 md:py-20"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0F1C2E 50%, #0A1628 100%)',
      }}
    >
      {/* subtle gold glow — top left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-100px',
          left: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)',
        }}
      />
      {/* subtle gold glow — bottom right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-100px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)',
        }}
      />

      {/* dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div
        className="relative mx-auto w-full px-5 md:px-14"
        style={{ maxWidth: '1440px' }}
      >

        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 md:mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <div style={{ width: '32px', height: '1px', backgroundColor: '#C9A84C' }} />
              <span
                className="text-[10.5px] font-bold uppercase"
                style={{ color: '#C9A84C', letterSpacing: '0.3em' }}
              >
                Fresh From Our Portfolio
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold leading-tight max-w-lg"
              style={{ color: '#FFFFFF', letterSpacing: '-0.03em' }}
            >
              Latest Additions{' '}
              <span
                className="italic font-light"
                style={{
                  background: 'linear-gradient(135deg, #E8D48B 0%, #C9A84C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
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
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[13px] transition-all"
              style={{
                border: '1.5px solid rgba(201,168,76,0.4)',
                backgroundColor: 'transparent',
                color: '#E8D48B',
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
          <div
            className="text-center py-20 rounded-2xl"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="text-4xl mb-3">🏗️</div>
            <div className="text-lg font-bold mb-2" style={{ color: '#fff' }}>
              New listings coming soon
            </div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              We&apos;re adding fresh properties every week.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {properties.map((p, i) => (
              <ListingCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}

        {/* mobile view all */}
        {!isDesktop && properties.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/properties')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm"
              style={{
                border: '1.5px solid rgba(201,168,76,0.4)',
                backgroundColor: 'transparent',
                color: '#E8D48B',
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