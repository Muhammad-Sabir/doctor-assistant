import React from 'react';
import { Link } from 'react-router-dom';
import { TbClockCheck, TbClockEdit } from "react-icons/tb";
import { FiEye } from 'react-icons/fi';

import { formatDate } from '@/utils/date';

export default function PatientConsultationCard({ consultation }) {
    return (
        <div className="relative p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md transition-shadow">
            <div className="absolute top-3 right-4">
                <Link to={`/patient/prescription/${consultation.id}`} className="text-primary flex underline items-center gap-2 text-xs">
                    <FiEye /> View Prescription
                </Link>
            </div>
            <h3 className="font-semibold -mt-1 text-sm text-primary mb-2 block w-56 truncate">
                {consultation.title}
            </h3>
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
    );
}
