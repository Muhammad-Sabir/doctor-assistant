import React from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegCalendarAlt } from 'react-icons/fa';
import { LiaStethoscopeSolid } from "react-icons/lia";
import { PiGraduationCapLight } from "react-icons/pi";
import { FiCheckCircle } from "react-icons/fi";

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import Loading from '@/components/shared/Loading';
import banner from "@/assets/images/webp/profileBanner.webp";
import HospitalCard from '@/components/shared/HospitalCard';
import ListGrid from '@/components/shared/ListGrid';
import AddReview from '@/components/dialogs/AddReview';
import BookAppointment from '@/components/dialogs/BookAppointment';

export default function DoctorDetail() {
    const { id } = useParams();

    const { data, isFetching, isError, error } = useFetchQuery({
        url: `doctors/${id}`,
        queryKey: ['doctorDetails'],
        fetchFunction: fetchWithAuth,
    });

    if (isFetching) return <Loading />;
    if (isError) return <div className="text-red-500">Error: {error.message}</div>;

    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

    const getDoctorImageUrl = (file_url) => {
        if (file_url?.startsWith('/media')) {
            return `${baseUrl}${file_url}`;
        }
        return file_url;
    };

    return (
        <section className="relative pt-40 pb-6 mx-1">
            <img src={banner} alt="cover-image" className="w-full absolute top-0 left-0 z-0 h-[10rem] object-cover" />

            <div className="w-full max-w-7xl mx-auto px-6 md:px-8 -mt-28 bg-white">
                <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5 mt-10 lg:mt-0">
                    <img src={getDoctorImageUrl(data.file_url)} alt={data.name}
                        className="bg-white h-[120px] lg:h-[152px] w-[120px] lg:w-[152px] object-cover border border-gray-300 rounded-full" />
                </div>

                <div className="flex items-center justify-center flex-col sm:flex-row max-sm:gap-5 sm:justify-between mb-5">
                    <div>
                        <h3 className="font-manrope font-bold text-xl text-primary mb-1 max-sm:text-center">{data.name}</h3>
                        <div className="font-normal text-gray-500 max-sm:text-center text-sm">
                            <div className='lg:flex gap-3'>
                                <p className="text-sm text-gray-600 flex">
                                    <FaRegCalendarAlt className='mr-1 mt-1' />
                                    {data.date_of_experience ? `${new Date().getFullYear() - new Date(data.date_of_experience).getFullYear()} years of experience` : 'N/A'}
                                </p>
                                <div className="flex items-center mt-2 lg:mt-0 justify-center sm:justify-normal">
                                    <FaStar className="text-yellow-500" />
                                    <span className="ml-1 text-primary">{data.average_rating}</span>
                                    <span className="ml-1 text-gray-500 ">({data.total_reviews} reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <BookAppointment doctorId={data.id} doctorName={data.name} />
                    </div>
                </div>

                <hr className="border-t border-gray-300 mt-4" />
                <div className="mt-4">
                    <h2 className="text-md font-semibold text-primary">Specialties</h2>
                    <ListGrid data={data.specialities} icon={LiaStethoscopeSolid} color="text-red-400" />
                </div>

                <hr className="border-t border-gray-300 mt-8" />
                <div className="mt-4">
                    <h2 className="text-md font-semibold text-primary">Affiliated Hospitals</h2>
                    <div className="grid gap-4 lg:grid-cols-2 mt-4">
                        {data.hospitals.length > 0 ? (
                            data.hospitals.map((hospital) => (
                                <HospitalCard hospital={hospital} key={hospital.id} />
                            ))
                        ) : (
                            <p className="text-gray-600 text-sm">N/A</p>
                        )}
                    </div>
                </div>

                <hr className="border-t border-gray-300 mt-8" />
                <div className="mt-4">
                    <h2 className="text-md font-semibold text-primary">Degrees</h2>
                    <ListGrid data={data.degrees} icon={PiGraduationCapLight} color="text-purple-600" />
                </div>

                <hr className="border-t border-gray-300 mt-8" />
                <div className="mt-4">
                    <h2 className="text-md font-semibold text-primary">Diseases Treated</h2>
                    <ListGrid data={data.diseases} icon={FiCheckCircle} color="text-green-500" />
                </div>

                <hr className="border-t border-gray-300 mt-9" />
                <div className="mt-4">
                    <div className='flex justify-between mt-2'>
                        <h2 className="text-md font-semibold text-primary mb-4">Reviews</h2>
                        <AddReview doctorId={data.id} doctorName={data.name} />
                    </div>
                    {data.reviews.length > 0 ? (
                        <div className="grid gap-4 lg:grid-cols-2 mt-2">
                            {data.reviews.map((review) => (
                                <div key={review.id}
                                    className="p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-primary transition-shadow">
                                    <div className='flex justify-between'>
                                        <div className="flex items-center mb-3">
                                            {Array(review.rating).fill(0).map((_, index) => (
                                                <FaStar key={index} className="text-yellow-400 mr-1" />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            <span className='hidden sm:inline-block mr-1'>Reviewed on</span>{new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-600 text-sm mb-2">{review.comment}</p>
                                    <p className="text-sm text-primary">
                                        <span className='hidden sm:inline-block mr-1'>Reviewed by</span>{review.patient_name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm">Not reviewed yet.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
