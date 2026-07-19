'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, Award, Ruler, Users, Sparkles } from 'lucide-react'

// dramatic low-angle skyscraper — golden hour
const HERO_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2400&q=85&auto=format&fit=crop'

const STATS = [
  { icon: Building2, value: '500+',    label: 'Properties Built' },
  { icon: Award,     value: '65',      label: 'Iconic Projects'  },
  { icon: Ruler,     value: '2,279K+', label: 'Sq.Ft Delivered'  },
  { icon: Sparkles,  value: '25 yrs',  label: 'Excellence'       },
  { icon: Users,     value: '1,200+',  label: 'Happy Families'   },
]

export default function Hero() {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)
  const [isTablet,  setIsTablet]  = useState(false)

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 1024)
      setIsTablet(window.innerWidth >= 640)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      minHeight: '720px',
      backgroundColor: '#050B14',
      overflow: 'hidden',
    }}>

      {/* ══════════ IMAGE LAYER ══════════ */}
      <motion.img
        src={HERO_IMAGE}
        alt="Estate Manager — Iconic Developments"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center bottom',
        }}
      />

      {/* ══════════ GRADIENT OVERLAY ══════════ */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isDesktop
          ? 'linear-gradient(90deg, rgba(5,11,20,0.88) 0%, rgba(5,11,20,0.55) 45%, rgba(5,11,20,0.15) 75%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(5,11,20,0.55) 0%, rgba(5,11,20,0.9) 100%)',
      }} />

      {/* ══════════ SOFT GOLD LIGHT FROM TOP-RIGHT ══════════ */}
      <div style={{
        position: 'absolute',
        top: '-150px', right: '-150px',
        width: '700px', height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ══════════ VERTICAL GOLD ACCENT — right edge ══════════ */}
      {isDesktop && (
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '15%',
            bottom: '25%',
            right: '48px',
            width: '1px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.6) 20%, rgba(201,168,76,0.6) 80%, transparent 100%)',
            transformOrigin: 'top',
          }} />
      )}

      {/* ══════════ EST. 2000 MICRO BADGE — top right ══════════ */}
      {isDesktop && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          style={{
            position: 'absolute',
            top: '120px',
            right: '78px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px',
            zIndex: 5,
          }}
        >
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            color: 'rgba(201,168,76,0.9)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
          }}>
            Est. 2000
          </span>
          <span style={{
            fontSize: '9.5px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}>
            Bangladesh
          </span>
        </motion.div>
      )}

      {/* ══════════ CONTENT ══════════ */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '100%',
        padding: isDesktop ? '0 60px' : '0 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            maxWidth: '680px',
            marginTop: isDesktop ? '-80px' : '-40px',
          }}
        >

          {/* ── ICONIC DEVELOPMENTS chip ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '32px',
            }}
          >
            {/* left thin gold line */}
            <div style={{ width: '32px', height: '1px', backgroundColor: 'rgba(201,168,76,0.6)' }} />
            <span style={{
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#E8D48B',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
            }}>
              Iconic Developments · Est. 2000
            </span>
          </motion.div>

          {/* ── HEADLINE — refined typography ── */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease: 'easeOut' }}
            style={{
              fontSize: isDesktop ? '72px' : isTablet ? '54px' : '40px',
              lineHeight: 1.02,
              color: '#FFFFFF',
              margin: '0 0 28px 0',
              letterSpacing: '-0.04em',
              fontWeight: 300,
              fontFamily: 'inherit',
            }}
          >
            <span style={{ display: 'block', fontWeight: 600 }}>
              Building Landmarks.
            </span>
            <span style={{
              display: 'block',
              fontWeight: 300,
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #F5E5A8 0%, #C9A84C 50%, #A6832E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginTop: '4px',
            }}>
              Shaping Skylines.
            </span>
          </motion.h1>

          {/* ── SUBTITLE ── */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            style={{
              fontSize: isDesktop ? '19px' : '16px',
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.85)',
              margin: '0 0 18px 0',
              maxWidth: '560px',
              letterSpacing: '-0.005em',
            }}
          >
            Premium residential and commercial developments
            across Bangladesh.
          </motion.p>

          {/* ── DESCRIPTION ── */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{
              fontSize: isDesktop ? '14.5px' : '13.5px',
              fontWeight: 400,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.55)',
              margin: '0 0 44px 0',
              maxWidth: '500px',
            }}
          >
            With over 25 years of architectural excellence, Estate Manager
            crafts spaces that redefine modern living and long-term value —
            direct from the builder, no middlemen.
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => router.push('/properties')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 28px 16px 32px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13.5px',
                letterSpacing: '0.02em',
                color: '#0F1C2E',
                background: 'linear-gradient(135deg, #E8D48B 0%, #C9A84C 40%, #A6832E 100%)',
                boxShadow: '0 8px 28px rgba(201,168,76,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 14px 36px rgba(201,168,76,0.55), inset 0 1px 0 rgba(255,255,255,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,168,76,0.4), inset 0 1px 0 rgba(255,255,255,0.25)'
              }}
            >
              Explore Our Projects
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: 'rgba(15,28,46,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ArrowRight style={{ width: '13px', height: '13px' }} />
              </div>
            </button>

            <button
              onClick={() => router.push('/#about')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 24px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                background: 'transparent',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '13.5px',
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'all 0.3s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
                e.currentTarget.style.color = '#E8D48B'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
              }}
            >
              Our Story
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* ══════════ GLASS STATS BAR ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: isDesktop ? '32px' : '24px',
          left: '20px',
          right: '20px',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isDesktop ? '22px 32px' : '20px',
          borderRadius: '20px',
          backgroundColor: 'rgba(5,11,20,0.55)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(5, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
          gap: isDesktop ? '0' : '18px',
          zIndex: 10,
        }}
      >
        {STATS.map((s, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            paddingLeft: isDesktop && i > 0 ? '32px' : '0',
            borderLeft: isDesktop && i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            minWidth: 0,
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '11px',
              backgroundColor: 'rgba(201,168,76,0.10)',
              border: '1px solid rgba(201,168,76,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <s.icon style={{ width: '17px', height: '17px', color: '#C9A84C' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                color: '#fff',
                fontSize: isDesktop ? '19px' : '17px',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}>
                {s.value}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '10.5px',
                marginTop: '3px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}