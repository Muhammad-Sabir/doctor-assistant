import React from 'react';

import MobileMenu from '@/components/dashboard/MobileMenu';
import Notifications from '@/components/dashboard/Notifications';
import UserProfileMenu from '@/components/dashboard/UserProfileMenu';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';

const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

export default function Header() {

    const { data } = useFetchQuery({
        url: 'doctors/me',
        queryKey: ['doctorName'],
        fetchFunction: fetchWithAuth,
    });

    const username = data?.name || 'Loading...';

    return (
        <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 bg-white border-b shadow-sm sticky top-0 left-0 z-50">
            <MobileMenu />
            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                        <p className="text-md font-semibold">Hello, {username}</p>
                    </div>
                </form>
            </div>
            <p className="hidden sm:block text-sm font-medium text-gray-500">{currentDate}</p>
            <Notifications />
            <UserProfileMenu username={username}/>
        </header>
    );
}
