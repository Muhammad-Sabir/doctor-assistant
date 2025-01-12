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

                <div className="inline-flex flex-col items-center justify-center w-full gap-10 lg:items-start">
                    <div className="flex flex-col items-center justify-start w-full gap-3 lg:items-start">
                        <Subtitle subtitle="Discover" />
                        <h2 className="text-4xl font-bold leading-normal text-center capitalize text-primary font-manrope lg:text-start">
                            The Easiet way to access Seamless Healthcare</h2>
                        <p className="text-base font-normal leading-relaxed text-center text-gray-500 lg:text-start">
                            Access your health records anytime, anywhere.
                            Experience hassle-free appointments and consultations right from your phone.</p>
                        <Button className="block mx-auto mt-5 lg:mx-0">
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
