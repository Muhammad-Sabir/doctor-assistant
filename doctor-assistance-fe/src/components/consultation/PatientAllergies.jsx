import React from 'react';

import { fetchWithAuth } from '@/utils/fetchApis';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import DeleteItem from '@/components/dialogs/DeleteItem';

export default function PatientAllergies({ patientId }) {

    const { data, isFetching, isError, error } = useFetchQuery({
        url: `patient-allergies?patient_id=${patientId}`,
        queryKey: ['patientAllergies'],
        fetchFunction: fetchWithAuth,
    });

    const patientAllergies = data?.results || []

    if (isFetching) { return <div className="text-gray-500 text-sm">Loading...</div>; }

    if (isError) { return <div className="text-red-500">Error: {error.message}</div>; }

    return (
        <>
            {patientAllergies && patientAllergies.length > 0 ? (
                patientAllergies.map(allergy => (
                    <span key={allergy.id} className="flex m-1 py-1 px-2 bg-accent rounded-md text-xs font-medium text-primary max-w-fit">
                        {allergy.allergy.name}
                        <DeleteItem deleteUrl={`patient-allergies/${allergy.id}/`} itemName={'Allergy'} iconSize={13} />
                    </span>
                ))
            ) : (
                <p className="text-gray-600 text-sm break-words">
                    No allergies recorded for this patient.
                </p>

            )}
        </>
    );
}
