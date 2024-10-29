import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import ReviewCard from '@/components/shared/ReviewCard';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';

const MyReviews = () => {

  const { fetchWithUserAuth } = useAuth();

  const { data, isFetching, isError, error } = useFetchQuery({
    url: `reviews/me/`,
    queryKey: ['myReviews'],
    fetchFunction: fetchWithUserAuth,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = data?.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = data ? Math.ceil(data.length / reviewsPerPage) : 0;

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };


  return (
    <CustomKeyboardView>
      <View className="px-5 pb-4 bg-white">
        <Text className="text-xl font-semibold text-primary my-3 mb-4">My Reviews History:</Text>

        {isFetching ? (
          <ActivityIndicator size="large" color="#6200EE" />
        ) : isError ? (
          <Text className="text-red-500">Error fetching reviews: {error.message}</Text>
        ) : data && data.length > 0 ? (
          <View>
            <View>
              {currentReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </View>

            <View className="flex flex-row justify-between items-center mt-4 mb-5">
              <TouchableOpacity
                className={`px-4 py-2 bg-blue-500 rounded`}
                onPress={handlePrevPage} disabled={currentPage === 1} >
                <Text className="text-white">Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-4 py-2 bg-blue-500 rounded`}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Text className="text-white">Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text className="text-gray-600 text-sm">No reviews by you yet.</Text>
        )}
      </View>
    </CustomKeyboardView>
  );
};

export default MyReviews;
