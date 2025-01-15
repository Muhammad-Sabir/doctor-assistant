import React from 'react';
import { useParams } from 'react-router-dom';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import { formatDate } from '@/utils/date';
import EditableTitle from '@/components/consultation/EditableTitle';
import Notifications from '@/components/dashboard/Notifications';
import UserProfileMenu from '@/components/dashboard/UserProfileMenu';
import MobileOverlay from '@/components/consultation/MobileOverlay';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

export default function Header() {
    const { consultationId, appointmentId } = useParams();

    const { data: doctorData } = useFetchQuery({
        url: 'doctors/me',
        queryKey: ['doctorName'],
        fetchFunction: fetchWithAuth,
    });

    const { data: appointmentData, isFetching } = useFetchQuery({
        url: `appointments/${appointmentId}/`,
        queryKey: ['appointmentConsultation'],
        fetchFunction: fetchWithAuth,
    });

    const isCompleted = appointmentData?.completed || false;

    const getDoctorImageUrl = (file_url) => {
        if (file_url?.startsWith('/media')) {
            return `${baseUrl}${file_url}`;
        }
        return file_url;
    };

    return (
        <header className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 bg-white border-b shadow-sm sticky top-0 left-0 z-50">
            <MobileOverlay />
            <div className="w-[10%] flex-1">
                <EditableTitle consultationId={consultationId} isCompleted={isCompleted} isAppointmentFetching={isFetching}/>
            </div>
            <p className="hidden sm:block text-sm font-medium text-gray-500">{formatDate(new Date())}</p>
            <Notifications />
            <UserProfileMenu userImageUrl={getDoctorImageUrl(doctorData?.file_url)} />
        </header>
    );
}
