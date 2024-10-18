import React from 'react';
import { useParams } from 'react-router-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";

import { Button } from '@/components/ui/button';

import { calculateAge } from '@/utils/date';
import { fetchWithAuth } from '@/utils/fetchApis';
import { useFetchQuery } from '@/hooks/useFetchQuery';

import Loading from '@/components/shared/Loading';
import AddAllergy from '@/components/dialogs/AddAllergy';
import CreateConsultation from '@/components/dialogs/CreateConsultation';

import userIcon from "@/assets/images/webp/userIcon.webp";
import banner from "@/assets/images/webp/profileBanner.webp";
import PatientAllergies from '@/components/consultation/PatientAllergies';
import PatientConsultations from '@/components/consultation/PatientConsultations';

export default function PatientDetail() {
    const { id } = useParams();

    const { data: patientData, isFetching, isError, error } = useFetchQuery({
        url: `patients/${id}`,
        queryKey: ['patientDetails'],
        fetchFunction: fetchWithAuth,
    });

    if (isFetching) return <Loading />;
    if (isError) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <section className="relative pt-40 pb-6 mx-1">
            <img src={banner} alt="cover-image" className="w-full absolute top-0 left-0 z-0 h-[10rem] object-cover" />

            <div className="w-full max-w-7xl mx-auto px-6 md:px-8 -mt-28 bg-white">
                <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5 mt-10 lg:mt-0">
                    <img src={userIcon} alt="user-image"
                        className="bg-white h-[120px] lg:h-[152px] w-[120px] lg:w-[152px] object-cover border border-gray-300 rounded-full" />
                </div>

                <div className="flex items-center justify-center flex-col sm:flex-row max-sm:gap-5 sm:justify-between mb-5">
                    <div>
                        <h3 className="font-manrope font-bold text-xl text-primary mb-1 max-sm:text-center">{patientData.name}</h3>
                        <div className="font-normal text-gray-500 max-sm:text-center text-sm">
                            <div className='lg:flex gap-3'>
                                <p className="text-sm text-gray-600 flex justify-center sm:justify-start">
                                    <FaRegCalendarAlt className='mr-1 mt-0.5' />
                                    {calculateAge(patientData.date_of_birth)} years old
                                </p>
                                <div className="flex items-center mt-2 lg:mt-0 justify-center sm:justify-normal">
                                    <span className="flex">
                                        {patientData.gender === 'F' ? (
                                            <><BsGenderFemale className='mr-1 mt-1 text-pink-700' /> Female </>
                                        ) : (
                                            <><BsGenderMale className='mr-1 mt-1 text-blue-700' /> Male </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <CreateConsultation patientId={id} />
                    </div>
                </div>

                <hr className="border-t border-gray-300 mt-4" />
                <div className="mt-4">
                    <div className='flex justify-between mt-2'>
                        <h2 className="text-md font-semibold text-primary mb-4">Allergies</h2>
                        <AddAllergy triggerElement={<Button className='ml-3'>Add Allergy</Button>} patientId={id} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                        <PatientAllergies patientId={id} />
                    </div>
                </div>

                <hr className="border-t border-gray-300 mt-8" />
                <div className="mt-4">
                    <h2 className="text-md font-semibold text-primary mb-4">Past Consultations</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                        <PatientConsultations patientId={id} />
                    </div>
                </div>
            </div>
        </section>
    );
}
