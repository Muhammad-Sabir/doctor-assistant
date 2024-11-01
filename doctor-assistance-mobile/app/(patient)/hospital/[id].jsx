import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import banner from "@/assets/images/profileBanner.webp";
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import DoctorCard from '@/components/shared/DoctorCard';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import Loading from '@/components/shared/Loading';

export default function HospitalDetail() {

    const { id } = useLocalSearchParams();
    const [page, setPage] = useState(1);
    const { fetchWithUserAuth } = useAuth();

    const { data: hospitalData, isFetching: isFetchingHospital, isError: isErrorHospital } = useFetchQuery({
        url: `hospitals/${id}`,
        queryKey: ['hospitalDetail', id],
        fetchFunction: fetchWithUserAuth,
    });

    const { data: doctorsData, isFetching: isFetchingDoctors, isError: isErrorDoctors } = useFetchQuery({
        url: `doctors?hospital_id=${id}&page=${page}`,
        queryKey: ['doctorsByHospital', id, page],
        fetchFunction: fetchWithUserAuth,
    });

    const doctors = doctorsData?.results || [];
    const nextPage = doctorsData?.next;
    const prevPage = doctorsData?.previous;

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => setPage((prev) => prev - 1);

    if (isFetchingHospital) {
        return <Loading />;
    }

    if (isErrorHospital) {
        return <Text className="text-red-500 text-center">Error loading hospital data.</Text>;
    }

    return (
        <>
            <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: 65, marginTop: 40 }}>
                <HeaderBackButton />
                <Text className="text-xl font-semibold text-primary flex-1 text-center">Hospital Details</Text>
            </View>
            <CustomKeyboardView>
                <View className="bg-white mx-1">
                    <View style={{ position: 'relative' }}>
                        <Image source={banner} style={{ height: 200 }} />
                    </View>

                    <View className="w-full max-w-7xl mx-auto px-5 -mt-20 bg-white rounded-lg shadow-md">
                        <View className="flex items-center justify-center mt-4">
                            <Image source={{ uri: hospitalData.logo_url }}
                                alt={hospitalData.name} resizeMode='contain'
                                style={{ position: 'absolute', top: -100, height: 150, width: 150, objectFit: 'cover', borderRadius: 100, backgroundColor: 'white' }}
                            />
                        </View>

                        <View className="flex items-center justify-center gap-3 mb-5" style={{ marginTop: 70 }}>
                            <View className="items-center">
                                <Text className="font-bold text-xl text-primary text-center">{hospitalData.name}</Text>
                                <Text className="text-gray-600">City: {hospitalData.city}</Text>
                            </View>
                        </View>

                        <View className="border-t border-gray-200 my-4" />
                        <Text className="text-md mb-4 font-semibold text-primary">Doctors at {hospitalData.name}:</Text>

                        {isFetchingDoctors ? (
                            <Loading/>
                        ) : (
                            <View className="mb-6">
                                {doctors.length > 0 ? (
                                    <View>
                                        {doctors.map((doctor) => (
                                            <DoctorCard key={doctor.id} doctor={doctor} />
                                        ))}

                                        <View className="flex flex-row justify-between items-center mt-4 mb-5">
                                            <TouchableOpacity
                                                className={`px-4 py-2 bg-blue-500 rounded ${!prevPage && 'bg-gray-300'}`}
                                                onPress={handlePrevPage} disabled={!prevPage}>
                                                <Text className="text-white">Previous</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                className={`px-4 py-2 bg-blue-500 rounded ${!nextPage && 'bg-gray-300'}`}
                                                onPress={handleNextPage}
                                                disabled={!nextPage}
                                            >
                                                <Text className="text-white">Next</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <Text className="text-center text-gray-600 col-span-3">No doctors available at this hospital.</Text>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </CustomKeyboardView>
        </>
    );
}
