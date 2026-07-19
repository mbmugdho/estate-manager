'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Loader2 } from 'lucide-react'

interface DeleteModalProps {
  open:          boolean
  onClose:       () => void
  onConfirm:     () => Promise<void>
  title:         string
  referenceCode: string
}

export default function DeleteModal({
  open, onClose, onConfirm, title, referenceCode,
}: DeleteModalProps) {
  const [typed, setTyped] = useState('')
  const [deleting, setDeleting] = useState(false)

  const canDelete = typed === 'DELETE'

  // reset when modal opens
  useEffect(() => {
    if (open) { setTyped(''); setDeleting(false) }
  }, [open])

  // close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && !deleting && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, deleting])

  async function handleConfirm() {
    if (!canDelete || deleting) return
    setDeleting(true)
    try {
      await onConfirm()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !deleting && onClose()}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15,28,46,0.6)',
              backdropFilter: 'blur(6px)',
              zIndex: 60,
            }}
          />

          {/* modal */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              style={{
                width: '100%',
                maxWidth: '460px',
                backgroundColor: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                pointerEvents: 'auto',
                boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              }}
            >
              {/* header */}
              <div style={{ position: 'relative', padding: '28px 28px 0' }}>
                <button
                  onClick={onClose}
                  disabled={deleting}
                  aria-label="Close"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.5 : 1,
                  }}
                >
                  <X style={{ width: '14px', height: '14px', color: '#6B7280' }} />
                </button>

                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(220,38,38,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <AlertTriangle style={{ width: '26px', height: '26px', color: '#DC2626' }} />
                </div>

                <h3 style={{
                  color: '#0F1C2E',
                  fontSize: '18px',
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.3,
                }}>
                  Permanently delete this property?
                </h3>
                <p style={{
                  color: '#6B7280',
                  fontSize: '13.5px',
                  marginTop: '8px',
                  lineHeight: 1.5,
                }}>
                  This will permanently delete <strong style={{ color: '#0F1C2E' }}>{title}</strong>{' '}
                  <span style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '12px',
                    color: '#A6832E',
                    fontWeight: 600,
                  }}>({referenceCode})</span> and all its images.
                  <br /><br />
                  <span style={{ color: '#DC2626', fontWeight: 600 }}>
                    This action cannot be undone.
                  </span>
                </p>
              </div>

              {/* body */}
              <div style={{ padding: '20px 28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '8px',
                }}>
                  Type <span style={{
                    fontFamily: 'ui-monospace, monospace',
                    color: '#DC2626',
                    fontWeight: 700,
                  }}>DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={typed}
                  onChange={e => setTyped(e.target.value)}
                  disabled={deleting}
                  autoFocus
                  placeholder="DELETE"
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    border: `1px solid ${canDelete ? '#DC2626' : '#E2E8F0'}`,
                    backgroundColor: '#FAFBFC',
                    color: '#0F1C2E',
                    fontSize: '14px',
                    fontFamily: 'ui-monospace, monospace',
                    fontWeight: 600,
                    outline: 'none',
                    boxShadow: canDelete ? '0 0 0 3px rgba(220,38,38,0.15)' : 'none',
                    transition: 'all 0.2s',
                  }}
                />
              </div>

              {/* footer */}
              <div style={{
                padding: '16px 28px 24px',
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
              }}>
                <button
                  onClick={onClose}
                  disabled={deleting}
                  style={{
                    padding: '11px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#6B7280',
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.5 : 1,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!canDelete || deleting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#fff',
                    backgroundColor: canDelete ? '#DC2626' : '#FCA5A5',
                    border: 'none',
                    cursor: (canDelete && !deleting) ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.2s',
                    boxShadow: canDelete ? '0 4px 12px rgba(220,38,38,0.30)' : 'none',
                  }}
                >
                  {deleting && (
                    <Loader2 style={{
                      width: '14px',
                      height: '14px',
                      animation: 'spin 1s linear infinite',
                    }} />
                  )}
                  {deleting ? 'Deleting…' : 'Delete Forever'}
                </button>
              </div>
            </motion.div>
          </div>

          <style jsx global>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </>
      )}
    </AnimatePresence>
  )
}