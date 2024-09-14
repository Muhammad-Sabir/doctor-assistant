import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';

import logoIcon from '@/assets/images/svg/logo-icon.svg';
import { getAuthStatus } from '@/utils/authUtils';
import { menuItems, accountLinks } from '@/assets/data/MenuData';

export default function MobileMenu() {

    const { user } = getAuthStatus();
    const role = user?.role;

    const items = menuItems[role] || [];

    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("Home");

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handleMenuItemClick = async (itemName) => {
        const isLogoutItem = () => itemName === "Logout";

        if (isLogoutItem()) {
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
                <nav className="grid gap-2 text-sm font-medium">
                    <Link to={`/${role}`} className="flex items-center gap-2 font-medium pb-2" onClick={() => setIsOpen(false)}>
                        <img src={logoIcon} alt="LogoIcon" className="h-6 w-6" />
                        <span className="text-primary">Doctor Assistance</span>
                    </Link>
                    <h2 className="text-xs font-medium text-primary py-4 pb-1.5">MAIN MENU</h2>
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            to={item.url}
                            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-1 
                                ${activeItem === item.name ? 'font-bold text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => handleMenuItemClick(item.name)}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="border-t border-gray-300">
                    <h2 className="text-xs font-medium text-primary py-4 pb-3">ACCOUNT</h2>
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
