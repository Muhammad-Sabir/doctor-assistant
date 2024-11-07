import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { fetchWithAuth } from '@/utils/fetchApis';
import { useFetchQuery } from '@/hooks/useFetchQuery';

import DoctorCard from '@/components/shared/DoctorCard';
import Loading from '@/components/shared/Loading';
import banner from "@/assets/images/webp/profileBanner.webp";
import { getPaginationItems } from '@/utils/pagination';

export default function HospitalDetails() {

    const { id } = useParams();
    const [page, setPage] = useState(1);
    const [resultPerPage, setResultPerPage] = useState(10);

    const { data: hospitalData, isFetching: isFetchingHospital, isError: isErrorHospital } = useFetchQuery({
        url: `hospitals/${id}`,
        queryKey: ['hospitalDetail', id],
        fetchFunction: fetchWithAuth,
    });

    const { data: doctorsData, isFetching: isFetchingDoctors, isError: isErrorDoctors } = useFetchQuery({
        url: `doctors?hospital_id=${id}&page=${page}`,
        queryKey: ['doctorsByHospital', id, page],
        fetchFunction: fetchWithAuth,
    });

    const doctors = doctorsData?.results || [];
    const dataCount = doctorsData?.count || 0;
    const nextPage = doctorsData?.next;
    const prevPage = doctorsData?.previous;

    const totalPages = resultPerPage ? Math.ceil(dataCount / resultPerPage) : 0;
    const startResult = (page - 1) * resultPerPage + 1;
    const endResult = Math.min(page * resultPerPage, dataCount);

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => setPage((prev) => prev - 1);
    const handlePageClick = (pageNumber) => setPage(pageNumber);
    const paginationItems = getPaginationItems(page, totalPages);

    if (isFetchingHospital || isFetchingDoctors) {
        return <Loading />;
    }

    if (isErrorHospital || isErrorDoctors) {
        return <div className="text-center py-10">Some Error Occured</div>;
    }

    return (
        <section className="relative pt-40 pb-6 mx-1">
            <img src={banner} alt="cover-image" className="w-full absolute top-0 left-0 z-0 h-[10rem] object-cover" />

            <div className="w-full max-w-7xl mx-auto px-6 md:px-8 -mt-28 bg-white">
                <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5 mt-10 lg:mt-0">
                    <img src={hospitalData.logo_url} alt={hospitalData.name}
                        className="bg-white h-[120px] lg:h-[152px] w-[120px] lg:w-[152px] object-cover border border-gray-300 rounded-full" />
                </div>

                <div className="flex items-center justify-center flex-col sm:flex-row max-sm:gap-5 sm:justify-between mb-5">
                    <div>
                        <h3 className="font-manrope font-bold text-xl text-primary mb-1 max-sm:text-center">{hospitalData.name}</h3>
                        <p className="font-normal text-gray-500 max-sm:text-center text-sm">
                            <span className='leading-6'>City: {hospitalData.city}</span>
                        </p>
                    </div>
                </div>

                <hr className="border-t border-gray-300 mt-4" />

                <div className="mt-6">
                    <h2 className="text-md font-medium text-primary mb-4">Doctors at {hospitalData.name}:</h2>
                    {doctors.length > 0 ? (
                        <>
                            <p className='text-gray-600 text-sm'>
                                {startResult === endResult
                                    ? `Showing ${endResult} of ${dataCount} results`
                                    : `Showing ${startResult}-${endResult} of ${dataCount} results`}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                {doctors.map((doctor) => (
                                    <DoctorCard key={doctor.id} doctor={doctor} />
                                ))}
                            </div>

                            <div className="flex gap-1 justify-center items-center mt-7">
                                <button className="px-2 py-2 rounded-md border border-gray-300" onClick={handlePrevPage} disabled={!prevPage}>
                                    <ChevronLeft size={18} color={!prevPage ? 'lightgrey' : 'grey'} />
                                </button>

                                <div className="flex flex-row">
                                    {paginationItems.map((pg, index) => (
                                        <button key={index}
                                            className={`px-3 py-2 border border-gray-300 ${page === pg ? 'bg-primary text-white' : 'text-gray-700'} rounded-md mx-1 font-semibold text-sm`}
                                            onClick={() => {
                                                if (pg !== '...') {
                                                    handlePageClick(pg);
                                                }
                                            }} >
                                            {pg}
                                        </button>
                                    ))}
                                </div>

                                <button className="px-2 py-2 rounded-md border border-gray-300" onClick={handleNextPage} disabled={!nextPage} >
                                    <ChevronRight size={18} color={!nextPage ? 'lightgrey' : 'grey'} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-600 col-span-3">No doctors available at this hospital.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
