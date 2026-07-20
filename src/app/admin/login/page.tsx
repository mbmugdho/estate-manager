'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import {
  Eye, EyeOff, Lock, Mail, Building2,
  ArrowRight, KeyRound, ShieldCheck, ArrowLeft ,
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // handle login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid credentials. Please try again.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
  }

  // auto fill demo
  function fillDemo() {
    setEmail('demo@estatemanager.com')
    setPassword('Demo@1234')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* ── LEFT PANEL — branding (desktop only) ── */}
      {isDesktop && (
        <div style={{
          width: '50%',
          position: 'relative',
          backgroundColor: '#0F1C2E',
          overflow: 'hidden',
          display: 'flex',
        }}>
          {/* decorative circles */}
          <div style={{
            position: 'absolute', top: '-120px', right: '-80px',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', left: '-100px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,60,94,0.4) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px', borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.08)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px', height: '400px', borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.05)',
            pointerEvents: 'none',
          }} />

          {/* grid lines */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
          }} />

          {/* content */}
          <div style={{
            position: 'relative', zIndex: 10,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px', width: '100%',
          }}>
            {/* logo */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(201,168,76,0.3)',
              }}>
                <Building2 style={{ width: '22px', height: '22px', color: '#fff' }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '17px', lineHeight: 1.2 }}>
                  Estate Manager
                </div>
                <div style={{
                  color: '#C9A84C', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: '3px',
                }}>
                  Property Management
                </div>
              </div>
            </motion.div>

            {/* center text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              <h1 style={{
                fontSize: '52px', fontWeight: 900, color: '#fff',
                lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 0 20px',
              }}>
                Manage Your
                <br />
                <span style={{ color: '#C9A84C' }}>Properties</span>
                <br />
                With Ease.
              </h1>
              <p style={{
                color: 'rgba(255,255,255,0.45)', fontSize: '16px',
                lineHeight: 1.7, maxWidth: '420px', margin: 0,
              }}>
                Add, edit, and manage your entire property portfolio from one powerful dashboard.
              </p>
            </motion.div>

            {/* bottom stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '40px' }}
            >
              {[
                { value: '150+', label: 'Properties Listed' },
                { value: '12', label: 'Cities Covered' },
                { value: '98%', label: 'Client Satisfaction' },
              ].map((stat, i) => (
                <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                  {i > 0 && (
                    <div style={{ width: '1px', height: '48px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                  )}
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#C9A84C', lineHeight: 1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', fontWeight: 500 }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* ── RIGHT PANEL — login form ── */}
      <div style={{
        width: isDesktop ? '50%' : '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: isDesktop ? '48px' : '24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ width: '100%', maxWidth: '420px' }}
        >
          {/* back to home */}
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#6B7280',
                textDecoration: 'none',
                marginBottom: '32px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#0F1C2E' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#6B7280' }}
            >
              <ArrowLeft style={{ width: '14px', height: '14px' }} />
              Back to Home
            </Link>
          {/* mobile logo */}
          {!isDesktop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Building2 style={{ width: '18px', height: '18px', color: '#fff' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#0F1C2E' }}>
                Estate Manager
              </span>
            </div>
          )}

          {/* heading */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '26px', fontWeight: 900, color: '#0F1C2E',
              margin: '0 0 8px', letterSpacing: '-0.02em',
            }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>
              Sign in to access your admin dashboard
            </p>
          </div>

          {/* demo credentials box */}
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #0F1C2E 0%, #1A3C5E 100%)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            overflow: 'hidden',
          }}>
            {/* decorative circle */}
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              width: '80px', height: '80px', borderRadius: '50%',
              backgroundColor: 'rgba(201,168,76,0.1)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <KeyRound style={{ width: '14px', height: '14px', color: '#C9A84C' }} />
                <span style={{
                  fontSize: '10px', fontWeight: 700, color: '#C9A84C',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                }}>
                  Demo Access
                </span>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '16px',
              }}>
                <div>
                  <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Email: </span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>demo@estatemanager.com</span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Pass: </span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>Demo@1234</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={fillDemo}
                  style={{
                    padding: '8px 16px', borderRadius: '10px', border: 'none',
                    background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                    color: '#0F1C2E', fontSize: '11px', fontWeight: 700,
                    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(201,168,76,0.3)',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  Auto Fill
                </button>
              </div>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleLogin}>
            {/* email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: 600,
                color: '#0F1C2E', marginBottom: '8px',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  width: '32px', height: '32px', borderRadius: '8px',
                  backgroundColor: '#F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <Mail style={{ width: '14px', height: '14px', color: '#9CA3AF' }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    width: '100%', padding: '14px 16px 14px 56px',
                    backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0',
                    borderRadius: '12px', fontSize: '14px', color: '#0F1C2E',
                    outline: 'none', transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#1A3C5E'; e.currentTarget.style.backgroundColor = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.backgroundColor = '#F8FAFC' }}
                />
              </div>
            </div>

            {/* password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: 600,
                color: '#0F1C2E', marginBottom: '8px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  width: '32px', height: '32px', borderRadius: '8px',
                  backgroundColor: '#F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <Lock style={{ width: '14px', height: '14px', color: '#9CA3AF' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', padding: '14px 52px 14px 56px',
                    backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0',
                    borderRadius: '12px', fontSize: '14px', color: '#0F1C2E',
                    outline: 'none', transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#1A3C5E'; e.currentTarget.style.backgroundColor = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.backgroundColor = '#F8FAFC' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    width: '32px', height: '32px', borderRadius: '8px',
                    backgroundColor: '#F1F5F9', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E2E8F0' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F1F5F9' }}
                >
                  {showPassword
                    ? <EyeOff style={{ width: '14px', height: '14px', color: '#6B7280' }} />
                    : <Eye style={{ width: '14px', height: '14px', color: '#6B7280' }} />
                  }
                </button>
              </div>
            </div>

            {/* error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  backgroundColor: '#FEE2E2', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#DC2626' }}>{error}</span>
              </div>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px 24px', borderRadius: '12px',
                border: 'none', fontSize: '14px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                backgroundColor: loading ? '#374151' : '#0F1C2E',
                color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s',
                boxShadow: '0 4px 16px rgba(15,28,46,0.2)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#1A3C5E' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#0F1C2E' }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                    <path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </>
              )}
            </button>
          </form>

          {/* divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            margin: '28px 0',
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#CBD5E1', letterSpacing: '0.1em' }}>
              ADMIN ACCESS ONLY
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          </div>

          {/* security note */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9',
            borderRadius: '14px', padding: '16px 18px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: '#F0FDF4', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldCheck style={{ width: '18px', height: '18px', color: '#16A34A' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F1C2E' }}>
                Secured Access
              </div>
              <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '2px' }}>
                This area is protected with end-to-end encryption
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}