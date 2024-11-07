import React from 'react';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import MyReviewCard from '@/components/shared/MyReviewCard';
import Loading from '@/components/shared/Loading';

export default function MyReviews() {

  const { data, isFetching, isError, error } = useFetchQuery({
    url: `reviews/me/`,
    queryKey: ['myReviews'],
    fetchFunction: fetchWithAuth,
  });
 
  return (
    <div className='px-2 pb-4'>
      <h2 className="text-md font-medium text-primary mb-4">My Review History:</h2>

      {isFetching ? ( <Loading />
      ) : isError ? ( <p className='text-primary'>Error fetching reviews: {error.message}</p>
      ) : data && data.length > 0 ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2 mt-2">
            {data.map((review) => (
              <MyReviewCard key={review.id} review={review} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-sm">No reviews by you yet.</p>
      )}
    </div>
  );
}
