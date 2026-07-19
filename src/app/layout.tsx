import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PublicShell from '@/components/public/PublicShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Estate Manager — Premium Properties in Bangladesh',
  description: 'Browse verified apartments, villas, plots and commercial spaces across Dhaka, Chittagong and Rangpur. Direct from builder — no middlemen.',
  keywords: 'real estate bangladesh, property dhaka, apartment chittagong, flat for sale bangladesh, estate manager',
  authors: [{ name: 'Estate Manager' }],
  creator: 'Estate Manager',
  metadataBase: new URL('https://estate-manager.vercel.app'),
  openGraph: {
    title: 'Estate Manager — Premium Properties in Bangladesh',
    description: 'Browse verified apartments, villas, plots and commercial spaces across Dhaka, Chittagong and Rangpur.',
    url: 'https://estate-manager.vercel.app',
    siteName: 'Estate Manager',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Estate Manager — Premium Real Estate Bangladesh' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Estate Manager — Premium Properties in Bangladesh',
    description: 'Verified apartments, villas, plots across Dhaka, Chittagong and Rangpur.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: '#F1F5F9' }}>
        <PublicShell>
          {children}
        </PublicShell>
      </body>
    </html>
  )
}