'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home',       href: '/'            },
  { label: 'Properties', href: '/properties'  },
  { label: 'About',      href: '/#about'      },
  { label: 'Contact',    href: '/#contact'    },
]

const WHATSAPP = '+8801575871170'
const PHONE    = '+8801575871170'

export default function Navbar() {
  const pathname                    = usePathname()
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop,  setIsDesktop]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isHeroPage = pathname === '/'

  const navBg = scrolled || !isHeroPage
    ? 'rgba(15,28,46,0.97)'
    : 'rgba(15,28,46,0.15)'

  const navBorder = scrolled || !isHeroPage
    ? '1px solid rgba(201,168,76,0.15)'
    : '1px solid rgba(255,255,255,0.08)'

  return (
    <>
      {/* ── NAV BAR — full width bg, 1440px inner ── */}
      <nav
        style={{
          position:             'fixed',
          top:                  0,
          left:                 0,
          right:                0,
          zIndex:               100,
          backgroundColor:     navBg,
          borderBottom:         navBorder,
          backdropFilter:       'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition:           'background-color 0.35s, border-color 0.35s',
        }}
      >
        <div
          style={{
            maxWidth:       '1440px',
            marginLeft:     'auto',
            marginRight:    'auto',
            width:          '100%',
            height:         '68px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '0 20px',
          }}
        >
          {/* ── LOGO ── */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: '0 4px 12px rgba(201,168,76,0.35)',
              }}>
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: 800, letterSpacing: '-0.5px' }}>E</span>
              </div>
              <div>
                <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.2px' }}>
                  Estate<span style={{ color: '#C9A84C' }}> Manager</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9.5px', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>
                  Bangladesh
                </div>
              </div>
            </div>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          {isDesktop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {NAV_LINKS.map(link => {
                const active = pathname === link.href
                return (
                  <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        position: 'relative', padding: '8px 14px', borderRadius: '8px',
                        fontSize: '13.5px', fontWeight: active ? 600 : 500,
                        color: active ? '#C9A84C' : 'rgba(255,255,255,0.80)',
                        transition: 'color 0.2s, background-color 0.2s', cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        if (!active) e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
                      }}
                      onMouseLeave={e => {
                        if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.80)'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      {link.label}
                      {active && (
                        <motion.div
                          layoutId="nav-active"
                          style={{ position: 'absolute', bottom: '4px', left: '14px', right: '14px', height: '2px', borderRadius: '999px', backgroundColor: '#C9A84C' }}
                          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                        />
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* ── DESKTOP CTA ── */}
          {isDesktop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <a
                href={`tel:${PHONE}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px',
                  borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  color: 'rgba(255,255,255,0.80)', backgroundColor: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.10)', textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.80)' }}
              >
                <Phone style={{ width: '13px', height: '13px' }} />
                Call Us
              </a>

              <a
                href={`https://wa.me/${WHATSAPP.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 18px',
                  borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#0F1C2E',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                  boxShadow: '0 4px 14px rgba(201,168,76,0.35)', textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(201,168,76,0.35)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          )}

          {/* ── MOBILE HAMBURGER ── */}
          {!isDesktop && (
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
              style={{
                width: '42px', height: '42px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X style={{ width: '20px', height: '20px', color: '#fff' }} /></motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu style={{ width: '20px', height: '20px', color: '#fff' }} /></motion.div>
                }
              </AnimatePresence>
            </button>
          )}

        </div>{/* end 1440px inner */}
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && !isDesktop && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 98, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 99,
                width: 'min(320px, 85vw)', backgroundColor: '#080F1D',
                borderLeft: '1px solid rgba(201,168,76,0.15)',
                display: 'flex', flexDirection: 'column', overflowY: 'auto',
              }}
            >
              {/* drawer header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>
                  Estate<span style={{ color: '#C9A84C' }}> Manager</span>
                </div>
                <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.6)' }} />
                </button>
              </div>

              {/* nav links */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {NAV_LINKS.map((link, i) => {
                  const active = pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.22 }}
                    >
                      <Link href={link.href} style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 16px', borderRadius: '12px',
                          backgroundColor: active ? 'rgba(201,168,76,0.10)' : 'transparent',
                          border: active ? '1px solid rgba(201,168,76,0.20)' : '1px solid transparent',
                          color: active ? '#C9A84C' : 'rgba(255,255,255,0.75)',
                          fontSize: '15px', fontWeight: active ? 700 : 500, transition: 'all 0.2s',
                        }}>
                          {link.label}
                          {active && <ChevronDown style={{ width: '16px', height: '16px', transform: 'rotate(-90deg)' }} />}
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* drawer footer CTAs */}
              <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href={`https://wa.me/${WHATSAPP.replace(/\D/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    padding: '15px', borderRadius: '14px', fontSize: '15px', fontWeight: 700,
                    color: '#0F1C2E', background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                    boxShadow: '0 4px 16px rgba(201,168,76,0.35)', textDecoration: 'none',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Us
                </a>
                <a
                  href={`tel:${PHONE}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    padding: '15px', borderRadius: '14px', fontSize: '15px', fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)', backgroundColor: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)', textDecoration: 'none',
                  }}
                >
                  <Phone style={{ width: '16px', height: '16px' }} />
                  {PHONE}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}