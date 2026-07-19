import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface SettingsRow {
  company_name: string | null
  tagline: string | null
  about: string | null
  logo_url: string | null
  founded_year: number | null
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

async function getSettings(): Promise<SettingsRow | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data } = await supabase
    .from('settings')
    .select('company_name, tagline, about, logo_url, founded_year, primary_phone, primary_whatsapp, contact_email, office_address, office_hours, facebook_url, instagram_url, linkedin_url, youtube_url')
    .limit(1)
    .maybeSingle()

  return data ?? null
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '12px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        color: 'rgba(255,255,255,0.75)',
        transition: 'all 0.2s',
        textDecoration: 'none',
      }}
      className="footerSocial"
    >
      {children}
    </a>
  )
}

export default async function Footer() {
  const settings = await getSettings()

  const companyName = settings?.company_name ?? 'Estate Manager'
  const tagline = settings?.tagline ?? 'Premium properties, built with trust.'
  const about =
    settings?.about ??
    'Discover verified developments across Bangladesh — crafted with care, delivered with integrity.'
  const phone = settings?.primary_phone ?? '+8801575871170'
  const whatsapp = settings?.primary_whatsapp ?? '+8801575871170'
  const email = settings?.contact_email ?? 'contact@estatemanager.com'
  const address = settings?.office_address ?? 'Dhaka, Bangladesh'
  const hours = settings?.office_hours ?? 'Sat–Thu: 9:00 AM – 8:00 PM · Friday: Closed'
  const year = new Date().getFullYear()

  const whatsappDigits = whatsapp.replace(/\D/g, '')

  const socials = [
    { key: 'facebook',  href: settings?.facebook_url ?? '',  label: 'Facebook' },
    { key: 'instagram', href: settings?.instagram_url ?? '', label: 'Instagram' },
    { key: 'linkedin',  href: settings?.linkedin_url ?? '',  label: 'LinkedIn' },
    { key: 'youtube',   href: settings?.youtube_url ?? '',   label: 'YouTube' },
  ].filter(s => s.href.trim().length > 0)

  return (
    <footer style={{ backgroundColor: '#080F1D', color: '#fff' }}>
      <div
        style={{
          maxWidth: '1440px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '56px 20px 26px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '28px',
            alignItems: 'start',
            paddingBottom: '26px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* brand */}
          <div style={{ minWidth: 0 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 6px 18px rgba(201,168,76,0.25)',
                  }}
                >
                  <span style={{ color: '#0F1C2E', fontWeight: 900, fontSize: '16px' }}>E</span>
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                    {companyName}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.45)',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      marginTop: '4px',
                    }}
                  >
                    Bangladesh
                  </div>
                </div>
              </div>
            </Link>

            <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.78)', marginBottom: '10px' }}>
              {tagline}
            </div>

            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', margin: 0, maxWidth: '420px' }}>
              {about}
            </p>

            {socials.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
                {socials.map(s => (
                  <SocialIcon key={s.key} href={s.href} label={s.label}>
                    {s.key === 'facebook' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.7-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
                      </svg>
                    )}
                    {s.key === 'instagram' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm5.4-1.8a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z" />
                      </svg>
                    )}
                    {s.key === 'linkedin' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M6.9 6.3a1.9 1.9 0 1 1-3.8 0 1.9 1.9 0 0 1 3.8 0zM3.4 21h3.1V9H3.4v12zM10.2 9h3v1.6h.1c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5V21h-3.1v-5.4c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V21h-3.1V9z" />
                      </svg>
                    )}
                    {s.key === 'youtube' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31.7 31.7 0 0 0 2 12c0 1.6.1 3.2.4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
                      </svg>
                    )}
                  </SocialIcon>
                ))}
              </div>
            )}
          </div>

          {/* nav */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '14px' }}>
              Navigate
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/" className="footerLink" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '13.5px', fontWeight: 600 }}>
                Home
              </Link>
              <Link href="/properties" className="footerLink" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '13.5px', fontWeight: 600 }}>
                Properties
              </Link>
              <Link href="/#about" className="footerLink" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '13.5px', fontWeight: 600 }}>
                About
              </Link>
              <Link href="/#contact" className="footerLink" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '13.5px', fontWeight: 600 }}>
                Contact
              </Link>
            </div>
          </div>

          {/* contact */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '14px' }}>
              Contact
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href={`tel:${phone}`} className="footerLink" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '13.5px', fontWeight: 600 }}>
                {phone}
              </a>
              <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer" className="footerLink" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '13.5px', fontWeight: 600 }}>
                WhatsApp: {whatsapp}
              </a>
              <a href={`mailto:${email}`} className="footerLink" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '13.5px', fontWeight: 600 }}>
                {email}
              </a>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                {address}
              </div>
            </div>
          </div>

          {/* hours */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '14px' }}>
              Office Hours
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
              {hours}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', paddingTop: '18px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
            © {year} {companyName}. All rights reserved.
            <span style={{ display: 'inline-block', marginLeft: '10px', color: 'rgba(255,255,255,0.28)' }}>
  Made with{' '}
  <span style={{ color: '#EF4444' }}>❤</span>
  {' '}by{' '}
  <a
    href="https://duallayercreative.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="footerLink"
    style={{
      color: 'rgba(255,255,255,0.55)',
      textDecoration: 'none',
      fontWeight: 700,
    }}
  >
    DualLayer Creative
  </a>
</span>
          </div>

          <Link
            href="/admin/login"
            className="footerLink"
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.32)',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Admin
          </Link>
        </div>
      </div>

      {/* <style jsx>{`
        .footerLink:hover {
          color: rgba(201,168,76,0.95) !important;
        }
        .footerSocial:hover {
          transform: translateY(-2px);
          border-color: rgba(201,168,76,0.35);
          background-color: rgba(255,255,255,0.10);
          color: rgba(201,168,76,0.95);
        }
      `}</style> */}
    </footer>
  )
}