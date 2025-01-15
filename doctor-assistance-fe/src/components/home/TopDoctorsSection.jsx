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
        <section id="topDoctors" className="py-8 lg:py-14 section-padding">
            <div className="flex-col flex-wrap items-center justify-center gap-y-8 lg:gap-y-0 md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8">
                <div className="w-full text-center">
                    <Subtitle subtitle="Doctors" />
                    <h2 className="text-4xl font-bold text-primary leading-[3.25rem] mb-8 mt-5 capitalize">
                        Meet our top medical specialists
                    </h2>
                </div>

                <div className="w-full">
                    {isFetching ? (<Loading />
                    ) : isError ? (<div className="text-center text-red-600">Error: {error.message}</div>
                    ) : topDoctors && topDoctors.length > 0 ? (
                        <Slider {...settings}>
                            {topDoctors.map((doctor, index) => (
                                <div key={index} className="p-6 ml-2 transition-all duration-500 border border-gray-300 rounded-md hover:border-primary">
                                    <div className="relative flex flex-col items-center gap-4">
                                        <p className="absolute flex items-center px-2 py-1 text-xs font-medium bg-orange-100 rounded-md -top-2 -right-4">
                                            <FaStar className="text-yellow-500" />
                                            <span className="ml-1 font-semibold text-primary">{doctor.average_rating}</span>
                                            <span className="ml-1 text-gray-500">({doctor.total_reviews})</span>
                                        </p>
                                        <img className="object-cover rounded-full w-28 h-28" src={getDoctorImageUrl(doctor.file_url)} alt={doctor.name} />
                                        <div className="text-center">
                                            <div className="flex justify-center w-full">
                                                <h4 className="block font-semibold text-center truncate text-md text-primary w-90 sm:w-60">{doctor.name}</h4>
                                            </div>
                                            <div className="flex justify-center w-full">
                                                <p className="block mx-auto text-sm font-normal leading-6 text-gray-500 truncate w-90 sm:w-52">
                                                    Specialities<span className='inline mx-1'>-</span>{doctor.specialities.length > 0 ? doctor.specialities.map(s => s.name).join(', ') : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex justify-center w-full">
                                                <p className="block mx-auto text-sm font-normal leading-6 text-gray-500 truncate w-90 sm:w-52">
                                                    Treats<span className='inline mx-1'>-</span>{doctor.diseases.length > 0 ? doctor.diseases.map(d => d.name).join(', ') : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex justify-center w-full">
                                                <p className="block mx-auto text-sm font-normal leading-6 text-gray-500 truncate w-90 sm:w-52">
                                                    Degrees<span className='inline mx-1'>-</span>{doctor.degrees.length > 0 ? doctor.degrees.map(d => d.name).join(', ') : 'N/A'}
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
                        <p className="text-center text-gray-600">
                            No top rated doctors yet.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
