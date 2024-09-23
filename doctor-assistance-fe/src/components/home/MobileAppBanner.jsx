import React from 'react'
import { Link } from 'react-router-dom';
import { MdOutlineInstallMobile } from "react-icons/md";

import { Button } from '@/components/ui/button';

import mobileBanner from '@/assets/images/webp/mobileBanner.webp';
import Subtitle from '@/components/shared/Subtitle';


export default function MobileAppBanner() {
    return (
        <section className="py-8 lg:py-14 section-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">

                <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                    <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                        <Subtitle subtitle="Discover" />
                        <h2 className="text-primary text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                            The Easiet way to access Seamless Healthcare</h2>
                        <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                            Access your health records anytime, anywhere.
                            Experience hassle-free appointments and consultations right from your phone.</p>
                        <Button className="block mx-auto lg:mx-0 mt-5">
                            <Link className="flex" to="/">
                                <MdOutlineInstallMobile className="mt-1 mr-1" /> Download App Now
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="order-1 lg:order-none">
                    <img src={mobileBanner} alt="About Us tailwind page"
                        className="object-cover rounded-xl" />
                </div>

            </div>
        </section>
    )
}
