import React from 'react';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function UserProfileMenu({username}) {

    const getInitials = () => {
        return username.charAt(0).toUpperCase();
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const menuItems = [
        { label: 'Settings', onClick: () => {} },
        { label: 'Support', onClick: () => {} },
        { label: 'Logout', onClick: handleLogout },
    ];

    return (
        <div className='hidden sm:block'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="smallIcon"
                        className="overflow-hidden rounded-full p-2 bg-primary"
                        aria-label="User profile menu"
                    >
                        <div className="flex items-center justify-center bg-primary">
                            <span className="text-xs text-white">
                                {getInitials()}
                            </span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {menuItems.map((item, index) => (
                        <DropdownMenuItem key={index} onClick={item.onClick}>
                            {item.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
