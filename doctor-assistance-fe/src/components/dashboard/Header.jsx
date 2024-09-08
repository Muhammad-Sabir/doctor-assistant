import React from 'react'
import MobileMenu from './MobileMenu'
import UserProfileMenu from './UserProfileMenu'
import Notifications from './Notifications'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext } from 'react'

export default function Header() {

    const { user } = useContext(AuthContext);

    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 bg-indigo-50">
            <MobileMenu />
            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                        <p className="text-md font-semibold">Hello, {user?.name || user.role}</p>
                    </div>
                </form>
            </div>
            <p className="hidden sm:block text-sm font-medium text-gray-500">{currentDate}</p>
            <Notifications />
            <UserProfileMenu />
        </header>
    )
}
