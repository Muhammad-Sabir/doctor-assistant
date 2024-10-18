import DoctorHomeCards from '@/components/dashboard/DoctorHomeCard'
import React from 'react'
import DoctorConsultations from '@/components/consultation/DoctorConsultations'
import TotalAppointments from '@/components/dashboard/TotalAppointments'
import TotalPatients from '@/components/dashboard/TotalPatients'

export default function Home() {
  return (
    <>
      <DoctorHomeCards />
      <section className="px-2 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="relative w-full">
            <h2 className='text-md font-medium text-primary mb-3'>Your Total Patients:</h2>
            <TotalPatients />
          </div>

          <div className="relative w-full">
            <h2 className='text-md font-medium text-primary mb-3'>Your Total Appointments:</h2>
            <TotalAppointments/>
          </div>

          <div className="relative w-full">
            <h2 className='text-md font-medium text-primary mb-3'>Your recent Consultations:</h2>
            <DoctorConsultations />
          </div>
        </div>
      </section>
    </>
  )
}
