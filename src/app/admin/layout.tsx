import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* sidebar */}
      <AdminSidebar />

      {/* main area — pushed right by sidebar */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* top bar */}
        <AdminTopBar />

        {/* page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}