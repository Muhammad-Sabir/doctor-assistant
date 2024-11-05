import React from 'react';
import { View, Text } from 'react-native';
import { StarIcon } from 'lucide-react-native';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import UpdateReview from '@/components/modals/UpdateReview';
import DeleteItem from '@/components/modals/DeleteItem';

const ReviewCard = ({ review }) => {

    const { fetchWithUserAuth } = useAuth();

    const { data } = useFetchQuery({
        url: `doctors/${review.doctor}`,
        queryKey: ['reviewedDoctor', review],
        fetchFunction: fetchWithUserAuth,
    });

    const doctorName = data?.name || 'Doctor';

    return (

        <View className="p-4 bg-white border border-gray-300 rounded-md mb-4">
            <Text className="text-base text-gray-600">Reviewed {doctorName}</Text>
            <View className="flex flex-row mt-3 mb-1 gap-1">
                {Array(review.rating).fill(0).map((_, index) => (
                    <StarIcon key={index} color={'orange'} size={17} />
                ))}
            </View>
            <Text className="font-medium text-primary mt-1 text-md mb-2">{review.comment}</Text>

            <View className="flex flex-row justify-between items-center">
                <Text className="text-sm text-gray-400">
                    Reviewed on {new Date(review.created_at).toLocaleDateString()}
                </Text>
                <View className="flex flex-row items-center gap-2">
                    <UpdateReview doctorName={doctorName} review={review}/>
                    <DeleteItem deleteUrl={`reviews/${review.id}/`} itemName={"Review"} iconSize={15} queryKey={'myReviews'}/>
                </View>
            </View>
        </View>
    );
};

export default ReviewCard;
