import Sidebar from '@/components/dashboard/Sidebar.jsx'
import Header from '@/components/dashboard/Header.jsx'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 md:ml-[218px] lg:ml-[234px]">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
