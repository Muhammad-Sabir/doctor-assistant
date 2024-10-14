import React from 'react';
import { useParams } from 'react-router-dom';
import Notifications from '@/components/dashboard/Notifications';
import UserProfileMenu from '@/components/dashboard/UserProfileMenu';
import MobileOverlay from '@/components/consultation/MobileOverlay';
import { getAuthStatus } from '@/utils/auth';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import EditableTitle from './EditableTitle';
import { formatDate } from '@/utils/date';

export default function Header() {
    const { consultationId } = useParams();
    const { user } = getAuthStatus();
    const role = user?.role;

    const { data: doctorData } = useFetchQuery({
        url: 'doctors/me',
        queryKey: ['doctorName'],
        fetchFunction: fetchWithAuth,
        enabled: role === 'doctor',
    });

    const userName = doctorData?.name || 'Loading...';

    return (
        <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 bg-white border-b shadow-sm sticky top-0 left-0 z-50">
            <MobileOverlay />
            <div className="w-[10%] flex-1">
                <EditableTitle consultationId={consultationId} />
            </div>
            <p className="hidden sm:block text-sm font-medium text-gray-500">{formatDate(new Date())}</p>
            <Notifications />
            <UserProfileMenu userName={userName} />
        </header>
    );
}
