import React from 'react';
import { FaStar } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

const DoctorCard = ({ doctor }) => {
    const getDoctorImageUrl = (file_url) => {
        if (file_url?.startsWith('/media')) {
            return `http://localhost:8000${file_url}`;
        }
        return file_url;
    };

    return (
        <Link to={`/patient/doctor/${doctor.id}`} className="block">
            <div className="border border-gray-300 rounded-lg px-4 py-5 hover:shadow-md hover:border-primary transition-shadow duration-500 w-full max-w-[90vw] sm:max-w-[350px] mx-auto">
                <div className="flex justify-center mb-4">
                    <img
                        className="rounded-full shadow-lg w-24 h-24 object-cover"
                        src={getDoctorImageUrl(doctor.file_url)}
                        alt={doctor.name}
                    />
                </div>

                <div className="text-center">
                    <div className="flex justify-center w-full">
                        <h4 className="text-center text-lg font-semibold text-primary w-90 sm:w-60 truncate block">{doctor.name}</h4>
                    </div>
                    <div className="flex justify-center w-full">
                        <p className="font-normal text-sm leading-6 text-gray-500 w-90 sm:w-52 truncate block mx-auto">
                            Specialities: {doctor.specialities.length > 0 ? doctor.specialities.map(s => s.name).join(', ') : 'N/A'}
                        </p>
                    </div>
                    <div className="flex justify-center w-full">
                        <p className="font-normal text-sm leading-6 text-gray-500 w-90 sm:w-52 truncate block mx-auto">
                            Treats: {doctor.diseases.length > 0 ? doctor.diseases.map(d => d.name).join(', ') : 'N/A'}
                        </p>
                    </div>
                    <div className="flex justify-center w-full">
                        <p className="font-normal text-sm leading-6 text-gray-500 w-90 sm:w-52 truncate block mx-auto">
                            Degrees: {doctor.degrees.length > 0 ? doctor.degrees.map(d => d.name).join(', ') : 'N/A'}
                        </p>
                    </div>
                    <div className="flex justify-center mt-4">
                        <p className="text-sm text-green-600 text-center">
                            {doctor.date_of_experience ?
                                `${new Date().getFullYear() - new Date(doctor.date_of_experience).getFullYear()} years of experience`
                                : 'N/A'}
                        </p>
                        <div className="flex items-center text-sm text-center ml-4">
                            <FaStar className="text-yellow-500" />
                            <span className="ml-1 text-primary">
                                {doctor.average_rating}
                            </span>
                            <span className="ml-1 text-gray-500">({doctor.total_reviews})</span>
                        </div>
                    </div>
                </div>

                <div className='flex mt-5 mb-1 justify-center'>
                    <Button variant='secondary'>Visit Clinic</Button>
                    <Button className='ml-2'>Consult Online</Button>
                </div>
            </div>
        </Link>
    );
};

export default DoctorCard;
