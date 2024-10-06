import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { IoMedicalOutline } from "react-icons/io5";
import { CgUserList } from "react-icons/cg";
import { RiAddLine } from "react-icons/ri";
import { FaCircle } from "react-icons/fa";
import { RxFilePlus } from "react-icons/rx";

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import logoIcon from '@/assets/images/svg/logo-icon.svg';
import { getAuthStatus } from '@/utils/auth';
import { accountLinks } from '@/components/shared/MenuData';
import DeleteItemDialog from '@/components/dialogs/DeleteItemDialog';

export default function MobileOverlay() {
    const { user } = getAuthStatus();
    const role = user?.role;
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("");

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

    useEffect(() => {
        const currentPath = location.pathname;
        const currentItem = [...accountLinks].find(item => currentPath.includes(item.url));
        setActiveItem(currentItem ? currentItem.name : "Home");

    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handleMenuItemClick = (itemName) => {
        if (itemName === "Logout") {
            handleLogout();
        } else {
            setActiveItem(itemName);
            setIsOpen(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="primary"
                    size="icon"
                    className="shrink-0 md:hidden"
                    onClick={() => setIsOpen(true)}
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                    Choose an option from the menu.
                </SheetDescription>

                <Link to={`/${role}`} className="flex items-center gap-2 font-medium pb-2" onClick={() => setIsOpen(false)}>
                    <img src={logoIcon} alt="LogoIcon" className="h-6 w-6" />
                    <span className="text-primary">Doctor Assistance</span>
                </Link>

                <div>
                    <Accordion type="single" collapsible className="w-full">
                        
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <h2 className='flex items-center gap-3 py-1 text-muted-foreground transition-all'>
                                    <CgUserList className="h-5 w-5" />
                                    Patient Info
                                </h2>
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="font-normal p-1.5 text-gray-500 text-sm">
                                    <span className="leading-6 block">Name: Fatima Iqbal Mirza</span>
                                    <span className='leading-6 block'>Patient ID: 1</span>
                                    <span className='leading-6 block'>DOB: 01-10-1998</span>
                                    <span className='leading-6 block'>Female</span>
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <h2 className='flex items-center gap-3 py-1 text-muted-foreground transition-all'>
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
                                                <DeleteItemDialog deleteUrl={`/allergies/${allergy.id}`} itemName={'Allergy'} iconSize={13} />
                                            </span>
                                        ))}
                                    </div>
                                    <span className='mt-6 cursor-pointer flex text-xs font-medium text-primary underline justify-end items-center'>
                                        <RiAddLine className='mr-2' />Add Allergies
                                    </span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <h2 className='flex items-center gap-3 py-1 text-muted-foreground transition-all'>
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

                <div>
                    <h2 className="text-xs font-medium text-primary py-2 pb-3">ACCOUNT</h2>
                    <nav className="grid gap-2 text-sm font-medium">
                        {accountLinks.map((item, index) => (
                            <Link
                                key={index}
                                to={`/${role}/${item.url}`}
                                className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-1 
                                    ${activeItem === item.name ? 'font-bold text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                onClick={() => handleMenuItemClick(item.name)}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}
