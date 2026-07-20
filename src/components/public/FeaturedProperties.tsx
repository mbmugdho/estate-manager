'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import PropertyCard, { type PropertyCardData } from '@/components/public/PropertyCard'

export default function FeaturedProperties({ properties }: { properties: PropertyCardData[] }) {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 1024)
      setIsTablet(window.innerWidth >= 640)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // 3 on desktop, 4 on tablet/mobile (scrollable feel)
  const displayProperties = properties.slice(0, isDesktop ? 3 : 4)

  return (
    <section style={{
      backgroundColor: '#FAFAF7',
      padding: isDesktop ? '96px 0 80px' : '64px 0 56px',
    }}>
      <div style={{
        maxWidth: '1440px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: isDesktop ? '0 60px' : '0 20px',
      }}>

        {/* section header */}
        <div style={{ marginBottom: isDesktop ? '56px' : '40px' }}>

          {/* editorial label */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ width: '32px', height: '1px', backgroundColor: '#C9A84C' }} />
            <span style={{
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#C9A84C',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}>
              Featured Listings
            </span>
          </motion.div>

          {/* heading + view all */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
          }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h2 style={{
                fontSize: isDesktop ? '42px' : '30px',
                fontWeight: 700,
                color: '#0F1C2E',
                lineHeight: 1.1,
                margin: '0 0 10px 0',
                letterSpacing: '-0.03em',
              }}>
                Handpicked Signature
                <br />
                <span style={{ fontWeight: 300, fontStyle: 'italic', color: '#6B7280' }}>
                  Properties
                </span>
              </h2>
              <p style={{ fontSize: '15px', color: '#6B7280', margin: 0, maxWidth: '480px' }}>
                Curated selection of our most exceptional developments — built with precision, priced with purpose.
              </p>
            </motion.div>

            {isDesktop && (
              <motion.button
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                onClick={() => router.push('/properties')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 24px',
                  borderRadius: '999px',
                  border: '1.5px solid #0F1C2E',
                  backgroundColor: 'transparent',
                  color: '#0F1C2E',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  flexShrink: 0,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#0F1C2E'
                  e.currentTarget.style.color = '#C9A84C'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#0F1C2E'
                }}
              >
                View All Properties
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </motion.button>
            )}
          </div>
        </div>

        {/* property grid */}
        {displayProperties.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: '#fff',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏛️</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F1C2E', marginBottom: '8px' }}>
              Setting up our showcase
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>
              Our featured properties will appear here shortly.
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr',
            gap: isDesktop ? '28px' : '16px',
          }}>
            {displayProperties.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}

        {/* mobile view all */}
        {!isDesktop && properties.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button
              onClick={() => router.push('/properties')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                borderRadius: '999px',
                border: '1.5px solid #0F1C2E',
                backgroundColor: 'transparent',
                color: '#0F1C2E',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              View All Properties
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        )}

      </div>
    </section>
  )
}