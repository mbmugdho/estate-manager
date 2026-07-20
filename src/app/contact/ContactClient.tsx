'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Phone, Mail, MapPin, Clock,
  MessageCircle, ExternalLink,
} from 'lucide-react'

interface ContactSettings {
  company_name: string | null
  primary_phone: string | null
  primary_whatsapp: string | null
  contact_email: string | null
  office_address: string | null
  office_hours: string | null
  facebook_url: string | null
  instagram_url: string | null
  linkedin_url: string | null
  youtube_url: string | null
}

export default function ContactClient({ settings }: { settings: ContactSettings | null }) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const company = settings?.company_name ?? 'Estate Manager'
  const phone = settings?.primary_phone ?? '+8801575871170'
  const whatsapp = settings?.primary_whatsapp ?? '+8801575871170'
  const email = settings?.contact_email ?? 'contact@estatemanager.com'
  const address = settings?.office_address ?? 'Dhaka, Bangladesh'
  const hours = settings?.office_hours ?? 'Sat–Thu: 9:00 AM – 8:00 PM · Friday: Closed'
  const waDigits = whatsapp.replace(/\D/g, '')

  const socials = [
    { key: 'facebook', href: settings?.facebook_url ?? '', label: 'Facebook' },
    { key: 'instagram', href: settings?.instagram_url ?? '', label: 'Instagram' },
    { key: 'linkedin', href: settings?.linkedin_url ?? '', label: 'LinkedIn' },
    { key: 'youtube', href: settings?.youtube_url ?? '', label: 'YouTube' },
  ].filter(s => s.href.trim().length > 0)

  const contactCards = [
    {
      icon: Phone,
      label: 'Phone',
      value: phone,
      action: `tel:${phone}`,
      actionLabel: 'Call Now',
      color: '#3B82F6',
      bg: '#EFF6FF',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: whatsapp,
      action: `https://wa.me/${waDigits}?text=${encodeURIComponent(`Hi, I'd like to inquire about your properties.`)}`,
      actionLabel: 'Open Chat',
      color: '#25D366',
      bg: '#F0FDF4',
      external: true,
    },
    {
      icon: Mail,
      label: 'Email',
      value: email,
      action: `mailto:${email}`,
      actionLabel: 'Send Email',
      color: '#C9A84C',
      bg: '#FFFBEB',
    },
  ]

  return (
    <div style={{ backgroundColor: '#F1F5F9', minHeight: '100vh', paddingTop: isDesktop ? '96px' : '80px' }}>

      {/* hero */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0F1C2E 0%, #1A3C5E 100%)',
        padding: isDesktop ? '80px 0' : '56px 0',
      }}>
        {/* decorative */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: '1320px', margin: '0 auto',
          padding: isDesktop ? '0 32px' : '0 20px',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}
          >
            <div style={{ width: '32px', height: '1px', backgroundColor: '#C9A84C' }} />
            <span style={{
              fontSize: '10.5px', fontWeight: 700, color: '#C9A84C',
              letterSpacing: '0.3em', textTransform: 'uppercase',
            }}>
              Get in Touch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{
              fontSize: isDesktop ? '48px' : '32px',
              fontWeight: 900, color: '#fff',
              lineHeight: 1.1, letterSpacing: '-0.03em',
              margin: '0 0 16px', maxWidth: '600px',
            }}
          >
            Let&apos;s Find Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #E8D48B 0%, #C9A84C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Perfect Property
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: '16px', color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7, maxWidth: '500px', margin: 0,
            }}
          >
            Reach out via WhatsApp, phone, or email — we typically respond within the hour.
          </motion.p>
        </div>
      </section>

      {/* main content */}
      <section style={{
        maxWidth: '1320px', margin: '0 auto',
        padding: isDesktop ? '64px 32px 80px' : '40px 20px 56px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          gap: isDesktop ? '32px' : '24px',
          alignItems: 'flex-start',
        }}>

          {/* left — contact cards */}
          <div style={{ flex: isDesktop ? '0 0 58%' : undefined, width: isDesktop ? '58%' : '100%' }}>

            {/* contact method cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr',
              gap: '16px',
              marginBottom: '24px',
            }}>
              {contactCards.map((card, i) => (
                <motion.a
                  key={card.label}
                  href={card.action}
                  target={card.external ? '_blank' : undefined}
                  rel={card.external ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  style={{
                    display: 'block',
                    backgroundColor: '#fff', borderRadius: '16px',
                    border: '1px solid #E2E8F0', padding: '24px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(15,28,46,0.04)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,28,46,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,28,46,0.04)'
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    backgroundColor: card.bg, color: card.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '14px',
                  }}>
                    <card.icon style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, color: '#9CA3AF',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    marginBottom: '6px',
                  }}>
                    {card.label}
                  </div>
                  <div style={{
                    fontSize: '14px', fontWeight: 700, color: '#0F1C2E',
                    marginBottom: '12px', wordBreak: 'break-all',
                  }}>
                    {card.value}
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontSize: '12px', fontWeight: 700, color: card.color,
                  }}>
                    {card.actionLabel}
                    <ExternalLink style={{ width: '11px', height: '11px' }} />
                  </div>
                </motion.a>
              ))}
            </div>

            {/* big WhatsApp CTA */}
            <motion.a
              href={`https://wa.me/${waDigits}?text=${encodeURIComponent(`Hi, I'd like to inquire about your properties.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '12px', padding: '20px 32px', borderRadius: '16px',
                backgroundColor: '#25D366', color: '#fff',
                fontSize: '16px', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(37,211,102,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(37,211,102,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.3)'
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Start a WhatsApp Conversation
            </motion.a>
          </div>

          {/* right — office info card */}
          <div style={{ flex: isDesktop ? '0 0 42%' : undefined, width: isDesktop ? '42%' : '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              style={{
                backgroundColor: '#fff', borderRadius: '20px',
                border: '1px solid #E2E8F0', overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(15,28,46,0.06)',
                position: isDesktop ? 'sticky' as const : undefined,
                top: isDesktop ? '96px' : undefined,
              }}
            >
              {/* gold bar */}
              <div style={{
                height: '4px',
                background: 'linear-gradient(90deg, #C9A84C, #E8D48B, #C9A84C)',
              }} />

              <div style={{ padding: '28px' }}>
                <h2 style={{
                  fontSize: '18px', fontWeight: 800, color: '#0F1C2E',
                  margin: '0 0 24px',
                }}>
                  Office Information
                </h2>

                {/* info rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <InfoRow
                    icon={<MapPin style={{ width: '16px', height: '16px', color: '#C9A84C' }} />}
                    label="Office Address"
                    value={address}
                  />
                  <InfoRow
                    icon={<Clock style={{ width: '16px', height: '16px', color: '#C9A84C' }} />}
                    label="Working Hours"
                    value={hours}
                  />
                  <InfoRow
                    icon={<Phone style={{ width: '16px', height: '16px', color: '#C9A84C' }} />}
                    label="Phone"
                    value={phone}
                  />
                  <InfoRow
                    icon={<Mail style={{ width: '16px', height: '16px', color: '#C9A84C' }} />}
                    label="Email"
                    value={email}
                  />
                </div>

                {/* social links */}
                {socials.length > 0 && (
                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{
                      fontSize: '11px', fontWeight: 700, color: '#9CA3AF',
                      textTransform: 'uppercase', letterSpacing: '0.12em',
                      marginBottom: '12px',
                    }}>
                      Follow Us
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {socials.map(s => (
                        <a
                          key={s.key}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '7px 14px', borderRadius: '10px',
                            backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9',
                            fontSize: '12px', fontWeight: 600, color: '#374151',
                            textDecoration: 'none', transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#FDF8EE'
                            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
                            e.currentTarget.style.color = '#A6832E'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = '#F8FAFC'
                            e.currentTarget.style.borderColor = '#F1F5F9'
                            e.currentTarget.style.color = '#374151'
                          }}
                        >
                          <ExternalLink style={{ width: '11px', height: '11px' }} />
                          {s.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

// info row sub-component
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        backgroundColor: '#FDF8EE', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: '11px', fontWeight: 700, color: '#9CA3AF',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '4px',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '14px', fontWeight: 600, color: '#0F1C2E',
          lineHeight: 1.5,
        }}>
          {value}
        </div>
      </div>
    </div>
  )
}