import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import banner from "@/assets/images/profileBanner.webp";
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import DoctorCard from '@/components/shared/DoctorCard';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import Loading from '@/components/shared/Loading';
import { getPaginationItems } from '@/utils/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

export default function HospitalDetail() {
    const { id } = useLocalSearchParams();
    const { fetchWithUserAuth } = useAuth();

    const [page, setPage] = useState(1);
    const [resultPerPage, setResultPerPage] = useState(10);

    const { data: hospitalData, isFetching: isFetchingHospital, isError: isErrorHospital, error: errorHospital } = useFetchQuery({
        url: `hospitals/${id}`,
        queryKey: ['hospitalDetail', id],
        fetchFunction: fetchWithUserAuth,
    });

    const { data: doctorsData, isFetching: isFetchingDoctors, isError: isErrorDoctors, error: errorDoctors } = useFetchQuery({
        url: `doctors?hospital_id=${id}&page=${page}`,
        queryKey: ['doctorsByHospital', id, page],
        fetchFunction: fetchWithUserAuth,
    });

    const doctors = doctorsData?.results || [];
    const dataCount = doctorsData?.count || 0;
    const nextPage = doctorsData?.next;
    const prevPage = doctorsData?.previous;

    useEffect(() => {
        setPage(1);
    }, []);

    const totalPages = resultPerPage ? Math.ceil(dataCount / resultPerPage) : 0;

    const startResult = (page - 1) * resultPerPage + 1;
    const endResult = Math.min(page * resultPerPage, dataCount);

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => setPage((prev) => prev - 1);
    const handlePageClick = (pageNumber) => setPage(pageNumber);
    const paginationItems = getPaginationItems(page, totalPages);

    return (
        <>
            <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: 59, marginTop: 40 }}>
                <HeaderBackButton />
                <Text className="text-xl font-semibold text-primary flex-1 text-center">Hospital Details</Text>
            </View>

            <CustomKeyboardView>
                {isFetchingHospital && <Loading />}
                {isErrorHospital && <Text className="text-red-500 text-center">Error loading hospital data.</Text>}

                <View className="bg-white mx-1 flex-1">
                    {!isFetchingHospital && !isErrorHospital && (
                        <>
                            <View style={{ position: 'relative' }}>
                                <Image source={banner} style={{ height: 200 }} />
                            </View>

                            <View className="w-full max-w-7xl mx-auto px-5 -mt-20 bg-white rounded-lg flex-1">

                                <View className="flex items-center justify-center mt-4">
                                    <Image source={{ uri: hospitalData.logo_url }} alt={hospitalData.name} resizeMode='contain' style={{ position: 'absolute', top: -100, height: 150, width: 150, objectFit: 'cover', borderRadius: 100, backgroundColor: 'white' }} />
                                </View>

                                <View className="flex items-center justify-center gap-3 mb-5" style={{ marginTop: 70 }}>
                                    <View className="items-center">
                                        <Text className="font-bold text-xl text-primary text-center">{hospitalData.name}</Text>
                                        <Text className="text-gray-600">City: {hospitalData.city}</Text>
                                    </View>
                                </View>

                                <View className="border-t border-gray-200 my-4" />
                                <Text className="text-lg mb-4 font-semibold text-primary">Doctors at {hospitalData.name}:</Text>

                                {isFetchingDoctors ? (
                                    <Loading />
                                ) : isErrorDoctors ? (
                                    <Text className="text-center mt-4 text-red-500">Error: {errorDoctors.message}</Text>
                                ) : (
                                    <View className="mb-6">
                                        <Text className="text-gray-700 mb-4"> Showing {startResult}-{endResult} of {dataCount} results</Text>
                                        {doctors.length > 0 ? (
                                            <View>
                                                {doctors.map((doctor) => (
                                                    <DoctorCard key={doctor.id} doctor={doctor} />
                                                ))}
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
                                            </View>
                                        ) : (
                                            <Text className="text-center text-gray-600 col-span-3">No doctors available at this hospital.</Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </CustomKeyboardView>
        </>
    );
}
