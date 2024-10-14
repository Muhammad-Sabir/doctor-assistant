import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineStart } from "react-icons/md";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import Loading from '@/components/shared/Loading';
import { calculateAge } from '@/utils/date';

export default function MyPatients() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isFetching, isError, error } = useFetchQuery({
        url: `patients/?page=${currentPage}`,
        queryKey: ['myPatients', currentPage],
        fetchFunction: fetchWithAuth,
    });

    if (isFetching) {
        return <Loading />;
    }

    if (isError) {
        return <div className="text-center py-10">Some Error Occurred: {error.message}</div>;
    }

    const patients = data?.results || [];
    const nextPage = data?.next;
    const prevPage = data?.previous;

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNextClick = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handlePrevClick = () => {
        setCurrentPage((prev) => prev - 1);
    };

    return (
        <div className="mx-2 pb-2">
            <h2 className="text-md font-medium text-primary mb-2">My Patients:</h2>
            <p className="text-gray-600 text-sm mb-4">Track your patients and stay on top of your schedule.</p>

            <hr className="border-t border-gray-300 mt-4 mb-5" />

            <Input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className='mt-5 px-2'>
                {filteredPatients.length > 0 ? (
                    <>
                        <div className="hidden sm:grid grid-cols-5 gap-4 border-b border-gray-200 pb-3">
                            <div className="text-sm font-medium text-gray-700">ID</div>
                            <div className="text-sm font-medium text-gray-700">Name</div>
                            <div className="text-sm font-medium text-gray-700">Age</div>
                            <div className="text-sm font-medium text-gray-700">Gender</div>
                            <div className="text-sm font-medium text-gray-700">Actions</div>
                        </div>

                        {filteredPatients.map((patient) => (
                            <div key={patient.id}>
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-0 sm:gap-4 border sm:border-t 
                                sm:border-l-0 sm:border-r-0 sm:border-b-0 border-gray-300 py-3 px-4 sm:px-0 rounded-md sm:rounded-none my-5 sm:my-0"
                                >
                                    <div className="text-sm font-normal text-gray-500 flex items-center">
                                        <span className="block sm:hidden mr-1">Patient Id:</span>{patient.id}
                                    </div>
                                    <div className="font-bold text-md text-primary sm:text-sm sm:font-normal sm:text-gray-600 flex items-center">
                                        {patient.name}
                                    </div>
                                    <div className="text-sm font-normal text-gray-500 flex items-center mt-2 sm:mt-0">
                                        <span className="block sm:hidden mr-1">Age:</span>{calculateAge(patient.date_of_birth)}
                                    </div>
                                    <div className="text-sm font-normal text-blue-500 sm:text-gray-500 flex items-center">
                                        {patient.gender === 'M' ? 'Male' : 'Female'}
                                    </div>

                                    <div className="flex justify-end sm:ml-3 sm:justify-start items-center">
                                        <Link to={`/doctor/patient/${patient.id}`}><MdOutlineStart className='text-green-500' /></Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center gap-3.5 mt-8">
                            <Button variant='outline' onClick={handlePrevClick} disabled={!prevPage}><FaAnglesLeft className='mr-1' />Prev </Button>
                            <Button variant='outline' onClick={handleNextClick} disabled={!nextPage}>Next <FaAnglesRight className='ml-1 mt-0.5' /></Button>
                        </div>
                    </>
                ) : (
                    <p className='text-sm text-gray-600'>No patients found.</p>
                )}
            </div>
        </div>
    );
}
