import { headers } from 'next/headers'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // read current path to exclude login from shell
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isLoginPage = pathname.includes('/admin/login')

  if (isLoginPage) {
    // login page renders standalone — no sidebar/topbar
    return <>{children}</>
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
      <AdminSidebar />
      <AdminShell>
        <AdminTopBar />
        <main
          style={{
            flex: 1,
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '32px 20px',
          }}
          className="sm:!px-8 lg:!px-12"
        >
          {children}
        </main>
      </AdminShell>
    </div>
  )
}