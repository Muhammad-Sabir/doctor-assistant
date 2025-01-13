import React from 'react'

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import Loading from '@/components/shared/Loading';
import DoctorConsultationCard from '@/components/shared/DoctorConsultationCard';

export default function MyAllConsultations() {

    const { data, isFetching, isError, error } = useFetchQuery({
        url: `consultations/?completed=false`,
        queryKey: ['doctorConsultations'],
        fetchFunction: fetchWithAuth,
    });

    const consultations = data?.results || [];

    return (
        <div className='mx-2 pb-2'>
            <h2 className="text-md font-medium text-primary mb-2">My Pending Consultations:</h2>
            <p className="text-gray-600 text-sm mb-4">Keep Track of your consultations.</p>

            <hr className="border-t border-gray-300 mt-4 mb-5" />

            {isFetching ? (<Loading />
            ) : isError ? (<p className='text-primary'>Error fetching reviews: {error.message}</p>
            ) : consultations && consultations.length > 0 ? (
                <>
                    <div className="grid gap-4 lg:grid-cols-2 mt-2">
                        {consultations.map((consultation) => (
                            <DoctorConsultationCard key={consultation.id} consultation={consultation} />
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-gray-600 text-sm">No pending consultations.</p>
            )}
        </div>
    )
}
