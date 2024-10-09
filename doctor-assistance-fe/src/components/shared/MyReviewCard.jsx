import React from 'react';
import { FaStar } from 'react-icons/fa';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import DeleteItemDialog from '@/components/dialogs/DeleteItemDialog';
import UpdateReview from '@/components/dialogs/UpdateReview';

export default function MyReviewCard({ review }) {

    const { data } = useFetchQuery({
        url: `doctors/${review.doctor}`,
        queryKey: ['reviewedDoctor', review],
        fetchFunction: fetchWithAuth,
    });

    const doctorName = data?.name || 'Doctor'

    return (
        <div className="relative p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-primary transition-shadow">
            <p className="text-sm text-primary"><span className='inline-block mr-1'>Reviewed {doctorName}</span> </p>
            <div className="flex items-center mt-2 mb-1">
                {Array(review.rating).fill(0).map((_, index) => (
                    <FaStar key={index} className="text-yellow-400 mr-1" />
                ))}
            </div>
            <p className="font-medium text-gray-600 text-sm mb-2">{review.comment}</p>

            <div className='flex justify-between items-center'>
                <p className="text-xs text-gray-400">
                    <span className='hidden sm:inline-block mr-1'>Reviewed on</span>
                    {new Date(review.created_at).toLocaleDateString()}
                </p>
                <span className='flex items-center text-xs text-gray-600 -mt-1' >
                    <DeleteItemDialog deleteUrl={`reviews/${review.id}/`} itemName={"Review"} iconSize={16}/>
                    <UpdateReview doctorName={doctorName} review={review}/>
                </span>
            </div>
        </div>
    );
}
