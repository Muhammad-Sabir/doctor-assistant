import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { StarIcon, Stethoscope, GraduationCap, CircleCheckBig, CalendarDays } from 'lucide-react-native';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import banner from "@/assets/images/profileBanner.webp";
import ListGrid from '@/components/shared/ListGrid';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import HospitalCard from '@/components/shared/HopsitalCard';

export default function DoctorDetail() {
    const { id } = useLocalSearchParams();

    const { data, isFetching, isError, error } = useFetchQuery({
        url: `doctors/${id}`,
        queryKey: ['doctorDetails', id],
        fetchFunction: fetchWithAuth,
    });

    if (isFetching) return <Text>Loading....</Text>;
    if (isError) return <Text className="text-red-500">Error: {error.message}</Text>;

    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    const getDoctorImageUrl = (file_url) => {
        if (file_url?.startsWith('/media')) {
            return `${baseUrl}${file_url}`;
        }
        return file_url;
    };

    return (
        <CustomKeyboardView>
            <View className="bg-white mx-1">
                <View style={{ position: 'relative' }}>
                    <Image source={banner} style={{ height: 200 }} />
                </View>

                <View className="w-full max-w-7xl mx-auto px-4 -mt-20 bg-white rounded-lg shadow-md">
                    <View className="flex items-center justify-center mt-4">
                        <Image source={{ uri: getDoctorImageUrl(data.file_url) }}
                            alt={data.name} resizeMode='contain'
                            style={{ position: 'absolute', top: -100, height: 150, width: 150, objectFit: 'cover', borderRadius: 100, backgroundColor: 'white' }}
                        />
                    </View>

                    <View className="flex items-center justify-center gap-3 mb-5" style={{ marginTop: 70 }}>
                        <View className="items-center">
                            <Text className="font-bold text-xl text-primary text-center">{data.name}</Text>
                            <View className="flex flex-col lg:flex-row lg:gap-3 mt-2 items-center text-sm text-gray-500">
                                <View className="flex flex-row items-center gap-2">
                                    <CalendarDays color='grey' size={17} className="mr-1" />
                                    <Text className='text-gray-600'>{data.date_of_experience ? `${new Date().getFullYear() - new Date(data.date_of_experience).getFullYear()} years of experience` : 'N/A'}</Text>
                                </View>
                                <View className="flex flex-row items-center mt-2 gap-1">
                                    <StarIcon color={'orange'} size={17} />
                                    <Text className="text-primary">{data.average_rating}</Text>
                                    <Text className="text-gray-500">({data.total_reviews} reviews)</Text>
                                </View>
                            </View>
                        </View>

                        <View className="flex flex-row items-center justify-center gap-4">
                            <TouchableOpacity className="mt-4 bg-primary text-primary justify-center items-center px-4 h-10 rounded-md p-2">
                                <Text className="text-white font-bold">Visit Clinic</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="mt-4 justify-center items-center h-10 rounded-md p-2 px-4" style={{ backgroundColor: 'rgb(219 234 254)' }}>
                                <Text className="text-primary font-bold">Consult Online</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="border-t border-gray-200 my-4" />

                    <Text className="text-md font-semibold text-primary">Specialties</Text>
                    <ListGrid data={data.specialities} icon={Stethoscope} color="red" />

                    <View className="border-t border-gray-200 my-4" />
                    <Text className="text-md font-semibold text-primary">Affiliated Hospitals</Text>
                    <View className="grid gap-4 lg:grid-cols-2 mt-4">
                    {data.hospitals.length > 0 ? (
                        data.hospitals.map((hospital) => (
                            <HospitalCard hospital={hospital} key={hospital.id} />
                        ))
                    ) : (
                        <Text className="text-gray-600 text-sm">N/A</Text>
                    )}
                </View> 

                    <View className="border-t border-gray-200 my-4" />
                    <Text className="text-md font-semibold text-primary">Degrees</Text>
                    <ListGrid data={data.degrees} icon={GraduationCap} color="purple" />

                    <View className="border-t border-gray-200 my-4" />
                    <Text className="text-md font-semibold text-primary">Diseases Treated</Text>
                    <ListGrid data={data.diseases} icon={CircleCheckBig} color="green" />

                    <View className="border-t border-gray-200 my-4 mb-3" />
                    <View className="flex flex-row items-center justify-between">
                        <Text className="text-md font-semibold text-primary mb-4 mt-2">Reviews</Text>
                        <TouchableOpacity className=" bg-primary text-primary justify-center items-center px-4 h-10 rounded-md p-2">
                            <Text className="text-white font-bold">Add Review</Text>
                        </TouchableOpacity>
                    </View>
                    <View className='mb-3'>
                        {data.reviews.length > 0 ? (
                            <View className="flex mt-3">
                                {data.reviews.map((review) => (
                                    <View key={review.id} className="mb-5 p-4 bg-white border border-gray-300 rounded-md shadow hover:border-primary">
                                        <View className="flex flex-row justify-between">
                                            <View className="flex flex-row items-center mb-3">
                                                {Array(review.rating).fill(0).map((_, index) => (
                                                    <StarIcon key={index} color={'orange'} size={17} />
                                                ))}
                                            </View>
                                            <Text className="text-sm text-gray-400"> <Text>Reviewed on </Text>{new Date(review.created_at).toLocaleDateString()} </Text>
                                        </View>
                                        <Text className="font-medium text-gray-600 text-md mb-2">{review.comment}</Text>
                                        <Text className="text-sm text-primary"> <Text>Reviewed by </Text>{review.patient_name}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text className="text-gray-600 text-sm">Not reviewed yet.</Text>
                        )}
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    );
}