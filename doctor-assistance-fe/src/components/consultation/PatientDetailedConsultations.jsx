import React from 'react';
import { fetchWithAuth } from '@/utils/fetchApis';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import DoctorConsultationCard from '@/components/shared/DoctorConsultationCard';

export default function PatientDetailedConsultations({ patientId }) {

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
                    <DoctorConsultationCard key={consultation.id} consultation={consultation} />
                ))
            ) : (
                <p className="text-gray-600 text-sm">No consultations found for this patient.</p>
            )}
        </>
    );
}
