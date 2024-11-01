import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { StarIcon, Stethoscope, GraduationCap, CircleCheckBig, CalendarDays } from 'lucide-react-native';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import banner from "@/assets/images/profileBanner.webp";
import ListGrid from '@/components/shared/ListGrid';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import HospitalCard from '@/components/shared/HospitalCard';
import AddReviewModal from '@/components/modals/AddReview';
import BookAppointment from '@/components/modals/BookAppointment';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import Loading from '@/components/shared/Loading';

export default function DoctorDetail() {

    const { id } = useLocalSearchParams();
    const { fetchWithUserAuth } = useAuth();

    const { data, isFetching, isError, error } = useFetchQuery({
        url: `doctors/${id}`,
        queryKey: ['doctorDetails', id],
        fetchFunction: fetchWithUserAuth,
    });

    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    const getDoctorImageUrl = (file_url) => {
        if (file_url?.startsWith('/media')) {
            return `${baseUrl}${file_url}`;
        }
        return file_url;
    };

    return (
        <>
            <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: 65, marginTop: 40 }}>
                <HeaderBackButton />
                <Text className="text-xl font-semibold text-primary flex-1 text-center">Doctor Details</Text>
            </View>

            <CustomKeyboardView>
                <View className="flex-1 bg-white">
                    {isFetching && <Loading />}
                    {isError && <Text className="text-red-500">Error: {error.message}</Text>}

                    {!isFetching && !isError && data && (
                        <View>
                            <View style={{ position: 'relative' }}>
                                <Image source={banner} style={{ height: 200 }} />
                            </View>

                            <View className="w-full max-w-7xl mx-auto px-5 -mt-20 bg-white rounded-lg">
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

                                    <BookAppointment doctorId={data.id} doctorName={data.name} />
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

                                <View className="border-t border-gray-200 my-4 mb-4" />
                                <View className="flex flex-row items-center justify-between">
                                    <Text className="text-md font-semibold text-primary mb-4 mt-2">Reviews</Text>
                                    <AddReviewModal doctorId={data.id} doctorName={data.name} />
                                </View>
                                <View className='mb-3'>
                                    {data.reviews.length > 0 ? (
                                        <View className="flex mt-4">
                                            {data.reviews.map((review) => (
                                                <View key={review.id} className="mb-5 p-4 bg-white border border-gray-300 rounded-md hover:border-primary">
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
                    )}
                </View>
            </CustomKeyboardView>
        </>
    );
}
