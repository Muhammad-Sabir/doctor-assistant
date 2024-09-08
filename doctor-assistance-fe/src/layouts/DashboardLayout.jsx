import Sidebar from '@/components/dashboard/Sidebar.jsx'
import Header from '@/components/dashboard/Header.jsx'

export default function DashboardLayout({ children }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr]">
      <Sidebar/>
      <div className="flex flex-col">
        <Header/>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:pt-3 bg-indigo-50">
          {children}
        </main>
      </div>
    </div>
  )
}
