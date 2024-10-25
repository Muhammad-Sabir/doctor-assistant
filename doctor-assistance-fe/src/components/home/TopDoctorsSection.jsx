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
                                    <div className="flex flex-row gap-4">
                                        <img className="rounded-full object-cover w-28 h-28" src={getDoctorImageUrl(doctor.file_url)} alt={doctor.name} />
                                        <div className="flex-col justify-start items-start">
                                            <p className="w-72 sm:w-52 truncate block mx-auto">
                                                <h4 className="text-primary text-sm font-medium leading-8">{doctor.name}</h4>
                                            </p>
                                            <p className="font-normal text-sm leading-6 text-gray-500 w-72 sm:w-52 truncate block mx-auto">
                                                Specialities<span className='mx-1 inline'>-</span>{doctor.specialities.length > 0 ? doctor.specialities.map(s => s.name).join(', ') : 'N/A'}
                                            </p>
                                            <h6 className="text-green-600 text-sm leading-relaxed">
                                                {doctor.date_of_experience ? `${new Date().getFullYear() - new Date(doctor.date_of_experience).getFullYear()} years of experience` : 'N/A'}
                                            </h6>
                                            <p className="flex items-center mt-2 text-yellow-500">
                                                <FaStar />
                                                <span className="text-primary text-sm font-normal leading-relaxed ml-1">{doctor.average_rating}
                                                    <span className="ml-1">({doctor.total_reviews})</span>
                                                </span>
                                            </p>
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
