import React from 'react';
import { Link } from 'react-router-dom';
import { IoMedicalOutline } from "react-icons/io5";
import { CgUserList } from "react-icons/cg";
import { FaCircle } from "react-icons/fa";
import { RxFilePlus } from "react-icons/rx";
import { RiAddLine } from "react-icons/ri";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import DeleteItem from '@/components/dialogs/DeleteItem';
import AddAllergy from '@/components/dialogs/AddAllergy';
import logoIcon from '@/assets/images/svg/logo-icon.svg';
import { getAuthStatus } from '@/utils/auth';

export default function Sidebar() {
    const { user } = getAuthStatus();
    const role = user?.role;

    const allergies = [
        { id: '1', name: 'Cruciferous Allergy' },
        { id: '2', name: 'Histamine Allergy' },
        { id: '3', name: 'Lactose Intolerance' },
        { id: '4', name: 'Pollen Allergy' }
    ];

    const consultations = [
        { id: '7', date: '10-12-2023', title: 'Flu and Fever Symptoms and High Fever' },
        { id: '8', date: '11-12-2023', title: 'Follow-up Checkup after cure from allergy' },
        { id: '9', date: '12-12-2023', title: 'Routine Consultation for the Diabetes' },
        { id: '10', date: '13-12-2023', title: 'Final Checkup for the fever symptoms' }
    ];

    return (
        <div className="bg-muted/40 h-screen fixed left-0 bg-slate-100 px-3">
            <div className="flex flex-col h-full gap-2">
                <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
                    <Link to={`/${role}`} className="flex items-center gap-2 font-semibold">
                        <img src={logoIcon} alt="LogoIcon" className="h-6 w-6" />
                        <span className="text-primary font-semibold">Doctor Assistance</span>
                    </Link>
                </div>

                <div className='px-2 lg:px-4'>
                    <Accordion type="single" collapsible className="w-full">
                       
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <h2 className='flex items-center gap-3 px-2 py-1 text-muted-foreground transition-all'>
                                    <CgUserList className="h-5 w-5" />
                                    Patient Info
                                </h2>
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="font-normal p-1.5 text-gray-500 max-sm:text-center text-sm">
                                    <span className="leading-6 block w-32 truncate lg:w-full">Name: Fatima Iqbal Mirza</span>
                                    <span className='leading-6 block'>Patient ID: 1</span>
                                    <span className='leading-6 block'>DOB: 01-10-1998</span>
                                    <span className='leading-6 block'>Female</span>
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <h2 className='flex items-center gap-3 px-2 py-1 text-muted-foreground transition-all'>
                                    <IoMedicalOutline className="h-5 w-5" />
                                    Allergies
                                </h2>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='p-2'>
                                    <div className="space-y-2">
                                        {allergies.map(allergy => (
                                            <span key={allergy.id} className="flex m-1 py-1 px-2 bg-accent rounded-md text-xs font-medium text-primary max-w-fit">
                                                {allergy.name}
                                                <DeleteItem deleteUrl={`/allergies/${allergy.id}`} itemName={'Allergy'} iconSize={13} />
                                            </span>
                                        ))}
                                    </div>
                                    <AddAllergy triggerElement={<span className='mt-6 cursor-pointer flex text-xs font-medium text-primary underline justify-start items-center'>
                                        <RiAddLine className='mr-2' />Add Allergies
                                    </span>} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <h2 className='flex items-center gap-3 px-2 py-1 text-muted-foreground transition-all'>
                                    <RxFilePlus className="h-5 w-5" />
                                    Recent Consults
                                </h2>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='py-2'>
                                    {consultations.map(consultation => (
                                        <Link key={consultation.id} to={`/doctor/consultation/${consultation.id}`} className="no-underline">
                                            <div className="bg-white shadow rounded-md p-2 mx-1 min-w-min mb-3">
                                                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                                                    <FaCircle className="text-primary h-2 w-2" />
                                                    <span className='text-xs'>{consultation.date}</span>
                                                </div>
                                                <div className="text-sm mt-1 w-36 truncate block">{consultation.title}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
