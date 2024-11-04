import React from 'react';
import { View, Text, Dimensions } from 'react-native';;

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import ReviewCard from '@/components/shared/ReviewCard';
import Loading from '@/components/shared/Loading';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';

const MyReviews = () => {

  const { fetchWithUserAuth } = useAuth();
  const screenWidth = Dimensions.get('window').width;

  const { data, isFetching, isError, error } = useFetchQuery({
    url: `reviews/me/`,
    queryKey: ['myReviews'],
    fetchFunction: fetchWithUserAuth,
  });
 
  return (
    <>
      <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: screenWidth * 0.14, marginTop: screenWidth * 0.09 }}>
        <HeaderBackButton />
        <Text className="text-xl font-semibold text-primary flex-1 text-center">My Reviews</Text>
      </View>

      <CustomKeyboardView>
        <View className="flex-1 px-5 py-5 bg-white">
          {isFetching ? (
            <Loading/>
          ) : isError ? (
            <Text className="text-red-500">Error fetching reviews: {error.message}</Text>
          ) : data && data.length > 0 ? (
            <View>
              <View>
                {data.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </View>
            </View>
          ) : (
            <Text className="text-gray-600 text-md text-center">No reviews by you yet.</Text>
          )}
        </View>
      </CustomKeyboardView>
    </>
  );
};

export default MyReviews;
