import React, { useContext } from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from '@/contexts/AuthContext';

export default function UserProfileMenu() {

    const { user, logout } = useContext(AuthContext);

    const getInitials = () => {
        const initials = user?.name?.split(' ').map(name => name[0]).join('') || 'AU';
        return initials.toUpperCase();
    };

    const handleLogout = async () => {
        await logout();
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
