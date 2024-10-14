import React from 'react';
import { Link } from 'react-router-dom';
import { IoMedicalOutline } from "react-icons/io5";
import { CgUserList } from "react-icons/cg";
import { RxFilePlus } from "react-icons/rx";
import { RiAddLine } from "react-icons/ri";
import { useParams } from 'react-router-dom';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import AddAllergy from '@/components/dialogs/AddAllergy';
import logoIcon from '@/assets/images/svg/logo-icon.svg';
import { getAuthStatus } from '@/utils/auth';
import PatientInfo from '@/components/consultation/PatientInfo';
import PatientAllergies from '@/components/consultation/PatientAllergies';
import PatientConsultations from '@/components/consultation/PatientConsultations';

export default function Sidebar() {

    const { patientId } = useParams();
    const { user } = getAuthStatus();
    const role = user?.role;

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
                                <PatientInfo patientId={patientId} />
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
                                <div>
                                    <div className="space-y-2">
                                        <PatientAllergies patientId={patientId} />
                                    </div>
                                    <AddAllergy triggerElement={<span className='mt-6 cursor-pointer flex text-xs font-medium text-primary underline justify-start items-center'>
                                        <RiAddLine className='mr-2' />Add Allergies
                                    </span>} patientId={patientId} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <h2 className='flex items-center gap-3 px-2 py-1 text-muted-foreground transition-all'>
                                    <RxFilePlus className="h-5 w-5" /> Consultations
                                </h2>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='py-1 h-96 overflow-y-scroll flex flex-col gap-3'>
                                    <PatientConsultations patientId={patientId} truncate={true} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
