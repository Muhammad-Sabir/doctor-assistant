import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import logoIcon from '@/assets/images/svg/logo-icon.svg';
import { getAuthStatus } from '@/utils/auth';
import { menuItems, accountLinks } from '@/components/shared/MenuData';

export default function Sidebar() {

    const { user } = getAuthStatus();
    const role = user?.role;

    const [activeItem, setActiveItem] = useState("Dashboard");
    const items = menuItems[role] || [];

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
        }
    };

    return (
        <div className="hidden bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
                    <Link to={`/${role}`} className="flex items-center gap-2 font-semibold">
                        <img src={logoIcon} alt="LogoIcon" className="h-6 w-6" />
                        <span className="text-primary font-semibold">Doctor Assistance</span>
                    </Link>
                </div>
                <div className="flex-col">
                    <nav className="grid gap-2 items-start px-2 text-sm font-medium lg:px-4">
                        <h2 className="text-xs font-medium p-2.5 pb-2 text-black">MAIN MENU</h2>
                        {items.map((item, index) => (
                            <Link
                                key={index}
                                to={item.url}
                                onClick={() => handleMenuItemClick(item.name)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all 
                                    ${activeItem === item.name ? 'bg-primary text-white' : 'hover:bg-accent'}`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="border-t border-gray-300 px-4 py-2 mt-4">
                    <h2 className="text-xs font-medium p-2.5 text-black">ACCOUNT</h2>
                    <nav className="grid gap-2 text-sm font-medium">
                        {accountLinks.map((item, index) => (
                            <Link
                                key={index}
                                to={`/${role}/${item.url}`}
                                onClick={() => handleMenuItemClick(item.name)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all 
                                    ${activeItem === item.name ? 'bg-primary text-white' : 'hover:bg-accent'}`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
