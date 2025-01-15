import React, { useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Subtitle from '@/components/shared/Subtitle';
import { patientFeatures, doctorFeatures } from '@/components/shared/FeaturesData';

export default function FeatureSection() {

    const [activeTab, setActiveTab] = useState('doctor');
    const features = activeTab === 'doctor' ? doctorFeatures : patientFeatures;

    return (
        <section id="feature" className="py-8 lg:py-10 section-padding">
            
            <div className="text-center mb-14">
                <Subtitle subtitle="Features" />
                <h2 className="py-5 text-4xl font-bold text-center text-primary">Revolutionary Features</h2>
                <p className="max-w-md mx-auto font-normal text-gray-500 text-md md:max-w-2xl">
                    See How We Transform Healthcare for Patients and Doctors. Discover how our platform enhances
                    care and communication.</p>
                <div className="flex justify-center mt-4 space-x-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 mt-4">
                            <TabsTrigger value="doctor" className='mr-3' >You a doctor?</TabsTrigger>
                            <TabsTrigger value="patient">You a patient?</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-8 lg:gap-y-0 md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8 ">
                {features.map((feature, index) => (
                    <div key={index} className="relative w-full p-3 text-center border-b rounded-md shadow-lg sm:w-64 h-52 group md:w-2/5 lg:w-1/4">
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-5 transition-all duration-500 rounded-lg cursor-pointer bg-indigo-50 text-primary group-hover:bg-primary group-hover:text-white">
                            {feature.icon}
                        </div>
                        <h4 className="mb-3 text-lg font-medium text-gray-900 capitalize">
                            {feature.title}
                        </h4>
                        <p className="text-sm font-normal text-gray-500 line-clamp-2">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

        </section>
    );
}
