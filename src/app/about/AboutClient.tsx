'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, Users, MapPin, Award,
  Shield, Handshake, TrendingUp, Star,
} from 'lucide-react'

interface Settings {
  company_name: string | null
  tagline: string | null
  about: string | null
  logo_url: string | null
  founded_year: number | null
  stat_properties_sold: number | null
  stat_happy_clients: number | null
  stat_cities_served: number | null
}

// value cards data
const VALUES = [
  {
    icon: Shield,
    title: 'Trust & Transparency',
    desc: 'Every listing is verified. Every price is honest. No hidden charges, no surprises.',
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    icon: Handshake,
    title: 'Client-First Approach',
    desc: 'We listen before we list. Your needs drive every recommendation we make.',
    color: '#16A34A',
    bg: '#F0FDF4',
  },
  {
    icon: TrendingUp,
    title: 'Market Expertise',
    desc: 'Deep knowledge of Bangladesh\'s real estate landscape — Dhaka, Chittagong, and beyond.',
    color: '#C9A84C',
    bg: '#FFFBEB',
  },
  {
    icon: Star,
    title: 'Quality Construction',
    desc: 'We partner only with builders who meet our standards for materials, safety, and finish.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
]

export default function AboutClient({ settings }: { settings: Settings | null }) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const companyName = settings?.company_name ?? 'Estate Manager'
  const tagline = settings?.tagline ?? 'Premium properties, built with trust.'
  const about = settings?.about ?? 'We are a trusted real estate company based in Bangladesh, dedicated to connecting buyers with their perfect properties across Dhaka, Chittagong, and Rangpur. With years of experience and hundreds of satisfied clients, we bring transparency, quality, and care to every transaction.'
  const foundedYear = settings?.founded_year ?? 2018
  const yearsActive = new Date().getFullYear() - foundedYear

  const stats = [
    { value: settings?.stat_properties_sold ?? 150, label: 'Properties Delivered', icon: Building2 },
    { value: settings?.stat_happy_clients ?? 500, label: 'Happy Clients', icon: Users },
    { value: settings?.stat_cities_served ?? 3, label: 'Cities Served', icon: MapPin },
    { value: yearsActive, label: 'Years of Trust', icon: Award },
  ]

  return (
    <div style={{ backgroundColor: '#F1F5F9', minHeight: '100vh', paddingTop: isDesktop ? '96px' : '80px' }}>

      {/* hero section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0F1C2E 0%, #1A3C5E 100%)',
        padding: isDesktop ? '80px 0' : '56px 0',
      }}>
        {/* decorative elements */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-60px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,60,94,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* dot grid */}
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
              About Us
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
              margin: '0 0 16px', maxWidth: '700px',
            }}
          >
            Building Trust,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #E8D48B 0%, #C9A84C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              One Property
            </span>
            {' '}at a Time
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: '16px', color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7, maxWidth: '560px', margin: 0,
            }}
          >
            {tagline}
          </motion.p>
        </div>
      </section>

      {/* stats bar */}
      <section style={{
        maxWidth: '1320px', margin: '-40px auto 0',
        padding: isDesktop ? '0 32px' : '0 20px',
        position: 'relative', zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
            gap: '1px',
            backgroundColor: '#E2E8F0',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(15,28,46,0.1)',
          }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} style={{
              backgroundColor: '#fff',
              padding: isDesktop ? '32px' : '24px 20px',
              textAlign: 'center',
            }}>
              <stat.icon style={{
                width: '20px', height: '20px', color: '#C9A84C',
                margin: '0 auto 10px',
              }} />
              <div style={{
                fontSize: isDesktop ? '32px' : '26px',
                fontWeight: 900, color: '#0F1C2E',
                lineHeight: 1, letterSpacing: '-0.03em',
              }}>
                {stat.value.toLocaleString('en-IN')}+
              </div>
              <div style={{
                fontSize: '12px', color: '#6B7280',
                fontWeight: 500, marginTop: '6px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* story section */}
      <section style={{
        maxWidth: '1320px', margin: '0 auto',
        padding: isDesktop ? '80px 32px' : '56px 20px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          gap: isDesktop ? '64px' : '40px',
          alignItems: 'flex-start',
        }}>
          {/* left — heading */}
          <div style={{ flex: isDesktop ? '0 0 40%' : undefined, width: isDesktop ? '40%' : '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '4px', height: '28px', borderRadius: '2px',
                  background: 'linear-gradient(to bottom, #C9A84C, #A6832E)',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '10px', fontWeight: 700, color: '#C9A84C',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                }}>
                  Our Story
                </span>
              </div>

              <h2 style={{
                fontSize: isDesktop ? '36px' : '28px',
                fontWeight: 800, color: '#0F1C2E',
                lineHeight: 1.15, letterSpacing: '-0.02em',
                margin: '0 0 16px',
              }}>
                {companyName}
              </h2>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px', borderRadius: '999px',
                backgroundColor: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.15)',
              }}>
                <Award style={{ width: '13px', height: '13px', color: '#C9A84C' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#A6832E' }}>
                  Established {foundedYear}
                </span>
              </div>
            </motion.div>
          </div>

          {/* right — about text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{
                backgroundColor: '#fff', borderRadius: '20px',
                border: '1px solid #E2E8F0', padding: isDesktop ? '40px' : '28px',
                boxShadow: '0 4px 16px rgba(15,28,46,0.04)',
              }}
            >
              <p style={{
                fontSize: '15px', color: '#374151',
                lineHeight: 1.8, margin: 0,
                whiteSpace: 'pre-line',
              }}>
                {about}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* values section */}
      <section style={{
        maxWidth: '1320px', margin: '0 auto',
        padding: isDesktop ? '0 32px 80px' : '0 20px 56px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: isDesktop ? '40px' : '28px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '4px', height: '28px', borderRadius: '2px',
              background: 'linear-gradient(to bottom, #C9A84C, #A6832E)',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: '10px', fontWeight: 700, color: '#C9A84C',
              letterSpacing: '0.22em', textTransform: 'uppercase',
            }}>
              What We Stand For
            </span>
          </div>
          <h2 style={{
            fontSize: isDesktop ? '32px' : '24px',
            fontWeight: 800, color: '#0F1C2E',
            margin: 0, letterSpacing: '-0.02em',
          }}>
            Our Core Values
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
          gap: '16px',
        }}>
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{
                backgroundColor: '#fff', borderRadius: '16px',
                border: '1px solid #E2E8F0', padding: '28px 24px',
                boxShadow: '0 4px 12px rgba(15,28,46,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                backgroundColor: v.bg, color: v.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <v.icon style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 style={{
                fontSize: '14.5px', fontWeight: 700, color: '#0F1C2E',
                margin: '0 0 8px', lineHeight: 1.3,
              }}>
                {v.title}
              </h3>
              <p style={{
                fontSize: '13px', color: '#6B7280',
                lineHeight: 1.6, margin: 0,
              }}>
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}