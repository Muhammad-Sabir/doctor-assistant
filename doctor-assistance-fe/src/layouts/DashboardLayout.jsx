import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { getAuthStatus } from '@/utils/auth';
import Sidebar from '@/components/dashboard/Sidebar.jsx';
import Header from '@/components/dashboard/Header.jsx';
import IncomingCall from '@/components/dialogs/IncomingCall';

export default function DashboardLayout() {
  const { user } = getAuthStatus();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (user.role === 'patient') {
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  }, [user.role]);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 md:ml-[218px] lg:ml-[234px]">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {openDialog && <IncomingCall />}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
