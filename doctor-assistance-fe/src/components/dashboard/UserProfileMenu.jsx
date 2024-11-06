import React from 'react';

import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function UserProfileMenu({ userImageUrl }) {

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const menuItems = [
        { label: 'Settings', onClick: () => { } },
        { label: 'Support', onClick: () => { } },
        { label: 'Logout', onClick: handleLogout },
    ];

    return (
        <div className='hidden sm:block'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="smallIcon" className="mt-1 rounded-full bg-primary overflow-hidden p-0 border-none"
                        aria-label="User profile menu">
                        <img src={userImageUrl} alt="user-image" className="rounded-full w-8 h-8 object-cover" />
                    </Button>

                </DropdownMenuTrigger>
                {/* <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {menuItems.map((item, index) => (
                        <DropdownMenuItem key={index} onClick={item.onClick}>
                            {item.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent> */}
            </DropdownMenu>
        </div>
    );
}
