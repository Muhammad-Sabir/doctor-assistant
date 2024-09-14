import React from 'react';

import MobileMenu from '@/components/dashboard/MobileMenu';
import Notifications from '@/components/dashboard/Notifications';
import UserProfileMenu from '@/components/dashboard/UserProfileMenu';
import { getAuthStatus } from '@/utils/authUtils';

const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

export default function Header() {
    const { user } = getAuthStatus();
    const role = user?.role || 'Guest';

    return (
        <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 bg-indigo-50">
            <MobileMenu />
            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                        <p className="text-md font-semibold">Hello, {role}</p>
                    </div>
                </form>
            </div>
            <p className="hidden sm:block text-sm font-medium text-gray-500">{currentDate}</p>
            <Notifications />
            <UserProfileMenu/>
        </header>
    );
}
