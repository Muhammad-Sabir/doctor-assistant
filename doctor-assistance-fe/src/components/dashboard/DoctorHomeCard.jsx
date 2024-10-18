import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

import { Button } from '@/components/ui/button';

import heroImg from '@/assets/images/webp/doctorProfileBanner.webp';

export default function DoctorHomeCards() {
    return (
        <>
            <section className="px-2 pt-2 pb-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="relative w-full md:col-span-2 h-52">
                        <div className="bg-violet-100 rounded-md flex h-full">
                            <div className="p-5 xl:p-8 flex flex-col justify-center w-full md:w-1/2">
                                <h3 className="text-lg font-bold text-primary pb-2">
                                    Manage Consultations and Appointments
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">Streamline your workflow and focus on patient care with one easy platform.</p>
                                <Button variant='outline' className="bg-violet-100 self-start block">
                                    <Link className="flex" to="/doctor/appointments">
                                        Go To Appointments <MdOutlineArrowForwardIos className="mt-1 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="relative hidden sm:w-full md:w-1/2 sm:block pr-6">
                                <img src={heroImg} alt="Header tailwind Section" className="h-52 w-full object-cover rounded-md" />
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full h-52 hidden lg:block">
                        <div className="bg-secondary rounded-md p-5 xl:p-8 h-full flex flex-col justify-center">
                            <h3 className="pb-2 text-white font-bold text-lg">Keep Track and Stay Updated on Your Patients</h3>
                            <p className="text-sm font-normal text-white mb-4">Manage and track your patients' online and in-person seamlessly in one place.</p>
                            <Button variant='outline' className="bg-secondary hover:text-white text-white border-white block self-start">
                                <Link className="flex" to="/doctor/patients">
                                    Go to Patients <MdOutlineArrowForwardIos className="mt-1 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
