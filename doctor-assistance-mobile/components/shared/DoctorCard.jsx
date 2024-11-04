import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';

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
        <TouchableOpacity
            onPress={() => router.push(`/(patient)/doctor/${doctor.id}`)}
            className="flex-row items-center border border-gray-300 rounded-md px-4 mb-4 bg-white"
            style={{height: 150}}
        >
            <View className="mr-4 items-center justify-center">
                <Image
                    source={{ uri: getDoctorImageUrl(doctor.file_url) }} alt={doctor.name}
                    style={{ height: 80, width: 80, borderRadius: 40, marginRight: 15 }}
                />

                <View className="mt-4 text-xs font-medium flex-row items-center rounded-md px-3 bg-orange-100 py-1" style={{ marginLeft: -10 }}>
                    <Star size={16} color="orange" />
                    {doctor.average_rating > 0 && doctor.total_reviews > 0 ? (
                        <View className='flex-row'>
                            <Text className="text-primary text-sm font-semibold ml-1"> {doctor.average_rating}</Text>
                            <Text className="text-gray-500 text-sm ml-1">({doctor.total_reviews})</Text>
                        </View>
                    ) : (
                        <Text className="text-primary text-sm font-semibold ml-1">N/A</Text>
                    )}
                </View>
            </View>

            <View className="flex-1">
                <Text className="text-md font-bold text-primary" numberOfLines={1} ellipsizeMode="tail" style={{ width: 250 }}>
                    {doctor.name}
                </Text>
                <Text className="text-md text-gray-600" numberOfLines={1} ellipsizeMode="tail" style={{ width: 250 }}>
                    {doctor.specialities.length > 0 ? doctor.specialities.map(s => s.name).join(', ') : 'N/A'}
                </Text>
                <Text className="text-sm text-gray-500 mt-2" numberOfLines={1} ellipsizeMode="tail" style={{ width: 250 }}>
                    Treats: {doctor.diseases.length > 0 ? doctor.diseases.map(d => d.name).join(', ') : 'N/A'}
                </Text>
                <Text className="text-sm text-gray-500" numberOfLines={1} ellipsizeMode="tail" style={{ width: 250 }}>
                    Degrees: {doctor.degrees.length > 0 ? doctor.degrees.map(d => d.name).join(', ') : 'N/A'}
                </Text>
                <Text className="mt-4 font-medium text-sm px-4 rounded-md bg-emerald-50 text-emerald-600" style={{ paddingVertical: 3, width: 160 }}>
                    {doctor.date_of_experience ?
                        `${new Date().getFullYear() - new Date(doctor.date_of_experience).getFullYear()} years of experience`
                        : 'N/A'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default DoctorCard;
