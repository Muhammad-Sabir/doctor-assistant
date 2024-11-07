import React from 'react';
import { Link } from 'react-router-dom';
import { TbClockCheck, TbClockEdit } from "react-icons/tb";
import { FiEye } from 'react-icons/fi';

import { fetchWithAuth } from '@/utils/fetchApis';
import { formatDate } from '@/utils/date';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import Loading from '@/components/shared/Loading';

export default function Consultations() {
    const { data, isFetching, isError, error } = useFetchQuery({
        url: `consultations`,
        queryKey: ['patientAllConsultations'],
        fetchFunction: fetchWithAuth,
    });

    const patientConsultations = data?.results || [];

    return (
        <div className='px-2 pb-4'>
            
            <h2 className="text-md font-medium text-primary mb-4">My Consultations History:</h2>

            {isFetching ? (
                <Loading />
            ) : isError ? (
                <p className='text-primary'>Error fetching consultations: {error.message}</p>
            ) : patientConsultations && patientConsultations.length > 0 ? (
                <div className="grid gap-4 lg:grid-cols-2 mt-2">
                    {patientConsultations.map(consultation => (
                        <div key={consultation.id} className="relative p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md transition-shadow">
                            <div className="absolute top-3 right-4">
                                <Link to={`/patient/prescription/${consultation.id}`} className="text-primary flex underline items-center gap-2 text-xs">
                                    <FiEye /> View Prescription
                                </Link>
                            </div>
                            <h3 className="font-semibold -mt-1 text-sm text-primary mb-2 block w-56 truncate">  {consultation.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">Consultation for {consultation.patient_name}</p>
                            <p className="text-sm text-gray-600 mb-1">Created by Dr. {consultation.doctor_name}</p>
                            <div className="flex justify-between text-xs text-gray-600 mt-4">
                                <p className="flex items-center gap-2 text-xs">
                                    <TbClockCheck /> Created on {formatDate(consultation.created_at)}
                                </p>
                                <p className="flex items-center gap-2 text-xs">
                                    <TbClockEdit /> Updated on {formatDate(consultation.updated_at)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-sm">You have no past consultations.</p>
            )}
        </div>
    );
}
