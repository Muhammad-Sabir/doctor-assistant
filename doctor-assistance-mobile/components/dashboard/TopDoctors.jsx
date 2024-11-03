import React from 'react';
import { FlatList, Dimensions, View, Text } from 'react-native';
import { useFetchQuery } from '@/hooks/useFetchQuery';

import { useAuth } from '@/contexts/AuthContext';
import DoctorCard from '@/components/shared/DoctorCard';
import Loading from '@/components/shared/Loading';

const TopDoctors = () => {

    const { fetchWithUserAuth } = useAuth();

    const { data, isFetching, isError, error } = useFetchQuery({
        url: 'doctors?average_rating_min=3&average_rating_max=5',
        queryKey: ['topRatedDoctors'],
        fetchFunction: fetchWithUserAuth,
    });

    const topDoctors = data?.results?.sort((a, b) => b.average_rating - a.average_rating).slice(0, 5);

    const renderItem = ({ item }) => (
        <DoctorCard doctor={item} />
    );

    return (
        <View style={{ height: 170 }}> 
            {isFetching ? (
                <Loading />
            ) : isError ? (
                <Text className="text-center mt-4 text-red-500">Error: {error.message}</Text>
            ) : topDoctors && topDoctors.length > 0 ? (
                <FlatList
                    data={topDoctors}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                    decelerationRate="fast"
                    snapToInterval={Dimensions.get('window').width / 3.5}
                    snapToAlignment="center"
                />
            ) : (
                <Text className="text-gray-600 text-sm text-center mt-4">
                    No Top Rated Doctors yet.
                </Text>
            )}
        </View>
    );
};

export default TopDoctors;
