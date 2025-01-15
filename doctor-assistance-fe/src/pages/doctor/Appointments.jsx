import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ProfileTabs from '@/components/shared/ProfileTabs';
import AppoitmentCard from '@/components/shared/AppointmentCard';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import Loading from '@/components/shared/Loading';
import { getPaginationItems } from '@/utils/pagination';

export default function Appointments() {

  const [page, setPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [filters, setFilters] = useState({ patientName: '', mode: '' });

  const statusParam =
    activeTab === "all" ? "" :
      activeTab === "upcoming" || activeTab === "completed" ? "approved" :
        activeTab;

  const { data, isFetching, isError, error } = useFetchQuery({
    url: `appointments/?page=${page}${statusParam ? `&status=${statusParam}` : ''}`,
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

  const handleSelectChange = (value, field) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    };

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const appointmentTabs = [
    { label: "All", key: "all" },
    { label: "Upcoming", key: "upcoming" },
    { label: "Pending", key: "pending" },
    { label: "Rejected", key: "rejected" },
    { label: "Completed", key: "completed" },
  ];

  const matchesPatient = (appointment) =>
    !filters.patientName ||
    (appointment.patient_name &&
      appointment.patient_name.toLowerCase().includes(filters.patientName.toLowerCase()));

  const matchesMode = (appointment) =>
    !filters.mode ||
    (appointment.appointment_mode &&
      appointment.appointment_mode === filters.mode);

  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === "upcoming") return !appointment.completed;
    if (activeTab === "completed") return appointment.completed;

    return matchesPatient(appointment) && matchesMode(appointment);
  });

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

        <div className="text-gray-500">
          <Select onValueChange={(value) => handleSelectChange(value, "mode")} >
            <SelectTrigger id='mode' name='mode' value={filters.mode}>
              <SelectValue placeholder="Select Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Modes</SelectItem>
              <SelectItem value="physical">Physical</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
