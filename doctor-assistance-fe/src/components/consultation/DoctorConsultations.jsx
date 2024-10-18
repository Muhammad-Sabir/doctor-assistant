import React from 'react';
import { Link } from 'react-router-dom';
import { TbClockCheck, TbClockEdit } from "react-icons/tb";

import { fetchWithAuth } from '@/utils/fetchApis';
import { formatDate } from '@/utils/date';
import { useFetchQuery } from '@/hooks/useFetchQuery';

export default function DoctorConsultations() {
    const { data, isFetching, isError, error } = useFetchQuery({
        url: `consultations`,
        queryKey: ['doctorConsultations'],
        fetchFunction: fetchWithAuth,
    });

    const consultations = data?.results || [];

    if (isFetching) return <div className="text-gray-500 text-sm">Loading...</div>;
    if (isError) return <div className="text-red-500">Error: {error.message}</div>;

    const recentConsultations = consultations.slice(0, 2);

    return (
        <>
            {recentConsultations.length > 0 ? (
                recentConsultations.map(consultation => (
                    <Link key={consultation.id} to={`/doctor/consultation/${consultation.patient}/${consultation.id}`}>
                        <div className=" mb-5 p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-primary transition-shadow block">
                            <h3 className={`font-semibold text-sm text-primary mb-2 block w-56 truncate`}>
                                {consultation.title}
                            </h3>
                            <p className="text-sm flex items-center gap-2 text-gray-600">
                                <TbClockCheck /> {`${formatDate(consultation.created_at)}`}
                            </p>
                            <p className="text-sm flex items-center gap-2 mt-1 text-gray-600">
                                <TbClockEdit /> {`${formatDate(consultation.updated_at)}`}
                            </p>
                        </div>
                    </Link>
                ))
            ) : (
                <p className="text-gray-600 text-sm">You have no recent consultations yet.</p>
            )}
        </>
    );
}
