import React, { useState, useEffect } from 'react';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import ProfileTabs from '@/components/shared/ProfileTabs';
import AppoitmentCard from '@/components/shared/AppoitmentCard';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import Loading from '@/components/shared/Loading';

export default function Appointments() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("approved");
  const [filters, setFilters] = useState({ doctorName: '', mode: '' });

  const { data, isFetching, isError, error } = useFetchQuery({
    url: `appointments/?page=${page}&status=${activeTab}`,
    queryKey: ['patientAppointments', page, activeTab],
    fetchFunction: fetchWithAuth,
  });

  const appointments = data?.results || [];
  const nextPage = data?.next;
  const prevPage = data?.previous;

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const appointmentTabs = [
    { label: "Approved", key: "approved" },
    { label: "Pending", key: "pending" },
    { label: "Rejected", key: "rejected" },
  ];

  const matchesDoctor = (appointment) =>
    !filters.doctorName ||
    (appointment.doctor_name &&
      appointment.doctor_name.toLowerCase().includes(filters.doctorName.toLowerCase()));

  const matchesMode = (appointment) =>
    !filters.mode ||
    (appointment.appointment_mode &&
      appointment.appointment_mode === filters.mode);

  const filteredAppointments = appointments.filter(appointment =>
    matchesDoctor(appointment) && matchesMode(appointment)
  );

  if (isFetching) {
    return <Loading />;
  }

  if (isError) {
    return <p className='text-primary'>Error fetching patient profile: {error.message}</p>;
  }

  return (
    <div className='px-2 pb-4'>
      <h2 className="text-md font-medium text-primary mb-2">My Appointments:</h2>
      <p className="text-gray-600 text-sm mb-4">See your appointments and stay on top of your schedule.</p>

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={appointmentTabs} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Search by Doctor Name"
          id='doctorName'
          name='doctorName'
          value={filters.doctorName}
          onChange={handleChange}
          className="border p-2 mr-2 col-span-2"
        />
        <select
          id='mode'
          name='mode'
          value={filters.mode}
          onChange={handleChange}
          className='flex h-9 w-full text-gray-500 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>
          <option value="">All Modes</option>
          <option value="physical">Physical</option>
          <option value="online">Online</option>
        </select>
      </div>

      <div className="appointment-list mt-4">
        {filteredAppointments.length > 0 ? (
          <>
            <div className="grid gap-4 lg:grid-cols-2 mt-2">
              {filteredAppointments.map(appointment => (
                <AppoitmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
            <div className="flex justify-center gap-4 my-6">
              <Button variant='outline' onClick={handlePrevPage} disabled={!prevPage}>
                <FaAnglesLeft className='mr-1' />Prev
              </Button>
              <Button variant='outline' onClick={handleNextPage} disabled={!nextPage}>
                Next <FaAnglesRight className='ml-1 mt-0.5' />
              </Button>
            </div>
          </>
        ) : (
          <p>No {activeTab} appointments found on this page.</p>
        )}
      </div>
    </div >
  );
}
