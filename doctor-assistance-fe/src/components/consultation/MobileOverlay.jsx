import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { IoMedicalOutline } from "react-icons/io5";
import { CgUserList } from "react-icons/cg";
import { RiAddLine } from "react-icons/ri";
import { RxFilePlus } from "react-icons/rx";

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import AddAllergy from '@/components/dialogs/AddAllergy';
import PatientInfo from '@/components/consultation/PatientInfo';
import PatientAllergies from '@/components/consultation/PatientAllergies';
import PatientConsultations from '@/components/consultation/PatientConsultations';
import logoIcon from '@/assets/images/svg/logo-icon.svg';
import { getAuthStatus } from '@/utils/auth';
import { accountLinks } from '@/components/shared/MenuData';

export default function MobileOverlay() {

    const { patientId } = useParams();

    const { user } = getAuthStatus();
    const role = user?.role;
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("");

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
                                <PatientConsultations patientId={patientId}/>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

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
