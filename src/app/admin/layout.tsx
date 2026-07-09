import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* sidebar */}
      <AdminSidebar />

      {/* main area */}
      <div className="lg:pl-72 min-h-screen flex flex-col">
        {/* top bar */}
        <AdminTopBar />

        {/* page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}