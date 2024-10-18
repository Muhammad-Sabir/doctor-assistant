import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/dashboard/Sidebar.jsx'
import Header from '@/components/dashboard/Header.jsx'
import IncomingCall from '@/components/dialogs/IncomingCall';

export default function DashboardLayout() {
  const [openDialog, setOpenDialog] = useState(true)

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 md:ml-[218px] lg:ml-[234px]">
        <Header />
        {openDialog && <IncomingCall />}
        <main className="flex-1 overflow-auto p-4">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
