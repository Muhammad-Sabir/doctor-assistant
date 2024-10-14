import React from 'react';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import DoctorCard from '@/components/shared/DoctorCard';
import Loading from '@/components/shared/Loading';
import DoctorSearchBar from '@/components/dashboard/DoctorSearchBar';

export default function DoctorsList() {

    const { data, isFetching, isError, error } = useFetchQuery({
        url: 'doctors?average_rating_min=3&average_rating_max=5',
        queryKey: ['topRatedDoctors'],
        fetchFunction: fetchWithAuth,
    });

    const topDoctors = data?.results?.sort((a, b) => b.average_rating - a.average_rating).slice(0, 5);

    return (
        <div className="mx-1 pb-2">
            <DoctorSearchBar />
            <h2 className="text-md font-medium text-primary mb-4 mt-6">Top Medical Specialists:</h2>

            {isFetching ? (<Loading />
            ) : isError ? (<p className='text-primary'>Error fetching reviews: {error.message}</p>
            ) : topDoctors && topDoctors.length > 0  ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mx-auto max-w-screen-lg">
                    {topDoctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-sm">No top rated doctors yet.</p>
            )}
        </div>
    );
}
