import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react-native';
import * as Location from 'expo-location';

import DoctorCard from '@/components/shared/DoctorCard';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import FilterModal from '@/components/modals/FilterModal';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import Loading from '@/components/shared/Loading';
import { getPaginationItems } from '@/utils/pagination';

export default function DoctorSearchResults() {
    const { fetchWithUserAuth } = useAuth();
    const { searchBy, searchQuery } = useLocalSearchParams();
    const screenWidth = Dimensions.get('window').width;

    const [searchParams, setSearchParams] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        average_rating_min: '',
        average_rating_max: '',
        years_of_experience: '',
        gender: 'all',
        distance: '',
    });

    const [resultPerPage, setResultPerPage] = useState(10);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    console.log(searchParams)

    const { data: doctorsData, isFetching, isError, error } = useFetchQuery({
        url: `doctors?${searchParams}&page=${currentPage}`,
        queryKey: ['doctorsSearchResults', searchParams, currentPage],
        fetchFunction: fetchWithUserAuth,
    });

    const doctors = doctorsData?.results || [];
    const dataCount = doctorsData?.count || 0;
    const nextPage = doctorsData?.next;
    const prevPage = doctorsData?.previous;

    const totalPages = resultPerPage ? Math.ceil(dataCount / resultPerPage) : 0;
    const startResult = (currentPage - 1) * resultPerPage + 1;
    const endResult = Math.min(currentPage * resultPerPage, dataCount);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
        };

        getLocation();
    }, []);

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    useFocusEffect(
        useCallback(() => {
            setFilters({
                name: '', average_rating_min: '', average_rating_max: '',
                years_of_experience: '', gender: 'all', distance: ''
            });
            setCurrentPage(1);
            setSearchParams(`${searchBy}=${searchQuery}`);
        }, [searchQuery, searchBy])
    );

    const createSearchParams = (filters) => {
        const updatedSearchParams = Object.entries(filters)
            .filter(([key, value]) => value && !(key === 'gender' && value === 'all'))
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        setSearchParams(`${searchBy}=${searchQuery}&${updatedSearchParams}`);
    };

    const applyFilters = () => {
        setCurrentPage(1);

        const validFilters = { ...filters };
        if (validFilters.distance && latitude && longitude) {
            validFilters.radius = validFilters.distance;
            validFilters.latitude = latitude;
            validFilters.longitude = longitude;
            delete validFilters.distance;
        } else {
            delete validFilters.latitude;
            delete validFilters.longitude;
        }
    
        createSearchParams(validFilters);
        setModalVisible(false);
    };

    const removeFilter = (filterName) => {
        const updatedFilters = { ...filters };
        delete updatedFilters[filterName];
        setFilters(updatedFilters);
    };

    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePrevPage = () => setCurrentPage((prev) => prev - 1);
    const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

    const paginationItems = getPaginationItems(currentPage, totalPages);

    return (
        <>
            <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: screenWidth * 0.14, marginTop: screenWidth * 0.09 }}>
                <HeaderBackButton />
                <Text className="text-xl font-semibold text-primary flex-1 text-center">Doctor Search Results</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <SlidersHorizontal size={24} color="hsl(203, 87%, 30%)" />
                </TouchableOpacity>
            </View>

            <CustomKeyboardView>
                <View className="flex-1 px-5 py-5 bg-white">
                    {isFetching && <Loading />}
                    {isError && <Text className="text-center mt-4 text-red-500">Error: {error.message}</Text>}

                    {!isFetching && !isError && (
                        <>
                            <ScrollView>
                                {doctors.length > 0 && <Text className="text-gray-700 mb-4"> Showing {startResult}-{endResult} of {dataCount} results</Text>}
                                {doctors.length > 0 ? (
                                    doctors.map((doctor) => (
                                        <DoctorCard key={doctor.id} doctor={doctor} />
                                    ))
                                ) : (
                                    <Text className="text-center text-gray-500">No doctors found.</Text>
                                )}
                            </ScrollView>

                            <View className="flex flex-row gap-1 justify-center items-center mt-2">
                                <TouchableOpacity
                                    className="px-2 py-2 rounded-md border border-gray-300"
                                    onPress={handlePrevPage}
                                    disabled={!prevPage}>
                                    <ChevronLeft size={18} color={!prevPage ? 'lightgrey' : 'grey'} />
                                </TouchableOpacity>

                                <View className="flex flex-row">
                                    {paginationItems.map((page, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className={`px-3 py-2 border border-gray-300 ${currentPage === page ? 'bg-primary' : ''} rounded-md mx-1`}
                                            onPress={() => {
                                                if (page !== '...') {
                                                    handlePageClick(page);
                                                }
                                            }}>
                                            <Text className={`${currentPage === page ? 'text-white' : 'text-gray-700'} font-semibold text-sm`}>{page}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    className="px-2 py-2 rounded-md border border-gray-300"
                                    onPress={handleNextPage}
                                    disabled={!nextPage}>
                                    <ChevronRight size={18} color={!nextPage ? 'lightgrey' : 'grey'} />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </CustomKeyboardView>

            <FilterModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                filters={filters}
                handleFilterChange={handleFilterChange}
                applyFilters={applyFilters}
                removeFilter={removeFilter}
                latitude={latitude}
                longitude={longitude}
            />
        </>
    );
}
