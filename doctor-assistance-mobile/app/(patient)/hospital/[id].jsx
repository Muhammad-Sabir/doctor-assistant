import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import banner from "@/assets/images/profileBanner.webp";
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import DoctorCard from '@/components/shared/DoctorCard';

export default function HospitalDetail() {
    const { id } = useLocalSearchParams();
    console.log(id)

    const [page, setPage] = useState(1);

    const { data: hospitalData, isFetching: isFetchingHospital, isError: isErrorHospital } = useFetchQuery({
        url: `hospitals/${id}`,
        queryKey: ['hospitalDetail', id],
        fetchFunction: fetchWithAuth,
    });

    const { data: doctorsData, isFetching: isFetchingDoctors, isError: isErrorDoctors } = useFetchQuery({
        url: `doctors?hospital_id=${id}&page=${page}`,
        queryKey: ['doctorsByHospital', id, page],
        fetchFunction: fetchWithAuth,
    });

    const doctors = doctorsData?.results || [];
    const nextPage = doctorsData?.next;
    const prevPage = doctorsData?.previous;

    const handleNextPage = () => {
        setPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        setPage((prev) => prev - 1);
    };

    if (isFetchingHospital || isFetchingDoctors) {
        return <Text>Loading....</Text>;
    }

    if (isErrorHospital || isErrorDoctors) {
        return <div className="text-center py-10">Some Error Occured</div>;
    }

    return (
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
                            <View className="flex mt-2 items-center text-sm text-gray-500">
                                <View className="flex flex-row items-center gap-2">
                                    <Text className='text-gray-600'>City: {hospitalData.city}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="border-t border-gray-200 my-4" />
                    <Text className="text-md mb-4 font-semibold text-primary">Doctors at {hospitalData.name}:</Text>
                    
                    <View className='mb-6'>
                        {doctors.length > 0 ? (
                            <View>
                                <View>
                                    {doctors.map((doctor) => (
                                        <DoctorCard key={doctor.id} doctor={doctor} />
                                    ))}
                                </View>

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
                </View>
            </View>
        </CustomKeyboardView>
    );
}