import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react-native';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import AppointmentCard from '@/components/shared/AppointmentCard';
import ProfileTabs from '@/components/shared/ProfileTabs';
import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import AppointmentFilters from '@/components/modals/AppointmentFilters';
import Loading from '@/components/shared/Loading';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import { getPaginationItems } from '@/utils/pagination';

export default function Appointments() {

  const [page, setPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const screenWidth = Dimensions.get('window').width;

  const [filters, setFilters] = useState({ doctorName: '', mode: '' });
  const [pendingFilters, setPendingFilters] = useState(filters);

  const [activeTab, setActiveTab] = useState("approved");
  const [modalVisible, setModalVisible] = useState(false);
  const { fetchWithUserAuth } = useAuth();

  const { data, isFetching, isError, error } = useFetchQuery({
    url: `appointments/?page=${page}${activeTab !== "all" ? `&status=${activeTab}` : ''}`,
    queryKey: ['patientAppointments', page, activeTab],
    fetchFunction: fetchWithUserAuth,
  });

  const appointmentTabs = [
    { label: "All", key: "all" },
    { label: "Approved", key: "approved" },
    { label: "Pending", key: "pending" },
    { label: "Rejected", key: "rejected" },
  ];

  const appointments = data?.results || [];
  const dataCount = data?.count || 0;
  const nextPage = data?.next;
  const prevPage = data?.previous;

  const totalPages = resultPerPage ? Math.ceil(dataCount / resultPerPage) : 0;

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => prev - 1);
  const handlePageClick = (pageNumber) => setPage(pageNumber);

  const paginationItems = getPaginationItems(page, totalPages);

  const handleFilterChange = (name, value) => {
    setPendingFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setFilters(pendingFilters);
    setModalVisible(false);
  };

  const removeFilter = (filterName) => {
    const updatedFilters = { ...filters, [filterName]: '' };
    setPendingFilters(updatedFilters);
  };

  useEffect(() => {
    setFilters({ doctorName: '', mode: '' });
    setPage(1);
  }, []);

  const filteredAppointments = appointments.filter(appointment =>
    (!filters.doctorName || appointment.doctor_name.toLowerCase().includes(filters.doctorName.toLowerCase())) &&
    (!filters.mode || appointment.appointment_mode === filters.mode)
  );

  return (
    <CustomKeyboardView>
      <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: screenWidth * 0.14, marginTop: screenWidth * 0.09 }}>
        <HeaderBackButton />
        <Text className="text-xl font-semibold text-primary flex-1 text-center">My Appointments</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <SlidersHorizontal size={24} color="hsl(203, 87%, 30%)" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 py-5 px-5 pb-8 bg-white">

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={appointmentTabs} />

        <View className='flex-1 py-2'>
          {isFetching ? (
            <Loading />
          ) : isError ? (
            <Text className="text-red-500">Error fetching reviews: {error.message}</Text>
          ) : filteredAppointments.length > 0 ? (
            <View>
              {filteredAppointments.map((item) => (
                <AppointmentCard key={item.id} appointment={item} />
              ))}
              {(prevPage || nextPage) && (
                <View className="flex flex-row gap-2 justify-center items-center mt-2">
                  <TouchableOpacity
                    className="px-2 py-2 rounded-md border border-gray-300"
                    onPress={handlePrevPage}
                    disabled={!prevPage}>
                    <ChevronLeft size={20} color={!prevPage ? 'lightgrey' : 'grey'} />
                  </TouchableOpacity>

                  <View className="flex flex-row">
                    {paginationItems.map((pg, index) => (
                      <TouchableOpacity
                        key={index}
                        className={`px-3 py-2 border border-gray-300 ${page === pg ? 'bg-primary' : ''} rounded-md mx-1`}
                        onPress={() => {
                          if (pg !== '...') {
                            handlePageClick(pg);
                          }
                        }}>
                        <Text className={`${page === pg ? 'text-white' : 'text-gray-700'} font-semibold`}>{pg}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    className="px-2 py-2 rounded-md border border-gray-300"
                    onPress={handleNextPage}
                    disabled={!nextPage}>
                    <ChevronRight size={20} color={!nextPage ? 'lightgrey' : 'grey'} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <Text className="text-gray-600 text-center">No {activeTab} appointments found.</Text>
          )}
        </View>

        <AppointmentFilters
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          filters={pendingFilters}
          handleFilterChange={handleFilterChange}
          applyFilters={applyFilters}
          removeFilter={removeFilter}
        />
      </View>
    </CustomKeyboardView>
  );
}
