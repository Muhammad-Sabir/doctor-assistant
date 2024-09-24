import React from 'react'

import heroImg2 from '@/assets/images/webp/heroImg2.webp';
import Subtitle from '@/components/shared/Subtitle';

export default function AboutSection() {
    return (
        <section className="py-8 lg:py-14 section-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
                
                <div className="order-1 lg:order-none">
                    <img src={heroImg2} alt="About Us tailwind page"
                        className="object-cover rounded-xl" />
                </div>
                
                <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                    <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                        <Subtitle subtitle="About Us" />
                        <h2 className="text-primary text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                            Empowering Patients and Doctors</h2>
                        <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                            Our platform empowers patients and doctors with advanced features that enhance
                            communication and streamline the healthcare experience. By simplifying the process
                            of finding doctors, booking appointments, and facilitating consultations, we foster
                            meaningful interactions between the patients and doctors.</p>
                    </div>
                </div>
            
            </div>
        </section>
    )
}
