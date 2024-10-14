import React from 'react';
import { useParams } from 'react-router-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { TbClockCheck, TbClockEdit } from "react-icons/tb";

import { Button } from '@/components/ui/button';

import { calculateAge } from '@/utils/date';
import { fetchWithAuth } from '@/utils/fetchApis';
import { formatDate } from '@/utils/date';
import { useFetchQuery } from '@/hooks/useFetchQuery';

import Loading from '@/components/shared/Loading';
import DeleteItem from '@/components/dialogs/DeleteItem';
import AddAllergy from '@/components/dialogs/AddAllergy';
import CreateConsultation from '@/components/dialogs/CreateConsultation';

import userIcon from "@/assets/images/webp/userIcon.webp";
import banner from "@/assets/images/webp/profileBanner.webp";

export default function PatientDetail() {
    const { id } = useParams();

    const { data: patientData, isFetching, isError, error } = useFetchQuery({
        url: `patients/${id}`,
        queryKey: ['patientDetails'],
        fetchFunction: fetchWithAuth,
    });

    const { data: patientAllergies, isFetching: isAllergiesFetching, isError: isAllergiesError } = useFetchQuery({
        url: `patient-allergies/`,
        queryKey: ['patientAllergies'],
        fetchFunction: fetchWithAuth,
    });

    const { data: patientConsultations, isFetching: isConsultationFetching, isError: isConsultationError } = useFetchQuery({
        url: `consultations/`,
        queryKey: ['patientConsultations'],
        fetchFunction: fetchWithAuth,
    });

    if (isFetching) return <Loading />;
    if (isError) return <div className="text-red-500">Error: {error.message}</div>;

    const filteredAllergies = patientAllergies?.results?.filter(allergy => allergy.patient.id === Number(id));
    const filteredConsultations = patientConsultations?.results?.filter(consultation => consultation.patient === Number(id));

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
                                <p className="text-sm text-gray-600 flex">
                                    <FaRegCalendarAlt className='mr-1 mt-0.5' />
                                    {calculateAge(patientData.date_of_birth)} years old   
                                </p>
                                <div className="flex items-center mt-2 lg:mt-0 justify-center sm:justify-normal">
                                    <span className="ml-1 flex">
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
                        <CreateConsultation patientId={id}/>
                    </div>
                </div>

                <hr className="border-t border-gray-300 mt-4" />
                <div className="mt-4">
                    <div className='flex justify-between mt-2'>
                        <h2 className="text-md font-semibold text-primary mb-4">Allergies</h2>
                        <AddAllergy triggerElement={ <Button className='ml-3'>Add Allergy</Button>} patientId={id}/>
                    </div>

                    {isAllergiesFetching ? (
                        <Loading />
                    ) : isAllergiesError ? (
                        <div className="text-red-500">Error loading allergies</div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                            {filteredAllergies && filteredAllergies.length > 0 ? (
                                filteredAllergies.map(allergy => (
                                    <span key={allergy.id} className="flex m-1 py-1 px-2 bg-accent rounded-md text-xs font-medium text-primary max-w-fit">
                                        {allergy.allergy.name}
                                        <DeleteItem deleteUrl={`patient-allergies/${allergy.id}/`} itemName={'Allergy'} iconSize={13} />
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-600 text-sm">No allergies recorded for this patient.</p>
                            )}
                        </div>
                    )}
                </div>

                <hr className="border-t border-gray-300 mt-8" />
                <div className="mt-4">
                    <h2 className="text-md font-semibold text-primary mb-4">Past Consultations</h2>

                    {isConsultationFetching ? (
                        <Loading />
                    ) : isConsultationError ? (
                        <div className="text-red-500">Error loading consultations</div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                            {filteredConsultations && filteredConsultations.length > 0 ? (
                                filteredConsultations.map(consultation => (
                                    <div key={consultation.id} className="p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-primary transition-shadow">
                                        <h3 className="font-semibold text-sm text-primary mb-2">{consultation.title}</h3>
                                        <p className="text-sm flex items-center gap-2 text-gray-600"><TbClockCheck/> Created on: {formatDate(consultation.created_at)}</p>
                                        <p className="text-sm flex items-center gap-2 mt-1 text-gray-600"><TbClockEdit/> Last updated: {formatDate(consultation.created_at)}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600 text-sm">No consultations found for this patient.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
