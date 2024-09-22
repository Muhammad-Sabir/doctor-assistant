import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

import { Button } from '@/components/ui/button';

import heroImg1 from '@/assets/images/webp/heroImg1.webp';
import heroImg2 from '@/assets/images/webp/heroImg2.webp';
import heroVideo from '@/assets/videos/heroVideo.mp4';

const HeroSection = () => {
    return (
        <section className="section-padding h-full py-11 lg:py-6">
            <div className="flex justify-between items-center flex-col lg:flex-row">

                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <div className="flex items-center text-sm font-medium text-gray-500 justify-center lg:justify-start mb-3">
                        <p className="bg-primary py-1 px-3 rounded-md text-xs font-medium text-white mr-3">AI</p>
                        Healthcare Revolution
                    </div>
                    <h1 className="text-primary font-bold text-5xl leading-[70px] my-5">
                        The New Standard for <span className="text-secondary">Modern Healthcare</span>
                    </h1>
                    <p className="text-lg text-gray-500 mb-7">
                        Simplifying your healthcare journey with smart solutions.
                    </p>
                    <Button className="block mx-auto lg:mx-0">
                        <Link className="flex" to="/signup">
                            Get Started <MdOutlineArrowForwardIos className="mt-1 ml-1" />
                        </Link>
                    </Button>
                </div>
                
                <div className="w-full lg:w-1/2">
                    <div className="lg:grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 gap-8">
                        <img
                            src={heroImg1}
                            alt="Team tailwind section"
                            className="hidden lg:block w-44 h-80 rounded-xl object-cover mt-11"
                        />
                        <video
                            src={heroVideo}
                            alt="Team tailwind section"
                            className="w-full lg:w-44 h-80 rounded-xl object-cover md:mx-auto mt-11 lg:mt-20"
                            loop autoPlay muted
                        />
                        <img
                            src={heroImg2}
                            alt="Team tailwind section"
                            className="hidden lg:block w-44 h-80 rounded-xl object-cover mt-32"
                        />
                    </div>
                </div>
            
            </div>
        </section>
    );
};

export default HeroSection;
