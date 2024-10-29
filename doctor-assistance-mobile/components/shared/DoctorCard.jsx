import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import BookAppointment from '@/components/modals/BookAppointment';

const DoctorCard = ({ doctor }) => {
    const router = useRouter();
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    const getDoctorImageUrl = (file_url) => {
        if (file_url?.startsWith('/media')) {
            return `${baseUrl}${file_url}`;
        }
        return file_url;
    };

    return (
        <View style={{ marginBottom: 17, padding: 17 }} className="border border-gray-300 rounded-md hover:shadow-md hover:border-primary transition-shadow duration-500 w-full max-w-[90vw] sm:max-w-[350px] mx-auto relative">
            <TouchableOpacity onPress={() => router.push(`/(patient)/doctor/${doctor.id}`)}>
                <View className="text-xs font-medium flex-row items-center rounded-md px-3 absolute top-0 right-0 bg-orange-100" style={{ paddingVertical: 3 }}>
                    <FontAwesome name="star" size={16} color="orange" />
                    <Text className="text-primary text-sm font-semibold ml-1" >{doctor.average_rating}</Text>
                    <Text className="text-gray-500 text-sm ml-1">({doctor.total_reviews})</Text>
                </View>

                <View className="flex justify-center items-center mb-4 mt-4">
                    <Image
                        source={{ uri: getDoctorImageUrl(doctor.file_url) }}
                        alt={doctor.name}
                        resizeMode='contain'
                        style={{ height: 120, width: 120, objectFit: 'cover', borderRadius: 100 }}
                    />
                </View>

                <View className="text-center">
                    <View className="flex justify-center items-center w-full">
                        <Text className="text-center text-base font-semibold text-primary w-90 sm:w-60 truncate">
                            {doctor.name}
                        </Text>
                    </View>
                    <View className="flex justify-center items-center w-full mt-1">
                        <Text className="font-normal text-md mt-2 leading-6 text-gray-500 text-center" numberOfLines={1} ellipsizeMode="tail" style={{width: 300}}>
                            Specialities<Text className="mx-1 inline"> - </Text>{doctor.specialities.length > 0 ? doctor.specialities.map(s => s.name).join(', ') : 'N/A'}
                        </Text>
                    </View>
                    <View className="flex justify-center items-center w-full mt-1">
                        <Text className="font-normal text-md leading-6 text-gray-500 text-center" numberOfLines={1} ellipsizeMode="tail" style={{width: 300 }}>
                            Treats<Text className="mx-1 inline"> - </Text>{doctor.diseases.length > 0 ? doctor.diseases.map(d => d.name).join(', ') : 'N/A'}
                        </Text>
                    </View>
                    <View className="flex justify-center w-full items-center mt-1">
                        <Text className="font-normal text-md leading-6 text-gray-500 text-center" numberOfLines={1} ellipsizeMode="tail" style={{width: 300 }}>
                            Degrees<Text className="mx-1 inline"> - </Text>{doctor.degrees.length > 0 ? doctor.degrees.map(d => d.name).join(', ') : 'N/A'}
                        </Text>
                    </View>

                    <View className="flex justify-center items-center mt-4">
                        <Text className="font-medium text-sm px-4 rounded-md bg-emerald-50 text-emerald-600" style={{ paddingVertical: 3 }}>
                            {doctor.date_of_experience ?
                                `${new Date().getFullYear() - new Date(doctor.date_of_experience).getFullYear()} years of experience`
                                : 'N/A'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <BookAppointment doctorId={doctor.id} doctorName={doctor.name} />
        </View>
    );
};

export default DoctorCard;
