'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building,
  CheckCircle,
  Star,
  TrendingUp,
  ArrowRight,
  CircleDot,
  Sprout,
  Trash2,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

interface RecentProperty {
  id:         string
  title:      string
  status:     string
  price:      number
  price_type: string
  city:       string
  created_at: string
}

interface Stats {
  total:     number
  available: number
  sold:      number
  featured:  number
  recent:    RecentProperty[]
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: '#16A34A', bg: 'rgba(22,163,74,0.10)' },
  sold:      { label: 'Sold',      color: '#DC2626', bg: 'rgba(220,38,38,0.10)' },
  rented:    { label: 'Rented',    color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  archived:  { label: 'Archived',  color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.25, 0.1, 0, 1] } },
}

// format as Bangladeshi Taka with Indian numbering (lakhs/crores)
function formatPrice(price: number, type: string) {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(price)
  return type === 'rent' ? `৳${formatted}/mo` : `৳${formatted}`
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export default function DashboardClient({ stats }: { stats: Stats }) {

  const statCards = [
    { label: 'Total Listings', value: stats.total,     icon: Building,     accent: '#C9A84C', bg: 'rgba(201,168,76,0.10)', desc: 'All properties'    },
    { label: 'Available',      value: stats.available, icon: CheckCircle,  accent: '#16A34A', bg: 'rgba(22,163,74,0.10)',  desc: 'Ready to view'     },
    { label: 'Sold / Rented',  value: stats.sold,      icon: TrendingUp,   accent: '#2563EB', bg: 'rgba(37,99,235,0.10)',  desc: 'Closed deals'      },
    { label: 'Featured',       value: stats.featured,  icon: Star,         accent: '#9333EA', bg: 'rgba(147,51,234,0.10)', desc: 'Promoted listings' },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >

      {/* welcome banner */}
      <motion.div
        variants={fadeUp}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          padding: '28px 32px',
          background: 'linear-gradient(135deg, #0F1C2E 0%, #1A3C5E 100%)',
        }}
      >
        {/* deco circles */}
        <div style={{
          position: 'absolute', right: '-48px', top: '-48px',
          width: '192px', height: '192px', borderRadius: '999px',
          background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)',
          opacity: 0.10, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '64px', bottom: '-40px',
          width: '112px', height: '112px', borderRadius: '999px',
          background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)',
          opacity: 0.07, pointerEvents: 'none',
        }} />

        <div
          style={{
            position: 'relative', zIndex: 10,
            display: 'flex', flexDirection: 'column', gap: '20px',
          }}
          className="sm:!flex-row sm:!items-center"
        >
          <div style={{ flex: 1 }}>
            <p style={{
              color: '#C9A84C', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '8px',
            }}>
              Welcome back
            </p>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
              Demo Admin
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '6px' }}>
              Here&apos;s what&apos;s happening with your listings today.
            </p>
          </div>

          <div style={{
            display: 'flex', gap: '10px', flexWrap: 'wrap',
            alignSelf: 'flex-start', flexShrink: 0,
            position: 'relative',
          }}>
            <SeedButtons />
            <Link
              href="/admin/properties/add"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '12px 20px', borderRadius: '12px',
                fontSize: '13px', fontWeight: 600, color: '#0F1C2E',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #C9A84C 0%, #B8943F 100%)',
                boxShadow: '0 4px 16px rgba(201,168,76,0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Add Listing
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}
        className="lg:!grid-cols-4"
      >
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={fadeUp}
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              transition: 'all 0.3s',
            }}
            whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px', backgroundColor: card.bg,
            }}>
              <card.icon style={{ width: '18px', height: '18px', color: card.accent }} />
            </div>
            <p style={{ color: '#0F1C2E', fontSize: '26px', fontWeight: 700, lineHeight: 1, margin: 0 }}>
              {card.value}
            </p>
            <p style={{ color: '#0F1C2E', fontSize: '13px', fontWeight: 600, marginTop: '6px' }}>
              {card.label}
            </p>
            <p style={{ color: '#6B7280', fontSize: '11.5px', marginTop: '2px' }}>
              {card.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* recent listings */}
      <motion.div
        variants={fadeUp}
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #F1F5F9',
        }}>
          <h3 style={{ color: '#0F1C2E', fontWeight: 700, fontSize: '15px', margin: 0 }}>
            Recent Listings
          </h3>
          <Link
            href="/admin/properties"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '12.5px', fontWeight: 600,
              color: '#C9A84C', textDecoration: 'none',
            }}
          >
            View all <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '64px 24px', textAlign: 'center',
          }}>
            <div style={{
              width: '56px', height: '56px',
              backgroundColor: '#F1F5F9', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <Building style={{ width: '24px', height: '24px', color: '#9CA3AF' }} />
            </div>
            <p style={{ color: '#0F1C2E', fontWeight: 600, fontSize: '14px', margin: 0 }}>
              No properties yet
            </p>
            <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>
              Add your first listing to get started.
            </p>
            <Link
              href="/admin/properties/add"
              style={{
                marginTop: '20px', padding: '10px 20px',
                borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                color: '#fff', textDecoration: 'none',
                background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                boxShadow: '0 4px 12px rgba(201,168,76,0.25)',
              }}
            >
              Add Property
            </Link>
          </div>
        ) : (
          <div>
            {stats.recent.map((p, i) => {
              const st = statusConfig[p.status] ?? statusConfig.available
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 24px',
                    borderTop: i === 0 ? 'none' : '1px solid #F1F5F9',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFBFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <CircleDot style={{ width: '16px', height: '16px', color: st.color, flexShrink: 0 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: '#0F1C2E', fontSize: '13.5px', fontWeight: 600, margin: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.title}
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>
                      {p.city} · {timeAgo(p.created_at)}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ color: '#0F1C2E', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                      {formatPrice(p.price, p.price_type)}
                    </p>
                    <span style={{
                      display: 'inline-block', marginTop: '4px',
                      padding: '2px 8px', borderRadius: '999px',
                      fontSize: '10.5px', fontWeight: 600,
                      color: st.color, backgroundColor: st.bg,
                    }}>
                      {st.label}
                    </span>
                  </div>

                  <Link
                    href={`/admin/properties/edit/${p.id}`}
                    style={{
                      flexShrink: 0, width: '32px', height: '32px',
                      borderRadius: '12px', backgroundColor: '#F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E2E8F0')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                  >
                    <ArrowRight style={{ width: '14px', height: '14px', color: '#6B7280' }} />
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

    </motion.div>
  )
}

// ── seed / clear demo data buttons ──────────────────────────
function SeedButtons() {
  const [seeding, setSeeding] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  async function handleSeed() {
    if (seeding) return
    setSeeding(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        setFeedback(`✓ Added ${json.count} properties`)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setFeedback(`✗ ${json.error ?? 'Failed'}`)
      }
    } catch {
      setFeedback('✗ Network error')
    } finally {
      setSeeding(false)
    }
  }

  async function handleClear() {
    if (clearing) return
    const confirmed = window.confirm(
      'This will DELETE all demo properties (titles starting with [DEMO]).\n\nContinue?'
    )
    if (!confirmed) return

    setClearing(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin/clear-demo', { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        setFeedback(`✓ Cleared ${json.count} properties`)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setFeedback(`✗ ${json.error ?? 'Failed'}`)
      }
    } catch {
      setFeedback('✗ Network error')
    } finally {
      setClearing(false)
    }
  }

  return (
    <>
      <button
        onClick={handleSeed}
        disabled={seeding || clearing}
        title="Add 25 realistic demo properties"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 16px', borderRadius: '12px',
          fontSize: '12.5px', fontWeight: 600,
          color: 'rgba(255,255,255,0.85)',
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          cursor: seeding || clearing ? 'not-allowed' : 'pointer',
          opacity: seeding || clearing ? 0.6 : 1,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!seeding && !clearing) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)'
        }}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
      >
        {seeding ? (
          <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
        ) : (
          <Sprout style={{ width: '14px', height: '14px' }} />
        )}
        {seeding ? 'Seeding…' : 'Seed Demo Data'}
      </button>

      <button
        onClick={handleClear}
        disabled={seeding || clearing}
        title="Delete all demo properties"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 14px', borderRadius: '12px',
          fontSize: '12.5px', fontWeight: 600,
          color: 'rgba(252,165,165,0.9)',
          backgroundColor: 'rgba(220,38,38,0.10)',
          border: '1px solid rgba(220,38,38,0.20)',
          cursor: seeding || clearing ? 'not-allowed' : 'pointer',
          opacity: seeding || clearing ? 0.6 : 1,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!seeding && !clearing) e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.18)'
        }}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.10)')}
      >
        {clearing ? (
          <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
        ) : (
          <Trash2 style={{ width: '14px', height: '14px' }} />
        )}
        {clearing ? 'Clearing…' : 'Clear Demo'}
      </button>

      {feedback && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: '12px',
          padding: '8px 14px', borderRadius: '10px',
          fontSize: '12px', fontWeight: 600,
          backgroundColor: feedback.startsWith('✓') ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)',
          color: feedback.startsWith('✓') ? '#86efac' : '#fca5a5',
          border: `1px solid ${feedback.startsWith('✓') ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}`,
          zIndex: 20, whiteSpace: 'nowrap',
        }}>
          {feedback}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}