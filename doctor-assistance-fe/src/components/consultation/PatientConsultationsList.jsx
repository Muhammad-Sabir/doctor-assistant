import React from 'react';
import { Link } from 'react-router-dom';
import { TbClockCheck, TbClockEdit } from "react-icons/tb";

import { fetchWithAuth } from '@/utils/fetchApis';
import { formatDate } from '@/utils/date';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { MdOutlineDateRange } from 'react-icons/md';

export default function PatientConsultationsList({ patientId, truncate = false }) {
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
                        to={`/doctor/consultation/${patientId}/${consultation.id}/${consultation.appointment}`}
                        state={{ patientName: consultation.patient_name }}
                    >
                        <div className="p-3 bg-white border border-gray-300 rounded-md hover:shadow-md hover:border-primary transition-shadow">
                            <h3 className={`text-sm font-semibold text-primary mb-1 -mt-1 ${truncate ? 'block w-32 truncate' : ''}`}>
                                {consultation.title}
                            </h3>
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
