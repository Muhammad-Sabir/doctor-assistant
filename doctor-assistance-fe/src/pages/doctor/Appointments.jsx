import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Input } from '@/components/ui/input';

import ProfileTabs from '@/components/shared/ProfileTabs';
import AppoitmentCard from '@/components/shared/AppointmentCard';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import Loading from '@/components/shared/Loading';
import { getPaginationItems } from '@/utils/pagination';

export default function Appointments() {

  const [page, setPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);

  const [activeTab, setActiveTab] = useState("approved");
  const [filters, setFilters] = useState({ patientName: '', mode: '' });

  const { data, isFetching, isError, error } = useFetchQuery({
    url: `appointments/?page=${page}${activeTab !== "all" ? `&status=${activeTab}` : ''}`,
    queryKey: ['patientAppointments', page, activeTab],
    fetchFunction: fetchWithAuth,
  });

  const appointments = data?.results || [];
  const dataCount = data?.count || 0;
  const nextPage = data?.next;
  const prevPage = data?.previous;

  const totalPages = resultPerPage ? Math.ceil(dataCount / resultPerPage) : 0;

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => prev - 1);
  const handlePageClick = (pageNumber) => setPage(pageNumber);

  const paginationItems = getPaginationItems(page, totalPages);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const appointmentTabs = [
    { label: "All", key: "all" },
    { label: "Upcoming", key: "approved" },
    { label: "Pending", key: "pending" },
    { label: "Rejected", key: "rejected" },
  ];

  const matchesPatient = (appointment) =>
    !filters.patientName ||
    (appointment.patient_name &&
      appointment.patient_name.toLowerCase().includes(filters.patientName.toLowerCase()));

  const matchesMode = (appointment) =>
    !filters.mode ||
    (appointment.appointment_mode &&
      appointment.appointment_mode === filters.mode);

  const filteredAppointments = appointments.filter(appointment =>
    matchesPatient(appointment) && matchesMode(appointment)
  );

  return (
    <div className='px-2 pb-4'>
      <h2 className="text-md font-medium text-primary mb-2">My Appointments:</h2>
      <p className="text-gray-600 text-sm mb-4">See your appointments and stay on top of your schedule.</p>

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={appointmentTabs} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Search by Patient Name"
          id='patientName'
          name='patientName'
          value={filters.patientName}
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

      <div className="mt-4">
        {isFetching ? (<Loading />
        ) : isError ? (<p className='text-primary'>Error fetching appointments: {error.message}</p>
        ) : (
          <>
            {filteredAppointments.length > 0 ? (
              <>
                <div className="grid gap-4 lg:grid-cols-2 mt-2">
                  {filteredAppointments.map(appointment => (
                    <AppoitmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>

                {(prevPage || nextPage) && (
                  <div className="flex gap-1 justify-center items-center mt-7">
                    <button className="px-2 py-2 rounded-md border border-gray-300" onClick={handlePrevPage} disabled={!prevPage}>
                      <ChevronLeft size={18} color={!prevPage ? 'lightgrey' : 'grey'} />
                    </button>

                    <div className="flex flex-row">
                      {paginationItems.map((pg, index) => (
                        <button key={index}
                          className={`px-3 py-2 border border-gray-300 ${page === pg ? 'bg-primary text-white' : 'text-gray-700'} rounded-md mx-1 font-semibold text-sm`}
                          onClick={() => {
                            if (pg !== '...') {
                              handlePageClick(pg);
                            }
                          }} >
                          {pg}
                        </button>
                      ))}
                    </div>

                    <button className="px-2 py-2 rounded-md border border-gray-300" onClick={handleNextPage} disabled={!nextPage} >
                      <ChevronRight size={18} color={!nextPage ? 'lightgrey' : 'grey'} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-600 text-sm">
                {activeTab === "approved"
                  ? "No upcoming appointment found"
                  : activeTab === "all"
                    ? "No appointments found"
                    : `No ${activeTab} appointments found.`}
              </p>
            )}
          </>
        )}
      </div>
    </div >
  );
}
