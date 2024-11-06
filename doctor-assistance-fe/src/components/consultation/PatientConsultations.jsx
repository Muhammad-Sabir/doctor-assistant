import React from 'react';
import { Link } from 'react-router-dom';
import { TbClockCheck, TbClockEdit } from "react-icons/tb";

import { fetchWithAuth } from '@/utils/fetchApis';
import { formatDate } from '@/utils/date';
import { useFetchQuery } from '@/hooks/useFetchQuery';

export default function PatientConsultations({ patientId, truncate = false }) {
    const { data, isFetching, isError, error } = useFetchQuery({
        url: `consultations?patient_id=${patientId}`,
        queryKey: ['patientConsultations'],
        fetchFunction: fetchWithAuth,
    });

    const patientConsultations = data?.results || [];

    if (isFetching) return <div className="text-gray-500 text-sm">Loading...</div>;

    if (isError) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <>
            {patientConsultations && patientConsultations.length > 0 ? (
                patientConsultations.map(consultation => (
                    <Link 
                        key={consultation.id}
                        to={`/doctor/consultation/${patientId}/${consultation.id}`}
                        state= {{ patientName: consultation.patient_name }}
                    >
                        <div className="p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-primary transition-shadow">
                            <h3 className={`font-semibold text-sm text-primary mb-2 ${truncate ? 'block w-32 truncate' : ''}`}>
                                {consultation.title}
                            </h3>
                            <p className="text-sm flex items-center gap-2 text-gray-600">
                                <TbClockCheck /> {truncate ? formatDate(consultation.created_at) : `Created on: ${formatDate(consultation.created_at)}`}
                            </p>
                            <p className="text-sm flex items-center gap-2 mt-1 text-gray-600">
                                <TbClockEdit /> {truncate ? formatDate(consultation.updated_at) : `Last updated: ${formatDate(consultation.updated_at)}`}
                            </p>
                        </div>
                    </Link>
                ))
            ) : (
                <p className="text-gray-600 text-sm">No consultations found for this patient.</p>
            )}
        </>
    );
}
