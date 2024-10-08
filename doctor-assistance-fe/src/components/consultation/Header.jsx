import React, { useState } from 'react';

import { Input } from '@/components/ui/input';

import Notifications from '@/components/dashboard/Notifications';
import UserProfileMenu from '@/components/dashboard/UserProfileMenu';
import MobileOverlay from '@/components/consultation/MobileOverlay';

import { getAuthStatus } from '@/utils/auth';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';

const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

export default function Header() {
    const { user } = getAuthStatus();
    const role = user?.role;

    const { data } = useFetchQuery({
        url: role === 'doctor' ? 'doctors/me' : role === 'patient' ? 'patients/' : '',
        queryKey: [role === 'doctor' ? 'doctorProfile' : 'patientProfile'],
        fetchFunction: fetchWithAuth,
    });

    const userName = role === 'doctor'
        ? data?.name || 'Loading...'
        : role === 'patient'
            ? data?.results[0]?.name || 'Loading...'
            : 'Loading...';

    const [title, setTitle] = useState(
        'Fever and Flu Symptoms with lot of wide issues like constipation, diarrhea, etc.'
    );

    const [isEditing, setIsEditing] = useState(false);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const toggleEditing = () => {
        setIsEditing((prev) => !prev);
    };
    
    return (
        <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 bg-white border-b shadow-sm sticky top-0 left-0 z-50">
            <MobileOverlay />
            <div className="w-[10%] flex-1">
                {isEditing ? (
                    <Input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={toggleEditing}
                        className="text-md font-semibold text-primary w-40 truncate block sm:w-94 lg:w-102 focus-visible:outline-0 focus-visible:ring-0 focus-visible:border-0"
                        autoFocus
                    />
                ) : (
                    <p
                        className="text-md font-semibold text-primary w-40 truncate block sm:w-94 lg:w-102"
                        onClick={toggleEditing}
                    >
                        Title: {title}
                    </p>
                )}
            </div>
            <p className="hidden sm:block text-sm font-medium text-gray-500">{currentDate}</p>
            <Notifications />
            <UserProfileMenu userName={userName} />
        </header>
    );
}
