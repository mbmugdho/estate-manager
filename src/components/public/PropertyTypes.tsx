'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

// The 7 DB property types mapped to luxury images and grid spans
const TYPES = [
  {
    label: 'Apartments',
    value: 'apartment',
    span:  2, // takes 2 columns
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  },
  {
    label: 'Signature Villas',
    value: 'villa',
    span:  2,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
  },
  {
    label: 'Commercial Offices',
    value: 'office',
    span:  1, // takes 1 column
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },
  {
    label: 'Luxury Penthouses',
    value: 'penthouse',
    span:  2,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
  },
  {
    label: 'Premium Plots',
    value: 'plot',
    span:  1,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
  },
  {
    label: 'Townhouses',
    value: 'townhouse',
    span:  2,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  },
  {
    label: 'Modern Studios',
    value: 'studio',
    span:  2,
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
  },
]

function TypeCard({ item, index, isDesktop }: { item: typeof TYPES[0]; index: number; isDesktop: boolean }) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/properties?type=${item.value}`)}
      style={{
        position: 'relative',
        height:   isDesktop ? '260px' : '200px',
        gridColumn: isDesktop ? `span ${item.span}` : 'span 1',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* ── BACKGROUND IMAGE ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={item.label}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      {/* ── GRADIENT OVERLAY ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(15,28,46,0.8) 0%, rgba(15,28,46,0.2) 100%)'
          : 'linear-gradient(to top, rgba(15,28,46,0.65) 0%, rgba(15,28,46,0.1) 100%)',
        transition: 'background 0.4s',
      }} />

      {/* ── CONTENT ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <h3 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            {item.label}
          </h3>

          {/* animated arrow circle */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: hovered ? '#C9A84C' : 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transform: hovered ? 'translate(4px, -4px)' : 'translate(0, 0)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}>
            <ArrowUpRight style={{
              width: '18px',
              height: '18px',
              color: hovered ? '#0F1C2E' : '#FFFFFF',
              transition: 'color 0.3s',
            }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function PropertyTypes() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isTablet,  setIsTablet]  = useState(false)

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 1024)
      setIsTablet(window.innerWidth >= 768)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section style={{
      backgroundColor: '#F8FAFC', // subtle slate gray to separate from white section above
      padding: isDesktop ? '100px 0' : '64px 0',
    }}>
      <div style={{
        maxWidth: '1440px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: isDesktop ? '0 60px' : '0 20px',
      }}>

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex',
          flexDirection: isTablet ? 'row' : 'column',
          alignItems: isTablet ? 'flex-end' : 'flex-start',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: isDesktop ? '48px' : '32px',
        }}>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}
            >
              <div style={{ width: '32px', height: '1px', backgroundColor: '#C9A84C' }} />
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#C9A84C', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                Portfolio
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{
                fontSize: isDesktop ? '42px' : '30px',
                fontWeight: 700,
                color: '#0F1C2E',
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: '-0.03em',
              }}
            >
              Explore By
              <span style={{ fontWeight: 300, fontStyle: 'italic', color: '#6B7280', marginLeft: '10px' }}>
                Type
              </span>
            </motion.h2>
          </div>
        </div>

        {/* ── BENTO GRID ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr',
          gap: '16px',
        }}>
          {TYPES.map((type, i) => (
            <TypeCard key={type.value} item={type} index={i} isDesktop={isDesktop} />
          ))}
        </div>

      </div>
    </section>
  )
}