'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import {
  Building2, Phone, Share2, BarChart3, Search,
  Upload, X, CheckCircle2, AlertCircle, Loader2,
  ExternalLink, Image as ImageIcon,
} from 'lucide-react'
import type { Settings } from './page'

// ── styled inputs ──────────────────────────────────────────
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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
}

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
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '18px 24px', borderBottom: '1px solid #F1F5F9',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          backgroundColor: 'rgba(201,168,76,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
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
export default function SettingsClient({ initial }: { initial: Settings }) {
  const [form, setForm] = useState<Settings>(initial)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof Settings>(key: K, val: Settings[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleLogoSelect(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', msg: 'Logo must be under 5 MB' })
      return
    }
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function uploadLogo(): Promise<string | null> {
    if (!logoFile) return null
    const ext = logoFile.name.split('.').pop()
    const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage
      .from('company-assets')
      .upload(path, logoFile)
    if (error) throw new Error(`Logo upload failed: ${error.message}`)
    const { data } = supabase.storage.from('company-assets').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)

    try {
      const newLogo = logoFile ? await uploadLogo() : null

      const payload = {
        ...form,
        logo_url: newLogo ?? form.logo_url,
      }

      const { error } = await supabase
        .from('settings')
        .update(payload)
        .eq('id', form.id)

      if (error) throw error

      setFeedback({ type: 'success', msg: 'Settings saved successfully!' })
      setLogoFile(null)
      if (newLogo) set('logo_url', newLogo)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save'
      setFeedback({ type: 'error', msg })
    } finally {
      setSaving(false)
    }
  }

  const currentLogo = logoPreview ?? form.logo_url

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px', flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{
            color: '#0F1C2E', fontSize: '22px', fontWeight: 700,
            margin: 0, lineHeight: 1.2,
          }}>
            Company Settings
          </h2>
          <p style={{ color: '#6B7280', fontSize: '13.5px', marginTop: '6px' }}>
            Manage your company information, branding, and public site content.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px', borderRadius: '12px',
            fontSize: '12.5px', fontWeight: 600,
            color: '#0F1C2E', textDecoration: 'none',
            backgroundColor: '#fff', border: '1px solid #E2E8F0',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
        >
          <ExternalLink style={{ width: '13px', height: '13px' }} />
          Public Preview
        </a>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: '20px',
        maxWidth: '860px',
      }}>

        {/* company identity */}
        <Section icon={Building2} title="Company Identity" description="How your company appears everywhere">
          <div>
            <label style={labelStyle}>Company Name *</label>
            <StyledInput
              value={form.company_name}
              onChange={e => set('company_name', e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Tagline</label>
            <StyledInput
              placeholder="e.g. Building Dreams Since 1998"
              value={form.tagline ?? ''}
              onChange={e => set('tagline', e.target.value)}
            />
          </div>

          <div>
            <label style={labelStyle}>About / Bio</label>
            <StyledTextarea
              rows={4}
              placeholder="A short paragraph about your company..."
              value={form.about ?? ''}
              onChange={e => set('about', e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Founded Year</label>
              <StyledInput
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                placeholder="2020"
                value={form.founded_year ?? ''}
                onChange={e => set('founded_year', parseInt(e.target.value) || null)}
              />
            </div>
          </div>

          {/* logo upload */}
          <div>
            <label style={labelStyle}>Company Logo</label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '14px', borderRadius: '12px',
              border: '1px solid #E2E8F0', backgroundColor: '#FAFBFC',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '12px',
                backgroundColor: '#fff', border: '1px solid #E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
              }}>
                {currentLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentLogo} alt="Logo" style={{
                    width: '100%', height: '100%', objectFit: 'contain', padding: '8px',
                  }} />
                ) : (
                  <ImageIcon style={{ width: '24px', height: '24px', color: '#CBD5E1' }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#0F1C2E', fontWeight: 600, margin: 0 }}>
                  {logoFile ? logoFile.name : (form.logo_url ? 'Current logo' : 'No logo uploaded')}
                </p>
                <p style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '3px' }}>
                  PNG, JPG, WEBP, or SVG · Max 5 MB
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '9px 14px', borderRadius: '10px',
                    fontSize: '12px', fontWeight: 600,
                    color: '#0F1C2E', backgroundColor: '#fff',
                    border: '1px solid #E2E8F0', cursor: 'pointer',
                  }}
                >
                  <Upload style={{ width: '12px', height: '12px' }} />
                  {form.logo_url || logoFile ? 'Replace' : 'Upload'}
                </button>
                {(logoFile || form.logo_url) && (
                  <button
                    type="button"
                    onClick={() => {
                      setLogoFile(null)
                      setLogoPreview(null)
                      set('logo_url', null)
                    }}
                    style={{
                      width: '32px', height: '32px', borderRadius: '10px',
                      backgroundColor: 'rgba(220,38,38,0.08)',
                      border: '1px solid rgba(220,38,38,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X style={{ width: '13px', height: '13px', color: '#DC2626' }} />
                  </button>
                )}
              </div>
            </div>

            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && handleLogoSelect(e.target.files[0])}
            />
          </div>
        </Section>

        {/* contact info */}
        <Section icon={Phone} title="Contact Info" description="Displayed on public site and property pages">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Primary Phone</label>
              <StyledInput
                placeholder="+880 1XXX XXXXXX"
                value={form.primary_phone ?? ''}
                onChange={e => set('primary_phone', e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Primary WhatsApp</label>
              <StyledInput
                placeholder="+880 1XXX XXXXXX"
                value={form.primary_whatsapp ?? ''}
                onChange={e => set('primary_whatsapp', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Contact Email</label>
            <StyledInput
              type="email"
              placeholder="contact@yourcompany.com"
              value={form.contact_email ?? ''}
              onChange={e => set('contact_email', e.target.value)}
            />
          </div>

          <div>
            <label style={labelStyle}>Office Address</label>
            <StyledTextarea
              rows={2}
              placeholder="Full office address"
              value={form.office_address ?? ''}
              onChange={e => set('office_address', e.target.value)}
            />
          </div>

          <div>
            <label style={labelStyle}>Office Hours</label>
            <StyledInput
              placeholder="Sat - Thu: 9:00 AM - 6:00 PM"
              value={form.office_hours ?? ''}
              onChange={e => set('office_hours', e.target.value)}
            />
          </div>
        </Section>

        {/* social media */}
        <Section icon={Share2} title="Social Media" description="Links displayed in the footer">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Facebook URL</label>
              <StyledInput
                type="url"
                placeholder="https://facebook.com/..."
                value={form.facebook_url ?? ''}
                onChange={e => set('facebook_url', e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Instagram URL</label>
              <StyledInput
                type="url"
                placeholder="https://instagram.com/..."
                value={form.instagram_url ?? ''}
                onChange={e => set('instagram_url', e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <StyledInput
                type="url"
                placeholder="https://linkedin.com/company/..."
                value={form.linkedin_url ?? ''}
                onChange={e => set('linkedin_url', e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>YouTube URL</label>
              <StyledInput
                type="url"
                placeholder="https://youtube.com/@..."
                value={form.youtube_url ?? ''}
                onChange={e => set('youtube_url', e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* homepage stats */}
        <Section icon={BarChart3} title="Homepage Stats" description="Numbers shown in your hero section">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Properties Sold</label>
              <StyledInput
                type="number"
                min={0}
                placeholder="500"
                value={form.stat_properties_sold ?? ''}
                onChange={e => set('stat_properties_sold', parseInt(e.target.value) || null)}
              />
            </div>
            <div>
              <label style={labelStyle}>Happy Clients</label>
              <StyledInput
                type="number"
                min={0}
                placeholder="1200"
                value={form.stat_happy_clients ?? ''}
                onChange={e => set('stat_happy_clients', parseInt(e.target.value) || null)}
              />
            </div>
            <div>
              <label style={labelStyle}>Cities Served</label>
              <StyledInput
                type="number"
                min={0}
                placeholder="3"
                value={form.stat_cities_served ?? ''}
                onChange={e => set('stat_cities_served', parseInt(e.target.value) || null)}
              />
            </div>
          </div>
        </Section>

        {/* SEO */}
        <Section icon={Search} title="SEO Settings" description="How your site appears in search engines">
          <div>
            <label style={labelStyle}>Meta Title</label>
            <StyledInput
              placeholder="Your Company - Real Estate in Bangladesh"
              value={form.meta_title ?? ''}
              onChange={e => set('meta_title', e.target.value)}
              maxLength={70}
            />
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
              {(form.meta_title ?? '').length} / 70 characters
            </p>
          </div>
          <div>
            <label style={labelStyle}>Meta Description</label>
            <StyledTextarea
              rows={3}
              placeholder="Brief description for search engines (160 chars max)"
              value={form.meta_description ?? ''}
              onChange={e => set('meta_description', e.target.value)}
              maxLength={160}
            />
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
              {(form.meta_description ?? '').length} / 160 characters
            </p>
          </div>
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
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 20px', borderRadius: '12px',
                fontSize: '13.5px', fontWeight: 500,
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

        {/* save bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px' }}>
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '13px 28px', borderRadius: '12px',
              fontSize: '13.5px', fontWeight: 600, color: '#0F1C2E',
              background: 'linear-gradient(135deg, #C9A84C 0%, #B8943F 100%)',
              boxShadow: '0 4px 16px rgba(201,168,76,0.32)',
              border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving && <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
            {saving ? 'Saving…' : 'Save Settings'}
          </motion.button>
        </div>

        <style jsx global>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </form>
    </div>
  )
}