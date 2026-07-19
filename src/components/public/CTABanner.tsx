'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const WHATSAPP = '8801575871170'

export default function CTABanner() {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{
      padding:         isDesktop ? '80px 0' : '56px 0',
      backgroundColor: '#FAFAF7',
    }}>
      <div style={{
        maxWidth:    '1440px',
        marginLeft:  'auto',
        marginRight: 'auto',
        padding:     isDesktop ? '0 60px' : '0 20px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          style={{
            position:     'relative',
            overflow:     'hidden',
            borderRadius: '24px',
            padding:      isDesktop ? '72px 80px' : '48px 28px',
            background:   'linear-gradient(135deg, #0A1628 0%, #0F1C2E 50%, #162A46 100%)',
            textAlign:    'center',
          }}
        >
          {/* ── gold corner brackets ── */}
          {/* top-left */}
          <div style={{
            position:   'absolute',
            top:        isDesktop ? '24px' : '16px',
            left:       isDesktop ? '24px' : '16px',
            width:      '48px',
            height:     '48px',
            borderTop:  '2px solid rgba(201,168,76,0.5)',
            borderLeft: '2px solid rgba(201,168,76,0.5)',
            pointerEvents: 'none',
          }} />
          {/* top-right */}
          <div style={{
            position:    'absolute',
            top:         isDesktop ? '24px' : '16px',
            right:       isDesktop ? '24px' : '16px',
            width:       '48px',
            height:      '48px',
            borderTop:   '2px solid rgba(201,168,76,0.5)',
            borderRight: '2px solid rgba(201,168,76,0.5)',
            pointerEvents: 'none',
          }} />
          {/* bottom-left */}
          <div style={{
            position:     'absolute',
            bottom:       isDesktop ? '24px' : '16px',
            left:         isDesktop ? '24px' : '16px',
            width:        '48px',
            height:       '48px',
            borderBottom: '2px solid rgba(201,168,76,0.5)',
            borderLeft:   '2px solid rgba(201,168,76,0.5)',
            pointerEvents: 'none',
          }} />
          {/* bottom-right */}
          <div style={{
            position:     'absolute',
            bottom:       isDesktop ? '24px' : '16px',
            right:        isDesktop ? '24px' : '16px',
            width:        '48px',
            height:       '48px',
            borderBottom: '2px solid rgba(201,168,76,0.5)',
            borderRight:  '2px solid rgba(201,168,76,0.5)',
            pointerEvents: 'none',
          }} />

          {/* gold radial glow — center */}
          <div style={{
            position:      'absolute',
            top:           '50%',
            left:          '50%',
            transform:     'translate(-50%, -50%)',
            width:         '500px',
            height:        '500px',
            borderRadius:  '50%',
            background:    'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* dot grid */}
          <div style={{
            position:        'absolute',
            inset:           0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize:  '28px 28px',
            pointerEvents:   'none',
          }} />

          {/* ── content ── */}
          <div style={{ position: 'relative', zIndex: 2 }}>

            {/* editorial label */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '10px',
                marginBottom:   '24px',
              }}
            >
              <div style={{ width: '24px', height: '1px', backgroundColor: '#C9A84C' }} />
              <span style={{
                fontSize:      '10.5px',
                fontWeight:    700,
                color:         '#C9A84C',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}>
                Ready to Build Your Future?
              </span>
              <div style={{ width: '24px', height: '1px', backgroundColor: '#C9A84C' }} />
            </motion.div>

            {/* headline */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontSize:      isDesktop ? '48px' : '32px',
                fontWeight:    700,
                lineHeight:    1.1,
                color:         '#FFFFFF',
                margin:        '0 0 18px 0',
                letterSpacing: '-0.03em',
              }}
            >
              Let&apos;s Find Your Family A
              <br />
              <span style={{
                fontWeight: 500,
                fontStyle:  'normal',
                background: 'linear-gradient(135deg, #F5E5A8 0%, #C9A84C 50%, #A6832E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Perfect Space
              </span>
            </motion.h2>

            {/* subtitle */}
            <motion.p
  initial={{ opacity: 0, y: 12 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.35, duration: 0.5 }}
  style={{
    fontSize:   isDesktop ? '16px' : '14.5px',
    lineHeight: 1.75,
    color:      'rgba(255,255,255,0.65)',
    margin:     '0 auto 36px',
    maxWidth:   '1080px',
  }}
>
  A home is where your family grows, where memories are made, and where
  every evening feels like coming back to something that&apos;s truly
  yours. Whether you&apos;re starting a new chapter, giving your loved
  ones the space they deserve, or building a legacy for the next
  generation — we&apos;ll walk beside you, every step of the way.
</motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '14px',
                flexWrap:       'wrap',
              }}
            >
              {/* gold CTA */}
              <button
                onClick={() => router.push('/properties')}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '10px',
                  padding:      '16px 32px',
                  borderRadius: '999px',
                  border:       'none',
                  cursor:       'pointer',
                  fontWeight:   700,
                  fontSize:     '14px',
                  color:        '#0F1C2E',
                  background:   'linear-gradient(135deg, #E8D48B 0%, #C9A84C 40%, #A6832E 100%)',
                  boxShadow:    '0 8px 28px rgba(201,168,76,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
                  transition:   'transform 0.3s, box-shadow 0.3s',
                  fontFamily:   'inherit',
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
                Browse Properties
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </button>

              {/* whatsapp CTA */}
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  gap:             '10px',
                  padding:         '16px 28px',
                  borderRadius:    '999px',
                  border:          '1px solid rgba(255,255,255,0.18)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  backdropFilter:  'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor:          'pointer',
                  fontWeight:      600,
                  fontSize:        '14px',
                  color:           '#FFFFFF',
                  textDecoration:  'none',
                  transition:      'all 0.3s',
                  fontFamily:      'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}