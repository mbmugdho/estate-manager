import { supabase } from '@/lib/supabase'

// stable anonymous visitor id per browser
export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  const KEY = 'em_visitor_id'
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}

// build wa.me link with pre-filled message
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/[^0-9]/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

// fire-and-forget inquiry log — never blocks CTA
export function logInquiry(propertyId: string, type: 'whatsapp' | 'call'): void {
  const visitor_id = getVisitorId()
  if (!visitor_id) return
  supabase
    .from('inquiries')
    .insert({ property_id: propertyId, type, visitor_id })
    .then(() => {})
    .catch(() => {})
}

// log a view — idempotent per day via DB unique constraint
export function logView(propertyId: string): void {
  const visitor_id = getVisitorId()
  if (!visitor_id) return
  supabase
    .from('property_views')
    .insert({ property_id: propertyId, visitor_id })
    .then(() => {})
    .catch(() => {}) // duplicate-day insert fails silently — expected
}

// toggle save — returns new saved state
export async function toggleSave(
  propertyId: string,
  currentlySaved: boolean
): Promise<boolean> {
  const visitor_id = getVisitorId()
  if (!visitor_id) return currentlySaved
  if (currentlySaved) {
    await supabase
      .from('property_saves')
      .delete()
      .eq('property_id', propertyId)
      .eq('visitor_id', visitor_id)
    return false
  } else {
    await supabase
      .from('property_saves')
      .insert({ property_id: propertyId, visitor_id })
    return true
  }
}

// check if visitor already saved this property
export async function isSavedByVisitor(propertyId: string): Promise<boolean> {
  const visitor_id = getVisitorId()
  if (!visitor_id) return false
  const { data } = await supabase
    .from('property_saves')
    .select('id')
    .eq('property_id', propertyId)
    .eq('visitor_id', visitor_id)
    .limit(1)
    .maybeSingle()
  return !!data
}