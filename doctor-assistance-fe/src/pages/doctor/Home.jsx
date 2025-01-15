import DoctorHomeCards from "@/components/dashboard/DoctorHomeCard";
import React from "react";
import TotalAppointments from "@/components/dashboard/TotalAppointments";
import TotalPatients from "@/components/dashboard/TotalPatients";
import TotalPendingConsultations from "@/components/dashboard/TotalPendingConsultations";

export default function Home() {
  return (
    <>
      <DoctorHomeCards />
      <section className="px-2 py-2">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative w-full">
            <h2 className="mb-3 font-medium text-md text-primary">
              Your Total Patients:
            </h2>
            <TotalPatients />
          </div>

          <div className="relative w-full">
            <h2 className="mb-3 font-medium text-md text-primary">
              Your Total Appointments:
            </h2>
            <TotalAppointments />
          </div>

          <div className="relative w-full">
            <h2 className="mb-3 font-medium text-md text-primary">
              Your Pending Consultations:
            </h2>
            <TotalPendingConsultations />
          </div>
          
        </div>
      </section>
    </>
  );
}
