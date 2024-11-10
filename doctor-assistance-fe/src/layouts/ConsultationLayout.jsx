import React from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from '@/components/consultation/Sidebar'
import Header from '@/components/consultation/Header'
import { useWebRTCContext } from '@/context/WebRTCContext';
import CallEndedDialog from '@/components/dialogs/CallEndedDialog';

export default function ConsultationLayout() {

  /* const webRTCContext = useWebRTCContext(); */

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 md:ml-[218px] lg:ml-[234px]">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {/* {webRTCContext?.isEndCall && <CallEndedDialog />} */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
