'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin, Bed, Bath, Ruler, Home, Phone, Heart,
  Share2, Eye, Calendar, ChevronLeft, ChevronRight,
  PlaySquare, X, Copy, Check, MessageCircle,
} from 'lucide-react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import PropertyCard, { type PropertyCardData } from '@/components/public/PropertyCard'
import {
  getVisitorId, logView, logInquiry,
  toggleSave, isSavedByVisitor, buildWhatsAppUrl,
} from '@/lib/visitor'
import type { PropertyDetail, SimilarProperty } from './page'

// ── helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number, type: string): string {
  if (price >= 10000000) {
    const v = (price / 10000000).toFixed(2).replace(/\.?0+$/, '')
    return type === 'rent' ? `৳${v} Cr/mo` : `৳${v} Cr`
  }
  if (price >= 100000) {
    const v = (price / 100000).toFixed(1).replace(/\.?0+$/, '')
    return type === 'rent' ? `৳${v} Lac/mo` : `৳${v} Lac`
  }
  const v = new Intl.NumberFormat('en-IN').format(price)
  return type === 'rent' ? `৳${v}/mo` : `৳${v}`
}

function cleanTitle(t: string): string {
  return t.replace(/^\[DEMO\]\s*/i, '')
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    apartment: 'Apartment', villa: 'Villa', plot: 'Plot',
    office: 'Office', townhouse: 'Townhouse', studio: 'Studio',
    penthouse: 'Penthouse',
  }
  return map[type] ?? type
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? '1 month ago' : `${months} months ago`
}

// extract youtube video id
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] ?? null
}

// status pill color
function statusStyle(status: string): { bg: string; color: string; label: string } {
  if (status === 'available') return { bg: 'rgba(34,197,94,0.12)', color: '#16A34A', label: 'Available' }
  if (status === 'sold')      return { bg: 'rgba(239,68,68,0.12)',  color: '#DC2626',  label: 'Sold' }
  if (status === 'rented')    return { bg: 'rgba(251,146,60,0.12)', color: '#EA580C',  label: 'Rented' }
  return { bg: 'rgba(156,163,175,0.12)', color: '#6B7280', label: status }
}

// ── types ─────────────────────────────────────────────────────────────────────

interface Props {
  property: PropertyDetail
  similar:  SimilarProperty[]
}

// ── component ─────────────────────────────────────────────────────────────────

export default function PropertyDetailClient({ property, similar }: Props) {
  // gallery state
  const allImages   = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80']
  const hasVideo    = !!property.video_url
  const totalSlides = allImages.length + (hasVideo ? 1 : 0)
  const VIDEO_INDEX = allImages.length // last tab is video

  const [activeIndex,   setActiveIndex]   = useState(0)
  const [showVideo,     setShowVideo]     = useState(false)
  const [lightboxOpen,  setLightboxOpen]  = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // engagement state
  const [isSaved,     setIsSaved]     = useState(false)
  const [savesCount,  setSavesCount]  = useState(property.saves_count)
  const [viewsCount,  setViewsCount]  = useState(property.views_count)
  const [saveLoading, setSaveLoading] = useState(false)

  // share state
  const [copied, setCopied] = useState(false)

  // mobile detection
  const [isMobile, setIsMobile] = useState(false)

  // copy link ref guard
  const viewLogged = useRef(false)

  // ── effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // log view once on mount
  useEffect(() => {
    if (viewLogged.current) return
    viewLogged.current = true
    const vid = getVisitorId()
    if (!vid) return
    logView(property.id)
    // optimistically bump view count (trigger handles actual increment)
    setViewsCount(c => c + 1)
  }, [property.id])

  // check if visitor saved this property
  useEffect(() => {
    isSavedByVisitor(property.id).then(setIsSaved)
  }, [property.id])

  // keyboard navigation for gallery + lightbox
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % allImages.length)
        if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length)
        if (e.key === 'Escape')     setLightboxOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, allImages.length])

  // ── handlers ───────────────────────────────────────────────────────────────

  const handleGalleryNav = useCallback((dir: 'prev' | 'next') => {
    setActiveIndex(i => {
      const next = dir === 'next' ? (i + 1) % totalSlides : (i - 1 + totalSlides) % totalSlides
      setShowVideo(next === VIDEO_INDEX)
      return next
    })
  }, [totalSlides, VIDEO_INDEX])

  const handleThumbClick = useCallback((idx: number) => {
    setActiveIndex(idx)
    setShowVideo(idx === VIDEO_INDEX)
  }, [VIDEO_INDEX])

  const handleSave = async () => {
    if (saveLoading) return
    setSaveLoading(true)
    // optimistic
    const next = !isSaved
    setIsSaved(next)
    setSavesCount(c => next ? c + 1 : c - 1)
    const actual = await toggleSave(property.id, !next) // pass old state
    // correct if DB disagreed
    setIsSaved(actual)
    setSaveLoading(false)
  }

  const handleWhatsApp = () => {
    if (!property.whatsapp_number) return
    logInquiry(property.id, 'whatsapp')
    const msg = `Hi, I'm interested in ${cleanTitle(property.title)} (Ref: ${property.reference_code}) listed at ${formatPrice(property.price, property.price_type)}. Is it still available?`
    window.open(buildWhatsAppUrl(property.whatsapp_number, msg), '_blank')
  }

  const handleCall = () => {
    if (!property.phone_number) return
    logInquiry(property.id, 'call')
    // tel: link fires via the <a> default — this just logs
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: cleanTitle(property.title), url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // ── derived ────────────────────────────────────────────────────────────────

  const title    = cleanTitle(property.title)
  const statInfo = statusStyle(property.status)
  const hasPhone = !!property.phone_number
  const hasWA    = !!property.whatsapp_number

  // similar mapped to PropertyCardData shape
  const similarCards: PropertyCardData[] = similar.map(p => ({
    id:            p.id,
    title:         p.title,
    location:      p.location,
    city:          p.city,
    price:         p.price,
    price_type:    p.price_type,
    bedrooms:      p.bedrooms,
    bathrooms:     p.bathrooms,
    area_sqft:     p.area_sqft,
    property_type: p.property_type,
    featured:      p.featured,
    images:        p.images,
    video_url:     p.video_url,
  }))

  // ── render video player ────────────────────────────────────────────────────

  const renderVideoPlayer = () => {
    if (!property.video_url) return null
    if (property.video_type === 'youtube') {
      const ytId = getYouTubeId(property.video_url)
      if (!ytId) return null
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }
    // uploaded video
    return (
      <video
        src={property.video_url}
        controls
        autoPlay
        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
      />
    )
  }

  // ── contact card (reused in sidebar + mobile bar) ──────────────────────────

  const ContactCard = ({ mobile = false }: { mobile?: boolean }) => (
    <div style={mobile ? {} : {
      position:     'sticky',
      top:          '88px',
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border:       '1px solid #E2E8F0',
      boxShadow:    '0 4px 24px rgba(15,28,46,0.08)',
      overflow:     'hidden',
    }}>
      {!mobile && (
        <>
          {/* gold top bar */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #C9A84C, #E8D48B, #C9A84C)' }} />
          <div style={{ padding: '24px 24px 0' }}>
            {/* status + ref */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{
                padding: '4px 10px', borderRadius: '999px', fontSize: '11px',
                fontWeight: 700, background: statInfo.bg, color: statInfo.color,
              }}>
                {statInfo.label}
              </span>
              <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.05em' }}>
                {property.reference_code}
              </span>
            </div>

            {/* title */}
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F1C2E', lineHeight: 1.25, margin: '0 0 8px' }}>
              {title}
            </h1>

            {/* location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '16px' }}>
              <MapPin style={{ width: '13px', height: '13px', color: '#C9A84C', flexShrink: 0 }} />
              <span style={{ fontSize: '12.5px', color: '#6B7280' }}>
                {property.location ? `${property.location}, ` : ''}{property.city}
              </span>
            </div>

            {/* price */}
            <div style={{
              padding: '14px 16px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #0F1C2E 0%, #1A3C5E 100%)',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                {property.price_type === 'rent' ? 'Monthly Rent' : 'Sale Price'}
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#C9A84C', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {formatPrice(property.price, property.price_type)}
              </div>
            </div>

            {/* stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {property.bedrooms != null && (
                <StatChip icon={<Bed style={{ width: '14px', height: '14px', color: '#C9A84C' }} />} label="Bedrooms" value={`${property.bedrooms} Bed`} />
              )}
              {property.bathrooms != null && (
                <StatChip icon={<Bath style={{ width: '14px', height: '14px', color: '#C9A84C' }} />} label="Bathrooms" value={`${property.bathrooms} Bath`} />
              )}
              {property.area_sqft != null && (
                <StatChip icon={<Ruler style={{ width: '14px', height: '14px', color: '#C9A84C' }} />} label="Area" value={`${new Intl.NumberFormat('en-IN').format(property.area_sqft)} sqft`} />
              )}
              <StatChip icon={<Home style={{ width: '14px', height: '14px', color: '#C9A84C' }} />} label="Type" value={typeLabel(property.property_type)} />
            </div>
          </div>
        </>
      )}

      {/* CTA buttons */}
      <div style={{ padding: mobile ? '0' : '0 24px 20px' }}>
        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          disabled={!hasWA}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '13px 20px', borderRadius: '12px', border: 'none',
            backgroundColor: hasWA ? '#25D366' : '#D1D5DB', color: hasWA ? '#fff' : '#9CA3AF',
            fontSize: '14px', fontWeight: 700, cursor: hasWA ? 'pointer' : 'not-allowed',
            marginBottom: '8px', transition: 'opacity 0.2s',
          }}
          title={!hasWA ? 'Contact info unavailable' : undefined}
        >
          <MessageCircle style={{ width: '16px', height: '16px' }} />
          WhatsApp Agent
        </button>

        {/* Call */}
        {hasPhone ? (
          <a
            href={`tel:${property.phone_number}`}
            onClick={handleCall}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '13px 20px', borderRadius: '12px',
              backgroundColor: '#0F1C2E', color: '#fff',
              fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              marginBottom: '12px', boxSizing: 'border-box',
            }}
          >
            <Phone style={{ width: '16px', height: '16px' }} />
            Call Agent
          </a>
        ) : (
          <button
            disabled
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '13px 20px', borderRadius: '12px', border: 'none',
              backgroundColor: '#D1D5DB', color: '#9CA3AF',
              fontSize: '14px', fontWeight: 700, cursor: 'not-allowed', marginBottom: '12px',
            }}
            title="Contact info unavailable"
          >
            <Phone style={{ width: '16px', height: '16px' }} />
            Call Agent
          </button>
        )}

        {/* Save + Share row */}
        {!mobile && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <SaveShareBtn
              onClick={handleSave}
              active={isSaved}
              icon={<Heart style={{ width: '15px', height: '15px', color: isSaved ? '#EF4444' : '#374151', fill: isSaved ? '#EF4444' : 'none' }} />}
              label={isSaved ? 'Saved' : 'Save'}
              flex={1}
            />
            <SaveShareBtn
              onClick={handleShare}
              active={false}
              icon={copied
                ? <Check style={{ width: '15px', height: '15px', color: '#16A34A' }} />
                : <Share2 style={{ width: '15px', height: '15px', color: '#374151' }} />
              }
              label={copied ? 'Copied!' : 'Share'}
              flex={1}
            />
          </div>
        )}

        {/* engagement stats */}
        {!mobile && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '6px',
            marginTop: '16px', padding: '14px', borderRadius: '10px',
            backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9',
          }}>
            <EngagementRow icon={<Eye style={{ width: '13px', height: '13px', color: '#9CA3AF' }} />} label={`${viewsCount.toLocaleString('en-IN')} views`} />
            <EngagementRow icon={<Heart style={{ width: '13px', height: '13px', color: '#9CA3AF' }} />} label={`${savesCount.toLocaleString('en-IN')} saves`} />
            <EngagementRow icon={<Calendar style={{ width: '13px', height: '13px', color: '#9CA3AF' }} />} label={`Listed ${timeAgo(property.created_at)}`} />
          </div>
        )}
      </div>
    </div>
  )

  // ── main render ────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />

      {/* lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              backgroundColor: 'rgba(0,0,0,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => setLightboxOpen(false)}
          >
            {/* close */}
            <button
              onClick={() => setLightboxOpen(false)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%', width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
              }}
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>

            {/* image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh', borderRadius: '12px', overflow: 'hidden' }}
            >
              <Image
                src={allImages[lightboxIndex]}
                alt={`${title} — photo ${lightboxIndex + 1}`}
                width={1200}
                height={800}
                style={{ objectFit: 'contain', maxHeight: '85vh', width: 'auto' }}
                unoptimized
              />
            </motion.div>

            {/* nav arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length) }}
                  style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', ...arrowBtnStyle }}
                >
                  <ChevronLeft style={{ width: '20px', height: '20px', color: '#fff' }} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % allImages.length) }}
                  style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', ...arrowBtnStyle }}
                >
                  <ChevronRight style={{ width: '20px', height: '20px', color: '#fff' }} />
                </button>
              </>
            )}

            {/* counter */}
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* page wrapper */}
      <div style={{ backgroundColor: '#F1F5F9', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: isMobile ? '16px 16px 100px' : '32px 32px 64px' }}>

          {/* breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Home',       href: '/' },
              { label: 'Properties', href: '/properties' },
              { label: property.city, href: `/properties?city=${property.city}` },
            ].map((crumb, i) => (
              <span key={crumb.href} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {i > 0 && <span style={{ color: '#CBD5E1', fontSize: '12px' }}>/</span>}
                <Link href={crumb.href} style={{ fontSize: '12.5px', color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}>
                  {crumb.label}
                </Link>
              </span>
            ))}
            <span style={{ color: '#CBD5E1', fontSize: '12px' }}>/</span>
            <span style={{ fontSize: '12.5px', color: '#C9A84C', fontWeight: 700 }}>{property.reference_code}</span>
          </nav>

          {/* two-column layout */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '28px',
            alignItems: 'flex-start',
          }}>

            {/* ── LEFT COLUMN ─────────────────────────────────────── */}
            <div style={{ flex: isMobile ? undefined : '0 0 62%', width: isMobile ? '100%' : undefined, minWidth: 0 }}>

              {/* gallery */}
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #E2E8F0', backgroundColor: '#0F1C2E', marginBottom: '16px' }}>
                {/* main image / video */}
                <div style={{ position: 'relative', paddingTop: isMobile ? '66.66%' : '62.5%' /* 16:10 */ }}>
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <AnimatePresence mode="wait">
                      {showVideo ? (
                        <motion.div
                          key="video"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
                        >
                          {renderVideoPlayer()}
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`img-${activeIndex}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ width: '100%', height: '100%', cursor: 'zoom-in' }}
                          onClick={() => { setLightboxIndex(activeIndex); setLightboxOpen(true) }}
                        >
                          <Image
                            src={allImages[activeIndex] ?? allImages[0]}
                            alt={`${title} — photo ${activeIndex + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                            unoptimized
                          />
                          {/* zoom hint */}
                          <div style={{
                            position: 'absolute', bottom: '14px', right: '14px',
                            padding: '5px 10px', borderRadius: '8px',
                            backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                          }}>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                              Click to enlarge
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* gallery arrows — only on images, multiple slides */}
                    {!showVideo && totalSlides > 1 && (
                      <>
                        <button
                          onClick={() => handleGalleryNav('prev')}
                          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', ...arrowBtnStyle }}
                        >
                          <ChevronLeft style={{ width: '18px', height: '18px', color: '#fff' }} />
                        </button>
                        <button
                          onClick={() => handleGalleryNav('next')}
                          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', ...arrowBtnStyle }}
                        >
                          <ChevronRight style={{ width: '18px', height: '18px', color: '#fff' }} />
                        </button>
                      </>
                    )}

                    {/* image counter badge */}
                    {!showVideo && allImages.length > 1 && (
                      <div style={{
                        position: 'absolute', top: '14px', left: '14px',
                        padding: '4px 10px', borderRadius: '8px',
                        backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}>
                        <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>
                          {activeIndex + 1} / {allImages.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* thumbnail strip */}
                {totalSlides > 1 && (
                  <div style={{
                    display: 'flex', gap: '6px', padding: '10px 12px',
                    backgroundColor: '#080F1D', overflowX: 'auto',
                    scrollbarWidth: 'none',
                  }}>
                    {allImages.map((img, i) => (
                      <ThumbBtn
                        key={img}
                        active={activeIndex === i && !showVideo}
                        onClick={() => handleThumbClick(i)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </ThumbBtn>
                    ))}
                    {hasVideo && (
                      <ThumbBtn active={showVideo} onClick={() => handleThumbClick(VIDEO_INDEX)}>
                        <div style={{
                          width: '100%', height: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', flexDirection: 'column', gap: '4px',
                          backgroundColor: '#0F1C2E',
                        }}>
                          {property.video_thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={property.video_thumbnail} alt="video" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                          ) : null}
                          <PlaySquare style={{ width: '20px', height: '20px', color: '#C9A84C', position: 'relative', zIndex: 1 }} />
                          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, position: 'relative', zIndex: 1 }}>VIDEO</span>
                        </div>
                      </ThumbBtn>
                    )}
                  </div>
                )}
              </div>

              {/* description */}
              {property.description && (
                <SectionCard title="Description">
                  <p style={{
                    fontSize: '14.5px', color: '#374151', lineHeight: 1.75,
                    margin: 0, maxWidth: '70ch', whiteSpace: 'pre-line',
                  }}>
                    {property.description}
                  </p>
                </SectionCard>
              )}

              {/* property details */}
              <SectionCard title="Property Details">
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0' }}>
                  {[
                    { label: 'Reference',      value: property.reference_code },
                    { label: 'Property Type',  value: typeLabel(property.property_type) },
                    { label: 'Status',         value: statInfo.label },
                    { label: 'City',           value: property.city },
                    ...(property.location    ? [{ label: 'Location',   value: property.location }]   : []),
                    ...(property.bedrooms   != null ? [{ label: 'Bedrooms',  value: `${property.bedrooms}` }]  : []),
                    ...(property.bathrooms  != null ? [{ label: 'Bathrooms', value: `${property.bathrooms}` }] : []),
                    ...(property.area_sqft  != null ? [{ label: 'Area',      value: `${new Intl.NumberFormat('en-IN').format(property.area_sqft)} sqft` }] : []),
                    { label: 'Price',          value: formatPrice(property.price, property.price_type) },
                    { label: 'Listed',         value: timeAgo(property.created_at) },
                  ].map((row, i, arr) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontSize: '13px', color: '#0F1C2E', fontWeight: 700 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* location */}
              {property.address && (
                <SectionCard title="Location">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin style={{ width: '16px', height: '16px', color: '#C9A84C', flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.6 }}>
                      {property.address}
                    </p>
                  </div>
                </SectionCard>
              )}
            </div>

            {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
            {!isMobile && (
              <div style={{ flex: '0 0 38%', width: '38%', minWidth: 0 }}>
                <ContactCard />
              </div>
            )}
          </div>

          {/* similar properties */}
          {similarCards.length > 0 && (
            <div style={{ marginTop: '64px' }}>
              {/* section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                <div style={{ width: '4px', height: '32px', borderRadius: '2px', background: 'linear-gradient(to bottom, #C9A84C, #A6832E)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '4px' }}>
                    You May Also Like
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F1C2E', margin: 0, letterSpacing: '-0.02em' }}>
                    Similar Properties
                  </h2>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(similarCards.length, 4)}, 1fr)`,
                gap: '20px',
              }}>
                {similarCards.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* mobile sticky bottom bar */}
      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          backgroundColor: '#fff', borderTop: '1px solid #E2E8F0',
          padding: '12px 16px',
          boxShadow: '0 -4px 24px rgba(15,28,46,0.1)',
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* save */}
            <button
              onClick={handleSave}
              style={{
                width: '44px', height: '44px', borderRadius: '12px', border: '1.5px solid #E2E8F0',
                backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              <Heart style={{ width: '18px', height: '18px', color: isSaved ? '#EF4444' : '#9CA3AF', fill: isSaved ? '#EF4444' : 'none' }} />
            </button>

            {/* share */}
            <button
              onClick={handleShare}
              style={{
                width: '44px', height: '44px', borderRadius: '12px', border: '1.5px solid #E2E8F0',
                backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              {copied
                ? <Check style={{ width: '18px', height: '18px', color: '#16A34A' }} />
                : <Copy style={{ width: '18px', height: '18px', color: '#9CA3AF' }} />
              }
            </button>

            {/* call */}
            {hasPhone ? (
              <a
                href={`tel:${property.phone_number}`}
                onClick={handleCall}
                style={{
                  flex: 1, height: '44px', borderRadius: '12px',
                  backgroundColor: '#0F1C2E', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none',
                }}
              >
                <Phone style={{ width: '15px', height: '15px' }} />
                Call
              </a>
            ) : (
              <div style={{ flex: 1, height: '44px', borderRadius: '12px', backgroundColor: '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 700 }}>No Phone</span>
              </div>
            )}

            {/* whatsapp */}
            <button
              onClick={handleWhatsApp}
              disabled={!hasWA}
              style={{
                flex: 1, height: '44px', borderRadius: '12px', border: 'none',
                backgroundColor: hasWA ? '#25D366' : '#D1D5DB',
                color: hasWA ? '#fff' : '#9CA3AF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', fontSize: '13px', fontWeight: 700, cursor: hasWA ? 'pointer' : 'not-allowed',
              }}
            >
              <MessageCircle style={{ width: '15px', height: '15px' }} />
              WhatsApp
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

// ── small sub-components (keep file flat, no separate files needed) ───────────

function StatChip({
  icon, label, value,
}: {
  icon:  React.ReactNode
  label: string
  value: string
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '10px 12px', borderRadius: '10px',
      backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9',
    }}>
      {icon}
      <div>
        <div style={{ fontSize: '9.5px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ fontSize: '12.5px', color: '#0F1C2E', fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  )
}

function EngagementRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon}
      <span style={{ fontSize: '12.5px', color: '#6B7280', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0',
      padding: '24px', marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: 'linear-gradient(to bottom, #C9A84C, #A6832E)', flexShrink: 0 }} />
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F1C2E', margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function ThumbBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '64px', height: '48px', borderRadius: '8px', overflow: 'hidden',
        border: active ? '2px solid #C9A84C' : '2px solid transparent',
        flexShrink: 0, cursor: 'pointer', padding: 0, position: 'relative',
        transition: 'border-color 0.2s', backgroundColor: '#0F1C2E',
      }}
    >
      {children}
    </button>
  )
}

function SaveShareBtn({
  onClick, active, icon, label, flex,
}: {
  onClick: () => void
  active:  boolean
  icon:    React.ReactNode
  label:   string
  flex:    number
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '6px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0',
        backgroundColor: active ? '#FFF5F5' : '#F8FAFC', cursor: 'pointer',
        fontSize: '12.5px', fontWeight: 700, color: active ? '#EF4444' : '#374151',
        transition: 'all 0.2s',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// shared arrow button style
const arrowBtnStyle: React.CSSProperties = {
  width: '36px', height: '36px', borderRadius: '50%',
  backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
}