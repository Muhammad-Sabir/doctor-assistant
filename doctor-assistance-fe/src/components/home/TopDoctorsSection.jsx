import React from "react";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa6";

import Subtitle from '@/components/shared/Subtitle';
import { doctors } from "@/assets/data/doctors";

export default function TopDoctorsSection() {
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
                    <Slider {...settings}>
                        {doctors.map((doctors, index) => (
                            <div key={index} className="border border-gray-300 rounded-2xl p-6 transition-all duration-500 hover:border-primary ml-2">
                                <div className="flex flex-row gap-4">
                                    <img className="rounded-md object-cover w-28 h-28" src={doctors.image} alt="Doctor image" />
                                    <div className="flex-col justify-start items-start">
                                        <h4 className="text-primary text-sm font-medium leading-8">{doctors.name}</h4>
                                        <h6 className="text-gray-500 text-sm leading-relaxed">{doctors.specialization}</h6>
                                        <h6 className="text-green-600 text-sm leading-relaxed">{doctors.experience} years of experience</h6>
                                        <p className="flex items-center mt-2 text-yellow-500">
                                            <FaStar />
                                            <span className="text-primary text-sm font-normal leading-relaxed ml-1">{doctors.rating}
                                                <span className="ml-1">({doctors.totalRating} reviews )</span>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>   
                </div>
    
            </div>
        </section>
    );
}
