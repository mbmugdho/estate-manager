'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Search, X, Home, Hash, MapPin, ChevronRight,
  MessageCircle, Phone, TrendingUp, Star, Archive,
  Settings, LogOut, Check, CheckCheck,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── types ───────────────────────────────────────────────
interface SearchResult {
  id: string
  title: string
  reference_code: string
  location: string
  status: string
}

interface Notification {
  id: string
  type: 'new_inquiry' | 'view_milestone' | 'trending' | 'no_featured' | 'archive_reminder'
  title: string
  message: string
  property_id: string | null
  read: boolean
  created_at: string
}

// ─── page title map ───────────────────────────────────────
const pageMeta: Record<string, { title: string; sub: string }> = {
  '/admin/dashboard':      { title: 'Dashboard',      sub: 'Overview of your properties'  },
  '/admin/properties':     { title: 'All Properties', sub: 'Manage your listings'         },
  '/admin/properties/add': { title: 'Add Property',   sub: 'Create a new listing'         },
  '/admin/settings':       { title: 'Settings',       sub: 'Company info and preferences' },
}

function getPageMeta(pathname: string) {
  if (pathname.startsWith('/admin/properties/edit'))
    return { title: 'Edit Property', sub: 'Update listing details' }
  return pageMeta[pathname] ?? { title: 'Admin', sub: '' }
}

// ─── notification icon by type ────────────────────────────
function NotifIcon({ type }: { type: Notification['type'] }) {
  const map: Record<Notification['type'], { icon: React.ReactNode; bg: string; color: string }> = {
    new_inquiry:      { icon: <MessageCircle size={14} />, bg: '#EFF6FF', color: '#3B82F6' },
    view_milestone:   { icon: <TrendingUp size={14} />,   bg: '#F0FDF4', color: '#16A34A' },
    trending:         { icon: <TrendingUp size={14} />,   bg: '#FFF7ED', color: '#D97706' },
    no_featured:      { icon: <Star size={14} />,         bg: '#FFFBEB', color: '#C9A84C' },
    archive_reminder: { icon: <Archive size={14} />,      bg: '#F8FAFC', color: '#6B7280' },
  }
  const { icon, bg, color } = map[type] ?? map.archive_reminder
  return (
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
  )
}

// ─── relative time helper ────────────────────────────────
function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ─── main component ───────────────────────────────────────
export default function AdminTopBar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { title, sub } = getPageMeta(pathname)

  // search
  const [searchOpen, setSearchOpen]   = useState(false)
  const [query, setQuery]             = useState('')
  const [results, setResults]         = useState<SearchResult[]>([])
  const [searching, setSearching]     = useState(false)

  // notifications
  const [notifOpen, setNotifOpen]           = useState(false)
  const [notifications, setNotifications]   = useState<Notification[]>([])
  const [unreadCount, setUnreadCount]       = useState(0)
  const notifRef                            = useRef<HTMLDivElement>(null)

  // profile
  const [profileOpen, setProfileOpen] = useState(false)
  const [userEmail, setUserEmail]     = useState('')
  const profileRef                    = useRef<HTMLDivElement>(null)

  // ── Cmd+K shortcut ──────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotifOpen(false)
        setProfileOpen(false)
      }
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  // ── search query ─────────────────────────────────────────
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const run = async () => {
      setSearching(true)
      const { data } = await supabase
        .from('properties')
        .select('id, title, reference_code, location, status')
        .or(`title.ilike.%${query}%,reference_code.ilike.%${query}%,location.ilike.%${query}%`)
        .limit(6)
      setResults((data as SearchResult[]) || [])
      setSearching(false)
    }
    const t = setTimeout(run, 300)
    return () => clearTimeout(t)
  }, [query])

  // ── fetch notifications ───────────────────────────────────
  const fetchNotifs = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    const list = (data as Notification[]) || []
    setNotifications(list)
    setUnreadCount(list.filter(n => !n.read).length)
  }

  useEffect(() => { fetchNotifs() }, [])

  // ── fetch user email ──────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? 'Admin')
    })
  }, [])

  // ── close dropdowns on outside click ─────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── mark all read ─────────────────────────────────────────
  const markAllRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  // ── mark one read ─────────────────────────────────────────
  const markOneRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  // ── sign out ──────────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // ─────────────────────────────────────────────────────────
  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          height: '72px',
          padding: '0 20px',
          backgroundColor: 'rgba(241,245,249,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(226,232,240,0.7)',
          flexShrink: 0,
        }}
        className="sm:px-8 lg:px-12"
      >
        {/* left — page title */}
        <div style={{ minWidth: 0, marginLeft: '56px' }} className="lg:!ml-0">
          <motion.h1
            key={title}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            style={{ color: '#0F1C2E', fontWeight: 700, fontSize: '17px', lineHeight: 1, margin: 0 }}
          >
            {title}
          </motion.h1>
          {sub && (
            <motion.p
              key={sub}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.06, duration: 0.28 }}
              style={{ color: '#6B7280', fontSize: '12.5px', marginTop: '6px', lineHeight: 1 }}
            >
              {sub}
            </motion.p>
          )}
        </div>

        {/* right — actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

          {/* search button */}
          <ActionButton aria="Search (Ctrl+K)" onClick={() => setSearchOpen(true)}>
            <Search style={{ width: '16px', height: '16px', color: '#6B7280' }} />
          </ActionButton>

          {/* notifications button + dropdown */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <ActionButton aria="Notifications" onClick={() => setNotifOpen(o => !o)}>
              <Bell style={{ width: '16px', height: '16px', color: '#6B7280' }} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '7px', right: '7px',
                  width: '7px', height: '7px',
                  borderRadius: '999px', backgroundColor: '#C9A84C',
                  border: '1.5px solid #F1F5F9',
                }} />
              )}
            </ActionButton>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '360px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(15,28,46,0.12), 0 2px 8px rgba(15,28,46,0.06)',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    zIndex: 50,
                  }}
                >
                  {/* header */}
                  <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F1C2E' }}>Notifications</div>
                      {unreadCount > 0 && (
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{unreadCount} unread</div>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        style={{ fontSize: '11px', color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                      >
                        <CheckCheck size={13} /> Mark all read
                      </button>
                    )}
                  </div>

                  {/* list */}
                  <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <Bell size={28} color="#E2E8F0" style={{ margin: '0 auto 10px' }} />
                        <div style={{ fontSize: '13px', color: '#9CA3AF' }}>No notifications yet</div>
                        <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '4px' }}>They'll show up when inquiries or milestones happen</div>
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (!n.read) markOneRead(n.id)
                            if (n.property_id) {
                              router.push(`/admin/properties/edit/${n.property_id}`)
                              setNotifOpen(false)
                            }
                          }}
                          style={{
                            padding: '12px 16px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                            backgroundColor: n.read ? 'transparent' : 'rgba(201,168,76,0.04)',
                            borderBottom: i < notifications.length - 1 ? '1px solid #F8FAFC' : 'none',
                            cursor: n.property_id ? 'pointer' : 'default',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { if (n.property_id) e.currentTarget.style.backgroundColor = '#F8FAFC' }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'rgba(201,168,76,0.04)' }}
                        >
                          <NotifIcon type={n.type} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: n.read ? 500 : 600, color: '#0F1C2E', lineHeight: 1.3 }}>{n.title}</div>
                            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '3px', lineHeight: 1.4 }}>{n.message}</div>
                            <div style={{ fontSize: '10.5px', color: '#9CA3AF', marginTop: '5px' }}>{timeAgo(n.created_at)}</div>
                          </div>
                          {!n.read && (
                            <div style={{ width: '7px', height: '7px', borderRadius: '999px', backgroundColor: '#C9A84C', flexShrink: 0, marginTop: '6px' }} />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* footer */}
                  {notifications.length > 0 && (
                    <div style={{ padding: '10px 16px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
                      <button
                        onClick={markAllRead}
                        style={{ fontSize: '11px', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Clear all notifications
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* profile button + dropdown */}
          <div ref={profileRef} style={{ position: 'relative', marginLeft: '4px' }}>
            <div
              onClick={() => setProfileOpen(o => !o)}
              style={{
                width: '36px', height: '36px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)',
                boxShadow: profileOpen ? '0 0 0 3px rgba(201,168,76,0.25)' : '0 4px 12px rgba(201,168,76,0.28)',
                transition: 'box-shadow 0.2s',
              }}
            >
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>D</span>
            </div>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '220px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    boxShadow: '0 8px 32px rgba(15,28,46,0.12), 0 2px 8px rgba(15,28,46,0.06)',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    zIndex: 50,
                  }}
                >
                  {/* user info */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #C9A84C 0%, #A6832E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>D</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F1C2E' }}>Demo Admin</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
                      </div>
                    </div>
                  </div>

                  {/* menu items */}
                  <div style={{ padding: '6px' }}>
                    <ProfileMenuItem
                      icon={<Settings size={14} />}
                      label="Settings"
                      onClick={() => { router.push('/admin/settings'); setProfileOpen(false) }}
                    />
                    <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '4px 0' }} />
                    <ProfileMenuItem
                      icon={<LogOut size={14} />}
                      label="Sign Out"
                      danger
                      onClick={signOut}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* ── SEARCH MODAL ────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh', paddingLeft: '20px', paddingRight: '20px' }}>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSearchOpen(false); setQuery('') }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,28,46,0.45)', backdropFilter: 'blur(4px)' }}
            />

            {/* panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 380 }}
              style={{ width: '100%', maxWidth: '600px', backgroundColor: '#FFF', borderRadius: '16px', boxShadow: '0 24px 48px rgba(0,0,0,0.16)', overflow: 'hidden', position: 'relative' }}
            >
              {/* input row */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #E2E8F0', gap: '12px' }}>
                <Search style={{ width: '18px', height: '18px', color: '#9CA3AF', flexShrink: 0 }} />
                <input
                  autoFocus
                  placeholder="Search by title, code (EM-2026), or location…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && results[0]) { router.push(`/admin/properties/edit/${results[0].id}`); setSearchOpen(false); setQuery('') } }}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#0F1C2E', backgroundColor: 'transparent' }}
                />
                {query && (
                  <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}>
                    <X size={16} color="#9CA3AF" />
                  </button>
                )}
                <kbd style={{ fontSize: '10px', color: '#9CA3AF', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '5px', padding: '2px 6px', flexShrink: 0 }}>ESC</kbd>
              </div>

              {/* results */}
              <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                {searching && (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>Searching…</div>
                )}
                {!searching && query.length >= 2 && results.length === 0 && (
                  <div style={{ padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>No properties found for "{query}"</div>
                  </div>
                )}
                {!searching && results.map((item, i) => (
                  <div
                    key={item.id}
                    onClick={() => { router.push(`/admin/properties/edit/${item.id}`); setSearchOpen(false); setQuery('') }}
                    style={{ padding: '11px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid #F8FAFC' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FDF8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Home size={17} color="#C9A84C" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F1C2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '3px' }}>
                        <span style={{ fontSize: '11px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '3px' }}><Hash size={11} />{item.reference_code}</span>
                        <span style={{ fontSize: '11px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={11} />{item.location}</span>
                      </div>
                    </div>
                    <StatusPill status={item.status} />
                    <ChevronRight size={15} color="#CBD5E1" />
                  </div>
                ))}
                {query.length < 2 && (
                  <div style={{ padding: '28px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: '12.5px' }}>
                    Type at least 2 characters to search properties
                  </div>
                )}
              </div>

              {/* footer hint */}
              {results.length > 0 && (
                <div style={{ padding: '8px 16px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '16px' }}>
                  <span style={{ fontSize: '10.5px', color: '#CBD5E1' }}>↵ to open first result</span>
                  <span style={{ fontSize: '10.5px', color: '#CBD5E1' }}>ESC to close</span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── sub-components ───────────────────────────────────────

function ActionButton({ children, aria, onClick }: { children: React.ReactNode; aria: string; onClick?: () => void }) {
  return (
    <button
      aria-label={aria}
      onClick={onClick}
      style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15,28,46,0.05)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(15,28,46,0.08)'; e.currentTarget.style.transform = 'scale(1.05)' }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(15,28,46,0.05)'; e.currentTarget.style.transform = 'scale(1)' }}
    >
      {children}
    </button>
  )
}

function ProfileMenuItem({ icon, label, onClick, danger = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: danger ? '#DC2626' : '#374151', fontSize: '13px', fontWeight: 500, transition: 'background 0.15s', textAlign: 'left' }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = danger ? '#FEF2F2' : '#F8FAFC' }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      {icon} {label}
    </button>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    available: { bg: '#F0FDF4', color: '#16A34A' },
    sold:      { bg: '#FEF2F2', color: '#DC2626' },
    rented:    { bg: '#FFFBEB', color: '#D97706' },
    archived:  { bg: '#F8FAFC', color: '#6B7280' },
  }
  const s = map[status] ?? map.archived
  return (
    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '5px', backgroundColor: s.bg, color: s.color, textTransform: 'capitalize', flexShrink: 0 }}>
      {status}
    </span>
  )
}