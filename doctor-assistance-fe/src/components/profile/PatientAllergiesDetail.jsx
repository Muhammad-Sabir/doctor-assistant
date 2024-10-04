import React, { useEffect, useState } from 'react';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import Loading from '@/components/shared/Loading';

export default function PatientAllergiesDetail({ patientData }) {
    const [patientId, setPatientId] = useState(null);
    const [patientAllergies, setPatientAllergies] = useState([]);
    const [dependentsAllergies, setDependentsAllergies] = useState([]);

    useEffect(() => {
        if (patientData) {
            const patientDetail = patientData.results[0]?.id;
            setPatientId(patientDetail);
        }
    }, [patientData]);

    const { data: allergiesData, isFetching, isSuccess: allergiesSuccess, isError, error } = useFetchQuery({
        url: 'patient-allergies/',
        queryKey: ['patientAllergies'],
        fetchFunction: fetchWithAuth,
    });

    useEffect(() => {
        if (allergiesSuccess && allergiesData) {
            const filteredPatientAllergies = allergiesData.results.filter(allergy => allergy.patient.id === patientId);
            const filteredDependentAllergies = allergiesData.results.filter(allergy => allergy.patient.id !== patientId);

            setPatientAllergies(filteredPatientAllergies);
            setDependentsAllergies(filteredDependentAllergies);
        }
    }, [allergiesSuccess, allergiesData, patientId]);

    const groupedOtherAllergies = dependentsAllergies.reduce((acc, allergy) => {
        const patientId = allergy.patient.id;
        if (!acc[patientId]) {
            acc[patientId] = {
                id: patientId,
                name: allergy.patient.name,
                allergies: [],
            };
        }
        acc[patientId].allergies.push(allergy.allergy.name);
        return acc;
    }, {});

    if (isFetching) {
        return (
            <Loading />
        );
    }

    if (isError) {
        return <p className='text-primary'>Error fetching patient profile: {error.message}</p>;
    }

    return (
        <div className="w-full">
            <h2 className="text-sm font-medium text-primary mb-3">Your Allergies:</h2>
            {patientAllergies.length > 0 ? (
                <div className="mb-4">
                    {patientAllergies.map(allergy => (
                        <span key={allergy.id} className="m-1 py-1 px-2 bg-accent rounded-md inline-block text-xs font-medium text-primary text-center">
                            {allergy.allergy.name}
                        </span>
                    ))}
                </div>
            ) : (
                <p className='text-sm text-gray-600 mb-4'>No allergies found for this patient.</p>
            )}

            <h2 className="text-sm font-medium text-primary mb-4">Dependent Patients Allergies:</h2>

            {Object.values(groupedOtherAllergies).length > 0 ? (
                <>
                    <div className="hidden sm:grid grid-cols-3 gap-4 border-b border-gray-200 pb-3">
                        <div className="text-sm font-medium text-gray-700">ID</div>
                        <div className="text-sm font-medium text-gray-700">Name</div>
                        <div className="text-sm font-medium text-gray-700">Allergies</div>
                    </div>

                    {Object.values(groupedOtherAllergies).map(({ id, name, allergies }) => (
                        <div key={id} className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-4 border sm:border-t 
                        sm:border-l-0 sm:border-r-0 sm:border-b-0 border-gray-300 py-2 px-4 sm:px-0 rounded-md sm:rounded-none my-5 sm:my-0">
                            <div className="text-sm font-normal text-gray-500 flex items-center">
                                <span className="block sm:hidden mr-1">Patient ID:</span>{id}
                            </div>
                            <div className="font-bold text-md text-primary sm:text-sm sm:font-normal sm:text-gray-600 flex items-center">
                                {name}
                            </div>
                            <div className="text-sm font-normal mt-2 sm:mt-0">
                                {allergies.map((allergy, index) => (
                                    <span key={allergy} className="m-1 py-1 px-2 bg-accent rounded-md inline-block text-xs font-medium text-primary text-center min-w-fit">
                                        {allergy}
                                        {index < allergies.length - 1 && ', '}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <p className="text-gray-600 text-sm">No allergies found for dependents.</p>
            )}
        </div>
    );
}
