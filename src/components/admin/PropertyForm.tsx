'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import {
  Upload, X, CheckCircle2, AlertCircle,
  ImageIcon, Loader2, Info, DollarSign,
  Home, MapPin, Eye, Phone, Camera,
  Video, PlaySquare, Film, Trash2,
} from 'lucide-react'

// ── types ────────────────────────────────────────────────────
interface FormData {
  title:           string
  description:     string
  price:           string
  price_type:      string
  property_type:   string
  bedrooms:        string
  bathrooms:       string
  area_sqft:       string
  city:            string
  location:        string
  address:         string
  status:          string
  featured:        boolean
  whatsapp_number: string
  phone_number:    string
  video_url:       string  
  video_type:      string
}

interface PropertyFormProps {
  initialData?: Partial<FormData> & {
    id?:             string
    images?:         string[]
    reference_code?: string
  }
  mode: 'add' | 'edit'
}

const BLANK: FormData = {
  title: '', description: '', price: '', price_type: 'sale',
  property_type: 'apartment', bedrooms: '', bathrooms: '',
  area_sqft: '', city: '', location: '', address: '',
  status: 'available', featured: false,
  whatsapp_number: '', phone_number: '',
  video_url: '', video_type: '',
}

// ── shared inline styles ─────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 16px',
  borderRadius: '12px',
  border: '1px solid #E2E8F0',
  backgroundColor: '#FAFBFC',
  color: '#0F1C2E',
  fontSize: '13.5px',
  outline: 'none',
  transition: 'all 0.2s',
  fontFamily: 'inherit',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  paddingRight: '40px',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
}

// ── input wrapper with focus handling ────────────────────────
function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
      style={{
        ...inputStyle,
        borderColor: focused ? '#C9A84C' : '#E2E8F0',
        boxShadow: focused ? '0 0 0 3px rgba(201,168,76,0.15)' : 'none',
        ...props.style,
      }}
    />
  )
}

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
      style={{
        ...inputStyle,
        resize: 'none',
        borderColor: focused ? '#C9A84C' : '#E2E8F0',
        boxShadow: focused ? '0 0 0 3px rgba(201,168,76,0.15)' : 'none',
        ...props.style,
      }}
    />
  )
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
      style={{
        ...selectStyle,
        borderColor: focused ? '#C9A84C' : '#E2E8F0',
        boxShadow: focused ? '0 0 0 3px rgba(201,168,76,0.15)' : 'none',
        ...props.style,
      }}
    >
      {props.children}
    </select>
  )
}

// ── section card ─────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ style?: React.CSSProperties }>
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '18px 24px',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'rgba(201,168,76,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: '16px', height: '16px', color: '#C9A84C' }} />
        </div>
        <div>
          <h3 style={{ color: '#0F1C2E', fontSize: '14px', fontWeight: 700, margin: 0 }}>{title}</h3>
          {description && (
            <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>{description}</p>
          )}
        </div>
      </div>
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {children}
      </div>
    </div>
  )
}

// ── main ─────────────────────────────────────────────────────
export default function PropertyForm({ initialData, mode }: PropertyFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormData>({ ...BLANK, ...initialData })
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images ?? [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(initialData?.video_url ?? null)
  const [videoUploading, setVideoUploading] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const videoInputRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const addFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter(f =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 5 * 1024 * 1024
    )
    setNewFiles(prev => [...prev, ...valid])
    setPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))])
  }, [])

  function removeNew(i: number) {
    URL.revokeObjectURL(previews[i])
    setNewFiles(p => p.filter((_, idx) => idx !== i))
    setPreviews(p => p.filter((_, idx) => idx !== i))
  }

  function removeExisting(url: string) {
    setExistingImages(p => p.filter(u => u !== url))
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  async function uploadImages(): Promise<string[]> {
    const urls: string[] = []
    for (const file of newFiles) {
      const ext = file.name.split('.').pop()
      const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('property-images').upload(path, file)
      if (error) throw new Error(`Upload failed: ${error.message}`)
      const { data } = supabase.storage.from('property-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }
  async function uploadVideo(): Promise<{ url: string; type: string } | null> {
  // youtube mode — just return the URL
  if (form.video_type === 'youtube' && form.video_url.trim()) {
    return { url: form.video_url.trim(), type: 'youtube' }
  }

  // upload mode — upload the file
  if (form.video_type === 'upload' && videoFile) {
    setVideoUploading(true)
    setVideoProgress(0)
    try {
      const ext = videoFile.name.split('.').pop()
      const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('property-videos')
        .upload(path, videoFile, {
          contentType: videoFile.type,
          cacheControl: '3600',
        })
      if (error) throw new Error(`Video upload failed: ${error.message}`)
      const { data } = supabase.storage.from('property-videos').getPublicUrl(path)
      return { url: data.publicUrl, type: 'upload' }
    } finally {
      setVideoUploading(false)
      setVideoProgress(0)
    }
  }

  // keep existing video if no change
  if (initialData?.video_url && form.video_url === initialData.video_url) {
    return { url: initialData.video_url, type: initialData.video_type ?? 'upload' }
  }

  return null
}

// helper: extract YouTube video ID
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ]
  for (const p of patterns) {
    const match = url.match(p)
    if (match) return match[1]
  }
  return null
}

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)

    try {
      const uploaded = await uploadImages()
      const allImages = [...existingImages, ...uploaded]
      const videoResult = await uploadVideo()

      const payload = {
      ...form,
      price:      parseFloat(form.price),
      bedrooms:   parseInt(form.bedrooms)  || null,
      bathrooms:  parseInt(form.bathrooms) || null,
      area_sqft:  parseInt(form.area_sqft) || null,
      images:     allImages,
      video_url:  videoResult?.url ?? null,
      video_type: videoResult?.type ?? null,
      updated_at: new Date().toISOString(),
    }

      if (mode === 'edit' && initialData?.id) {
        const { error } = await supabase.from('properties').update(payload).eq('id', initialData.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('properties').insert([payload])
        if (error) throw error
      }

      setFeedback({ type: 'success', msg: mode === 'edit' ? 'Property updated successfully!' : 'Property added successfully!' })
      setTimeout(() => router.push('/admin/properties'), 1400)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setFeedback({ type: 'error', msg })
    } finally {
      setSaving(false)
    }
  }

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '860px',
      }}
    >
      {mode === 'edit' && initialData?.reference_code && (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 14px',
      borderRadius: '999px',
      backgroundColor: 'rgba(201,168,76,0.10)',
      border: '1px solid rgba(201,168,76,0.25)',
      alignSelf: 'flex-start',
    }}
  >
    <span style={{
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: '#A6832E',
    }}>
      Reference
    </span>
    <span style={{
      fontSize: '12.5px',
      fontWeight: 700,
      color: '#0F1C2E',
      fontFamily: 'ui-monospace, monospace',
    }}>
      {initialData.reference_code}
    </span>
  </div>
)}

      {/* basic info */}
      <Section icon={Info} title="Basic Information" description="Property name and description">
        <div>
          <label style={labelStyle}>Property Title *</label>
          <StyledInput
            placeholder="e.g. Modern 3BR Apartment in Downtown"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <StyledTextarea
            rows={4}
            placeholder="Describe the property, its features, and what makes it special..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>
      </Section>

      {/* pricing */}
      <Section icon={DollarSign} title="Pricing & Type" description="Sale or rent details">
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>Price *</label>
            <StyledInput
              type="number"
              placeholder="250000"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              required
              min={0}
            />
          </div>
          <div>
            <label style={labelStyle}>Price Type</label>
            <StyledSelect value={form.price_type} onChange={e => set('price_type', e.target.value)}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </StyledSelect>
          </div>
          <div>
            <label style={labelStyle}>Property Type</label>
            <StyledSelect value={form.property_type} onChange={e => set('property_type', e.target.value)}>
              {['apartment','villa','plot','office','townhouse','studio','penthouse'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </StyledSelect>
          </div>
        </div>
      </Section>

      {/* details */}
      <Section icon={Home} title="Property Details" description="Rooms and size">
        <div style={rowStyle}>
          <div>
            <label style={labelStyle}>Bedrooms</label>
            <StyledSelect value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)}>
              <option value="">—</option>
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
            </StyledSelect>
          </div>
          <div>
            <label style={labelStyle}>Bathrooms</label>
            <StyledSelect value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)}>
              <option value="">—</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </StyledSelect>
          </div>
          <div>
            <label style={labelStyle}>Area (sq ft)</label>
            <StyledInput
              type="number"
              placeholder="1400"
              value={form.area_sqft}
              onChange={e => set('area_sqft', e.target.value)}
              min={0}
            />
          </div>
        </div>
      </Section>

      {/* location */}
      <Section icon={MapPin} title="Location" description="Where the property is located">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={labelStyle}>City *</label>
            <StyledInput placeholder="Dubai" value={form.city} onChange={e => set('city', e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Neighborhood / Area</label>
            <StyledInput placeholder="Downtown" value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Full Address</label>
          <StyledInput placeholder="123 Marina Walk, Tower B" value={form.address} onChange={e => set('address', e.target.value)} />
        </div>
      </Section>

      {/* status */}
      <Section icon={Eye} title="Status & Visibility" description="Listing status and featured toggle">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>Listing Status</label>
            <StyledSelect value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="archived">Archived</option>
            </StyledSelect>
          </div>
          <div style={{ paddingBottom: '4px' }}>
            <div
              onClick={() => set('featured', !form.featured)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                userSelect: 'none',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: form.featured ? 'rgba(201,168,76,0.08)' : '#FAFBFC',
                border: form.featured ? '1px solid rgba(201,168,76,0.3)' : '1px solid #E2E8F0',
                transition: 'all 0.2s',
              }}
            >
              <button
                type="button"
                style={{
                  width: '40px',
                  height: '22px',
                  borderRadius: '999px',
                  position: 'relative',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  backgroundColor: form.featured ? '#C9A84C' : '#D1D5DB',
                  transition: 'background-color 0.2s',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    width: '18px',
                    height: '18px',
                    backgroundColor: '#fff',
                    borderRadius: '999px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    transform: form.featured ? 'translateX(18px)' : 'translateX(0)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: form.featured ? '#A6832E' : '#374151',
              }}>
                {form.featured ? 'Featured listing' : 'Mark as featured'}
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* contact */}
      <Section icon={Phone} title="Contact Info" description="How buyers reach you">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={labelStyle}>WhatsApp Number</label>
            <StyledInput placeholder="+971 50 123 4567" value={form.whatsapp_number} onChange={e => set('whatsapp_number', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Phone Number</label>
            <StyledInput placeholder="+971 4 123 4567" value={form.phone_number} onChange={e => set('phone_number', e.target.value)} />
          </div>
        </div>
      </Section>

      {/* video */}
      <Section
        icon={Video}
        title="Property Video (Optional)"
        description="Add a 3-5 min walkthrough — upload a file or paste a YouTube URL"
      >
        {/* mode switcher */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '4px',
          backgroundColor: '#FAFBFC',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          width: 'fit-content',
        }}>
          {[
            { key: 'upload',  label: 'Upload File',  icon: Film    },
            { key: 'youtube', label: 'YouTube URL',  icon: PlaySquare },
          ].map(m => {
            const active = form.video_type === m.key
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => {
                  set('video_type', active ? '' : m.key)
                  set('video_url', '')
                  setVideoFile(null)
                  setVideoPreview(null)
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '9px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: active ? '#0F1C2E' : 'transparent',
                  color: active ? '#fff' : '#6B7280',
                  transition: 'all 0.2s',
                }}
              >
                <m.icon style={{ width: '13px', height: '13px' }} />
                {m.label}
              </button>
            )
          })}
          {form.video_type && (
            <button
              type="button"
              onClick={() => {
                set('video_type', '')
                set('video_url', '')
                setVideoFile(null)
                setVideoPreview(null)
              }}
              style={{
                padding: '7px 10px',
                borderRadius: '9px',
                fontSize: '12.5px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: '#DC2626',
              }}
            >
              Remove
            </button>
          )}
        </div>

        {/* upload mode */}
        {form.video_type === 'upload' && (
          <>
            {!videoPreview && !videoFile ? (
              <div
                onClick={() => videoInputRef.current?.click()}
                style={{
                  border: '2px dashed #E2E8F0',
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  backgroundColor: '#FAFBFC',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(201,168,76,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Film style={{ width: '20px', height: '20px', color: '#C9A84C' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#0F1C2E', fontSize: '13.5px', fontWeight: 600, margin: 0 }}>
                    Click to select a video file
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>
                    MP4, WEBM, MOV · Max 50 MB
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#0F1C2E',
                border: '1px solid #E2E8F0',
              }}>
                <video
                  src={videoPreview ?? (videoFile ? URL.createObjectURL(videoFile) : '')}
                  controls
                  style={{ width: '100%', maxHeight: '360px', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null)
                    setVideoPreview(null)
                    set('video_url', '')
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 style={{ width: '14px', height: '14px', color: '#fff' }} />
                </button>
                {videoFile && (
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#FAFBFC',
                    borderTop: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}>
                    <span style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {videoFile.name}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#0F1C2E', fontWeight: 600 }}>
                      {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                )}
              </div>
            )}

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                if (file.size > 50 * 1024 * 1024) {
                  setFeedback({ type: 'error', msg: 'Video exceeds 50 MB limit' })
                  return
                }
                setVideoFile(file)
                setVideoPreview(null)
              }}
            />

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(37,99,235,0.06)',
              border: '1px solid rgba(37,99,235,0.15)',
            }}>
              <Info style={{ width: '14px', height: '14px', color: '#2563EB', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '11.5px', color: '#1E40AF', margin: 0, lineHeight: 1.5 }}>
                <strong>Tip:</strong> For unlimited bandwidth and better quality, upload your video to YouTube as{' '}
                <em>Unlisted</em> and paste the URL using the YouTube tab above.
              </p>
            </div>
          </>
        )}

        {/* youtube mode */}
        {form.video_type === 'youtube' && (
          <>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '6px',
              }}>
                YouTube Video URL
              </label>
              <StyledInput
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.video_url}
                onChange={e => set('video_url', e.target.value)}
              />
            </div>

            {form.video_url && getYouTubeId(form.video_url) && (
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#0F1C2E',
                border: '1px solid #E2E8F0',
              }}>
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(form.video_url)}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allowFullScreen
                />
              </div>
            )}

            {form.video_url && !getYouTubeId(form.video_url) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(220,38,38,0.06)',
                border: '1px solid rgba(220,38,38,0.15)',
              }}>
                <AlertCircle style={{ width: '14px', height: '14px', color: '#DC2626' }} />
                <p style={{ fontSize: '12px', color: '#B91C1C', margin: 0 }}>
                  Invalid YouTube URL. Use format: youtube.com/watch?v=... or youtu.be/...
                </p>
              </div>
            )}
          </>
        )}

        {!form.video_type && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#9CA3AF',
            fontSize: '13px',
            backgroundColor: '#FAFBFC',
            borderRadius: '12px',
            border: '1px dashed #E2E8F0',
          }}>
            No video added — select a mode above to add one
          </div>
        )}

        {/* upload progress */}
        {videoUploading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.25)',
          }}>
            <Loader2 style={{
              width: '16px',
              height: '16px',
              color: '#A6832E',
              animation: 'spin 1s linear infinite',
            }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#A6832E' }}>
              Uploading video… please wait
            </span>
          </div>
        )}
      </Section>

      {/* images */}
      <Section icon={Camera} title="Property Images" description="Upload high-quality photos (up to 5MB each)">

        {/* drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? '#C9A84C' : '#E2E8F0'}`,
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            backgroundColor: dragging ? 'rgba(201,168,76,0.04)' : '#FAFBFC',
            transition: 'all 0.2s',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: 'rgba(201,168,76,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Upload style={{ width: '20px', height: '20px', color: '#C9A84C' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#0F1C2E', fontSize: '13.5px', fontWeight: 600, margin: 0 }}>
              Drop images here or click to browse
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>
              JPG, PNG, WEBP · Max 5 MB each
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: 'none' }}
          onChange={e => e.target.files && addFiles(e.target.files)}
        />

        {/* existing images */}
        {existingImages.length > 0 && (
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '10px' }}>
              Current images ({existingImages.length})
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
              {existingImages.map(url => (
                <ImagePreview key={url} src={url} onRemove={() => removeExisting(url)} />
              ))}
            </div>
          </div>
        )}

        {/* new previews */}
        {previews.length > 0 && (
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '10px' }}>
              New uploads ({previews.length})
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
              {previews.map((src, i) => (
                <ImagePreview key={i} src={src} onRemove={() => removeNew(i)} isNew />
              ))}
            </div>
          </div>
        )}

        {existingImages.length === 0 && previews.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9CA3AF', fontSize: '13px' }}>
            <ImageIcon style={{ width: '16px', height: '16px' }} />
            No images yet
          </div>
        )}
      </Section>

      {/* feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 500,
              border: feedback.type === 'success' ? '1px solid rgba(22,163,74,0.20)' : '1px solid rgba(220,38,38,0.20)',
              backgroundColor: feedback.type === 'success' ? 'rgba(22,163,74,0.07)' : 'rgba(220,38,38,0.07)',
              color: feedback.type === 'success' ? '#15803D' : '#B91C1C',
            }}
          >
            {feedback.type === 'success'
              ? <CheckCircle2 style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              : <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />}
            {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* submit bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px' }}>
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.97 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '13px 28px',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: 600,
            color: '#0F1C2E',
            background: 'linear-gradient(135deg, #C9A84C 0%, #B8943F 100%)',
            boxShadow: '0 4px 16px rgba(201,168,76,0.32)',
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {saving && (
            <Loader2
              style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }}
            />
          )}
          {saving ? 'Saving…' : mode === 'edit' ? 'Update Property' : 'Add Property'}
        </motion.button>

        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '13px 24px',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: 600,
            color: '#6B7280',
            backgroundColor: '#fff',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
        >
          Cancel
        </button>
      </div>

      {/* spinner keyframes */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  )
}

// ── image preview tile ───────────────────────────────────────
function ImagePreview({
  src,
  onRemove,
  isNew,
}: {
  src: string
  onRemove: () => void
  isNew?: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#F1F5F9',
        border: '1px solid #E2E8F0',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {isNew && (
        <span
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: '#C9A84C',
            color: '#fff',
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          New
        </span>
      )}

      <button
        type="button"
        onClick={onRemove}
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '24px',
          height: '24px',
          borderRadius: '999px',
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hover ? 1 : 0,
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
      >
        <X style={{ width: '12px', height: '12px', color: '#fff' }} />
      </button>
    </div>
  )
}