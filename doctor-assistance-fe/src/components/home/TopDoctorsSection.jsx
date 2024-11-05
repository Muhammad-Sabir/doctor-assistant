import React from "react";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa6";

import Subtitle from '@/components/shared/Subtitle';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchApi } from "@/utils/fetchApis";
import Loading from "@/components/shared/Loading";

export default function TopDoctorsSection() {
    const { data, isFetching, isError, error } = useFetchQuery({
        url: 'doctors?average_rating_min=3&average_rating_max=5',
        queryKey: ['topRatedDoctorsHome'],
        fetchFunction: fetchApi,
    });

    const topDoctors = data?.results?.sort((a, b) => b.average_rating - a.average_rating).slice(0, 5);

    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

    const getDoctorImageUrl = (file_url) => {
        if (file_url?.startsWith('/media')) {
            return `${baseUrl}${file_url}`;
        }
        return file_url;
    };

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 1000,
        swipeToSlide: true,
        autoplaySpeed: 2000,
        slidesToShow: 3,
        variableWidth: false,
        responsive: [
            {
                breakpoint: 1090,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <section className="py-8 lg:py-14 section-padding">
            <div className="flex-col justify-center items-center gap-y-8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8">
                <div className="w-full text-center">
                    <Subtitle subtitle="Doctors" />
                    <h2 className="text-4xl font-bold text-primary leading-[3.25rem] mb-8 mt-5">
                        Meet our top Medical specialists
                    </h2>
                </div>

                <div className="w-full">
                    {isFetching ? (<Loading />
                    ) : isError ? (<div className="text-center text-red-600">Error: {error.message}</div>
                    ) : topDoctors && topDoctors.length > 0 ? (
                        <Slider {...settings}>
                            {topDoctors.map((doctor, index) => (
                                <div key={index} className="border border-gray-300 rounded-md p-6 transition-all duration-500 hover:border-primary ml-2">
                                    <div className="flex flex-col gap-4 items-center relative">
                                        <p className="text-xs font-medium absolute -top-2 -right-4 flex items-center bg-orange-100 rounded-md px-2 py-1">
                                            <FaStar className="text-yellow-500" />
                                            <span className="ml-1 text-primary font-semibold">{doctor.average_rating}</span>
                                            <span className="ml-1 text-gray-500">({doctor.total_reviews})</span>
                                        </p>
                                        <img className="rounded-full object-cover w-28 h-28" src={getDoctorImageUrl(doctor.file_url)} alt={doctor.name} />
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
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <p className="text-gray-600 text-center">
                            No top rated doctors yet.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
