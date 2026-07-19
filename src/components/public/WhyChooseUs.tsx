'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, ShieldCheck, MessageCircle } from 'lucide-react'

// architectural interior — warm luxury lobby
const IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85&auto=format&fit=crop'

const PILLARS = [
  {
    number: '01',
    icon:   Building2,
    title:  'Direct From Builder',
    body:   'No middlemen, no inflated prices. Every property listed here is built by us — you talk to the makers, not agents.',
  },
  {
    number: '02',
    icon:   ShieldCheck,
    title:  'Verified Quality',
    body:   'Every square foot is inspected before handover. Structural integrity, finishing, and utilities — checked twice.',
  },
  {
    number: '03',
    icon:   MessageCircle,
    title:  'Personal Service',
    body:   'Talk directly to our team via WhatsApp or phone. No bots, no forms, no delays. Real people, real answers.',
  },
]

// ── single pillar ─────────────────────────────────────────────
function Pillar({ pillar, index, isDesktop }: { pillar: typeof PILLARS[0]; index: number; isDesktop: boolean }) {
  const [hovered, setHovered] = useState(false)
  const Icon = pillar.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:     'relative',
        padding:      isDesktop ? '28px 0 28px 28px' : '24px 0 24px 20px',
        borderTop:    index === 0 ? 'none' : '1px solid #F1F5F9',
        cursor:       'default',
        transition:   'all 0.35s',
      }}
    >
      {/* left gold accent — grows on hover */}
      <div style={{
        position:    'absolute',
        left:        0,
        top:         '28px',
        bottom:      '28px',
        width:       hovered ? '3px' : '2px',
        background:  hovered
          ? 'linear-gradient(to bottom, #C9A84C 0%, rgba(201,168,76,0.3) 100%)'
          : 'rgba(201,168,76,0.15)',
        borderRadius: '2px',
        transition:  'all 0.35s',
      }} />

      <div style={{
        display:      'flex',
        gap:          isDesktop ? '24px' : '18px',
        alignItems:   'flex-start',
      }}>

        {/* number */}
        <div style={{
          flexShrink:   0,
          minWidth:     isDesktop ? '48px' : '40px',
        }}>
          <div style={{
            fontSize:      isDesktop ? '32px' : '26px',
            fontWeight:    300,
            color:         hovered ? '#C9A84C' : '#CBD5E1',
            letterSpacing: '-0.02em',
            lineHeight:    1,
            fontStyle:     'italic',
            transition:    'color 0.35s',
          }}>
            {pillar.number}
          </div>
        </div>

        {/* content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* icon + title row */}
          <div style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '12px',
            marginBottom: '10px',
          }}>
            <div style={{
              width:           '36px',
              height:          '36px',
              borderRadius:    '10px',
              backgroundColor: hovered ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.06)',
              border:          '1px solid rgba(201,168,76,0.20)',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              flexShrink:      0,
              transition:      'all 0.35s',
            }}>
              <Icon style={{ width: '16px', height: '16px', color: '#C9A84C' }} />
            </div>
            <h3 style={{
              fontSize:      isDesktop ? '18px' : '16px',
              fontWeight:    700,
              color:         '#0F1C2E',
              letterSpacing: '-0.01em',
              margin:        0,
              lineHeight:    1.3,
            }}>
              {pillar.title}
            </h3>
          </div>

          <p style={{
            fontSize:     isDesktop ? '14.5px' : '13.5px',
            lineHeight:   1.65,
            color:        '#6B7280',
            margin:       0,
            paddingLeft:  '48px',
          }}>
            {pillar.body}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ── main section ──────────────────────────────────────────────
export default function WhyChooseUs() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{
      backgroundColor: '#FFFFFF',
      padding:         isDesktop ? '100px 0' : '64px 0',
    }}>
      <div style={{
        maxWidth:    '1440px',
        marginLeft:  'auto',
        marginRight: 'auto',
        padding:     isDesktop ? '0 60px' : '0 20px',
      }}>

        <div style={{
          display:       'grid',
          gridTemplateColumns: isDesktop ? '42% 1fr' : '1fr',
          gap:           isDesktop ? '72px' : '40px',
          alignItems:    'flex-start',
        }}>

          {/* ══════════ LEFT — IMAGE ══════════ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position:     'relative',
              width:        '100%',
              aspectRatio:  isDesktop ? '4 / 5' : '5 / 4',
            }}
          >
            {/* gold corner bracket — top left */}
            <div style={{
              position:     'absolute',
              top:          '-14px',
              left:         '-14px',
              width:        '60px',
              height:       '60px',
              borderTop:    '2px solid #C9A84C',
              borderLeft:   '2px solid #C9A84C',
              zIndex:       2,
              pointerEvents: 'none',
            }} />

            {/* gold corner bracket — bottom right */}
            <div style={{
              position:     'absolute',
              bottom:       '-14px',
              right:        '-14px',
              width:        '60px',
              height:       '60px',
              borderBottom: '2px solid #C9A84C',
              borderRight:  '2px solid #C9A84C',
              zIndex:       2,
              pointerEvents: 'none',
            }} />

            {/* image container */}
            <div style={{
              position:     'relative',
              width:        '100%',
              height:       '100%',
              overflow:     'hidden',
              borderRadius: '4px',
              boxShadow:    '0 20px 60px rgba(15,28,46,0.15)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMAGE}
                alt="Estate Manager — Architectural Excellence"
                style={{
                  width:     '100%',
                  height:    '100%',
                  objectFit: 'cover',
                  display:   'block',
                }}
              />

              {/* subtle overlay */}
              <div style={{
                position:   'absolute',
                inset:      0,
                background: 'linear-gradient(135deg, transparent 0%, rgba(15,28,46,0.15) 100%)',
                pointerEvents: 'none',
              }} />

              {/* floating badge — bottom left */}
              <div style={{
                position:        'absolute',
                bottom:          '24px',
                left:            '24px',
                padding:         '14px 20px',
                borderRadius:    '14px',
                backgroundColor: 'rgba(15,28,46,0.75)',
                backdropFilter:  'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border:          '1px solid rgba(201,168,76,0.25)',
                display:         'flex',
                alignItems:      'center',
                gap:             '14px',
              }}>
                <div style={{
                  width:           '42px',
                  height:          '42px',
                  borderRadius:    '10px',
                  background:      'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  flexShrink:      0,
                }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F1C2E' }}>25</span>
                </div>
                <div>
                  <div style={{
                    fontSize:      '9.5px',
                    fontWeight:    700,
                    color:         '#E8D48B',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginBottom:  '2px',
                  }}>
                    Years of
                  </div>
                  <div style={{
                    fontSize:   '13px',
                    fontWeight: 700,
                    color:      '#fff',
                    lineHeight: 1,
                  }}>
                    Architectural Excellence
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ══════════ RIGHT — CONTENT ══════════ */}
          <div>

            {/* editorial label */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '12px',
                marginBottom: '18px',
              }}
            >
              <div style={{ width: '32px', height: '1px', backgroundColor: '#C9A84C' }} />
              <span style={{
                fontSize:      '10.5px',
                fontWeight:    700,
                color:         '#C9A84C',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}>
                Our Commitment
              </span>
            </motion.div>

            {/* heading */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{
                fontSize:      isDesktop ? '38px' : '28px',
                fontWeight:    700,
                color:         '#0F1C2E',
                lineHeight:    1.1,
                margin:        '0 0 20px 0',
                letterSpacing: '-0.03em',
              }}
            >
              Why Discerning Buyers
              <br />
              <span style={{ fontWeight: 300, fontStyle: 'italic', color: '#6B7280' }}>
                Choose Estate Manager
              </span>
            </motion.h2>

            {/* intro */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontSize:     isDesktop ? '15.5px' : '14.5px',
                lineHeight:   1.7,
                color:        '#6B7280',
                margin:       '0 0 40px 0',
                maxWidth:     '540px',
              }}
            >
              For over 25 years, we&apos;ve built more than structures — we&apos;ve
              built trust. Here&apos;s what sets us apart.
            </motion.p>

            {/* pillars */}
            <div>
              {PILLARS.map((pillar, i) => (
                <Pillar key={i} pillar={pillar} index={i} isDesktop={isDesktop} />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}