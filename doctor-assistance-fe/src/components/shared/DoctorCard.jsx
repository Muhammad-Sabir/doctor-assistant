import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa6';

import BookAppointment from '@/components/dialogs/BookAppointment';

const DoctorCard = ({ doctor }) => {

    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

    const getDoctorImageUrl = (file_url) => {
        if (file_url?.startsWith('/media')) {
            return `${baseUrl}${file_url}`;
        }
        return file_url;
    };

    return (
        <div className="block border border-gray-300 rounded-lg px-4 py-5 hover:shadow-md hover:border-primary transition-shadow duration-500 w-full max-w-[90vw] sm:max-w-[350px] mx-auto relative">
            <Link to={`/patient/doctor/${doctor.id}`} >
                <div className="text-xs font-medium absolute top-3 right-3 flex items-center bg-orange-100 rounded-md px-2 py-1">
                    <FaStar className="text-yellow-500" />
                    <span className="ml-1 text-primary font-semibold">{doctor.average_rating}</span>
                    <span className="ml-1 text-gray-500">({doctor.total_reviews})</span>
                </div>

                <div className="flex justify-center mb-4 mt-4">
                    <img
                        className="rounded-full shadow-lg w-24 h-24 object-cover"
                        src={getDoctorImageUrl(doctor.file_url)}
                        alt={doctor.name}
                    />
                </div>

                <div className="text-center">
                    <div className="flex justify-center w-full">
                        <h4 className="text-center text-md font-semibold text-primary w-90 sm:w-60 truncate block">{doctor.name}</h4>
                    </div>
                    <div className="flex justify-center w-full">
                        <p className="font-normal text-sm leading-6 text-gray-500 w-90 sm:w-52 truncate block mx-auto">
                            Specialities<span className='mx-1 inline'>-</span>{doctor.specialities.length > 0 ? doctor.specialities.map(s => s.name).join(', ') : 'N/A'}
                        </p>
                    </div>
                    <div className="flex justify-center w-full">
                        <p className="font-normal text-sm leading-6 text-gray-500 w-90 sm:w-52 truncate block mx-auto">
                            Treats<span className='mx-1 inline'>-</span>{doctor.diseases.length > 0 ? doctor.diseases.map(d => d.name).join(', ') : 'N/A'}
                        </p>
                    </div>
                    <div className="flex justify-center w-full">
                        <p className="font-normal text-sm leading-6 text-gray-500 w-90 sm:w-52 truncate block mx-auto">
                            Degrees<span className='mx-1 inline'>-</span>{doctor.degrees.length > 0 ? doctor.degrees.map(d => d.name).join(', ') : 'N/A'}
                        </p>
                    </div>

                    <div className="flex justify-center mt-4">
                        <p className="font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-md bg-emerald-50 text-emerald-600">
                            {doctor.date_of_experience ?
                                `${new Date().getFullYear() - new Date(doctor.date_of_experience).getFullYear()} years of experience`
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            </Link>

            <div className="flex mt-5 justify-center">
                <BookAppointment doctorId={doctor.id} doctorName={doctor.name} />
            </div>

        </div>
    );
};

export default DoctorCard;
