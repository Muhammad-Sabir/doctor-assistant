import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import DoctorCard from '@/components/shared/DoctorCard';

const TopDoctors = () => {

    const { fetchWithUserAuth } = useAuth();

    const { data, isFetching, isError, error } = useFetchQuery({
        url: 'doctors?average_rating_min=3&average_rating_max=5',
        queryKey: ['topRatedDoctors'],
        fetchFunction: fetchWithUserAuth,
    });

    const topDoctors = data?.results?.sort((a, b) => b.average_rating - a.average_rating).slice(0, 5);

    return (
        <View>
            {isFetching ? (
                <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="hsl(203, 87%, 30%)" />
                    <Text className="text-gray-500 ml-2">Loading Doctors....</Text>
                </View>
            ) : isError ? (
                <Text className="text-center mt-4 text-red-500">Error: {error.message}</Text>
            ) : topDoctors && topDoctors.length > 0 ? (
                topDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))
            ) : (
                <Text className="text-gray-600 text-sm text-center mt-4">
                    No Top Rated Doctors yet.
                </Text>
            )}
        </View>
    );
};

export default TopDoctors;
