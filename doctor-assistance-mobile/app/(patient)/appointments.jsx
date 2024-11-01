import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import AppointmentCard from '@/components/shared/AppointmentCard';
import ProfileTabs from '@/components/shared/ProfileTabs';
import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import AppointmentFilters from '@/components/modals/AppointmentFilters';
import Loading from '@/components/shared/Loading';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';

export default function Appointments() {

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ doctorName: '', mode: '' });
  const [pendingFilters, setPendingFilters] = useState(filters);

  const [activeTab, setActiveTab] = useState("approved");
  const [modalVisible, setModalVisible] = useState(false);
  const { fetchWithUserAuth } = useAuth();

  const { data, isFetching, isError, error } = useFetchQuery({
    url: `appointments/?page=${page}&status=${activeTab}`,
    queryKey: ['patientAppointments', page, activeTab],
    fetchFunction: fetchWithUserAuth,
  });

  const appointmentTabs = [
    { label: "Approved", key: "approved" },
    { label: "Pending", key: "pending" },
    { label: "Rejected", key: "rejected" },
  ];

  const appointments = data?.results || [];
  const nextPage = data?.next;
  const prevPage = data?.previous;

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => prev - 1);

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

  }, []);

  const filteredAppointments = appointments.filter(appointment =>
    (!filters.doctorName || appointment.doctor_name.toLowerCase().includes(filters.doctorName.toLowerCase())) &&
    (!filters.mode || appointment.appointment_mode === filters.mode)
  );

  return (
    <CustomKeyboardView>
      <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: 65, marginTop: 40  }}>
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
              <View className="flex flex-row justify-between items-center mt-4 mb-5">
                <TouchableOpacity
                  className={`px-4 py-2 bg-blue-500 rounded`}
                  onPress={handlePrevPage}
                  disabled={!prevPage}
                >
                  <Text className="text-white">Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-4 py-2 bg-blue-500 rounded`}
                  onPress={handleNextPage}
                  disabled={!nextPage}
                >
                  <Text className="text-white">Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text className="text-gray-600">No {activeTab} appointments found.</Text>
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
