import React from 'react';
import { Link } from 'react-router-dom';
import { MdAccessTime, MdOutlineDateRange } from 'react-icons/md';
import { CircleCheckBig } from 'lucide-react';

import { formatDate } from '@/utils/date';
import { capitalizeWords } from '@/utils/strings';
import { toHHMMFormat } from '@/utils/time';

export default function DoctorConsultationCard({ consultation }) {
    return (
        <Link to={`/doctor/consultation/${consultation.patient}/${consultation.id}/${consultation.appointment}`}
            state={{ patientName: consultation.patient_name }}
            className="mb-5 p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-primary transition-shadow block"
        >
            <div className="flex items-center justify-between -mt-1">
                <div className="flex items-center gap-2">
                    <CircleCheckBig size={15} className="text-green-600" />
                    <p className="text-sm text-green-600">
                        {capitalizeWords(consultation.appointment_mode)} Consultation
                    </p>
                </div>
                <p className="text-xs text-gray-600">
                    <span className='hidden sm:inline-block mr-1'>Last Updated at</span>
                    {new Date(consultation.updated_at).toLocaleDateString()}
                </p>
            </div>

            <div>
                <p className="mt-2 text-sm font-medium text-primary">Title: {capitalizeWords(consultation.title)}</p>
                <p className="mb-1 text-sm text-gray-600">with {consultation.patient_name}</p>
            </div>

            <p className="text-sm flex items-center gap-2 mb-0.5 mt-2 text-gray-600">
                <MdOutlineDateRange /> {formatDate(consultation.appointment_date)}
            </p>
            <p className="text-sm flex items-center gap-2 text-gray-600">
                <MdAccessTime /> At {toHHMMFormat(consultation.appointment_time)} scheduled
            </p>
        </Link>
    );
}