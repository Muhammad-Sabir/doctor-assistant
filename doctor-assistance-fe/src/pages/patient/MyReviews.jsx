import React, { useState } from 'react';
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

import { Button } from '@/components/ui/button';

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

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = data?.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = data ? Math.ceil(data.length / reviewsPerPage) : 0;

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  if (isFetching) return <Loading />;
  if (isError) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className='px-2 pb-4'>
      <h2 className="text-md font-medium text-primary mb-4">My Review History:</h2>
      {data && data.length > 0 ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2 mt-2">
            {currentReviews.map((review) => (
              <MyReviewCard key={review.id} review={review} />
            ))}
          </div>

          {data.length > 4 && (
            <div className="flex justify-center gap-3.5 mt-8">
              <Button variant='outline' onClick={handlePreviousPage} disabled={currentPage === 1}>
                <FaAnglesLeft className='mr-1' />Prev
              </Button>
              <Button variant='outline' onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next <FaAnglesRight className='ml-1 mt-0.5' />
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600 text-sm">No reviews by you yet.</p>
      )}
    </div>
  );
}
