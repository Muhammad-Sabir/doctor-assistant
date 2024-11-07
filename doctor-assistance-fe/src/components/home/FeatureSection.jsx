import React, { useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Subtitle from '@/components/shared/Subtitle';
import { patientFeatures, doctorFeatures } from '@/components/shared/FeaturesData';

export default function FeatureSection() {

    const [activeTab, setActiveTab] = useState('doctor');
    const features = activeTab === 'doctor' ? doctorFeatures : patientFeatures;

    return (
        <section className="py-8 lg:py-10 section-padding">
            
            <div className="mb-14 text-center">
                <Subtitle subtitle="Features" />
                <h2 className="text-4xl text-center font-bold text-primary py-5">Revolutionary Features</h2>
                <p className="text-md font-normal text-gray-500 max-w-md md:max-w-2xl mx-auto">
                    See How We Transform Healthcare for Patients and Doctors. Discover how our platform enhances
                    care and communication.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 mt-4">
                            <TabsTrigger value="doctor" className='mr-3' >You a Doctor?</TabsTrigger>
                            <TabsTrigger value="patient">You a Patient?</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <div className="flex justify-center items-center gap-x-5 gap-y-8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8 ">
                {features.map((feature, index) => (
                    <div key={index} className="p-3 w-full sm:w-64 h-52 relative text-center group md:w-2/5 lg:w-1/4 rounded-md border-b shadow-lg">
                        <div className="bg-indigo-50 rounded-lg text-primary flex justify-center items-center mb-5 w-20 h-20 mx-auto cursor-pointer transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                            {feature.icon}
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3 capitalize">
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
