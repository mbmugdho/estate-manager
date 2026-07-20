'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import DeleteModal from '@/components/admin/DeleteModal'
import {
  Search, Plus, Star, Edit2, Trash2, Archive,
  Building, ChevronDown, X, ImageIcon, Video 
} from 'lucide-react'
import type { Property } from './page'

type TabKey = 'active' | 'archived' | 'featured'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'active',   label: 'All Active' },
  { key: 'archived', label: 'Archived'   },
  { key: 'featured', label: 'Featured'   },
]

const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: '#16A34A', bg: 'rgba(22,163,74,0.10)' },
  sold:      { label: 'Sold',      color: '#DC2626', bg: 'rgba(220,38,38,0.10)' },
  rented:    { label: 'Rented',    color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  archived:  { label: 'Archived',  color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
}

function formatPrice(price: number, type: string) {
  const f = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(price)
  return type === 'rent' ? `৳${f}/mo` : `৳${f}`
}

export default function PropertiesClient({
  initialProperties,
}: {
  initialProperties: Property[]
}) {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [tab, setTab] = useState<TabKey>('active')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null)

  // ── filter + search ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = properties

    // tab filter
    if (tab === 'active')   list = list.filter(p => p.status !== 'archived')
    if (tab === 'archived') list = list.filter(p => p.status === 'archived')
    if (tab === 'featured') list = list.filter(p => p.featured)

    // status filter (only in active tab)
    if (tab === 'active' && statusFilter !== 'all') {
      list = list.filter(p => p.status === statusFilter)
    }

    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(p =>
        (p.reference_code ?? '').toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.location ?? '').toLowerCase().includes(q) ||
        p.property_type.toLowerCase().includes(q)
      )
    }

    return list
  }, [properties, tab, search, statusFilter])

  // ── counts per tab ──────────────────────────────────────
  const counts = useMemo(() => ({
    active:   properties.filter(p => p.status !== 'archived').length,
    archived: properties.filter(p => p.status === 'archived').length,
    featured: properties.filter(p => p.featured).length,
  }), [properties])

  // ── actions ─────────────────────────────────────────────
  async function toggleFeatured(p: Property) {
    setProperties(prev => prev.map(x => x.id === p.id ? { ...x, featured: !x.featured } : x))
    const { error } = await supabase
      .from('properties')
      .update({ featured: !p.featured })
      .eq('id', p.id)
    if (error) {
      // rollback on error
      setProperties(prev => prev.map(x => x.id === p.id ? { ...x, featured: p.featured } : x))
    }
  }

  async function changeStatus(p: Property, newStatus: string) {
    setProperties(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus } : x))
    const { error } = await supabase
      .from('properties')
      .update({ status: newStatus })
      .eq('id', p.id)
    if (error) {
      setProperties(prev => prev.map(x => x.id === p.id ? { ...x, status: p.status } : x))
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const target = deleteTarget

    // delete images from storage
    if (target.images && target.images.length > 0) {
      const paths = target.images
        .map(url => url.split('/property-images/')[1])
        .filter(Boolean)
      if (paths.length) {
        await supabase.storage.from('property-images').remove(paths)
      }
    }

    // delete row
    const { error } = await supabase.from('properties').delete().eq('id', target.id)
    if (!error) {
      setProperties(prev => prev.filter(p => p.id !== target.id))
      setDeleteTarget(null)
    }
  }

  // ── render ──────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{
            color: '#0F1C2E',
            fontSize: '22px',
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.2,
          }}>
            All Properties
          </h2>
          <p style={{ color: '#6B7280', fontSize: '13.5px', marginTop: '6px' }}>
            {properties.length} total listings
          </p>
        </div>

        <Link
          href="/admin/properties/add"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 20px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#0F1C2E',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #C9A84C 0%, #B8943F 100%)',
            boxShadow: '0 4px 16px rgba(201,168,76,0.30)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Add Property
        </Link>
      </div>

      {/* tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '4px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        width: 'fit-content',
      }}>
        {tabs.map(t => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setStatusFilter('all') }}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: active ? '#0F1C2E' : 'transparent',
                color: active ? '#fff' : '#6B7280',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '20px',
                padding: '0 6px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: active ? 'rgba(255,255,255,0.15)' : '#F1F5F9',
                color: active ? '#fff' : '#0F1C2E',
              }}>
                {counts[t.key]}
              </span>
            </button>
          )
        })}
      </div>

      {/* search + filter row */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        {/* search */}
        <div style={{
          position: 'relative',
          flex: '1 1 320px',
          minWidth: '260px',
        }}>
          <Search style={{
            position: 'absolute',
            top: '50%',
            left: '14px',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: '#9CA3AF',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by reference, title, city, or type…"
            style={{
              width: '100%',
              padding: '11px 40px 11px 42px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#fff',
              color: '#0F1C2E',
              fontSize: '13.5px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                borderRadius: '8px',
                backgroundColor: '#F1F5F9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X style={{ width: '12px', height: '12px', color: '#6B7280' }} />
            </button>
          )}
        </div>

        {/* status filter (only in active tab) */}
        {tab === 'active' && (
          <div style={{ position: 'relative' }}>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                appearance: 'none',
                padding: '11px 40px 11px 16px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#fff',
                color: '#0F1C2E',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
            <ChevronDown style={{
              position: 'absolute',
              top: '50%',
              right: '14px',
              transform: 'translateY(-50%)',
              width: '14px',
              height: '14px',
              color: '#6B7280',
              pointerEvents: 'none',
            }} />
          </div>
        )}
      </div>

      {/* table */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
      }}>
        {/* table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '130px 60px minmax(200px, 1fr) 130px 110px 90px 130px',
          gap: '16px',
          padding: '14px 20px',
          borderBottom: '1px solid #F1F5F9',
          backgroundColor: '#FAFBFC',
          alignItems: 'center',
        }}>
          {['Reference', '', 'Property', 'Location', 'Price', 'Status', 'Actions'].map((h, i) => (
            <div key={i} style={{
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#6B7280',
              textAlign: i === 5 || i === 6 ? 'center' : 'left',
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* rows or empty */}
        {filtered.length === 0 ? (
          <EmptyState hasProperties={properties.length > 0} search={search} tab={tab} />
        ) : (
          <div>
            <AnimatePresence initial={false}>
              {filtered.map((p, i) => (
                <PropertyRow
                  key={p.id}
                  property={p}
                  index={i}
                  onToggleFeatured={() => toggleFeatured(p)}
                  onChangeStatus={(s) => changeStatus(p, s)}
                  onEdit={() => router.push(`/admin/properties/edit/${p.id}`)}
                  onDelete={() => setDeleteTarget(p)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* delete modal */}
      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget?.title ?? ''}
        referenceCode={deleteTarget?.reference_code ?? ''}
      />
    </div>
  )
}

// ── single row ──────────────────────────────────────────────
function PropertyRow({
  property, index, onToggleFeatured, onChangeStatus, onEdit, onDelete,
}: {
  property:          Property
  index:             number
  onToggleFeatured:  () => void
  onChangeStatus:    (status: string) => void
  onEdit:            () => void
  onDelete:          () => void
}) {
  const [hover, setHover] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const meta = statusMeta[property.status] ?? statusMeta.available
  const thumb = property.images?.[0]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.15) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setStatusOpen(false) }}
      style={{
        display: 'grid',
        gridTemplateColumns: '130px 60px minmax(200px, 1fr) 130px 110px 90px 130px',
        gap: '16px',
        padding: '14px 20px',
        borderBottom: '1px solid #F1F5F9',
        alignItems: 'center',
        backgroundColor: hover ? '#FAFBFC' : '#fff',
        transition: 'background-color 0.15s',
      }}
    >
      {/* reference */}
      <div style={{
        fontSize: '12px',
        fontFamily: 'ui-monospace, monospace',
        fontWeight: 700,
        color: '#A6832E',
      }}>
        {property.reference_code || '—'}
      </div>

      {/* thumbnail */}
      <div style={{
  position: 'relative',
  width: '48px',
  height: '48px',
  borderRadius: '10px',
  overflow: 'hidden',
  backgroundColor: '#F1F5F9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}}>
  {thumb ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={thumb} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  ) : (
    <ImageIcon style={{ width: '18px', height: '18px', color: '#CBD5E1' }} />
  )}
  {/* play overlay if video exists */}
  {property.video_url && (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '999px',
        backgroundColor: 'rgba(255,255,255,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* triangle play icon */}
        <div style={{
          width: 0,
          height: 0,
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
          borderLeft: '6px solid #0F1C2E',
          marginLeft: '2px',
        }} />
      </div>
    </div>
  )}
</div>

      {/* title */}
      {/* title */}
<div style={{ minWidth: 0 }}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '2px',
  }}>
    <p style={{
      color: '#0F1C2E',
      fontSize: '13.5px',
      fontWeight: 600,
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}>
      {property.title}
    </p>
    {property.featured && (
      <Star style={{
        width: '13px',
        height: '13px',
        color: '#C9A84C',
        fill: '#C9A84C',
        flexShrink: 0,
      }} />
    )}
    {/* video badge — NEW */}
    {property.video_url && (
      <div
        title="Has video"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '18px',
          borderRadius: '5px',
          backgroundColor: 'rgba(37,99,235,0.10)',
          flexShrink: 0,
        }}
      >
        <Video style={{ width: '10px', height: '10px', color: '#2563EB' }} />
      </div>
    )}
  </div>
  ...
</div>

      {/* location */}
      <div style={{ minWidth: 0 }}>
        <p style={{
          color: '#0F1C2E',
          fontSize: '13px',
          fontWeight: 500,
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {property.city}
        </p>
        {property.location && (
          <p style={{
            color: '#6B7280',
            fontSize: '11.5px',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {property.location}
          </p>
        )}
      </div>

      {/* price */}
      <div style={{
        color: '#0F1C2E',
        fontSize: '13px',
        fontWeight: 700,
      }}>
        {formatPrice(property.price, property.price_type)}
      </div>

      {/* status pill (click to change) */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => setStatusOpen(v => !v)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            color: meta.color,
            backgroundColor: meta.bg,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {meta.label}
          <ChevronDown style={{ width: '10px', height: '10px' }} />
        </button>

        <AnimatePresence>
          {statusOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '6px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                padding: '4px',
                zIndex: 20,
                minWidth: '120px',
              }}
            >
              {Object.entries(statusMeta).map(([key, m]) => (
                <button
                  key={key}
                  onClick={() => { onChangeStatus(key); setStatusOpen(false) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '7px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#374151',
                    backgroundColor: property.status === key ? '#F1F5F9' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = property.status === key ? '#F1F5F9' : 'transparent')}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '999px',
                    backgroundColor: m.color,
                  }} />
                  {m.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
        <IconBtn
          onClick={onToggleFeatured}
          tooltip={property.featured ? 'Unfeature' : 'Feature'}
          active={property.featured}
        >
          <Star style={{
            width: '14px',
            height: '14px',
            color: property.featured ? '#C9A84C' : '#6B7280',
            fill: property.featured ? '#C9A84C' : 'transparent',
          }} />
        </IconBtn>
        <IconBtn
          onClick={() => onChangeStatus(property.status === 'archived' ? 'available' : 'archived')}
          tooltip={property.status === 'archived' ? 'Restore' : 'Archive'}
        >
          <Archive style={{ width: '14px', height: '14px', color: '#6B7280' }} />
        </IconBtn>
        <IconBtn onClick={onEdit} tooltip="Edit">
          <Edit2 style={{ width: '14px', height: '14px', color: '#6B7280' }} />
        </IconBtn>
        <IconBtn onClick={onDelete} tooltip="Delete" danger>
          <Trash2 style={{ width: '14px', height: '14px', color: '#DC2626' }} />
        </IconBtn>
      </div>
    </motion.div>
  )
}

// ── icon button ─────────────────────────────────────────────
function IconBtn({
  children, onClick, tooltip, active, danger,
}: {
  children: React.ReactNode
  onClick:  () => void
  tooltip:  string
  active?:  boolean
  danger?:  boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={onClick}
        aria-label={tooltip}
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: hover
            ? (danger ? 'rgba(220,38,38,0.10)' : (active ? 'rgba(201,168,76,0.14)' : '#F1F5F9'))
            : (active ? 'rgba(201,168,76,0.08)' : 'transparent'),
          transition: 'background-color 0.15s',
        }}
      >
        {children}
      </button>
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 4px)',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0F1C2E',
              color: '#fff',
              fontSize: '10.5px',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 30,
            }}
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── empty state ─────────────────────────────────────────────
function EmptyState({
  hasProperties, search, tab,
}: {
  hasProperties: boolean
  search:        string
  tab:           TabKey
}) {
  const searching = search.trim().length > 0

  return (
    <div style={{
      padding: '80px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '18px',
        backgroundColor: '#F1F5F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      }}>
        {searching
          ? <Search style={{ width: '26px', height: '26px', color: '#9CA3AF' }} />
          : <Building style={{ width: '26px', height: '26px', color: '#9CA3AF' }} />}
      </div>
      <p style={{ color: '#0F1C2E', fontSize: '15px', fontWeight: 700, margin: 0 }}>
        {searching
          ? 'No matches found'
          : tab === 'archived' ? 'No archived properties'
          : tab === 'featured' ? 'No featured properties yet'
          : hasProperties      ? 'No active properties'
          : 'No properties yet'}
      </p>
      <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '6px', maxWidth: '340px' }}>
        {searching
          ? `Try adjusting your search or filters.`
          : tab === 'archived' ? 'Archived properties will appear here.'
          : tab === 'featured' ? 'Mark properties as featured to promote them on your homepage.'
          : 'Get started by adding your first property listing.'}
      </p>
      {!searching && !hasProperties && (
        <Link
          href="/admin/properties/add"
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#0F1C2E',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
            boxShadow: '0 4px 12px rgba(201,168,76,0.25)',
          }}
        >
          Add Your First Property
        </Link>
      )}
    </div>
  )
}