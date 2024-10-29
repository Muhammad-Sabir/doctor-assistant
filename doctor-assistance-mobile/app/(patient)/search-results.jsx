import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SlidersHorizontal } from 'lucide-react-native';

import DoctorCard from '@/components/shared/DoctorCard';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import FilterModal from '@/components/modals/FilterModal';

export default function DoctorSearchResults() {

    const { fetchWithUserAuth } = useAuth();

    const { searchBy, searchQuery } = useLocalSearchParams();
    const [searchParams, setSearchParams] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);

    const [filters, setFilters] = useState({
        name: '',
        average_rating_min: '',
        average_rating_max: '',
        years_of_experience: '',
        gender: 'all',
    });

    console.log(searchParams);

    const { data: doctorsData, isFetching, isError, error } = useFetchQuery({
        url: `doctors?${searchParams}&page=${currentPage}`,
        queryKey: ['doctorsSearchResults', searchParams, currentPage],
        fetchFunction: fetchWithUserAuth,
    });

    const doctors = doctorsData?.results || [];
    const totalPages = doctorsData?.total_pages || 1;
    const nextPage = doctorsData?.next;
    const prevPage = doctorsData?.previous;

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        setFilters({
            name: '', average_rating_min: '', average_rating_max: '',
            years_of_experience: '', gender: 'all',
        });

        setSearchParams(`${searchBy}=${searchQuery}`);
    }, [searchQuery]);

    const createSearchParams = (filters) => {

        const updatedSearchParams = Object.entries(filters)
            .filter(([key, value]) => value && !(key === 'gender' && value === 'all'))
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        setSearchParams(`${searchBy}=${searchQuery}&${updatedSearchParams}`);
    }

    const applyFilters = () => {
        setCurrentPage(1);
        createSearchParams(filters)
        setModalVisible(false);
    };

    const removeFilter = (filterName) => {
        const updatedFilters = { ...filters, [filterName]: '' };
        setFilters(updatedFilters);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => prev - 1);
    };

    if (isFetching) return <Text className="text-center mt-4 text-gray-500">Loading...</Text>;
    if (isError) return <Text className="text-center mt-4 text-red-500">Error fetching doctor profile: {error.message}</Text>;

    return (
        <CustomKeyboardView>
            <View className="flex-1 p-4 bg-white">
                <View className="flex flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-semibold text-primary">Search Results:</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <SlidersHorizontal size={24} color="hsl(203, 87%, 30%)" />
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    {doctors.length > 0 ? (
                        doctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))
                    ) : (
                        <Text className="text-center text-gray-500">No doctors found.</Text>
                    )}
                </ScrollView>

                <View className="flex flex-row justify-between items-center mt-4">
                    <TouchableOpacity
                        className={`px-4 py-2 bg-blue-500 rounded ${!prevPage && 'bg-gray-300'}`}
                        onPress={handlePrevPage} disabled={!prevPage}>
                        <Text className="text-white">Previous</Text>
                    </TouchableOpacity>
                    <Text className="text-lg text-gray-700">  Page {currentPage} of {totalPages}</Text>
                    <TouchableOpacity
                        className={`px-4 py-2 bg-blue-500 rounded ${!nextPage && 'bg-gray-300'}`}
                        onPress={handleNextPage}
                        disabled={!nextPage}
                    >
                        <Text className="text-white">Next</Text>
                    </TouchableOpacity>
                </View>

                <FilterModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    applyFilters={applyFilters}
                    removeFilter={removeFilter}
                />
            </View >
        </CustomKeyboardView >
    );
}
