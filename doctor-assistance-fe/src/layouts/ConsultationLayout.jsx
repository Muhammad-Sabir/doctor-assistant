import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/consultation/Sidebar'
import Header from '@/components/consultation/Header'

export default function ConsultationLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 md:ml-[218px] lg:ml-[234px]">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
