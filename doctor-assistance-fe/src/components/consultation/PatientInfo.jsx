import React from 'react';
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";

import { fetchWithAuth } from '@/utils/fetchApis';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { calculateAge } from '@/utils/date';

export default function PatientInfo({ patientId }) {
    const { data: patientData, isFetching, isError, error } = useFetchQuery({
        url: `patients/${patientId}`,
        queryKey: ['patientDetails'],
        fetchFunction: fetchWithAuth,
    });

    console.log(patientId)
    if (isFetching) return <div className="text-gray-500 text-sm">Loading....</div>;
    if (isError) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <>
            {patientData && !isFetching ? (
                <p className="font-normal px-1.5 text-gray-500 text-sm">
                    <span className="leading-6 block w-32 truncate lg:w-full">Name: {patientData.name}</span>
                    <span className='leading-6 block'>Patient ID: {patientData.id}</span>
                    <span className='leading-6 block'>Age: {calculateAge(patientData.date_of_birth)}</span>
                    <span className='leading-6 flex'>
                        Gender:
                        {patientData.gender === 'F' ? (
                            <><BsGenderFemale className='mx-1 mt-1.5 text-pink-700' /> Female </>
                        ) : (
                            <><BsGenderMale className='mx-1 mt-1.5 text-blue-700' /> Male </>
                        )}
                    </span>
                </p>
            ) : (
                <p className="text-gray-600 text-sm">Patient Data Not Found</p>
            )}
        </>
    );
}
