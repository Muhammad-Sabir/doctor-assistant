import React from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserProfileMenu() {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const role = user.role || 'guest';

    const getInitials = () => {
        const initials = role.split(' ').map(r => r[0]).join('') || 'G';
        return initials.toUpperCase();
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem('user');
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className='hidden sm:block'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size='smallIcon'
                        className="overflow-hidden rounded-full p-2 bg-primary"
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
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
